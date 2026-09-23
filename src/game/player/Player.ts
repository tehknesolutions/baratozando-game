import Phaser from 'phaser';
import type { InputController } from '../input/InputController.js';
import { PLAYER_MOVEMENT_CONFIG } from './PlayerMovementConfig.js';
import { MOBILITY_V2 } from './MobilityConfig.js';
import { MovementTimers } from './MovementTimers.js';
import { resolvePlayerState } from './PlayerStateMachine.js';
import type { PlayerState } from './PlayerState.js';
import { PlayerAnimationController } from './PlayerAnimationController.js';
import { PlayerDamageController } from './PlayerDamageController.js';
import { WingMobilityController } from './WingMobilityController.js';
import { WallMobilityController } from './WallMobilityController.js';
import type { SurfaceType } from '../world/SurfaceType.js';
import { PREMIUM_PLAYER } from '../../assets/assetKeys.js';
import { ROACH_WORLD_SCALE } from './PlayableV3Scale.js';

function approach(current: number, target: number, maxDelta: number): number {
  if (current < target) return Math.min(current + maxDelta, target);
  if (current > target) return Math.max(current - maxDelta, target);
  return target;
}

export type PlayerOptions = {
  mobilityV2?: boolean;
  /** Explicit diagnostic escape hatch. Playable V3 is premium by default. */
  legacyVisual?: boolean;
  premiumVisual?: boolean;
  premiumVisualQa?: boolean;
};

export type WallContact = { touchingLeft: boolean; touchingRight: boolean; surface: SurfaceType | null };

export class Player extends Phaser.Physics.Arcade.Sprite {
  readonly damage = new PlayerDamageController();
  facing: -1 | 1 = 1;
  state: PlayerState = 'BOOT';
  private readonly mobilityV2: boolean;
  private readonly movement: typeof PLAYER_MOVEMENT_CONFIG | typeof MOBILITY_V2;
  private readonly timers: MovementTimers;
  private readonly wings = new WingMobilityController(MOBILITY_V2);
  private readonly wall = new WallMobilityController(MOBILITY_V2);
  private readonly animator: PlayerAnimationController;
  private wallContactProvider: (() => WallContact) | null = null;
  private checkpoint = { x: 0, y: 0 };
  private deathAt = Number.NEGATIVE_INFINITY;
  private respawnScheduled = false;
  private wingFlapUntil = Number.NEGATIVE_INFINITY;
  private wallJumpUntil = Number.NEGATIVE_INFINITY;

  constructor(scene: any, x: number, y: number, private readonly inputController: InputController, options: PlayerOptions = {}) {
    const premiumVisual = options.legacyVisual !== true;
    super(scene, x, y, premiumVisual ? PREMIUM_PLAYER.idleFrames[0] : 'player-idle-01');
    this.mobilityV2 = options.mobilityV2 === true;
    this.movement = this.mobilityV2 ? MOBILITY_V2 : PLAYER_MOVEMENT_CONFIG;
    this.timers = new MovementTimers(this.movement);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1);
    if (premiumVisual) this.setScale(ROACH_WORLD_SCALE);
    this.setCollideWorldBounds(true);
    this.setGravityY(this.movement.gravity);
    this.setMaxVelocity(900, this.movement.maxFallSpeed);
    const body = this.body as any;
    body.setSize(30, 18, false);
    body.setOffset(17, 42);
    this.checkpoint = { x, y };
    this.animator = new PlayerAnimationController(this, premiumVisual);
  }

  get flapsRemaining(): number { return this.mobilityV2 ? this.wings.flapsRemaining : 0; }
  setWallContactProvider(provider: () => WallContact): void { this.wallContactProvider = provider; }
  setCheckpoint(x: number, y: number): void { this.checkpoint = { x, y }; }
  takeDamage(nowMs: number, sourceX: number): void { const result = this.damage.damage(nowMs); if (result === 'IGNORED') return; const knockDirection = this.x < sourceX ? -1 : 1; this.setVelocity(knockDirection * 145, -145); if (result === 'DEATH') this.deathAt = nowMs; }
  kill(nowMs: number, sourceX: number): void { const result = this.damage.kill(nowMs); if (result === 'IGNORED') return; const knockDirection = this.x < sourceX ? -1 : 1; this.setVelocity(knockDirection * 180, -165); this.deathAt = nowMs; }

  updatePlayer(nowMs: number, deltaMs: number): void {
    const intent = this.inputController.sample(); const body = this.body as any;
    const grounded = Boolean(body.blocked.down || body.touching.down);
    if (grounded) { this.timers.noteGrounded(nowMs); if (this.mobilityV2) this.wings.noteGrounded(nowMs); }
    if (intent.jumpPressed) this.timers.bufferJump(nowMs); if (intent.respawnPressed) this.requestRespawn();
    if (this.damage.dead && nowMs - this.deathAt >= 520 && !this.respawnScheduled) this.beginRespawn();
    const hurt = this.damage.isHurt(nowMs); const locked = this.damage.dead || this.damage.respawning || hurt;
    const fallbackContact: WallContact = { touchingLeft: Boolean(body.blocked.left || body.touching.left), touchingRight: Boolean(body.blocked.right || body.touching.right), surface: null };
    const wallContact = this.mobilityV2 && this.wallContactProvider ? this.wallContactProvider() : fallbackContact;
    let wallResolution = this.wall.resolve({ ...wallContact, moveX: intent.moveX, moveY: intent.moveY, nowMs });
    if (locked || grounded || !this.mobilityV2) wallResolution = { attached: false, wallSide: 0, climbVelocityY: 0, slideVelocityY: Number.POSITIVE_INFINITY };
    if (this.mobilityV2) this.wings.noteStableWallGrip(nowMs, wallResolution.attached);
    if (!locked && intent.dodgePressed) this.timers.tryStartDodge(nowMs);
    const dodging = !locked && this.timers.isDodging(nowMs); let wallJumped = false; let wingFlapped = false;
    if (!locked && !dodging && this.mobilityV2 && wallResolution.attached && intent.jumpPressed && wallResolution.wallSide !== 0) { const jump = this.wall.wallJump(nowMs, wallResolution.wallSide as -1 | 1); this.setVelocity(jump.velocityX, jump.velocityY); this.facing = wallResolution.wallSide === -1 ? 1 : -1; this.setFlipX(this.facing < 0); this.wallJumpUntil = nowMs + 150; wallJumped = true; wallResolution = { attached: false, wallSide: 0, climbVelocityY: 0, slideVelocityY: Number.POSITIVE_INFINITY }; this.timers.consumeBufferedJump(nowMs); this.timers.consumeCoyote(); }
    else if (!locked && !dodging && this.timers.canConsumeBufferedJump(nowMs) && this.timers.canCoyoteJump(nowMs)) { if (this.timers.consumeBufferedJump(nowMs)) { this.setVelocityY(this.movement.jumpVelocity); this.timers.consumeCoyote(); } }
    else if (!locked && !dodging && this.mobilityV2 && intent.jumpPressed && !grounded) { if (this.wings.tryFlap(nowMs, true)) { this.setVelocityY(this.wings.flapVelocity()); this.wingFlapUntil = nowMs + 115; wingFlapped = true; } }
    if (!locked && intent.jumpReleased && body.velocity.y < 0 && !wallJumped && !wingFlapped) this.setVelocityY(body.velocity.y * this.movement.jumpCutMultiplier);
    if (!locked) { if (intent.moveX !== 0) { this.facing = intent.moveX; this.setFlipX(this.facing < 0); } if (dodging) this.setVelocityX(this.facing * this.movement.dodgeSpeed); else if (wallResolution.attached) this.setVelocityX(0); else { const dt = Math.min(deltaMs, 50) / 1000; const target = intent.moveX * (intent.run ? this.movement.runSpeed : this.movement.walkSpeed); const current = body.velocity.x as number; if (grounded) { const accel = intent.moveX === 0 ? this.movement.groundDeceleration : this.movement.groundAcceleration; this.setVelocityX(approach(current, target, accel * dt)); } else if (intent.moveX !== 0) this.setVelocityX(approach(current, target, this.movement.airAcceleration * dt)); } }
    else if (this.damage.dead || this.damage.respawning) this.setVelocityX(approach(body.velocity.x, 0, this.movement.groundDeceleration * Math.min(deltaMs, 50) / 1000));
    if (!locked && wallResolution.attached) { if (intent.moveY !== 0) this.setVelocityY(wallResolution.climbVelocityY); else this.setVelocityY(Math.min(Math.max(body.velocity.y, 0), wallResolution.slideVelocityY)); }
    const gliding = this.mobilityV2 && !locked && !grounded && !wallResolution.attached ? this.wings.updateGlide(nowMs, intent.jumpHeld, body.velocity.y > 0) : false;
    if (gliding && body.velocity.y > MOBILITY_V2.glideMaxFallSpeed) this.setVelocityY(this.wings.clampFallSpeed(body.velocity.y)); else if (body.velocity.y > this.movement.maxFallSpeed) this.setVelocityY(this.movement.maxFallSpeed);
    const wallJumping = this.mobilityV2 && nowMs < this.wallJumpUntil; const wingFlap = this.mobilityV2 && nowMs < this.wingFlapUntil;
    this.state = resolvePlayerState({ grounded: grounded && body.velocity.y >= 0, velocityY: body.velocity.y, moveX: intent.moveX, run: intent.run, dodging, hurt, dead: this.damage.dead, respawning: this.damage.respawning, wingFlap, gliding, wallAttached: wallResolution.attached, climbing: wallResolution.attached && intent.moveY !== 0, wallJumping });
    if (hurt) this.setTint(0xff6b53); else this.clearTint(); if (this.damage.isProtected(nowMs) && !this.damage.dead) this.setAlpha(Math.floor(nowMs / 70) % 2 === 0 ? 0.58 : 1); else if (!this.damage.respawning) this.setAlpha(1); this.animator.update(this.state, nowMs);
  }

  requestRespawn(): void { this.beginRespawn(); }
  private beginRespawn(): void { if (this.respawnScheduled) return; this.respawnScheduled = true; this.damage.beginRespawn(); this.timers.reset(); this.wings.reset(); this.wall.reset(); this.wingFlapUntil = Number.NEGATIVE_INFINITY; this.wallJumpUntil = Number.NEGATIVE_INFINITY; this.setVelocity(0, 0); this.setPosition(this.checkpoint.x, this.checkpoint.y); this.setAlpha(1); this.scene.time.delayedCall(400, () => { this.damage.completeRespawn(); this.deathAt = Number.NEGATIVE_INFINITY; this.respawnScheduled = false; this.setAlpha(1); }); }
}

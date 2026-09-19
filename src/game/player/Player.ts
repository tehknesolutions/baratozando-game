import Phaser from 'phaser';
import type { InputController } from '../input/InputController.js';
import { PLAYER_MOVEMENT_CONFIG } from './PlayerMovementConfig.js';
import { MovementTimers } from './MovementTimers.js';
import { resolvePlayerState } from './PlayerStateMachine.js';
import type { PlayerState } from './PlayerState.js';
import { PlayerAnimationController } from './PlayerAnimationController.js';
import { PlayerDamageController } from './PlayerDamageController.js';

function approach(current: number, target: number, maxDelta: number): number {
  if (current < target) return Math.min(current + maxDelta, target);
  if (current > target) return Math.max(current - maxDelta, target);
  return target;
}

export class Player extends Phaser.Physics.Arcade.Sprite {
  readonly damage = new PlayerDamageController();
  facing: -1 | 1 = 1;
  state: PlayerState = 'BOOT';

  private readonly timers = new MovementTimers(PLAYER_MOVEMENT_CONFIG);
  private readonly animator: PlayerAnimationController;
  private checkpoint = { x: 0, y: 0 };
  private deathAt = Number.NEGATIVE_INFINITY;
  private respawnScheduled = false;

  constructor(scene: any, x: number, y: number, private readonly inputController: InputController) {
    super(scene, x, y, 'player-idle-01');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setCollideWorldBounds(true);
    this.setGravityY(PLAYER_MOVEMENT_CONFIG.gravity);
    this.setMaxVelocity(900, PLAYER_MOVEMENT_CONFIG.maxFallSpeed);
    const body = this.body as any;
    body.setSize(30, 18, false);
    body.setOffset(17, 42);
    this.checkpoint = { x, y };
    this.animator = new PlayerAnimationController(this);
  }

  setCheckpoint(x: number, y: number): void {
    this.checkpoint = { x, y };
  }

  takeDamage(nowMs: number, sourceX: number): void {
    const result = this.damage.damage(nowMs);
    if (result === 'IGNORED') return;
    const knockDirection = this.x < sourceX ? -1 : 1;
    this.setVelocity(knockDirection * 145, -145);
    if (result === 'DEATH') this.deathAt = nowMs;
  }

  kill(nowMs: number, sourceX: number): void {
    const result = this.damage.kill(nowMs);
    if (result === 'IGNORED') return;
    const knockDirection = this.x < sourceX ? -1 : 1;
    this.setVelocity(knockDirection * 180, -165);
    this.deathAt = nowMs;
  }

  updatePlayer(nowMs: number, deltaMs: number): void {
    const intent = this.inputController.sample();
    const body = this.body as any;
    const grounded = Boolean(body.blocked.down || body.touching.down);

    if (grounded) this.timers.noteGrounded(nowMs);
    if (intent.jumpPressed) this.timers.bufferJump(nowMs);
    if (intent.respawnPressed) this.requestRespawn();

    if (this.damage.dead && nowMs - this.deathAt >= 520 && !this.respawnScheduled) {
      this.beginRespawn();
    }

    const hurt = this.damage.isHurt(nowMs);
    const locked = this.damage.dead || this.damage.respawning || hurt;

    if (!locked && intent.dodgePressed) this.timers.tryStartDodge(nowMs);
    const dodging = !locked && this.timers.isDodging(nowMs);

    if (!locked && !dodging && this.timers.canConsumeBufferedJump(nowMs) && this.timers.canCoyoteJump(nowMs)) {
      if (this.timers.consumeBufferedJump(nowMs)) {
        this.setVelocityY(PLAYER_MOVEMENT_CONFIG.jumpVelocity);
        this.timers.consumeCoyote();
      }
    }

    if (!locked && intent.jumpReleased && body.velocity.y < 0) {
      this.setVelocityY(body.velocity.y * PLAYER_MOVEMENT_CONFIG.jumpCutMultiplier);
    }

    if (!locked) {
      if (intent.moveX !== 0) {
        this.facing = intent.moveX;
        this.setFlipX(this.facing < 0);
      }
      if (dodging) {
        this.setVelocityX(this.facing * PLAYER_MOVEMENT_CONFIG.dodgeSpeed);
      } else {
        const dt = Math.min(deltaMs, 50) / 1000;
        const target = intent.moveX * (intent.run ? PLAYER_MOVEMENT_CONFIG.runSpeed : PLAYER_MOVEMENT_CONFIG.walkSpeed);
        const current = body.velocity.x as number;
        if (grounded) {
          const accel = intent.moveX === 0 ? PLAYER_MOVEMENT_CONFIG.groundDeceleration : PLAYER_MOVEMENT_CONFIG.groundAcceleration;
          this.setVelocityX(approach(current, target, accel * dt));
        } else if (intent.moveX !== 0) {
          this.setVelocityX(approach(current, target, PLAYER_MOVEMENT_CONFIG.airAcceleration * dt));
        }
      }
    } else if (this.damage.dead || this.damage.respawning) {
      this.setVelocityX(approach(body.velocity.x, 0, PLAYER_MOVEMENT_CONFIG.groundDeceleration * Math.min(deltaMs, 50) / 1000));
    }

    if (body.velocity.y > PLAYER_MOVEMENT_CONFIG.maxFallSpeed) this.setVelocityY(PLAYER_MOVEMENT_CONFIG.maxFallSpeed);

    this.state = resolvePlayerState({
      grounded: grounded && body.velocity.y >= 0,
      velocityY: body.velocity.y,
      moveX: intent.moveX,
      run: intent.run,
      dodging,
      hurt,
      dead: this.damage.dead,
      respawning: this.damage.respawning,
    });

    if (hurt) this.setTint(0xff6b53);
    else this.clearTint();
    if (this.damage.isProtected(nowMs) && !this.damage.dead) this.setAlpha(Math.floor(nowMs / 70) % 2 === 0 ? 0.58 : 1);
    else if (!this.damage.respawning) this.setAlpha(1);

    this.animator.update(this.state, nowMs);
  }

  requestRespawn(): void {
    this.beginRespawn();
  }

  private beginRespawn(): void {
    if (this.respawnScheduled) return;
    this.respawnScheduled = true;
    this.damage.beginRespawn();
    this.timers.reset();
    this.setVelocity(0, 0);
    this.setPosition(this.checkpoint.x, this.checkpoint.y);
    this.setAlpha(0.25);
    this.scene.time.delayedCall(90, () => {
      this.damage.completeRespawn();
      this.deathAt = Number.NEGATIVE_INFINITY;
      this.respawnScheduled = false;
      this.setAlpha(1);
    });
  }
}

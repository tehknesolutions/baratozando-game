import { PLAYER_FRAMES, PREMIUM_PLAYER } from '../../assets/assetKeys.js';
import type { PlayerState } from './PlayerState.js';
import { resolveRoachAnimationV3 } from './RoachAnimationV3.js';

const LEGACY_FRAMES: Record<PlayerState, readonly string[]> = {
  BOOT: PLAYER_FRAMES.idle, IDLE: PLAYER_FRAMES.idle, WALK: PLAYER_FRAMES.walk, RUN: PLAYER_FRAMES.run,
  JUMP: PLAYER_FRAMES.jump, FALL: PLAYER_FRAMES.fall, WING_FLAP: PLAYER_FRAMES.jump, GLIDE: PLAYER_FRAMES.fall,
  WALL_CLING: PLAYER_FRAMES.idle, WALL_CLIMB: PLAYER_FRAMES.wallClimb, WALL_JUMP: PLAYER_FRAMES.jump,
  DODGE: PLAYER_FRAMES.dodge, HURT: PLAYER_FRAMES.hurt, DEATH: PLAYER_FRAMES.death, RESPAWN: PLAYER_FRAMES.idle,
};

const PREMIUM_BODY_FRAMES: Record<string, readonly string[]> = {
  idle: PREMIUM_PLAYER.idleFrames,
  walk: PREMIUM_PLAYER.walkFrames,
  run: PREMIUM_PLAYER.runFrames,
  jump: PREMIUM_PLAYER.jumpFrames,
  fall: PREMIUM_PLAYER.fallFrames,
  wallCling: PREMIUM_PLAYER.wallClingFrames,
  wallClimb: PREMIUM_PLAYER.wallClimbFrames,
  wallJump: PREMIUM_PLAYER.wallJumpFrames,
  dodge: PREMIUM_PLAYER.dodgeFrames,
  hurt: PREMIUM_PLAYER.hurtFrames,
  death: PREMIUM_PLAYER.deathFrames,
  respawn: PREMIUM_PLAYER.respawnFrames,
};

export class PlayerAnimationController {
  private state: PlayerState = 'BOOT';
  private stateStartedAt = 0;
  private currentTexture = '';

  constructor(private readonly sprite: any, private readonly premiumVisual = false) {}

  update(state: PlayerState, nowMs: number): void {
    if (state !== this.state) { this.state = state; this.stateStartedAt = nowMs; }
    const descriptor = resolveRoachAnimationV3(state);
    const frames = this.premiumVisual ? (PREMIUM_BODY_FRAMES[descriptor.bodyKey] ?? PREMIUM_PLAYER.idleFrames) : LEGACY_FRAMES[state];
    const elapsed = Math.max(0, nowMs - this.stateStartedAt);
    const raw = Math.floor(elapsed / (1000 / descriptor.fps));
    const index = descriptor.loop ? raw % frames.length : Math.min(raw, frames.length - 1);
    const key = frames[index];
    if (key !== this.currentTexture) { this.sprite.setTexture(key); this.currentTexture = key; }
  }
}

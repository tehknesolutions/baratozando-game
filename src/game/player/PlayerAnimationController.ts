import { PLAYER_FRAMES, PREMIUM_PLAYER } from '../../assets/assetKeys.js';
import type { PlayerState } from './PlayerState.js';

function frameForWindow(frames: readonly string[], elapsedMs: number, durationMs: number): string {
  const safeDuration = Math.max(1, durationMs);
  const progress = Math.min(Math.max(elapsedMs, 0), safeDuration) / safeDuration;
  const index = Math.min(Math.floor(progress * frames.length), frames.length - 1);
  return frames[index];
}

const DEFS: Record<PlayerState, { frames: readonly string[]; fps: number; loop: boolean }> = {
  BOOT: { frames: PLAYER_FRAMES.idle, fps: 6, loop: true },
  IDLE: { frames: PLAYER_FRAMES.idle, fps: 6, loop: true },
  WALK: { frames: PLAYER_FRAMES.walk, fps: 8, loop: true },
  RUN: { frames: PLAYER_FRAMES.run, fps: 12, loop: true },
  JUMP: { frames: PLAYER_FRAMES.jump, fps: 10, loop: false },
  FALL: { frames: PLAYER_FRAMES.fall, fps: 8, loop: true },
  WING_FLAP: { frames: PLAYER_FRAMES.jump, fps: 14, loop: false },
  GLIDE: { frames: PLAYER_FRAMES.fall, fps: 6, loop: true },
  WALL_CLING: { frames: PLAYER_FRAMES.idle, fps: 6, loop: true },
  WALL_CLIMB: { frames: PLAYER_FRAMES.wallClimb, fps: 10, loop: true },
  WALL_JUMP: { frames: PLAYER_FRAMES.jump, fps: 12, loop: false },
  DODGE: { frames: PLAYER_FRAMES.dodge, fps: 14, loop: false },
  HURT: { frames: PLAYER_FRAMES.hurt, fps: 8, loop: false },
  DEATH: { frames: PLAYER_FRAMES.death, fps: 8, loop: false },
  RESPAWN: { frames: PLAYER_FRAMES.idle, fps: 6, loop: true },
};

export class PlayerAnimationController {
  private state: PlayerState = 'BOOT';
  private stateStartedAt = 0;
  private currentTexture = '';

  constructor(private readonly sprite: any, private readonly premiumVisual = false) {}

  update(state: PlayerState, nowMs: number): void {
    if (state !== this.state) {
      this.state = state;
      this.stateStartedAt = nowMs;
    }
    if (this.premiumVisual) {
      const elapsed = Math.max(0, nowMs - this.stateStartedAt);
      let key: string = PREMIUM_PLAYER.idleLock;
      if (state === 'IDLE' || state === 'BOOT') {
        const frames = PREMIUM_PLAYER.idleFrames;
        key = frames[Math.floor(elapsed / 250) % frames.length];
      } else if (state === 'WALK') {
        const frames = PREMIUM_PLAYER.walkFrames;
        key = frames[Math.floor(elapsed / 125) % frames.length];
      } else if (state === 'RUN') {
        const frames = PREMIUM_PLAYER.runFrames;
        key = frames[Math.floor(elapsed / (1000 / 12)) % frames.length];
      } else if (state === 'JUMP') {
        const frames = PREMIUM_PLAYER.jumpFrames;
        key = frames[Math.min(Math.floor(elapsed / 100), frames.length - 1)];
      } else if (state === 'FALL') {
        const frames = PREMIUM_PLAYER.fallFrames;
        key = frames[Math.floor(elapsed / 125) % frames.length];
      } else if (state === 'WING_FLAP') {
        const frames = PREMIUM_PLAYER.wingFlapFrames;
        key = frameForWindow(frames, elapsed, 115);
      } else if (state === 'GLIDE') {
        const frames = PREMIUM_PLAYER.glideFrames;
        key = frames[Math.floor(elapsed / (1000 / 6)) % frames.length];
      } else if (state === 'WALL_CLING') {
        key = PREMIUM_PLAYER.wallClingFrames[0];
      } else if (state === 'WALL_CLIMB') {
        const frames = PREMIUM_PLAYER.wallClimbFrames;
        key = frames[Math.floor(elapsed / 100) % frames.length];
      } else if (state === 'WALL_JUMP') {
        const frames = PREMIUM_PLAYER.wallJumpFrames;
        key = frameForWindow(frames, elapsed, 150);
      } else if (state === 'DODGE') {
        const frames = PREMIUM_PLAYER.dodgeFrames;
        key = frameForWindow(frames, elapsed, 160);
      } else if (state === 'HURT') {
        const frames = PREMIUM_PLAYER.hurtFrames;
        key = frameForWindow(frames, elapsed, 220);
      } else if (state === 'DEATH') {
        const frames = PREMIUM_PLAYER.deathFrames;
        key = frameForWindow(frames, elapsed, 520);
      } else if (state === 'RESPAWN') {
        const frames = PREMIUM_PLAYER.respawnFrames;
        key = frameForWindow(frames, elapsed, 400);
      }
      if (key !== this.currentTexture) {
        this.sprite.setTexture(key);
        this.currentTexture = key;
      }
      return;
    }

    const def = DEFS[state];
    const elapsed = Math.max(0, nowMs - this.stateStartedAt);
    const raw = Math.floor(elapsed / (1000 / def.fps));
    const index = def.loop ? raw % def.frames.length : Math.min(raw, def.frames.length - 1);
    const key = def.frames[index];
    if (key !== this.currentTexture) {
      this.sprite.setTexture(key);
      this.currentTexture = key;
    }
  }
}

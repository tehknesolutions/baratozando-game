import { HD_PLAYER_BENCHMARK, PLAYER_FRAMES } from '../../assets/assetKeys.js';
import type { PlayerState } from './PlayerState.js';

const HD_BENCHMARK_STATE_TEXTURE: Partial<Record<PlayerState, string>> = {
  IDLE: HD_PLAYER_BENCHMARK.idle,
  WING_FLAP: HD_PLAYER_BENCHMARK.wing,
  GLIDE: HD_PLAYER_BENCHMARK.wing,
  WALL_CLING: HD_PLAYER_BENCHMARK.wall,
  WALL_CLIMB: HD_PLAYER_BENCHMARK.wall,
};

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

  constructor(private readonly sprite: any, private readonly hdBenchmark = false) {}

  update(state: PlayerState, nowMs: number): void {
    if (state !== this.state) {
      this.state = state;
      this.stateStartedAt = nowMs;
    }
    if (this.hdBenchmark) {
      const hdTexture = HD_BENCHMARK_STATE_TEXTURE[state];
      if (hdTexture) {
        if (hdTexture !== this.currentTexture) {
          this.sprite.setTexture(hdTexture);
          this.currentTexture = hdTexture;
        }
        return;
      }
    }

    const def = DEFS[state];
    const elapsed = Math.max(0, nowMs - this.stateStartedAt);
    const raw = Math.floor(elapsed / (1000 / def.fps));
    const index = def.loop ? raw % def.frames.length : Math.min(raw, def.frames.length - 1);
    const key = 'player-idle-01'; // TEMP QA: single-frame visual lock
    if (key !== this.currentTexture) {
      this.sprite.setTexture(key);
      this.currentTexture = key;
    }
  }
}
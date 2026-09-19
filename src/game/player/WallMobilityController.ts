import type { MobilityConfig } from './MobilityConfig.js';
import type { SurfaceType } from '../world/SurfaceType.js';
import { isBaseClimbableSurface } from '../world/SurfaceType.js';

export type WallFacts = {
  touchingLeft: boolean;
  touchingRight: boolean;
  moveX: -1 | 0 | 1;
  moveY: -1 | 0 | 1;
  surface: SurfaceType | null;
  nowMs: number;
};

export type WallResolution = {
  attached: boolean;
  wallSide: -1 | 0 | 1;
  climbVelocityY: number;
  slideVelocityY: number;
};

export class WallMobilityController {
  private detachedUntil = Number.NEGATIVE_INFINITY;
  private latchedSide: -1 | 0 | 1 = 0;

  constructor(private readonly config: MobilityConfig) {}

  reset(): void {
    this.detachedUntil = Number.NEGATIVE_INFINITY;
    this.latchedSide = 0;
  }

  resolve(facts: WallFacts): WallResolution {
    const wallSide: -1 | 0 | 1 = facts.touchingLeft ? -1 : facts.touchingRight ? 1 : 0;
    const climbable = wallSide !== 0 && isBaseClimbableSurface(facts.surface);
    const pushingIntoWall = wallSide !== 0 && facts.moveX === wallSide;
    const pressingAway = wallSide !== 0 && facts.moveX === -wallSide;
    const verticalIntent = facts.moveY !== 0;
    const alreadyLatched = wallSide !== 0 && this.latchedSide === wallSide;
    const canAttach = facts.nowMs >= this.detachedUntil && climbable && !pressingAway;
    const attached = canAttach && (verticalIntent || pushingIntoWall || alreadyLatched);

    if (attached) {
      this.latchedSide = wallSide;
    } else if (wallSide === 0 || pressingAway || !climbable || facts.nowMs < this.detachedUntil) {
      this.latchedSide = 0;
    }

    return {
      attached,
      wallSide,
      climbVelocityY: attached ? facts.moveY * this.config.wallClimbSpeed : 0,
      slideVelocityY: attached ? this.config.wallSlideSpeed : Number.POSITIVE_INFINITY,
    };
  }

  wallJump(nowMs: number, wallSide: -1 | 1): { velocityX: number; velocityY: number } {
    this.detachedUntil = nowMs + this.config.wallDetachLockMs;
    this.latchedSide = 0;
    return {
      velocityX: -wallSide * this.config.wallJumpVelocityX,
      velocityY: this.config.wallJumpVelocityY,
    };
  }
}

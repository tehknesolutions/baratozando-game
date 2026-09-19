import type { MobilityConfig } from './MobilityConfig.js';

export class WingMobilityController {
  private remaining: number;
  private nextFlapAt = Number.NEGATIVE_INFINITY;
  private wallGripStartedAt = Number.NEGATIVE_INFINITY;
  private glideStartedAt = Number.NEGATIVE_INFINITY;
  private gliding = false;

  constructor(private readonly config: MobilityConfig) {
    this.remaining = config.wingFlaps;
  }

  get flapsRemaining(): number { return this.remaining; }
  get isGliding(): boolean { return this.gliding; }

  reset(): void {
    this.remaining = this.config.wingFlaps;
    this.nextFlapAt = Number.NEGATIVE_INFINITY;
    this.wallGripStartedAt = Number.NEGATIVE_INFINITY;
    this.glideStartedAt = Number.NEGATIVE_INFINITY;
    this.gliding = false;
  }

  noteGrounded(_nowMs: number): void {
    this.remaining = this.config.wingFlaps;
    this.wallGripStartedAt = Number.NEGATIVE_INFINITY;
    this.glideStartedAt = Number.NEGATIVE_INFINITY;
    this.gliding = false;
  }

  noteStableWallGrip(nowMs: number, climbable: boolean): void {
    if (!climbable) {
      this.wallGripStartedAt = Number.NEGATIVE_INFINITY;
      return;
    }
    if (!Number.isFinite(this.wallGripStartedAt)) this.wallGripStartedAt = nowMs;
    if (nowMs - this.wallGripStartedAt >= this.config.stableWallGripResetMs) {
      this.remaining = this.config.wingFlaps;
    }
  }

  tryFlap(nowMs: number, airborne: boolean): boolean {
    if (!airborne || this.remaining <= 0 || nowMs < this.nextFlapAt) return false;
    this.remaining -= 1;
    this.nextFlapAt = nowMs + this.config.wingFlapCooldownMs;
    this.gliding = false;
    this.glideStartedAt = Number.NEGATIVE_INFINITY;
    return true;
  }

  flapVelocity(): number { return this.config.wingFlapVelocity; }

  updateGlide(nowMs: number, jumpHeld: boolean, descending: boolean): boolean {
    if (!jumpHeld || !descending) {
      this.gliding = false;
      this.glideStartedAt = Number.NEGATIVE_INFINITY;
      return false;
    }
    if (!Number.isFinite(this.glideStartedAt)) this.glideStartedAt = nowMs;
    this.gliding = nowMs - this.glideStartedAt <= this.config.glideBudgetMs;
    return this.gliding;
  }

  clampFallSpeed(currentVy: number): number {
    return this.gliding ? Math.min(currentVy, this.config.glideMaxFallSpeed) : currentVy;
  }
}

import type { PlayerMovementConfig } from './PlayerMovementConfig.js';

export class MovementTimers {
  private lastGroundedAt = Number.NEGATIVE_INFINITY;
  private bufferedJumpAt = Number.NEGATIVE_INFINITY;
  private dodgeStartedAt = Number.NEGATIVE_INFINITY;
  private nextDodgeAt = Number.NEGATIVE_INFINITY;

  constructor(private readonly config: PlayerMovementConfig) {}

  noteGrounded(nowMs: number): void {
    this.lastGroundedAt = nowMs;
  }

  canCoyoteJump(nowMs: number): boolean {
    return nowMs - this.lastGroundedAt <= this.config.coyoteTimeMs;
  }

  consumeCoyote(): void {
    this.lastGroundedAt = Number.NEGATIVE_INFINITY;
  }

  bufferJump(nowMs: number): void {
    this.bufferedJumpAt = nowMs;
  }

  canConsumeBufferedJump(nowMs: number): boolean {
    return nowMs - this.bufferedJumpAt <= this.config.jumpBufferMs;
  }

  consumeBufferedJump(nowMs: number): boolean {
    if (!this.canConsumeBufferedJump(nowMs)) return false;
    this.bufferedJumpAt = Number.NEGATIVE_INFINITY;
    return true;
  }

  tryStartDodge(nowMs: number): boolean {
    if (nowMs < this.nextDodgeAt) return false;
    this.dodgeStartedAt = nowMs;
    this.nextDodgeAt = nowMs + this.config.dodgeCooldownMs;
    return true;
  }

  isDodging(nowMs: number): boolean {
    return nowMs - this.dodgeStartedAt < this.config.dodgeDurationMs;
  }

  reset(): void {
    this.lastGroundedAt = Number.NEGATIVE_INFINITY;
    this.bufferedJumpAt = Number.NEGATIVE_INFINITY;
    this.dodgeStartedAt = Number.NEGATIVE_INFINITY;
    this.nextDodgeAt = Number.NEGATIVE_INFINITY;
  }
}

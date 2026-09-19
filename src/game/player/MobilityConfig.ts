export type MobilityConfig = {
  walkSpeed: number;
  runSpeed: number;
  groundAcceleration: number;
  groundDeceleration: number;
  airAcceleration: number;
  gravity: number;
  jumpVelocity: number;
  maxFallSpeed: number;
  coyoteTimeMs: number;
  jumpBufferMs: number;
  jumpCutMultiplier: number;
  dodgeDurationMs: number;
  dodgeSpeed: number;
  dodgeCooldownMs: number;
  wingFlaps: number;
  wingFlapVelocity: number;
  wingFlapCooldownMs: number;
  glideMaxFallSpeed: number;
  glideBudgetMs: number;
  stableWallGripResetMs: number;
  wallClimbSpeed: number;
  wallSlideSpeed: number;
  wallJumpVelocityX: number;
  wallJumpVelocityY: number;
  wallDetachLockMs: number;
  ledgeAssistHorizontalPx: number;
  ledgeAssistVerticalPx: number;
};

export const MOBILITY_V2: MobilityConfig = {
  walkSpeed: 115,
  runSpeed: 195,
  groundAcceleration: 1500,
  groundDeceleration: 1800,
  airAcceleration: 1000,
  gravity: 900,
  jumpVelocity: -350,
  maxFallSpeed: 420,
  coyoteTimeMs: 140,
  jumpBufferMs: 160,
  jumpCutMultiplier: 0.58,
  dodgeDurationMs: 160,
  dodgeSpeed: 330,
  dodgeCooldownMs: 380,
  wingFlaps: 2,
  wingFlapVelocity: -230,
  wingFlapCooldownMs: 130,
  glideMaxFallSpeed: 150,
  glideBudgetMs: 650,
  stableWallGripResetMs: 150,
  wallClimbSpeed: 80,
  wallSlideSpeed: 45,
  wallJumpVelocityX: 190,
  wallJumpVelocityY: -310,
  wallDetachLockMs: 120,
  ledgeAssistHorizontalPx: 10,
  ledgeAssistVerticalPx: 12,
};

export function validateMobilityConfig(config: MobilityConfig): void {
  for (const [key, value] of Object.entries(config)) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error(`Invalid mobility config: ${key} must be finite`);
    }
  }

  const positive: Array<keyof MobilityConfig> = [
    'walkSpeed','runSpeed','groundAcceleration','groundDeceleration','airAcceleration','gravity','maxFallSpeed',
    'coyoteTimeMs','jumpBufferMs','jumpCutMultiplier','dodgeDurationMs','dodgeSpeed','dodgeCooldownMs','wingFlaps',
    'wingFlapCooldownMs','glideMaxFallSpeed','glideBudgetMs','stableWallGripResetMs','wallClimbSpeed','wallSlideSpeed',
    'wallJumpVelocityX','wallDetachLockMs','ledgeAssistHorizontalPx','ledgeAssistVerticalPx',
  ];
  for (const key of positive) if (config[key] <= 0) throw new Error(`Invalid mobility config: ${key} must be > 0`);

  if (!Number.isInteger(config.wingFlaps)) throw new Error('Invalid mobility config: wingFlaps must be an integer');
  if (config.jumpVelocity >= 0) throw new Error('Invalid mobility config: jumpVelocity must be negative');
  if (config.wingFlapVelocity >= 0) throw new Error('Invalid mobility config: wingFlapVelocity must be negative');
  if (config.wallJumpVelocityY >= 0) throw new Error('Invalid mobility config: wallJumpVelocityY must be negative');
  if (config.jumpCutMultiplier >= 1) throw new Error('Invalid mobility config: jumpCutMultiplier must be < 1');
  if (config.runSpeed <= config.walkSpeed) throw new Error('Invalid mobility config: runSpeed must exceed walkSpeed');
  if (config.glideMaxFallSpeed >= config.maxFallSpeed) throw new Error('Invalid mobility config: glideMaxFallSpeed must be below maxFallSpeed');
  if (config.wallClimbSpeed >= config.runSpeed) throw new Error('Invalid mobility config: wallClimbSpeed must be below runSpeed');
}

validateMobilityConfig(MOBILITY_V2);

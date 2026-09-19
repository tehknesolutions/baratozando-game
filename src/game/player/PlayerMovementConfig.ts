export type PlayerMovementConfig = {
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
};

export const PLAYER_MOVEMENT_CONFIG: PlayerMovementConfig = {
  walkSpeed: 105,
  runSpeed: 185,
  groundAcceleration: 1200,
  groundDeceleration: 1500,
  airAcceleration: 700,
  gravity: 1050,
  jumpVelocity: -360,
  maxFallSpeed: 520,
  coyoteTimeMs: 100,
  jumpBufferMs: 110,
  jumpCutMultiplier: 0.48,
  dodgeDurationMs: 160,
  dodgeSpeed: 330,
  dodgeCooldownMs: 420,
};

export function validateMovementConfig(config: PlayerMovementConfig): void {
  for (const [key, value] of Object.entries(config)) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error(`Invalid movement config: ${key} must be finite`);
    }
  }

  const positiveKeys: Array<keyof PlayerMovementConfig> = [
    'walkSpeed',
    'runSpeed',
    'groundAcceleration',
    'groundDeceleration',
    'airAcceleration',
    'gravity',
    'maxFallSpeed',
    'coyoteTimeMs',
    'jumpBufferMs',
    'jumpCutMultiplier',
    'dodgeDurationMs',
    'dodgeSpeed',
    'dodgeCooldownMs',
  ];

  for (const key of positiveKeys) {
    if (config[key] <= 0) throw new Error(`Invalid movement config: ${key} must be > 0`);
  }

  if (config.jumpVelocity >= 0) throw new Error('Invalid movement config: jumpVelocity must be negative');
  if (config.jumpCutMultiplier >= 1) throw new Error('Invalid movement config: jumpCutMultiplier must be < 1');
  if (config.runSpeed <= config.walkSpeed) throw new Error('Invalid movement config: runSpeed must exceed walkSpeed');
}

validateMovementConfig(PLAYER_MOVEMENT_CONFIG);

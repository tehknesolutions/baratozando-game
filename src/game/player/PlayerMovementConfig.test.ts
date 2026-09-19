import { PLAYER_MOVEMENT_CONFIG, validateMovementConfig } from './PlayerMovementConfig.js';

function equal(actual: unknown, expected: unknown, message: string) {
  if (!Object.is(actual, expected)) throw new Error(`${message}: expected ${expected}, got ${actual}`);
}
function throws(fn: () => void, message: string) {
  let didThrow = false;
  try { fn(); } catch { didThrow = true; }
  if (!didThrow) throw new Error(`${message}: expected function to throw`);
}

let passed = 0;
function test(name: string, fn: () => void) {
  fn();
  passed += 1;
  console.log(`✓ ${name}`);
}

test('matches the approved M0 movement constants', () => {
  equal(PLAYER_MOVEMENT_CONFIG.walkSpeed, 105, 'walkSpeed');
  equal(PLAYER_MOVEMENT_CONFIG.runSpeed, 185, 'runSpeed');
  equal(PLAYER_MOVEMENT_CONFIG.groundAcceleration, 1200, 'groundAcceleration');
  equal(PLAYER_MOVEMENT_CONFIG.groundDeceleration, 1500, 'groundDeceleration');
  equal(PLAYER_MOVEMENT_CONFIG.airAcceleration, 700, 'airAcceleration');
  equal(PLAYER_MOVEMENT_CONFIG.gravity, 1050, 'gravity');
  equal(PLAYER_MOVEMENT_CONFIG.jumpVelocity, -360, 'jumpVelocity');
  equal(PLAYER_MOVEMENT_CONFIG.maxFallSpeed, 520, 'maxFallSpeed');
  equal(PLAYER_MOVEMENT_CONFIG.coyoteTimeMs, 100, 'coyoteTimeMs');
  equal(PLAYER_MOVEMENT_CONFIG.jumpBufferMs, 110, 'jumpBufferMs');
  equal(PLAYER_MOVEMENT_CONFIG.jumpCutMultiplier, 0.48, 'jumpCutMultiplier');
  equal(PLAYER_MOVEMENT_CONFIG.dodgeDurationMs, 160, 'dodgeDurationMs');
  equal(PLAYER_MOVEMENT_CONFIG.dodgeSpeed, 330, 'dodgeSpeed');
  equal(PLAYER_MOVEMENT_CONFIG.dodgeCooldownMs, 420, 'dodgeCooldownMs');
});

test('rejects invalid non-positive values', () => {
  throws(() => validateMovementConfig({ ...PLAYER_MOVEMENT_CONFIG, walkSpeed: 0 }), 'walkSpeed validation');
  throws(() => validateMovementConfig({ ...PLAYER_MOVEMENT_CONFIG, dodgeCooldownMs: -1 }), 'dodgeCooldown validation');
});

console.log(`PASS ${passed}/${passed} PlayerMovementConfig tests`);

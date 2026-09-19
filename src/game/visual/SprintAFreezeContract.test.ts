import { PLAYER_MOVEMENT_CONFIG as P } from '../player/PlayerMovementConfig.js';
import { FIRST_THREAT_LAYOUT as L } from '../world/FirstThreatLayout.js';

function equal(actual: unknown, expected: unknown, label: string) {
  if (!Object.is(actual, expected)) throw new Error(`${label}: expected ${expected}, got ${actual}`);
}

equal(P.walkSpeed, 105, 'walkSpeed');
equal(P.runSpeed, 185, 'runSpeed');
equal(P.gravity, 1050, 'gravity');
equal(P.jumpVelocity, -360, 'jumpVelocity');
equal(P.maxFallSpeed, 520, 'maxFallSpeed');
equal(P.coyoteTimeMs, 100, 'coyoteTimeMs');
equal(P.jumpBufferMs, 110, 'jumpBufferMs');
equal(P.dodgeDurationMs, 160, 'dodgeDurationMs');
equal(P.dodgeSpeed, 330, 'dodgeSpeed');
equal(P.dodgeCooldownMs, 420, 'dodgeCooldownMs');

equal(L.width, 2176, 'world width');
equal(L.height, 576, 'world height');
equal(L.checkpoint.x, 544, 'checkpoint x');
equal(L.checkpoint.y, 480, 'checkpoint y');
equal(L.chase.triggerX, 640, 'triggerX');
equal(L.chase.warningDurationMs, 650, 'warningDurationMs');
equal(L.chase.threatStartX, 260, 'threatStartX');
equal(L.chase.threatSpeed, 205, 'threatSpeed');
equal(L.chase.catchDistance, 54, 'catchDistance');
equal(L.chase.escapeX, 1875, 'escapeX');

console.log('PASS Sprint A frozen gameplay contract');

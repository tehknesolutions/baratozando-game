import { MOBILITY_V2, validateMobilityConfig } from './MobilityConfig.js';

function ok(value: unknown, message: string): void {
  if (!value) throw new Error(message);
}

validateMobilityConfig(MOBILITY_V2);
ok(MOBILITY_V2.runSpeed > MOBILITY_V2.walkSpeed, 'runSpeed must exceed walkSpeed');
ok(MOBILITY_V2.jumpVelocity < 0, 'jumpVelocity must be negative');
ok(MOBILITY_V2.wallJumpVelocityY < 0, 'wallJumpVelocityY must be negative');
ok(MOBILITY_V2.wingFlaps >= 1, 'at least one flap is required');
ok(MOBILITY_V2.glideMaxFallSpeed < MOBILITY_V2.maxFallSpeed, 'glide must slow falling');
ok(MOBILITY_V2.wallClimbSpeed < MOBILITY_V2.runSpeed, 'wall climb must be slower than run');

let rejected = false;
try {
  validateMobilityConfig({ ...MOBILITY_V2, wingFlaps: 0 });
} catch {
  rejected = true;
}
ok(rejected, 'invalid wingFlaps must be rejected');

console.log('PASS MobilityConfig');

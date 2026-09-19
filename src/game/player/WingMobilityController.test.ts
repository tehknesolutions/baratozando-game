import { MOBILITY_V2 } from './MobilityConfig.js';
import { WingMobilityController } from './WingMobilityController.js';

function equal(a: unknown, b: unknown, label: string): void {
  if (!Object.is(a,b)) throw new Error(`${label}: expected ${b}, got ${a}`);
}
function ok(v: unknown, label: string): void { if (!v) throw new Error(label); }

const w = new WingMobilityController(MOBILITY_V2);
equal(w.flapsRemaining, 2, 'starts with two flaps');
ok(w.tryFlap(1000, true), 'first flap should fire');
equal(w.flapsRemaining, 1, 'first flap consumes one');
ok(!w.tryFlap(1050, true), 'cooldown blocks spam');
ok(w.tryFlap(1140, true), 'second flap after cooldown');
equal(w.flapsRemaining, 0, 'second flap consumes last');
ok(!w.tryFlap(1300, true), 'no third flap');
w.noteGrounded(1400);
equal(w.flapsRemaining, 2, 'ground resets flaps');

w.tryFlap(1600, true);
w.noteStableWallGrip(1700, true);
w.noteStableWallGrip(1860, true);
equal(w.flapsRemaining, 2, 'stable rough wall grip resets flaps');

ok(w.updateGlide(2000, true, true), 'descending with jump held starts glide');
ok(w.updateGlide(2500, true, true), 'glide stays active within budget');
equal(w.clampFallSpeed(300), MOBILITY_V2.glideMaxFallSpeed, 'active glide clamps fall speed');
ok(!w.updateGlide(2700, true, true), 'glide stops after budget');
ok(!w.updateGlide(2800, false, true), 'releasing jump exits glide');

w.reset();
equal(w.flapsRemaining, 2, 'reset restores flaps');
console.log('PASS WingMobilityController');

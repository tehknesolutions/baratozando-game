import { resolveWallContactFromGeometry } from './WallContactSensor.js';

function ok(v: unknown, m: string): void { if (!v) throw new Error(m); }
function eq(a: unknown, b: unknown, m: string): void {
  if (!Object.is(a, b)) throw new Error(`${m}: expected ${b}, got ${a}`);
}

const wall = { x: 100, y: 100, width: 32, height: 220, surface: 'ROUGH_CLIMB' as const };

let r = resolveWallContactFromGeometry(
  { left: 69, right: 99, top: 160, bottom: 178 },
  [wall],
  7,
);
ok(r.touchingRight, 'player left of wall should sense wall on right without Phaser blocked/touching flags');
eq(r.surface, 'ROUGH_CLIMB', 'sensor should return surface type');

r = resolveWallContactFromGeometry(
  { left: 133, right: 163, top: 160, bottom: 178 },
  [wall],
  7,
);
ok(r.touchingLeft, 'player right of wall should sense wall on left');

r = resolveWallContactFromGeometry(
  { left: 70, right: 99, top: 76, bottom: 99 },
  [wall],
  7,
);
ok(!r.touchingLeft && !r.touchingRight, 'standing just above the top edge must not count as side contact');

r = resolveWallContactFromGeometry(
  { left: 61, right: 91, top: 160, bottom: 178 },
  [wall],
  7,
);
ok(!r.touchingLeft && !r.touchingRight, 'outside probe distance must not attach');

const smooth = { x: 200, y: 100, width: 32, height: 220, surface: 'SMOOTH_LOCKED' as const };
r = resolveWallContactFromGeometry(
  { left: 169, right: 199, top: 160, bottom: 178 },
  [wall, smooth],
  7,
);
eq(r.surface, 'SMOOTH_LOCKED', 'sensor reports actual material so wall controller can reject it');

console.log('PASS WallContactSensor');

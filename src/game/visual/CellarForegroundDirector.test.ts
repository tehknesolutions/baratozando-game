import assert from 'node:assert/strict';
import { CELLAR_FOREGROUND, isForegroundPlacementSafe } from './CellarForegroundDirector.js';

assert.equal(CELLAR_FOREGROUND.ownsPhysics, false);
assert.ok(CELLAR_FOREGROUND.parallax > 1);
assert.ok(CELLAR_FOREGROUND.maxAlpha <= 0.42);
assert.ok(CELLAR_FOREGROUND.exclusionZones.length >= 3);

for (const zone of CELLAR_FOREGROUND.exclusionZones) {
  assert.equal(isForegroundPlacementSafe(zone.x + zone.width / 2, zone.y + zone.height / 2), false);
}
assert.equal(isForegroundPlacementSafe(1180, 160), true);

console.log('Cellar foreground occlusion contract: PASS');

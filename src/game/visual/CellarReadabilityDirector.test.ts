import assert from 'node:assert/strict';
import { CELLAR_READABILITY } from './CellarReadabilityDirector.js';

assert.equal(CELLAR_READABILITY.ownsPhysics, false);
assert.equal(CELLAR_READABILITY.mutatesPlayerScale, false);
assert.ok(CELLAR_READABILITY.playerField.alpha <= 0.065);
assert.ok(CELLAR_READABILITY.playerField.width >= 140);
assert.ok(CELLAR_READABILITY.playerField.height >= 70);
assert.ok(CELLAR_READABILITY.environmentPools.length >= 2);
for (const pool of CELLAR_READABILITY.environmentPools) {
  assert.ok(pool.alpha > 0 && pool.alpha <= 0.16);
  assert.ok(pool.width >= 240 && pool.height >= 140);
}

console.log('Cellar environmental readability contract: PASS');

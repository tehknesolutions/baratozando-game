import assert from 'node:assert/strict';
import { CELLAR_PARALLAX, resolveParallaxOffset } from './CellarParallaxDirector.js';

assert.ok(CELLAR_PARALLAX.far.factor < CELLAR_PARALLAX.rear.factor);
assert.ok(CELLAR_PARALLAX.rear.factor < 1);
assert.equal(CELLAR_PARALLAX.ownsPhysics, false);

assert.equal(resolveParallaxOffset(0, 0.55, 120), 0);
assert.equal(resolveParallaxOffset(100, 0.55, 120), -45);
assert.equal(resolveParallaxOffset(1000, 0.55, 120), -120);
assert.equal(resolveParallaxOffset(-1000, 0.55, 120), 120);

console.log('Cellar bounded parallax contract: PASS');

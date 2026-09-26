import assert from 'node:assert/strict';
import { CELLAR_LAYERS } from './CellarLayerModel.js';
import { CELLAR_READABILITY } from './CellarReadabilityDirector.js';
import { CELLAR_PARALLAX } from './CellarParallaxDirector.js';
import { CELLAR_FOREGROUND } from './CellarForegroundDirector.js';
import { CELLAR_CAMERA } from './CellarCameraDirector.js';
import { CELLAR_SET_DRESSING } from './CellarSetDressingContract.js';

assert.equal(CELLAR_READABILITY.ownsPhysics, false);
assert.equal(CELLAR_PARALLAX.ownsPhysics, false);
assert.equal(CELLAR_FOREGROUND.ownsPhysics, false);
assert.equal(CELLAR_CAMERA.mutatesPhysics, false);
assert.equal(CELLAR_SET_DRESSING.ownsPhysics, false);
assert.equal(CELLAR_SET_DRESSING.mutatesPlayerScale, false);
assert.equal(CELLAR_SET_DRESSING.mutatesCamera, false);
assert.ok(CELLAR_LAYERS.farDarkness.depth < CELLAR_LAYERS.rearArchitecture.depth);
assert.ok(CELLAR_LAYERS.rearArchitecture.depth < CELLAR_LAYERS.gameplayPlane.depth);
assert.ok(CELLAR_LAYERS.gameplayPlane.depth < CELLAR_LAYERS.characterPlane.depth);
assert.ok(CELLAR_LAYERS.characterPlane.depth < CELLAR_LAYERS.nearForeground.depth);
assert.ok(CELLAR_LAYERS.nearForeground.depth < CELLAR_LAYERS.presentation.depth);
assert.ok(CELLAR_PARALLAX.far.factor < CELLAR_PARALLAX.rear.factor);
assert.ok(CELLAR_FOREGROUND.parallax > 1);
assert.ok(CELLAR_READABILITY.playerField.alpha <= 0.065);
assert.ok(CELLAR_FOREGROUND.maxAlpha <= 0.42);
assert.equal(CELLAR_SET_DRESSING.canOccludeCriticalTraversal, false);

console.log('Playable V3 aggregate presentation gate: PASS');

import assert from 'node:assert/strict';
import { PLAYABLE_V3_SCALE } from './PlayableV3Scale.js';

assert.equal(PLAYABLE_V3_SCALE.contractId, 'ROACH_WORLD_SCALE_V3');
assert.equal(PLAYABLE_V3_SCALE.sceneLocalScaleAllowed, false);
assert.equal(PLAYABLE_V3_SCALE.uniform, true);
assert.equal(PLAYABLE_V3_SCALE.sourceCanvasPx, 256);
assert.equal(PLAYABLE_V3_SCALE.targetGameplayCanvasPx, 96);
assert.equal(PLAYABLE_V3_SCALE.worldScale, 0.375);
assert.equal(PLAYABLE_V3_SCALE.sourceCanvasPx * PLAYABLE_V3_SCALE.worldScale, PLAYABLE_V3_SCALE.targetGameplayCanvasPx);

console.log('Playable V3 scale visual calibration contract: PASS');

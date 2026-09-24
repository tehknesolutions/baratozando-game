import assert from 'node:assert/strict';
import { PLAYABLE_V3_SCALE } from './PlayableV3Scale.js';

assert.equal(PLAYABLE_V3_SCALE.contractId, 'ROACH_WORLD_SCALE_V3');
assert.equal(PLAYABLE_V3_SCALE.sceneLocalScaleAllowed, false);
assert.equal(PLAYABLE_V3_SCALE.uniform, true);
assert.ok(PLAYABLE_V3_SCALE.worldScale > 0);
assert.ok(PLAYABLE_V3_SCALE.worldScale <= 1);

console.log('Playable V3 scale lock contract: PASS');

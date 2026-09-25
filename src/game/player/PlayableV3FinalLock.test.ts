import assert from 'node:assert/strict';
import { PLAYABLE_V3_FINAL_LOCK } from './PlayableV3FinalLock.js';

assert.equal(PLAYABLE_V3_FINAL_LOCK.visualScale, 0.5);
assert.equal(PLAYABLE_V3_FINAL_LOCK.bodyWidth, 30);
assert.equal(PLAYABLE_V3_FINAL_LOCK.bodyHeight, 18);
assert.equal(PLAYABLE_V3_FINAL_LOCK.bodyOffsetX, 17);
assert.equal(PLAYABLE_V3_FINAL_LOCK.bodyOffsetY, 42);
assert.equal(PLAYABLE_V3_FINAL_LOCK.actorOwnsPremiumScale, false);
assert.equal(PLAYABLE_V3_FINAL_LOCK.visualOwnsPremiumScale, true);
assert.equal(PLAYABLE_V3_FINAL_LOCK.visualHasPhysicsBody, false);
assert.equal(PLAYABLE_V3_FINAL_LOCK.sceneLocalScaleAllowed, false);

console.log('Playable V3 final lock contract: PASS');

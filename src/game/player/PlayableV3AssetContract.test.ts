import assert from 'node:assert/strict';
import { PLAYABLE_V3_ASSET_CONTRACT } from './PlayableV3AssetContract.js';

assert.equal(PLAYABLE_V3_ASSET_CONTRACT.id, 'ROACH_PLAYABLE_V3');
assert.equal(PLAYABLE_V3_ASSET_CONTRACT.visualIdentity, 'ROACH_MASTER_PREMIUM_V1');
assert.equal(PLAYABLE_V3_ASSET_CONTRACT.animationSource, 'ROACH_PLAYER_DARK_HORROR_V1');
assert.equal(PLAYABLE_V3_ASSET_CONTRACT.referenceBoardsAreRuntimeSprites, false);
assert.equal(PLAYABLE_V3_ASSET_CONTRACT.sceneLocalScaleAllowed, false);
assert.deepEqual(PLAYABLE_V3_ASSET_CONTRACT.requiredAnatomy, [
  'complete-body',
  'six-legs',
  'antennae',
  'wings',
]);
assert.deepEqual(PLAYABLE_V3_ASSET_CONTRACT.requiredStates, [
  'idle', 'walk', 'run', 'jump', 'fall', 'dodge', 'attack', 'hurt', 'death', 'climb',
]);

console.log('Playable V3 asset bridge contract: PASS');

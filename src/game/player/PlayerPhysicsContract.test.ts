import assert from 'node:assert/strict';
import { PLAYER_PHYSICS_CONTRACT, getPlayerPhysicsSnapshot } from './PlayerPhysicsContract.js';

assert.equal(PLAYER_PHYSICS_CONTRACT.contractId, 'PLAYER_PHYSICS_V3');

const baseline = getPlayerPhysicsSnapshot(0.375);
assert.deepEqual(getPlayerPhysicsSnapshot(0.25), baseline);
assert.deepEqual(getPlayerPhysicsSnapshot(0.5), baseline);
assert.deepEqual(getPlayerPhysicsSnapshot(1), baseline);

assert.equal(baseline.bodyWidth, 64);
assert.equal(baseline.bodyHeight, 32);
assert.equal(baseline.feetAnchorX, 0.5);
assert.equal(baseline.feetAnchorY, 1);

console.log('Player physics render-scale invariance contract: PASS');

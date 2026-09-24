import assert from 'node:assert/strict';
import { PLAYER_PHYSICS_CONTRACT, getPlayerPhysicsSnapshot } from './PlayerPhysicsContract.js';

assert.equal(PLAYER_PHYSICS_CONTRACT.contractId, 'PLAYER_PHYSICS_V3');

// Runtime-proven geometry from the stable 0.375 Player implementation.
const baseline = getPlayerPhysicsSnapshot(0.375);
assert.equal(baseline.bodyWidth, 30);
assert.equal(baseline.bodyHeight, 18);
assert.equal(baseline.bodyOffsetX, 17);
assert.equal(baseline.bodyOffsetY, 42);
assert.equal(baseline.feetAnchorX, 0.5);
assert.equal(baseline.feetAnchorY, 1);

// Rendering candidates must never mutate gameplay geometry again.
assert.deepEqual(getPlayerPhysicsSnapshot(0.25), baseline);
assert.deepEqual(getPlayerPhysicsSnapshot(0.5), baseline);
assert.deepEqual(getPlayerPhysicsSnapshot(1), baseline);

console.log('Player physics proven-geometry invariance contract: PASS');

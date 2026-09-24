import assert from 'node:assert/strict';
import { createRoachVisualSnapshot } from './RoachVisualContract.js';
import { getPlayerPhysicsSnapshot } from './PlayerPhysicsContract.js';

const physics = getPlayerPhysicsSnapshot(0.375);
const baseline = createRoachVisualSnapshot(0.375);
const enlarged = createRoachVisualSnapshot(0.5);

assert.equal(baseline.scale, 0.375);
assert.equal(enlarged.scale, 0.5);
assert.notDeepEqual(enlarged, baseline);

// The exact regression V3-03 exists to guarantee: visual calibration cannot
// mutate the stable gameplay body ever again.
assert.deepEqual(getPlayerPhysicsSnapshot(baseline.scale), physics);
assert.deepEqual(getPlayerPhysicsSnapshot(enlarged.scale), physics);
assert.equal(enlarged.physicsAuthority, false);
assert.equal(enlarged.originX, 0.5);
assert.equal(enlarged.originY, 1);

console.log('Roach visual/physics separation contract: PASS');

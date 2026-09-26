import assert from 'node:assert/strict';
import { createRoachVisualSnapshot, resolveRoachChannels } from './RoachVisualContract.js';
import { getPlayerPhysicsSnapshot } from './PlayerPhysicsContract.js';
import { resolveRoachAnimationV3 } from './RoachAnimationV3.js';

const physics = getPlayerPhysicsSnapshot(0.375);
const baseline = createRoachVisualSnapshot(0.375);
const enlarged = createRoachVisualSnapshot(0.5);
assert.equal(baseline.scale, 0.375);
assert.equal(enlarged.scale, 0.5);
assert.deepEqual(getPlayerPhysicsSnapshot(baseline.scale), physics);
assert.deepEqual(getPlayerPhysicsSnapshot(enlarged.scale), physics);
assert.equal(enlarged.physicsAuthority, false);
assert.equal(enlarged.originX, 0.5);
assert.equal(enlarged.originY, 1);

for (const state of ['IDLE','WALK','RUN','JUMP','FALL','WALL_CLING','WALL_CLIMB','WALL_JUMP','DODGE','HURT','DEATH','RESPAWN'] as const) {
  const channels = resolveRoachChannels(resolveRoachAnimationV3(state));
  assert.equal(channels.wingsVisible, false, `${state} must hide wings`);
  assert.equal(channels.wingMode, 'HIDDEN');
  assert.equal(channels.scale, 0.5);
  assert.equal(channels.physicsAuthority, false);
}
assert.equal(resolveRoachChannels(resolveRoachAnimationV3('WING_FLAP')).wingsVisible, true);
assert.equal(resolveRoachChannels(resolveRoachAnimationV3('GLIDE')).wingsVisible, true);
assert.equal(resolveRoachChannels(resolveRoachAnimationV3('RESPAWN')).wingsVisible, false);
assert.equal(resolveRoachChannels(resolveRoachAnimationV3('DEATH')).wingsVisible, false);

console.log('Roach body/wing presentation contract: PASS');

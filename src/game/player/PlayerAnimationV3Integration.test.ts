import assert from 'node:assert/strict';
import { resolveRoachAnimationV3 } from './RoachAnimationV3.js';
import { resolveRoachChannels } from './RoachVisualContract.js';

const sequence = ['IDLE','WING_FLAP','FALL','GLIDE','WALL_CLING','HURT','RESPAWN'] as const;
const snapshots = sequence.map((state) => ({ state, ...resolveRoachChannels(resolveRoachAnimationV3(state)) }));

assert.equal(snapshots[0].wingsVisible, false);
assert.equal(snapshots[1].wingsVisible, true);
assert.equal(snapshots[2].wingsVisible, false, 'leaving WING_FLAP for FALL must hide wings immediately');
assert.equal(snapshots[3].wingsVisible, true);
assert.equal(snapshots[4].wingsVisible, false, 'GLIDE -> WALL_CLING must hide wings immediately');
assert.equal(snapshots[5].wingsVisible, false);
assert.equal(snapshots[6].wingsVisible, false, 'RESPAWN must reset wing presentation');
for (const snapshot of snapshots) {
  assert.equal(snapshot.scale, 0.5);
  assert.equal(snapshot.physicsAuthority, false);
}

console.log('Player Animation V3 integration transitions: PASS');

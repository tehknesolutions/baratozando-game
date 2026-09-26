import assert from 'node:assert/strict';
import { resolveRoachAnimationV3 } from './RoachAnimationV3.js';
import type { PlayerState } from './PlayerState.js';

const states: PlayerState[] = ['BOOT','IDLE','WALK','RUN','JUMP','FALL','WING_FLAP','GLIDE','WALL_CLING','WALL_CLIMB','WALL_JUMP','DODGE','HURT','DEATH','RESPAWN'];
for (const state of states) {
  const d = resolveRoachAnimationV3(state);
  assert.ok(d.bodyKey.length > 0, `${state} needs bodyKey`);
  assert.ok(d.fps > 0, `${state} needs positive fps`);
  assert.equal(d.presentationOnly, true);
  assert.equal(d.scale, 0.5);
  assert.equal(d.wingsVisible, state === 'WING_FLAP' || state === 'GLIDE');
  assert.ok(d.legMotion.length > 0, `${state} needs leg motion language`);
  assert.ok(d.antennaMotion.length > 0, `${state} needs antenna motion language`);
}
assert.equal(resolveRoachAnimationV3('WING_FLAP').wingMode, 'FLAP');
assert.equal(resolveRoachAnimationV3('GLIDE').wingMode, 'GLIDE');
assert.equal(resolveRoachAnimationV3('FALL').wingMode, 'HIDDEN');
assert.equal(resolveRoachAnimationV3('WALK').legMotion, 'TRIPOD');
assert.equal(resolveRoachAnimationV3('RUN').legMotion, 'TRIPOD_EXTENDED');
assert.equal(resolveRoachAnimationV3('WALL_CLIMB').legMotion, 'CLIMB_ALTERNATE');
assert.equal(resolveRoachAnimationV3('IDLE').antennaMotion, 'ASYNC_SCAN');
assert.ok(resolveRoachAnimationV3('RUN').fps > resolveRoachAnimationV3('WALK').fps);
assert.ok(resolveRoachAnimationV3('WALK').fps > resolveRoachAnimationV3('IDLE').fps);
console.log('Roach Animation V3 living-motion contract: PASS');

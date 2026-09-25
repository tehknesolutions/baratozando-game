import assert from 'node:assert/strict';
import { CELLAR_CAMERA, resolveCameraIntent } from './CellarCameraDirector.js';

assert.equal(CELLAR_CAMERA.mutatesPhysics, false);
assert.ok(CELLAR_CAMERA.deadzone.width >= 160);
assert.ok(CELLAR_CAMERA.deadzone.height >= 120);

assert.deepEqual(resolveCameraIntent(1, 0, 'IDLE'), { x: -62, y: 0 });
assert.deepEqual(resolveCameraIntent(-1, 190, 'RUN'), { x: 78, y: 0 });
assert.deepEqual(resolveCameraIntent(1, 20, 'WALL_CLIMB'), { x: -62, y: -78 });
assert.deepEqual(resolveCameraIntent(1, 200, 'FALL'), { x: -78, y: 60 });
assert.deepEqual(resolveCameraIntent(1, -200, 'JUMP'), { x: -78, y: -28 });

console.log('Cellar cinematic camera contract: PASS');

import assert from 'node:assert/strict';
import { CELLAR_SET_DRESSING } from './CellarSetDressingContract.js';

assert.equal(CELLAR_SET_DRESSING.ownsPhysics, false);
assert.equal(CELLAR_SET_DRESSING.canOccludeCriticalTraversal, false);
assert.equal(CELLAR_SET_DRESSING.mutatesPlayerScale, false);
assert.equal(CELLAR_SET_DRESSING.mutatesCamera, false);
assert.ok(CELLAR_SET_DRESSING.maxPropAlpha <= 0.76);
assert.ok(CELLAR_SET_DRESSING.maxMarkAlpha <= 0.28);

console.log('Cellar set dressing contract: PASS');

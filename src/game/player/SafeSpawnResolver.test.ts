import assert from 'node:assert/strict';
import { resolveSafeSpawn } from './SafeSpawnResolver.js';

const surfaces = [
  { x: 64, y: 752, width: 288, height: 128, role: 'route' as const },
  { x: 0, y: 880, width: 1792, height: 48, role: 'recovery' as const },
];

assert.deepEqual(
  resolveSafeSpawn({ x: 104, y: 690 }, surfaces, { bodyHeight: 18, clearance: 2 }),
  { x: 104, y: 750, surfaceY: 752 },
  'spawn must resolve to a grounded feet position on the start crate instead of preserving an airborne checkpoint',
);

assert.deepEqual(
  resolveSafeSpawn({ x: 500, y: 700 }, surfaces, { bodyHeight: 18, clearance: 2 }),
  { x: 500, y: 878, surfaceY: 880 },
  'when no route surface exists below x, resolver must use the recovery floor',
);

console.log('Safe spawn resolver contract: PASS');

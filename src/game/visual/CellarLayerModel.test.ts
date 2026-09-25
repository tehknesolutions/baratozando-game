import assert from 'node:assert/strict';
import { CELLAR_LAYERS } from './CellarLayerModel.js';

const ordered = [
  CELLAR_LAYERS.farDarkness,
  CELLAR_LAYERS.rearArchitecture,
  CELLAR_LAYERS.gameplayPlane,
  CELLAR_LAYERS.characterPlane,
  CELLAR_LAYERS.nearForeground,
  CELLAR_LAYERS.presentation,
];

assert.deepEqual(ordered.map((layer) => layer.id), [
  'far-darkness', 'rear-architecture', 'gameplay-plane',
  'character-plane', 'near-foreground', 'presentation',
]);
for (let i = 1; i < ordered.length; i += 1) assert.ok(ordered[i].depth > ordered[i - 1].depth);
for (const layer of ordered) {
  assert.ok(layer.parallax >= 0 && layer.parallax <= 1);
  assert.equal(layer.ownsCollision, layer.id === 'gameplay-plane');
}
assert.ok(CELLAR_LAYERS.farDarkness.parallax < CELLAR_LAYERS.rearArchitecture.parallax);
assert.ok(CELLAR_LAYERS.rearArchitecture.parallax < CELLAR_LAYERS.gameplayPlane.parallax);
assert.equal(CELLAR_LAYERS.gameplayPlane.parallax, 1);
assert.equal(CELLAR_LAYERS.characterPlane.parallax, 1);
assert.ok(CELLAR_LAYERS.nearForeground.parallax > 1);
assert.equal(CELLAR_LAYERS.presentation.parallax, 0);

console.log('Cellar layer model: PASS');

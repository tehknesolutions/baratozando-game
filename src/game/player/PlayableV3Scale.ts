export const PLAYABLE_V3_SCALE = Object.freeze({
  contractId: 'ROACH_WORLD_SCALE_V3',
  // V3-03 regression probe: visual-only 0.50 candidate. Physics remains fixed
  // by PLAYER_PHYSICS_CONTRACT at body 30x18 / offset 17,42. This value is
  // experimental and must not become the final scale lock without runtime QA.
  sourceCanvasPx: 256,
  targetGameplayCanvasPx: 128,
  worldScale: 0.5,
  uniform: true,
  sceneLocalScaleAllowed: false,
} as const);

export const ROACH_WORLD_SCALE = PLAYABLE_V3_SCALE.worldScale;

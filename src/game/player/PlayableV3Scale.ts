export const PLAYABLE_V3_SCALE = Object.freeze({
  contractId: 'ROACH_WORLD_SCALE_V3',
  // Premium runtime frames are authored on a 256px canvas. 0.25 restores the
  // intended 64px gameplay footprint while preserving the premium source detail.
  sourceCanvasPx: 256,
  targetGameplayCanvasPx: 64,
  worldScale: 0.25,
  uniform: true,
  sceneLocalScaleAllowed: false,
} as const);

export const ROACH_WORLD_SCALE = PLAYABLE_V3_SCALE.worldScale;

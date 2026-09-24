export const PLAYABLE_V3_SCALE = Object.freeze({
  contractId: 'ROACH_WORLD_SCALE_V3',
  // Stable runtime baseline. V3-03 now owns render/physics decoupling, so scale
  // calibration remains presentation-only. 0.50 is retained as a later
  // regression probe and is not the baseline until runtime validation passes.
  sourceCanvasPx: 256,
  targetGameplayCanvasPx: 96,
  worldScale: 0.375,
  uniform: true,
  sceneLocalScaleAllowed: false,
} as const);

export const ROACH_WORLD_SCALE = PLAYABLE_V3_SCALE.worldScale;

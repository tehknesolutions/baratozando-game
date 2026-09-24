export const PLAYABLE_V3_SCALE = Object.freeze({
  contractId: 'ROACH_WORLD_SCALE_V3',
  // Runtime evidence from the complete Cellar showed the 64px / 0.25 candidate
  // was too small to read as the playable hero. Promote the next calibrated
  // candidate to a 96px canvas footprint while keeping one global uniform scale.
  sourceCanvasPx: 256,
  targetGameplayCanvasPx: 96,
  worldScale: 0.375,
  uniform: true,
  sceneLocalScaleAllowed: false,
} as const);

export const ROACH_WORLD_SCALE = PLAYABLE_V3_SCALE.worldScale;

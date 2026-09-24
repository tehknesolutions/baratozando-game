export const PLAYABLE_V3_SCALE = Object.freeze({
  contractId: 'ROACH_WORLD_SCALE_V3',
  // Complete-Cellar runtime evidence showed 0.25 was unreadably small and 0.375
  // improved presence but remained undersized against doors, crates and props.
  // Promote the next controlled candidate to a 128px footprint. Physics/spawn
  // contracts remain unchanged; only the single global visual scale moves.
  sourceCanvasPx: 256,
  targetGameplayCanvasPx: 128,
  worldScale: 0.5,
  uniform: true,
  sceneLocalScaleAllowed: false,
} as const);

export const ROACH_WORLD_SCALE = PLAYABLE_V3_SCALE.worldScale;

export const ROACH_PREMIUM_PIPELINE = {
  version: '1.0.0',
  issue: 20,
  status: 'CANDIDATE',
  canonicalFacing: 'right',
  gates: [
    'MASTER_IDENTITY_LOCK',
    'RGBA_BOUNDS_QA',
    'SCALE_ORIGIN_CAMERA_LOCK',
    'POSE_LOCK',
    'ANIMATION_FAMILY_QA',
    'PLAYER_VISUAL_INTEGRATION',
    'BUILD_AND_GAMEPLAY_QA',
  ],
  sourceRules: {
    transparentRgba: true,
    bakedShadow: false,
    independentFrameRedesign: false,
    anatomyLegCount: 6,
  },
  runtime: {
    physicsFrozen: true,
    renderer: 'PlayerVisual',
    exportResolution: 'PENDING_SINGLE_POSE_GATE',
  },
} as const;

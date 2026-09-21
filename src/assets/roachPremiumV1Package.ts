export const ROACH_PREMIUM_V1_PACKAGE = {
  issue: 21,
  status: 'REFERENCE_ASSET_PACKAGE',
  sourceSize: [1536, 1024] as const,
  assetCount: 37,
  authority: 'REFERENCE',
  runtimeReady: false,
  families: {
    views: ['roach_side_right','roach_side_left','roach_front','roach_back','roach_top'],
    scale: ['roach_silhouette','roach_scale_in_game'],
    anatomy: ['head_detail','eye_detail','antenna_detail','thorax_detail','elytra_detail','wing_detail','leg_front_detail','leg_mid_detail','leg_back_detail'],
    materials: ['roach_color_palette','chitin_texture','pbr_materials'],
    poses: ['idle','walk_01','walk_02','run_01','run_02','jump','fall','wing_open','glide','wall_cling','dodge','hurt','death'],
    context: ['environment_reference','scenario_context'],
    identity: ['identity_logo','identity_tagline'],
    atlas: ['atlas_preview'],
  },
  gates: {
    binaryPresence: 'PENDING',
    transparentRuntimeMasters: 'PENDING',
    poseContinuityQa: 'PENDING',
    runtimePromotion: 'BLOCKED',
  },
} as const;

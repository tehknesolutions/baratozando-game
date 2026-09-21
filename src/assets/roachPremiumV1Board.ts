export type RoachPremiumAuthority = 'REFERENCE' | 'CANDIDATE' | 'APPROVED' | 'LOCKED' | 'RUNTIME_READY';

export const ROACH06_BOARD_ASSETS = {
  issue: 24,
  package: 'ROACH06_RGBA_BOARD_ASSETS_V1',
  source: 'ROACH_MASTER_PREMIUM_V1 approved production board',
  assetCount: 39,
  authority: 'REFERENCE' as RoachPremiumAuthority,
  runtimeReady: false,
  promotionGate: 'isolated transparent master + continuity QA + explicit approval',
  families: {
    views: ['side_right','side_left','front','back','top'],
    scale: ['silhouette','game_scale'],
    anatomy: ['head','eye','antenna','thorax','elytra','wing'],
    legs: ['front','mid','back'],
    poses: ['idle','walk_01','walk_02','run_01','run_02','jump','fall','wing_open','glide','wall_cling','dodge','hurt','death','respawn'],
    materials: ['pbr_shell','pbr_membrane','pbr_eye','pbr_leg','color_palette'],
    context: ['environment','game_scale_scene'],
    branding: ['logo','tagline'],
  },
} as const;

export function assertRoach06RuntimePromotion(): never {
  throw new Error('ROACH-06 board crops are REFERENCE assets; runtime promotion is blocked until transparent-master QA.');
}

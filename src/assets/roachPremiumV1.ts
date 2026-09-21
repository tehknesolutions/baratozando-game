export const ROACH_PREMIUM_V1_REFERENCE_KEYS = [
  'master_side_right','master_side_left','master_front','master_rear','master_top','silhouette_scale',
  'detail_head_eyes_antennae','detail_pronotum','detail_elytra_closed','detail_wing_open','detail_leg',
  'palette','materials_pbr','key_poses','gameplay_scale','environment_context','identity_notes','master_badge',
] as const;

export type RoachPremiumV1ReferenceKey = typeof ROACH_PREMIUM_V1_REFERENCE_KEYS[number];

export const ROACH_PREMIUM_V1_REFERENCE_ROOT = 'assets/player/premium-v1/reference';

/**
 * Design-reference assets only. Do not preload these as Player animation frames.
 * Runtime activation is gated by ROACH-02 (technical lock) and ROACH-03 (pose lock).
 */
export const roachPremiumV1ReferencePath = (key: RoachPremiumV1ReferenceKey): string =>
  `${ROACH_PREMIUM_V1_REFERENCE_ROOT}/${key}.png`;

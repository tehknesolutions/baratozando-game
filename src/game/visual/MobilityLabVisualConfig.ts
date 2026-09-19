import { CELLAR_TEXTURES } from '../../assets/environmentAssetKeys.js';

export type MobilityLabProp = {
  name: string;
  texture: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  alpha: number;
  depth: number;
};

export const MOBILITY_LAB_VISUAL = {
  surfaceMaterials: [
    ['recovery-floor', CELLAR_TEXTURES.masonry],
    ['start-crate', CELLAR_TEXTURES.wood],
    ['low-recovery', CELLAR_TEXTURES.masonry],
    ['tipped-can', CELLAR_TEXTURES.metal],
    ['shelf-support-a', CELLAR_TEXTURES.wood],
    ['pipe-a', CELLAR_TEXTURES.metal],
    ['mid-recovery', CELLAR_TEXTURES.masonry],
    ['shelf-support-b', CELLAR_TEXTURES.wood],
    ['upper-shelf', CELLAR_TEXTURES.wood],
    ['cable-landing', CELLAR_TEXTURES.metal],
    ['shelf-support-c', CELLAR_TEXTURES.wood],
    ['goal-shelf', CELLAR_TEXTURES.wood],
  ] as Array<[string, string]>,
  props: [
    { name: 'broken-crate', texture: CELLAR_TEXTURES.crate, x: 205, y: 785, scale: 1.65, rotation: -0.08, alpha: 0.92, depth: 3 },
    { name: 'tipped-can', texture: CELLAR_TEXTURES.can, x: 490, y: 680, scale: 1.45, rotation: -0.22, alpha: 0.95, depth: 4 },
    { name: 'rough-shelf', texture: CELLAR_TEXTURES.wood, x: 1228, y: 309, scale: 2.2, rotation: 0, alpha: 0.82, depth: 1 },
    { name: 'pipe-route', texture: CELLAR_TEXTURES.pipe, x: 840, y: 475, scale: 1.55, rotation: 0.02, alpha: 0.95, depth: 4 },
    { name: 'hanging-cable', texture: CELLAR_TEXTURES.cable, x: 1428, y: 180, scale: 0.9, rotation: 0.18, alpha: 0.82, depth: 8 },
    { name: 'fork-bridge', texture: CELLAR_TEXTURES.fork, x: 1365, y: 390, scale: 1.35, rotation: -0.52, alpha: 0.92, depth: 2 },
    { name: 'bottle-landmark', texture: CELLAR_TEXTURES.bottle, x: 1180, y: 792, scale: 2.25, rotation: 0.05, alpha: 0.42, depth: -3 },
  ] as MobilityLabProp[],
} as const;

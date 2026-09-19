import { CELLAR_TEXTURES } from '../../assets/environmentAssetKeys.js';

export type SurfaceMaterial = 'wood' | 'masonry' | 'metal';
export type VisualLayer = 'background' | 'gameplay' | 'foreground';

export type PropPlacement = {
  texture: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  alpha: number;
  layer: VisualLayer;
  collision: false;
};

export const FIRST_THREAT_VISUAL_CONFIG = {
  platformMaterials: [
    'wood','wood','masonry','masonry','metal',
    'metal','masonry','masonry','wood','metal',
  ] as SurfaceMaterial[],
  depths: { background: -16, atmosphere: -8, gameplay: 2, foreground: 28 },
  props: [
    { texture: CELLAR_TEXTURES.fork, x: 355, y: 490, scale: 1.7, rotation: -0.12, alpha: 0.62, layer: 'background', collision: false },
    { texture: CELLAR_TEXTURES.bottle, x: 920, y: 505, scale: 1.55, rotation: 0.04, alpha: 0.52, layer: 'background', collision: false },
    { texture: CELLAR_TEXTURES.can, x: 1330, y: 500, scale: 1.15, rotation: -0.04, alpha: 0.64, layer: 'background', collision: false },
    { texture: CELLAR_TEXTURES.crate, x: 1710, y: 505, scale: 1.25, rotation: 0, alpha: 0.58, layer: 'background', collision: false },
    { texture: CELLAR_TEXTURES.cable, x: 1100, y: 118, scale: 1.2, rotation: 0.08, alpha: 0.42, layer: 'foreground', collision: false },
    { texture: CELLAR_TEXTURES.drain, x: 2010, y: 486, scale: 1.05, rotation: 0, alpha: 0.72, layer: 'gameplay', collision: false },
  ] as PropPlacement[],
} as const;

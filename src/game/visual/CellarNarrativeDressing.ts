import { CELLAR_TEXTURE_DISPLAY_SCALE, CELLAR_TEXTURES } from '../../assets/environmentAssetKeys.js';

type NarrativeProp = {
  texture: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  alpha: number;
  depth: number;
  scrollFactor?: number;
  collision: false;
};

type StainMark = {
  x: number;
  y: number;
  width: number;
  height: number;
  alpha: number;
  color: number;
  depth: number;
};

type ScratchCluster = {
  x: number;
  y: number;
  count: number;
  spacing: number;
  length: number;
  rotation: number;
  alpha: number;
  color: number;
  depth: number;
};

type DebrisTrail = {
  x: number;
  y: number;
  count: number;
  dx: number;
  dy: number;
  radius: number;
  alpha: number;
  color: number;
  depth: number;
};

const FIRST_THREAT_PROPS: NarrativeProp[] = [
  { texture: CELLAR_TEXTURES.can, x: 292, y: 487, scale: 0.82, rotation: -0.34, alpha: 0.76, depth: 3.2, collision: false },
  { texture: CELLAR_TEXTURES.fork, x: 338, y: 493, scale: 0.94, rotation: 0.23, alpha: 0.72, depth: 3.3, collision: false },
  { texture: CELLAR_TEXTURES.bottle, x: 908, y: 503, scale: 0.76, rotation: 0.21, alpha: 0.58, depth: 1.7, scrollFactor: 0.96, collision: false },
  { texture: CELLAR_TEXTURES.crate, x: 1760, y: 486, scale: 0.92, rotation: -0.035, alpha: 0.72, depth: 1.8, collision: false },
  { texture: CELLAR_TEXTURES.can, x: 1812, y: 492, scale: 0.66, rotation: 0.52, alpha: 0.64, depth: 2.1, collision: false },
];

const FIRST_THREAT_STAINS: StainMark[] = [
  { x: 780, y: 488, width: 138, height: 18, alpha: 0.18, color: 0x1a120d, depth: 2.22 },
  { x: 1090, y: 424, width: 62, height: 21, alpha: 0.16, color: 0x171512, depth: 2.22 },
  { x: 1504, y: 487, width: 124, height: 14, alpha: 0.24, color: 0x101211, depth: 2.24 },
  { x: 2016, y: 426, width: 92, height: 16, alpha: 0.19, color: 0x21150f, depth: 2.22 },
];

const FIRST_THREAT_SCRATCHES: ScratchCluster[] = [
  { x: 1120, y: 420, count: 4, spacing: 8, length: 38, rotation: -0.18, alpha: 0.18, color: 0xb6a98e, depth: 2.28 },
  { x: 1738, y: 452, count: 3, spacing: 7, length: 28, rotation: 0.16, alpha: 0.14, color: 0x9b8c75, depth: 2.28 },
];

const FIRST_THREAT_DEBRIS: DebrisTrail[] = [
  { x: 520, y: 497, count: 8, dx: 16, dy: -1.2, radius: 2.2, alpha: 0.26, color: 0xb18a58, depth: 2.32 },
  { x: 1860, y: 496, count: 6, dx: 14, dy: 0.8, radius: 1.8, alpha: 0.22, color: 0x826a50, depth: 2.32 },
];

const MOBILITY_PROPS: NarrativeProp[] = [
  { texture: CELLAR_TEXTURES.can, x: 376, y: 824, scale: 0.78, rotation: 0.48, alpha: 0.72, depth: 3.1, collision: false },
  { texture: CELLAR_TEXTURES.fork, x: 568, y: 806, scale: 0.74, rotation: -0.41, alpha: 0.68, depth: 3.2, collision: false },
  { texture: CELLAR_TEXTURES.bottle, x: 764, y: 770, scale: 0.72, rotation: -0.08, alpha: 0.54, depth: 1.7, collision: false },
  { texture: CELLAR_TEXTURES.crate, x: 1188, y: 742, scale: 0.88, rotation: 0.04, alpha: 0.62, depth: 1.8, collision: false },
  { texture: CELLAR_TEXTURES.can, x: 1456, y: 234, scale: 0.58, rotation: -0.52, alpha: 0.66, depth: 2.2, collision: false },
];

const MOBILITY_STAINS: StainMark[] = [
  { x: 506, y: 816, width: 122, height: 16, alpha: 0.21, color: 0x17120e, depth: 2.18 },
  { x: 840, y: 498, width: 148, height: 13, alpha: 0.19, color: 0x111614, depth: 2.18 },
  { x: 1216, y: 323, width: 126, height: 13, alpha: 0.17, color: 0x1d1610, depth: 2.18 },
  { x: 1606, y: 118, width: 116, height: 12, alpha: 0.20, color: 0x131513, depth: 2.18 },
];

const MOBILITY_SCRATCHES: ScratchCluster[] = [
  { x: 666, y: 468, count: 4, spacing: 8, length: 34, rotation: -0.22, alpha: 0.18, color: 0xa7977f, depth: 2.24 },
  { x: 1068, y: 292, count: 3, spacing: 7, length: 27, rotation: 0.13, alpha: 0.16, color: 0x9d8f79, depth: 2.24 },
];

const MOBILITY_DEBRIS: DebrisTrail[] = [
  { x: 170, y: 866, count: 9, dx: 18, dy: -2.2, radius: 2.3, alpha: 0.25, color: 0xa57c4e, depth: 2.28 },
  { x: 1120, y: 286, count: 6, dx: 16, dy: -0.8, radius: 1.7, alpha: 0.20, color: 0x7f6951, depth: 2.28 },
];

export class CellarNarrativeDressing {
  private static addProp(scene: any, prop: NarrativeProp): void {
    scene.add.image(prop.x, prop.y, prop.texture)
      .setScale(prop.scale * CELLAR_TEXTURE_DISPLAY_SCALE)
      .setRotation(prop.rotation)
      .setAlpha(prop.alpha)
      .setScrollFactor(prop.scrollFactor ?? 1)
      .setDepth(prop.depth);
  }

  private static addStain(scene: any, stain: StainMark): void {
    scene.add.ellipse(stain.x, stain.y, stain.width, stain.height, stain.color, stain.alpha)
      .setDepth(stain.depth);
  }

  private static addScratchCluster(scene: any, cluster: ScratchCluster): void {
    const g = scene.add.graphics().setDepth(cluster.depth);
    g.lineStyle(1, cluster.color, cluster.alpha);
    for (let i = 0; i < cluster.count; i++) {
      const offset = (i - (cluster.count - 1) * 0.5) * cluster.spacing;
      const dx = Math.cos(cluster.rotation) * cluster.length;
      const dy = Math.sin(cluster.rotation) * cluster.length;
      g.lineBetween(cluster.x - dx * 0.5, cluster.y + offset - dy * 0.5, cluster.x + dx * 0.5, cluster.y + offset + dy * 0.5);
    }
  }

  private static addDebrisTrail(scene: any, trail: DebrisTrail): void {
    for (let i = 0; i < trail.count; i++) {
      const wobble = ((i * 7) % 5) - 2;
      scene.add.circle(
        trail.x + trail.dx * i,
        trail.y + trail.dy * i + wobble,
        trail.radius * (0.72 + (i % 3) * 0.16),
        trail.color,
        trail.alpha,
      ).setDepth(trail.depth);
    }
  }

  private static addLocalizedGrime(scene: any, x: number, y: number, scale: number, alpha: number, depth: number): void {
    scene.add.image(x, y, CELLAR_TEXTURES.grime)
      .setScale(scale * CELLAR_TEXTURE_DISPLAY_SCALE)
      .setAlpha(alpha)
      .setDepth(depth);
  }

  private static addSet(
    scene: any,
    props: NarrativeProp[],
    stains: StainMark[],
    scratches: ScratchCluster[],
    debris: DebrisTrail[],
    grime: Array<[number, number, number, number, number]>,
  ): void {
    for (const stain of stains) this.addStain(scene, stain);
    for (const scratch of scratches) this.addScratchCluster(scene, scratch);
    for (const trail of debris) this.addDebrisTrail(scene, trail);
    for (const [x, y, scale, alpha, depth] of grime) this.addLocalizedGrime(scene, x, y, scale, alpha, depth);
    for (const prop of props) this.addProp(scene, prop);
  }

  static addFirstThreat(scene: any): void {
    this.addSet(
      scene,
      FIRST_THREAT_PROPS,
      FIRST_THREAT_STAINS,
      FIRST_THREAT_SCRATCHES,
      FIRST_THREAT_DEBRIS,
      [
        [770, 486, 0.46, 0.24, 2.26],
        [1490, 486, 0.54, 0.28, 2.26],
        [1990, 424, 0.38, 0.20, 2.26],
      ],
    );
  }

  static addMobilityLab(scene: any): void {
    this.addSet(
      scene,
      MOBILITY_PROPS,
      MOBILITY_STAINS,
      MOBILITY_SCRATCHES,
      MOBILITY_DEBRIS,
      [
        [500, 814, 0.52, 0.27, 2.24],
        [835, 497, 0.42, 0.22, 2.24],
        [1600, 116, 0.34, 0.18, 2.24],
      ],
    );
  }
}

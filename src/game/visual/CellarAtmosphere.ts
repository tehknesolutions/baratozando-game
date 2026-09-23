import Phaser from 'phaser';

export type SoftLightSpec = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  alpha: number;
  depth: number;
  scrollFactor?: number;
};

export class CellarAtmosphere {
  static addDepthHaze(scene: any, worldWidth: number, worldHeight: number, depth: number): void {
    scene.add.rectangle(worldWidth * 0.5, worldHeight * 0.28, worldWidth * 1.08, worldHeight * 0.34, 0x151a1d, 0.095)
      .setScrollFactor(0.28)
      .setDepth(depth);

    scene.add.rectangle(worldWidth * 0.5, worldHeight * 0.52, worldWidth * 1.04, worldHeight * 0.20, 0x241d18, 0.040)
      .setScrollFactor(0.46)
      .setDepth(depth + 0.1);

    scene.add.rectangle(worldWidth * 0.5, worldHeight * 0.80, worldWidth * 1.02, worldHeight * 0.16, 0x000000, 0.18)
      .setScrollFactor(0.72)
      .setDepth(depth + 0.2);
  }

  static addSoftLight(scene: any, spec: SoftLightSpec): void {
    const rings = [
      { scale: 1.00, alpha: 0.14 },
      { scale: 0.78, alpha: 0.20 },
      { scale: 0.56, alpha: 0.27 },
      { scale: 0.34, alpha: 0.34 },
    ];

    for (const ring of rings) {
      scene.add.ellipse(
        spec.x,
        spec.y,
        spec.width * ring.scale,
        spec.height * ring.scale,
        spec.color,
        spec.alpha * ring.alpha,
      )
        .setScrollFactor(spec.scrollFactor ?? 1)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(spec.depth);
    }
  }

  static addContactShadow(
    scene: any,
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number,
    alpha = 0.22,
    scrollFactor = 1,
  ): void {
    scene.add.ellipse(x, y, width, height, 0x000000, alpha)
      .setScrollFactor(scrollFactor)
      .setDepth(depth);
  }

  static addScreenVignette(scene: any, depth: number): void {
    const layers = [
      { x: 480, y: 20, w: 960, h: 96, a: 0.22 },
      { x: 480, y: 520, w: 960, h: 112, a: 0.24 },
      { x: 28, y: 270, w: 96, h: 540, a: 0.20 },
      { x: 932, y: 270, w: 96, h: 540, a: 0.20 },
    ];

    for (const v of layers) {
      scene.add.rectangle(v.x, v.y, v.w, v.h, 0x000000, v.a)
        .setScrollFactor(0)
        .setDepth(depth);
    }
  }
}

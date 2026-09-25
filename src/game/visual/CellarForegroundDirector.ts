import { CELLAR_LAYERS } from './CellarLayerModel.js';

type Zone = Readonly<{ x: number; y: number; width: number; height: number }>;

export const CELLAR_FOREGROUND = Object.freeze({
  ownsPhysics: false,
  parallax: CELLAR_LAYERS.nearForeground.parallax,
  maxAlpha: 0.38,
  exclusionZones: Object.freeze([
    Object.freeze({ x: 130, y: 650, width: 520, height: 230 }),
    Object.freeze({ x: 560, y: 500, width: 420, height: 260 }),
    Object.freeze({ x: 930, y: 250, width: 420, height: 520 }),
  ] satisfies readonly Zone[]),
  pieces: Object.freeze([
    Object.freeze({ x: 90, y: 430, width: 72, height: 500, alpha: 0.32 }),
    Object.freeze({ x: 1180, y: 160, width: 150, height: 80, alpha: 0.24 }),
    Object.freeze({ x: 1580, y: 470, width: 90, height: 430, alpha: 0.36 }),
  ]),
} as const);

export function isForegroundPlacementSafe(x: number, y: number): boolean {
  return !CELLAR_FOREGROUND.exclusionZones.some((z) =>
    x >= z.x && x <= z.x + z.width && y >= z.y && y <= z.y + z.height);
}

export class CellarForegroundDirector {
  static build(scene: any): any {
    const container = scene.add.container(0, 0).setDepth(CELLAR_LAYERS.nearForeground.depth);
    for (const piece of CELLAR_FOREGROUND.pieces) {
      if (!isForegroundPlacementSafe(piece.x, piece.y)) continue;
      container.add(scene.add.rectangle(piece.x, piece.y, piece.width, piece.height, 0x050403, piece.alpha));
    }
    return container;
  }

  static update(container: any, cameraScrollX: number): void {
    const raw = -cameraScrollX * (CELLAR_FOREGROUND.parallax - 1);
    container.setX(Math.max(-100, Math.min(100, raw)));
  }
}

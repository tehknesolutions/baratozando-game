import Phaser from 'phaser';
import { CELLAR_LAYERS } from './CellarLayerModel.js';

export const CELLAR_READABILITY = Object.freeze({
  ownsPhysics: false,
  mutatesPlayerScale: false,
  playerField: Object.freeze({ width: 150, height: 82, color: 0x8b542f, alpha: 0.05, movingAlpha: 0.065 }),
  environmentPools: Object.freeze([
    Object.freeze({ x: 640, y: 430, width: 520, height: 260, color: 0x6f8794, alpha: 0.07 }),
    Object.freeze({ x: 1500, y: 190, width: 620, height: 300, color: 0xd88945, alpha: 0.14 }),
  ]),
} as const);

export class CellarReadabilityDirector {
  static createPlayerField(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Ellipse {
    const field = CELLAR_READABILITY.playerField;
    return scene.add.ellipse(x, y - 13, field.width, field.height, field.color, field.alpha)
      .setDepth(CELLAR_LAYERS.characterPlane.depth - 2)
      .setBlendMode(Phaser.BlendModes.ADD);
  }

  static updatePlayerField(field: Phaser.GameObjects.Ellipse, x: number, y: number, facing: number, speed: number): void {
    const spec = CELLAR_READABILITY.playerField;
    field.setPosition(x + facing * 8, y - 13);
    field.setAlpha(speed > 170 ? spec.movingAlpha : spec.alpha);
  }
}

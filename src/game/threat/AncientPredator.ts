import Phaser from 'phaser';
import { SIR_CHINELLUS_TEXTURE_KEY } from '../../assets/environmentAssetKeys.js';
import { SIR_CHINELLUS_VISUAL as V } from './SirChinellusVisualConfig.js';
import type { ThreatChaseState } from './ThreatChaseController.js';

export class AncientPredator extends Phaser.GameObjects.Container {
  private readonly visual: any;

  constructor(scene: any, x: number, floorY: number) {
    super(scene, x, floorY);
    scene.add.existing(this);

    this.visual = scene.add.image(0, 0, SIR_CHINELLUS_TEXTURE_KEY)
      .setOrigin(V.originX, V.originY)
      .setScale(V.scale);

    this.add(this.visual);
    this.setDepth(40);
    this.setAlpha(V.alpha.DORMANT);
  }

  setThreatX(x: number): void {
    this.x = x;
  }

  setMood(state: ThreatChaseState): void {
    this.setAlpha(V.alpha[state]);
  }
}

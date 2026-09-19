import Phaser from 'phaser';
import type { RectSpec } from './MovementLabLayout.js';

export class Hazard extends Phaser.GameObjects.Rectangle {
  constructor(scene: any, spec: RectSpec) {
    super(scene, spec.x + spec.width / 2, spec.y + spec.height / 2, spec.width, spec.height, 0x541610, 0.9);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setStrokeStyle(2, 0xc4462d, 0.9);
  }
}

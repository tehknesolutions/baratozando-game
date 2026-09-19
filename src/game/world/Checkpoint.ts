import Phaser from 'phaser';

export class Checkpoint extends Phaser.GameObjects.Zone {
  readonly marker: any;

  constructor(scene: any, x: number, y: number) {
    super(scene, x, y - 20, 48, 72);
    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.marker = scene.add.circle(x, y - 22, 7, 0x8b5a2b, 0.55).setStrokeStyle(2, 0xffb35a, 0.75);
  }

  activate(): void {
    this.marker.setFillStyle(0xffa632, 1).setStrokeStyle(3, 0xffd48a, 1);
  }
}

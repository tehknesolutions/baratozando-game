import Phaser from 'phaser';

export class AncientPredator extends Phaser.GameObjects.Container {
  private readonly shadow: any;
  private readonly rim: any;
  private readonly underside: any;

  constructor(scene: any, x: number, floorY: number) {
    super(scene, x, floorY);
    scene.add.existing(this);

    this.shadow = scene.add.rectangle(-89, -82, 178, 164, 0x020202, 0.96)
      .setOrigin(0.5, 1)
      .setRotation(-0.08)
      .setStrokeStyle(3, 0x291c16, 0.9);
    this.rim = scene.add.ellipse(-98, -24, 196, 48, 0x2b1711, 0.82)
      .setOrigin(0.5, 0.5)
      .setRotation(-0.06)
      .setStrokeStyle(2, 0xb45732, 0.38);
    this.underside = scene.add.rectangle(-83, -12, 166, 18, 0x6a2217, 0.26)
      .setRotation(-0.04);

    this.add([this.shadow, this.rim, this.underside]);
    this.setDepth(40);
    this.setAlpha(0.14);
  }

  setThreatX(x: number): void {
    this.x = x;
  }

  setMood(state: 'DORMANT' | 'WARNING' | 'CHASING' | 'ESCAPED' | 'CAUGHT'): void {
    if (state === 'DORMANT') this.setAlpha(0.14);
    else if (state === 'WARNING') this.setAlpha(0.42);
    else if (state === 'CHASING') this.setAlpha(0.98);
    else if (state === 'CAUGHT') this.setAlpha(1);
    else this.setAlpha(0.18);
  }
}

import Phaser from 'phaser';
import { CELLAR_TEXTURE_DISPLAY_SCALE, CELLAR_TEXTURES } from '../../assets/environmentAssetKeys.js';

type MotionProfile = {
  worldWidth: number;
  worldHeight: number;
  flickerX: number;
  flickerY: number;
  flickerColor: number;
  flickerAlpha: number;
  dustCount: number;
  dripX: number[];
  shadowX: number[];
};

const FIRST_THREAT_PROFILE: MotionProfile = {
  worldWidth: 2176,
  worldHeight: 576,
  flickerX: 720,
  flickerY: 330,
  flickerColor: 0xd98d4c,
  flickerAlpha: 0.095,
  dustCount: 18,
  dripX: [1010, 1438, 1872],
  shadowX: [840, 1540],
};

const MOBILITY_PROFILE: MotionProfile = {
  worldWidth: 1792,
  worldHeight: 928,
  flickerX: 1492,
  flickerY: 204,
  flickerColor: 0xd88f4f,
  flickerAlpha: 0.085,
  dustCount: 20,
  dripX: [654, 1082, 1530],
  shadowX: [620, 1260],
};

export class CellarAmbientMotion {
  private static addDeterministicFlicker(scene: any, profile: MotionProfile): void {
    const glow = scene.add.ellipse(
      profile.flickerX,
      profile.flickerY,
      390,
      190,
      profile.flickerColor,
      profile.flickerAlpha,
    )
      .setBlendMode(Phaser.BlendModes.ADD)
      .setDepth(1.46);

    const sequence = [1.00, 0.74, 0.92, 0.68, 0.98, 0.81, 0.95, 0.72];
    let index = 0;
    scene.time.addEvent({
      delay: 118,
      loop: true,
      callback: () => {
        glow.setAlpha(profile.flickerAlpha * sequence[index]);
        index = (index + 1) % sequence.length;
      },
    });
  }

  private static addDustDrift(scene: any, profile: MotionProfile): void {
    for (let i = 0; i < profile.dustCount; i++) {
      const startX = (i * 149 + 73) % profile.worldWidth;
      const startY = 58 + ((i * 97) % Math.max(120, profile.worldHeight - 116));
      const mote = scene.add.image(startX, startY, CELLAR_TEXTURES.dust)
        .setScale((0.30 + (i % 4) * 0.08) * CELLAR_TEXTURE_DISPLAY_SCALE)
        .setAlpha(0.045 + (i % 3) * 0.018)
        .setScrollFactor(0.72 + (i % 3) * 0.06)
        .setDepth(5.2 + (i % 2) * 0.08);

      scene.tweens.add({
        targets: mote,
        x: startX + 18 + (i % 5) * 5,
        y: startY - 10 - (i % 4) * 4,
        alpha: Math.max(0.025, mote.alpha * 0.55),
        duration: 4200 + (i % 6) * 530,
        ease: 'Sine.InOut',
        yoyo: true,
        repeat: -1,
        delay: (i % 7) * 180,
      });
    }
  }

  private static addHazeBreathing(scene: any, profile: MotionProfile): void {
    const haze = scene.add.rectangle(
      profile.worldWidth * 0.5,
      profile.worldHeight * 0.42,
      profile.worldWidth * 1.06,
      profile.worldHeight * 0.24,
      0x6f7d80,
      0.018,
    )
      .setScrollFactor(0.55)
      .setDepth(-1.25);

    scene.tweens.add({
      targets: haze,
      alpha: 0.038,
      scaleY: 1.08,
      duration: 6200,
      ease: 'Sine.InOut',
      yoyo: true,
      repeat: -1,
    });
  }

  private static addShadowOscillation(scene: any, profile: MotionProfile): void {
    for (let i = 0; i < profile.shadowX.length; i++) {
      const shadow = scene.add.ellipse(
        profile.shadowX[i],
        profile.worldHeight * (0.58 + i * 0.05),
        330 + i * 70,
        124,
        0x000000,
        0.085 + i * 0.018,
      ).setDepth(1.34);

      scene.tweens.add({
        targets: shadow,
        x: profile.shadowX[i] + (i === 0 ? 18 : -16),
        alpha: 0.13 + i * 0.016,
        scaleX: 1.08,
        duration: 3600 + i * 740,
        ease: 'Sine.InOut',
        yoyo: true,
        repeat: -1,
      });
    }
  }

  private static addDrips(scene: any, profile: MotionProfile): void {
    for (let i = 0; i < profile.dripX.length; i++) {
      const topY = 72 + i * 18;
      const drop = scene.add.ellipse(
        profile.dripX[i],
        topY,
        3,
        9,
        0x83999b,
        0.16,
      ).setDepth(4.4);

      scene.tweens.add({
        targets: drop,
        y: Math.min(profile.worldHeight - 56, topY + 250 + i * 46),
        alpha: 0,
        duration: 1250 + i * 240,
        ease: 'Quad.In',
        repeat: -1,
        repeatDelay: 2450 + i * 730,
        delay: i * 880,
        onRepeat: () => {
          drop.setY(topY);
          drop.setAlpha(0.16);
        },
      });
    }
  }

  private static install(scene: any, profile: MotionProfile): void {
    this.addHazeBreathing(scene, profile);
    this.addShadowOscillation(scene, profile);
    this.addDustDrift(scene, profile);
    this.addDrips(scene, profile);
    this.addDeterministicFlicker(scene, profile);
  }

  static addFirstThreat(scene: any): void {
    this.install(scene, FIRST_THREAT_PROFILE);
  }

  static addMobilityLab(scene: any): void {
    this.install(scene, MOBILITY_PROFILE);
  }
}

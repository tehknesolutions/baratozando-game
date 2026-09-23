import Phaser from 'phaser';
import { CELLAR_TEXTURE_DISPLAY_SCALE, CELLAR_TEXTURES } from '../../assets/environmentAssetKeys.js';

type ForegroundCue = {
  texture: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  alpha: number;
  depth: number;
  scrollFactor: number;
};

type FocalZone = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
  alpha: number;
  depth: number;
};

type ShadowZone = {
  x: number;
  y: number;
  width: number;
  height: number;
  alpha: number;
  depth: number;
};

const FIRST_THREAT_FOREGROUND: ForegroundCue[] = [
  { texture: CELLAR_TEXTURES.pipe, x: 250, y: 112, scale: 4.20, rotation: 0.07, alpha: 0.42, depth: 34, scrollFactor: 1.04 },
  { texture: CELLAR_TEXTURES.cable, x: 1110, y: 112, scale: 2.65, rotation: -0.16, alpha: 0.38, depth: 36, scrollFactor: 1.08 },
  { texture: CELLAR_TEXTURES.crate, x: 2050, y: 524, scale: 2.75, rotation: 0.04, alpha: 0.30, depth: 33, scrollFactor: 1.05 },
];

const FIRST_THREAT_FOCALS: FocalZone[] = [
  { x: 390, y: 430, width: 430, height: 210, color: 0xd6a56b, alpha: 0.075, depth: 1.35 },
  { x: 1180, y: 370, width: 560, height: 240, color: 0x728b97, alpha: 0.055, depth: 1.35 },
  { x: 1990, y: 420, width: 460, height: 220, color: 0xd49a60, alpha: 0.085, depth: 1.35 },
];

const FIRST_THREAT_SHADOWS: ShadowZone[] = [
  { x: 790, y: 390, width: 380, height: 250, alpha: 0.15, depth: 1.30 },
  { x: 1570, y: 365, width: 440, height: 270, alpha: 0.18, depth: 1.30 },
];

const MOBILITY_FOREGROUND: ForegroundCue[] = [
  { texture: CELLAR_TEXTURES.crate, x: 160, y: 800, scale: 2.60, rotation: -0.10, alpha: 0.34, depth: 32, scrollFactor: 1.05 },
  { texture: CELLAR_TEXTURES.pipe, x: 920, y: 124, scale: 3.55, rotation: 0.05, alpha: 0.36, depth: 34, scrollFactor: 1.08 },
  { texture: CELLAR_TEXTURES.cable, x: 1650, y: 150, scale: 2.25, rotation: 0.20, alpha: 0.36, depth: 36, scrollFactor: 1.10 },
];

const MOBILITY_FOCALS: FocalZone[] = [
  { x: 260, y: 710, width: 410, height: 220, color: 0xd2a06a, alpha: 0.070, depth: 1.35 },
  { x: 980, y: 470, width: 500, height: 230, color: 0x718a96, alpha: 0.052, depth: 1.35 },
  { x: 1540, y: 270, width: 440, height: 210, color: 0xd59b62, alpha: 0.078, depth: 1.35 },
];

const MOBILITY_SHADOWS: ShadowZone[] = [
  { x: 640, y: 530, width: 360, height: 250, alpha: 0.14, depth: 1.30 },
  { x: 1280, y: 360, width: 380, height: 240, alpha: 0.16, depth: 1.30 },
];

export class CellarCinematicComposition {
  private static addForegroundCue(scene: any, cue: ForegroundCue): void {
    scene.add.image(cue.x, cue.y, cue.texture)
      .setScale(cue.scale * CELLAR_TEXTURE_DISPLAY_SCALE)
      .setRotation(cue.rotation)
      .setAlpha(cue.alpha)
      .setScrollFactor(cue.scrollFactor)
      .setDepth(cue.depth);
  }

  private static addFocalZone(scene: any, zone: FocalZone): void {
    const rings = [
      { scale: 1.00, alpha: 0.22 },
      { scale: 0.72, alpha: 0.32 },
      { scale: 0.46, alpha: 0.45 },
    ];

    for (const ring of rings) {
      scene.add.ellipse(
        zone.x,
        zone.y,
        zone.width * ring.scale,
        zone.height * ring.scale,
        zone.color,
        zone.alpha * ring.alpha,
      )
        .setBlendMode(Phaser.BlendModes.ADD)
        .setDepth(zone.depth);
    }
  }

  private static addShadowZone(scene: any, zone: ShadowZone): void {
    scene.add.ellipse(zone.x, zone.y, zone.width, zone.height, 0x000000, zone.alpha)
      .setDepth(zone.depth);
  }

  private static addComposition(
    scene: any,
    foreground: ForegroundCue[],
    focals: FocalZone[],
    shadows: ShadowZone[],
  ): void {
    for (const zone of shadows) this.addShadowZone(scene, zone);
    for (const zone of focals) this.addFocalZone(scene, zone);
    for (const cue of foreground) this.addForegroundCue(scene, cue);
  }

  static addFirstThreat(scene: any): void {
    this.addComposition(scene, FIRST_THREAT_FOREGROUND, FIRST_THREAT_FOCALS, FIRST_THREAT_SHADOWS);
  }

  static addMobilityLab(scene: any): void {
    this.addComposition(scene, MOBILITY_FOREGROUND, MOBILITY_FOCALS, MOBILITY_SHADOWS);
  }
}

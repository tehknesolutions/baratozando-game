import Phaser from 'phaser';
import type { FirstThreatLayout } from '../world/FirstThreatLayout.js';
import { CELLAR_TEXTURES, CELLAR_TEXTURE_DISPLAY_SCALE } from '../../assets/environmentAssetKeys.js';
import { FIRST_THREAT_VISUAL_CONFIG as V } from './FirstThreatVisualConfig.js';
import { CellarAtmosphere } from './CellarAtmosphere.js';
import { CellarCinematicComposition } from './CellarCinematicComposition.js';
import { CellarNarrativeDressing } from './CellarNarrativeDressing.js';

export type CellarArtHandles = {
  amberGlow: any;
  dust: any[];
};

export class CellarArtDirector {
  static build(scene: any, layout: FirstThreatLayout): CellarArtHandles {
    scene.add.rectangle(layout.width / 2, layout.height / 2, layout.width, layout.height, 0x090807, 1)
      .setDepth(-20);

    CellarAtmosphere.addDepthHaze(scene, layout.width, layout.height, V.depths.background - 4);

    // Macro silhouettes: distant cellar supports, pipes and stacked storage.
    for (let i = 0; i < 14; i++) {
      const x = 70 + i * 165;
      const height = 120 + (i % 4) * 54;
      scene.add.rectangle(x, layout.height - 170, 46 + (i % 3) * 28, height, 0x0d0e0e, 0.88)
        .setOrigin(0.5, 1)
        .setScrollFactor(0.28)
        .setDepth(V.depths.background - 2);
    }

    // A few giant pipes create scale without becoming collision geometry.
    for (const [x, y, scale, rotation] of [
      [620, 250, 1.45, 0],
      [1180, 205, 1.15, 0.08],
      [1540, 245, 1.55, -0.04],
    ] as const) {
      scene.add.image(x, y, CELLAR_TEXTURES.pipe)
        .setScale(scale * CELLAR_TEXTURE_DISPLAY_SCALE)
        .setRotation(rotation)
        .setAlpha(0.34)
        .setScrollFactor(0.42)
        .setDepth(V.depths.background);
    }

    layout.platforms.forEach((p, index) => {
      const material = V.platformMaterials[index];
      const texture = material === 'wood'
        ? CELLAR_TEXTURES.wood
        : material === 'metal'
          ? CELLAR_TEXTURES.metal
          : CELLAR_TEXTURES.masonry;

      CellarAtmosphere.addContactShadow(
        scene,
        p.x + p.width * 0.5,
        p.y + p.height + 5,
        Math.max(48, p.width * 0.96),
        Math.max(8, Math.min(22, p.height * 0.34)),
        V.depths.gameplay - 0.12,
        0.26,
      );

      scene.add.tileSprite(p.x, p.y, p.width, p.height, texture)
        .setOrigin(0, 0)
        .setTileScale(CELLAR_TEXTURE_DISPLAY_SCALE, CELLAR_TEXTURE_DISPLAY_SCALE)
        .setDepth(V.depths.gameplay);

      if (index % 3 === 0) {
        scene.add.image(p.x + Math.min(72, p.width * 0.5), p.y + 4, CELLAR_TEXTURES.grime)
          .setOrigin(0.5, 0.2)
          .setScale(0.42 * CELLAR_TEXTURE_DISPLAY_SCALE)
          .setAlpha(0.22)
          .setDepth(V.depths.gameplay + 0.2);
      }
    });

    for (const prop of V.props) {
      const depth = prop.layer === 'background'
        ? V.depths.background
        : prop.layer === 'foreground'
          ? V.depths.foreground
          : V.depths.gameplay - 0.5;

      const scrollFactor = prop.layer === 'background' ? 0.7 : 1;
      CellarAtmosphere.addContactShadow(
        scene,
        prop.x,
        prop.y + 18 * prop.scale,
        72 * prop.scale,
        14 * prop.scale,
        depth - 0.08,
        prop.layer === 'foreground' ? 0.26 : 0.18,
        scrollFactor,
      );

      scene.add.image(prop.x, prop.y, prop.texture)
        .setScale(prop.scale * CELLAR_TEXTURE_DISPLAY_SCALE)
        .setRotation(prop.rotation)
        .setAlpha(prop.alpha)
        .setScrollFactor(scrollFactor)
        .setDepth(depth);
    }

    CellarAtmosphere.addSoftLight(scene, {
      x: 735, y: 360, width: 760, height: 330,
      color: 0xd88945, alpha: 0.17,
      depth: V.depths.atmosphere - 1.2,
      scrollFactor: 0.55,
    });
    CellarAtmosphere.addSoftLight(scene, {
      x: 1660, y: 225, width: 620, height: 280,
      color: 0x6b8594, alpha: 0.095,
      depth: V.depths.atmosphere - 1.1,
      scrollFactor: 0.42,
    });

    const amberGlow = scene.add.ellipse(760, 385, 560, 230, 0xe38a38, 0.018)
      .setScrollFactor(0.55)
      .setDepth(V.depths.atmosphere - 1);

    const dust: any[] = [];
    for (let i = 0; i < 54; i++) {
      const particle = scene.add.image((i * 173) % layout.width, 72 + ((i * 89) % 370), CELLAR_TEXTURES.dust)
        .setScale((0.45 + (i % 3) * 0.2) * CELLAR_TEXTURE_DISPLAY_SCALE)
        .setAlpha(0.08 + (i % 4) * 0.025)
        .setScrollFactor(0.48 + (i % 3) * 0.08)
        .setDepth(V.depths.atmosphere);
      dust.push(particle);
    }

    // Mold is rare and semantic: it should hint at future chemical gameplay without becoming a hazard yet.
    scene.add.image(1450, 491, CELLAR_TEXTURES.mold)
      .setScale(0.52 * CELLAR_TEXTURE_DISPLAY_SCALE)
      .setAlpha(0.32)
      .setDepth(V.depths.gameplay + 0.3);

    CellarCinematicComposition.addFirstThreat(scene);
    CellarNarrativeDressing.addFirstThreat(scene);

    CellarAtmosphere.addScreenVignette(scene, V.depths.foreground + 8);

    return { amberGlow, dust };
  }
}

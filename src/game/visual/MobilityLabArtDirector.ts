import type { MobilityLabV2Layout } from '../world/MobilityLabV2Layout.js';
import { MOBILITY_LAB_VISUAL as V } from './MobilityLabVisualConfig.js';
import { CELLAR_TEXTURE_DISPLAY_SCALE } from '../../assets/environmentAssetKeys.js';
import { CellarAtmosphere } from './CellarAtmosphere.js';
import { CellarCinematicComposition } from './CellarCinematicComposition.js';
import { CellarNarrativeDressing } from './CellarNarrativeDressing.js';
import { CellarAmbientMotion } from './CellarAmbientMotion.js';

export class MobilityLabArtDirector {
  static build(scene: any, layout: MobilityLabV2Layout): void {
    scene.add.rectangle(layout.width / 2, layout.height / 2, layout.width, layout.height, 0x080706, 1).setDepth(-20);
    CellarAtmosphere.addDepthHaze(scene, layout.width, layout.height, -17);

    const textureBySurface = new Map(V.surfaceMaterials);
    for (const surface of layout.surfaces) {
      if (surface.role === 'boundary') continue;
      const texture = textureBySurface.get(surface.id);
      if (!texture) continue;
      const surfaceDepth = surface.role === 'recovery' ? 0 : 2;
      CellarAtmosphere.addContactShadow(
        scene,
        surface.x + surface.width * 0.5,
        surface.y + surface.height + 5,
        Math.max(42, surface.width * 0.96),
        Math.max(8, Math.min(20, surface.height * 0.34)),
        surfaceDepth - 0.12,
        surface.role === 'recovery' ? 0.18 : 0.25,
      );
      scene.add.tileSprite(surface.x, surface.y, surface.width, surface.height, texture)
        .setOrigin(0, 0)
        .setTileScale(CELLAR_TEXTURE_DISPLAY_SCALE, CELLAR_TEXTURE_DISPLAY_SCALE)
        .setAlpha(surface.role === 'recovery' ? 0.68 : 0.98)
        .setDepth(surfaceDepth);
    }

    for (const prop of V.props) {
      CellarAtmosphere.addContactShadow(
        scene,
        prop.x,
        prop.y + 16 * prop.scale,
        68 * prop.scale,
        13 * prop.scale,
        prop.depth - 0.08,
        0.20,
      );
      scene.add.image(prop.x, prop.y, prop.texture)
        .setScale(prop.scale * CELLAR_TEXTURE_DISPLAY_SCALE)
        .setRotation(prop.rotation)
        .setAlpha(prop.alpha)
        .setDepth(prop.depth);
    }

    scene.add.ellipse(530, 610, 520, 300, 0x000000, 0.18).setDepth(-2);
    scene.add.ellipse(1050, 430, 620, 330, 0x000000, 0.15).setDepth(-2);

    CellarAtmosphere.addSoftLight(scene, {
      x: 1500, y: 190, width: 620, height: 300,
      color: 0xd88945, alpha: 0.14,
      depth: -1.4, scrollFactor: 0.72,
    });
    CellarAtmosphere.addSoftLight(scene, {
      x: 640, y: 430, width: 520, height: 260,
      color: 0x6f8794, alpha: 0.07,
      depth: -1.3, scrollFactor: 0.58,
    });
    CellarCinematicComposition.addMobilityLab(scene);
    CellarNarrativeDressing.addMobilityLab(scene);
    CellarAmbientMotion.addMobilityLab(scene);
        CellarAtmosphere.addScreenVignette(scene, 36);
  }
}

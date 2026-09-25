import type { MobilityLabV2Layout } from '../world/MobilityLabV2Layout.js';
import { MOBILITY_LAB_VISUAL as V } from './MobilityLabVisualConfig.js';
import { CELLAR_TEXTURE_DISPLAY_SCALE } from '../../assets/environmentAssetKeys.js';
import { CellarAtmosphere } from './CellarAtmosphere.js';
import { CellarCinematicComposition } from './CellarCinematicComposition.js';
import { CellarNarrativeDressing } from './CellarNarrativeDressing.js';
import { CellarAmbientMotion } from './CellarAmbientMotion.js';
import { CELLAR_LAYERS } from './CellarLayerModel.js';

export type CellarVisualGroups = Readonly<{ far: any; rear: any }>;

export class MobilityLabArtDirector {
  static build(scene: any, layout: MobilityLabV2Layout): CellarVisualGroups {
    const far = CELLAR_LAYERS.farDarkness.depth;
    const rear = CELLAR_LAYERS.rearArchitecture.depth;
    const gameplay = CELLAR_LAYERS.gameplayPlane.depth;
    const farGroup = scene.add.container(0, 0).setDepth(far);
    const rearGroup = scene.add.container(0, 0).setDepth(rear);

    farGroup.add(scene.add.rectangle(layout.width / 2, layout.height / 2, layout.width + 360, layout.height + 120, 0x080706, 1));
    farGroup.add(scene.add.ellipse(layout.width * 0.22, layout.height * 0.45, 760, 520, 0x11100e, 0.32));
    farGroup.add(scene.add.ellipse(layout.width * 0.76, layout.height * 0.36, 920, 580, 0x050505, 0.42));

    rearGroup.add(scene.add.rectangle(layout.width * 0.18, layout.height * 0.45, 34, layout.height * 0.78, 0x171411, 0.75));
    rearGroup.add(scene.add.rectangle(layout.width * 0.58, layout.height * 0.38, 46, layout.height * 0.68, 0x1b1713, 0.72));
    rearGroup.add(scene.add.rectangle(layout.width * 0.84, layout.height * 0.44, 28, layout.height * 0.76, 0x12110f, 0.78));
    rearGroup.add(scene.add.ellipse(530, 610, 520, 300, 0x000000, 0.18));
    rearGroup.add(scene.add.ellipse(1050, 430, 620, 330, 0x000000, 0.15));

    CellarAtmosphere.addDepthHaze(scene, layout.width, layout.height, far + 1);

    const textureBySurface = new Map(V.surfaceMaterials);
    for (const surface of layout.surfaces) {
      if (surface.role === 'boundary') continue;
      const texture = textureBySurface.get(surface.id);
      if (!texture) continue;
      const surfaceDepth = surface.role === 'recovery' ? gameplay : gameplay + 2;
      CellarAtmosphere.addContactShadow(scene, surface.x + surface.width * 0.5, surface.y + surface.height + 5,
        Math.max(42, surface.width * 0.96), Math.max(8, Math.min(20, surface.height * 0.34)),
        surfaceDepth - 0.12, surface.role === 'recovery' ? 0.18 : 0.25);
      scene.add.tileSprite(surface.x, surface.y, surface.width, surface.height, texture)
        .setOrigin(0, 0).setTileScale(CELLAR_TEXTURE_DISPLAY_SCALE, CELLAR_TEXTURE_DISPLAY_SCALE)
        .setAlpha(surface.role === 'recovery' ? 0.68 : 0.98).setDepth(surfaceDepth);
    }

    for (const prop of V.props) {
      const propDepth = gameplay + Math.max(1, prop.depth);
      CellarAtmosphere.addContactShadow(scene, prop.x, prop.y + 16 * prop.scale, 68 * prop.scale, 13 * prop.scale,
        propDepth - 0.08, 0.20);
      scene.add.image(prop.x, prop.y, prop.texture).setScale(prop.scale * CELLAR_TEXTURE_DISPLAY_SCALE)
        .setRotation(prop.rotation).setAlpha(prop.alpha).setDepth(propDepth);
    }

    CellarAtmosphere.addSoftLight(scene, { x: 1500, y: 190, width: 620, height: 300, color: 0xd88945, alpha: 0.14,
      depth: rear + 5, scrollFactor: CELLAR_LAYERS.rearArchitecture.parallax });
    CellarAtmosphere.addSoftLight(scene, { x: 640, y: 430, width: 520, height: 260, color: 0x6f8794, alpha: 0.07,
      depth: rear + 4, scrollFactor: CELLAR_LAYERS.rearArchitecture.parallax });
    CellarCinematicComposition.addMobilityLab(scene);
    CellarNarrativeDressing.addMobilityLab(scene);
    CellarAmbientMotion.addMobilityLab(scene);
    CellarAtmosphere.addScreenVignette(scene, CELLAR_LAYERS.presentation.depth);
    return Object.freeze({ far: farGroup, rear: rearGroup });
  }
}

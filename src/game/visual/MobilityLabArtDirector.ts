import type { MobilityLabV2Layout } from '../world/MobilityLabV2Layout.js';
import { MOBILITY_LAB_VISUAL as V } from './MobilityLabVisualConfig.js';

export class MobilityLabArtDirector {
  static build(scene: any, layout: MobilityLabV2Layout): void {
    scene.add.rectangle(layout.width / 2, layout.height / 2, layout.width, layout.height, 0x080706, 1).setDepth(-20);

    const textureBySurface = new Map(V.surfaceMaterials);
    for (const surface of layout.surfaces) {
      if (surface.role === 'boundary') continue;
      const texture = textureBySurface.get(surface.id);
      if (!texture) continue;
      scene.add.tileSprite(surface.x, surface.y, surface.width, surface.height, texture)
        .setOrigin(0, 0)
        .setAlpha(surface.role === 'recovery' ? 0.62 : 0.96)
        .setDepth(surface.role === 'recovery' ? 0 : 2);
    }

    for (const prop of V.props) {
      scene.add.image(prop.x, prop.y, prop.texture)
        .setScale(prop.scale)
        .setRotation(prop.rotation)
        .setAlpha(prop.alpha)
        .setDepth(prop.depth);
    }

    scene.add.ellipse(530, 610, 520, 300, 0x000000, 0.24).setDepth(-2);
    scene.add.ellipse(1050, 430, 620, 330, 0x000000, 0.2).setDepth(-2);
    scene.add.ellipse(1510, 170, 430, 250, 0xe38a38, 0.035).setDepth(-1);
  }
}

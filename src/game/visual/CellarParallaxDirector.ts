import { CELLAR_LAYERS } from './CellarLayerModel.js';

export const CELLAR_PARALLAX = Object.freeze({
  ownsPhysics: false,
  far: Object.freeze({ factor: CELLAR_LAYERS.farDarkness.parallax, maxOffset: 160 }),
  rear: Object.freeze({ factor: CELLAR_LAYERS.rearArchitecture.parallax, maxOffset: 120 }),
} as const);

export function resolveParallaxOffset(cameraScroll: number, factor: number, maxOffset: number): number {
  const raw = -cameraScroll * (1 - factor);
  return Math.max(-maxOffset, Math.min(maxOffset, raw));
}

export class CellarParallaxDirector {
  static resolve(cameraScrollX: number): Readonly<{ farX: number; rearX: number }> {
    return Object.freeze({
      farX: resolveParallaxOffset(cameraScrollX, CELLAR_PARALLAX.far.factor, CELLAR_PARALLAX.far.maxOffset),
      rearX: resolveParallaxOffset(cameraScrollX, CELLAR_PARALLAX.rear.factor, CELLAR_PARALLAX.rear.maxOffset),
    });
  }
}

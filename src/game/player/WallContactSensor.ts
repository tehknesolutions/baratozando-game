import type { SurfaceType } from '../world/SurfaceType.js';

export type SensorSurface = {
  x: number;
  y: number;
  width: number;
  height: number;
  surface: SurfaceType;
};

export type BodyBounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export type GeometricWallContact = {
  touchingLeft: boolean;
  touchingRight: boolean;
  surface: SurfaceType | null;
};

export function resolveWallContactFromGeometry(
  body: BodyBounds,
  surfaces: readonly SensorSurface[],
  probeDistancePx = 7,
): GeometricWallContact {
  let best: { side: 'left' | 'right'; gap: number; surface: SurfaceType } | null = null;

  for (const spec of surfaces) {
    const surfaceBottom = spec.y + spec.height;
    const verticalOverlap = Math.min(body.bottom, surfaceBottom) - Math.max(body.top, spec.y);
    if (verticalOverlap <= 2) continue;

    const leftGap = Math.abs(body.left - (spec.x + spec.width));
    const rightGap = Math.abs(body.right - spec.x);

    if (leftGap <= probeDistancePx && (!best || leftGap < best.gap)) {
      best = { side: 'left', gap: leftGap, surface: spec.surface };
    }
    if (rightGap <= probeDistancePx && (!best || rightGap < best.gap)) {
      best = { side: 'right', gap: rightGap, surface: spec.surface };
    }
  }

  if (!best) return { touchingLeft: false, touchingRight: false, surface: null };

  return {
    touchingLeft: best.side === 'left',
    touchingRight: best.side === 'right',
    surface: best.surface,
  };
}

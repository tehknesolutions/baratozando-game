export type RoachVisualSnapshot = Readonly<{
  scale: number;
  originX: number;
  originY: number;
  offsetX: number;
  offsetY: number;
  physicsAuthority: false;
}>;

export function createRoachVisualSnapshot(scale: number): RoachVisualSnapshot {
  if (!Number.isFinite(scale) || scale <= 0) throw new Error('Roach visual scale must be a positive finite number');

  return Object.freeze({
    scale,
    originX: 0.5,
    originY: 1,
    offsetX: 0,
    offsetY: 0,
    physicsAuthority: false,
  });
}

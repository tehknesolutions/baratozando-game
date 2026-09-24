export const PLAYER_PHYSICS_CONTRACT = Object.freeze({
  contractId: 'PLAYER_PHYSICS_V3',
  // Runtime-proven geometry from the stable 0.375 Player implementation.
  // These gameplay-space values are authoritative and must never derive from
  // premium texture dimensions or render scale.
  bodyWidth: 30,
  bodyHeight: 18,
  bodyOffsetX: 17,
  bodyOffsetY: 42,
  feetAnchorX: 0.5,
  feetAnchorY: 1,
} as const);

export type PlayerPhysicsSnapshot = Readonly<{
  bodyWidth: number;
  bodyHeight: number;
  bodyOffsetX: number;
  bodyOffsetY: number;
  feetAnchorX: number;
  feetAnchorY: number;
}>;

export function getPlayerPhysicsSnapshot(_visualScale?: number): PlayerPhysicsSnapshot {
  const {
    bodyWidth,
    bodyHeight,
    bodyOffsetX,
    bodyOffsetY,
    feetAnchorX,
    feetAnchorY,
  } = PLAYER_PHYSICS_CONTRACT;

  return Object.freeze({
    bodyWidth,
    bodyHeight,
    bodyOffsetX,
    bodyOffsetY,
    feetAnchorX,
    feetAnchorY,
  });
}

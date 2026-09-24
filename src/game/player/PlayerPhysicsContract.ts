export const PLAYER_PHYSICS_CONTRACT = Object.freeze({
  contractId: 'PLAYER_PHYSICS_V3',
  // Physics geometry is deliberately independent from premium render scale.
  // These values are authoritative gameplay-space dimensions, not texture dimensions.
  bodyWidth: 64,
  bodyHeight: 32,
  bodyOffsetX: 0,
  bodyOffsetY: 0,
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

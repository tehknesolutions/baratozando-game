export type RectSpec = { x: number; y: number; width: number; height: number };
export type PointSpec = { x: number; y: number };

export type MovementLabLayout = {
  tileSize: 32;
  width: number;
  height: number;
  spawn: PointSpec;
  platforms: RectSpec[];
  hazards: RectSpec[];
  checkpoints: PointSpec[];
  finish: PointSpec;
};

export const MOVEMENT_LAB_LAYOUT: MovementLabLayout = {
  tileSize: 32,
  width: 2048,
  height: 576,
  spawn: { x: 96, y: 450 },
  platforms: [
    { x: 0, y: 512, width: 384, height: 64 },
    { x: 256, y: 480, width: 96, height: 32 },
    { x: 448, y: 512, width: 256, height: 64 },
    { x: 560, y: 464, width: 160, height: 32 },
    { x: 768, y: 432, width: 128, height: 24 },
    { x: 960, y: 464, width: 160, height: 32 },
    { x: 928, y: 512, width: 384, height: 64 },
    { x: 1344, y: 512, width: 704, height: 64 },
    { x: 1456, y: 464, width: 96, height: 24 },
    { x: 1648, y: 432, width: 128, height: 24 },
  ],
  hazards: [
    { x: 1168, y: 488, width: 96, height: 24 },
  ],
  checkpoints: [
    { x: 1032, y: 480 },
  ],
  finish: { x: 1920, y: 480 },
};

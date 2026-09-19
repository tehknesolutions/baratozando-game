// BARATOZANDO Asset Contract V0.1
// Drop this beside the first Phaser scene and replace prototype frame mappings as final sprites are approved.

export const BARATOZANDO_ASSETS = {
  player: {
    frameWidth: 64,
    frameHeight: 64,
    originX: 0.5,
    originY: 1,
    body: { width: 30, height: 18, offsetX: 17, offsetY: 42 },
  },
  world: {
    tileWidth: 32,
    tileHeight: 32,
  },
} as const;

export const PLAYER_ANIMATION_TARGETS = {
  idle:   { fps: 6,  repeat: -1 },
  walk:   { fps: 8,  repeat: -1 },
  run:    { fps: 12, repeat: -1 },
  jump:   { fps: 10, repeat: 0 },
  fall:   { fps: 8,  repeat: -1 },
  dodge:  { fps: 14, repeat: 0 },
  attack: { fps: 12, repeat: 0 },
  hurt:   { fps: 8,  repeat: 0 },
  death:  { fps: 8,  repeat: 0 },
  climb:  { fps: 8,  repeat: -1 },
} as const;

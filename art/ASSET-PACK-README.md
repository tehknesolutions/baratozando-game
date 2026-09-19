# BARATOZANDO — Asset Pack V0.1

This pack converts the approved visual direction into a technical prototype contract for the chosen stack:

- Phaser 3.90
- TypeScript
- Vite
- Tiled JSON maps
- 32×32 world grid
- 64×64 transparent player frame canvas
- nearest/pixel-art rendering in Phaser

## Important

The four large PNG files in `source/` are the approved AI-generated source atlases/concept assets.

`prototype/player/crops/` and `prototype/player/normalized_64/` are **automatic prototype extractions**. They are not yet final hand-cleaned sprites. They exist so the Movement Lab can begin immediately while final animation frames are normalized.

## Why 64×64 player frames if the art direction says 32×32?

The world grid remains 32×32. The player uses a 64×64 transparent canvas so long antennae, jumps, dodges and attacks do not get clipped. The visible cockroach remains roughly one tile tall and ~1.5 tiles long.

## Phaser rendering

Use:

```ts
const config: Phaser.Types.Core.GameConfig = {
  pixelArt: true,
  roundPixels: true,
  antialias: false,
};
```

Player origin: `(0.5, 1.0)`.

Prototype Arcade Physics body:
- width: 30
- height: 18
- offsetX: 17
- offsetY: 42

## Next milestone

M0 — Movement Lab:
idle → walk → run → jump → fall → dodge → damage → death/respawn.

The first milestone should use a single-room greybox/Tiled map and these prototype assets. Art polish must not block movement tuning.

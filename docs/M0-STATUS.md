# M0 Status — 2026-09-19

## Implemented

- Phaser 3.90 / TypeScript / Vite source scaffold
- dark single-room Movement Lab
- 24 approved 64×64 RGBA protagonist frames wired into state-driven animation
- walk / run / acceleration / deceleration
- coyote time / jump buffer / variable jump height
- dodge duration + cooldown
- player state resolver
- temporary 3 HP / hurt lock / protection window
- death / checkpoint / respawn
- camera follow + look-ahead
- dark silhouette / amber atmosphere layer
- room route with gap, steps, ledges, hazard, checkpoint, exit

## Verification evidence

- `npm test`: PASS — 5/5 test files, 16 behavior/invariant cases
- `tsc -p tsconfig.offline.json`: PASS
- `npm run build:offline`: PASS
- static smoke: PASS — import map, main module, and 24/24 player assets
- authored upward-platform reachability regression: RED observed, then GREEN after correction

## Environment limitation

The execution container cannot resolve `registry.npmjs.org`, so `npm install` cannot populate `node_modules`. Therefore the canonical `npm run build` cannot be verified here and stops on missing `phaser`/`vite` packages.

This is not counted as a successful Vite production build. In a networked environment run:

```bash
npm install
npm test
npm run build
npm run dev
```

## Acceptance gate still requiring a human playtest

M0 is not gameplay-approved until the room is played and the movement passes `docs/M0-PLAYTEST.md`, especially the question: **is it fun to simply run, jump, dodge and escape as this cockroach?**

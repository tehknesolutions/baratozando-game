# M1 Status — First Threat

## Implemented

- deterministic `ThreatChaseController`
- chase states: `DORMANT → WARNING → CHASING → ESCAPED/CAUGHT`
- 650 ms warning beat before pursuit begins
- timestamp-derived threat movement at 205 px/s
- escape priority over catch on the same update
- single catch event (no repeated kill spam)
- instant lethal catch path in `PlayerDamageController`
- pre-chase checkpoint and clean chase reset on respawn
- 1,235 px chase route with reachable authored jumps
- procedural giant Ancient Predator silhouette
- camera shake, danger tint, `CORRA.`, `ESMAGADO.` and `BARATOZOU.` feedback
- M0 Movement Lab preserved as a registered scene
- Boot now starts the M1 First Threat scene

## Fresh verification evidence

- `npm test`: PASS — 7/7 pure test files
- M0 regression tests remain green
- M1 controller/layout tests are green
- `npm run build:offline`: PASS

## Canonical build limitation

The current execution environment still has no installed `phaser`/`vite` node modules. The offline build compiles the browser TypeScript using the local TypeScript compiler and loads Phaser 3.90 from CDN at runtime.

Before calling M1 production-build verified, run in a networked environment:

```bash
npm install
npm test
npm run build
npm run dev
```

## Remaining gate

M1 still requires browser playtest. Automated tests prove chase rules and map invariants, not whether the chase *feels* tense, readable and fair.

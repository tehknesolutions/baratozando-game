# Sprint A — Environment Art Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the M1 procedural greybox with the first production-grade BARATOZANDO cellar visual language while preserving the already-approved player movement and chase feel.

**Architecture:** Keep gameplay and collision authoritative in the existing M1 modules. Add a separate visual configuration + rendering layer that consumes the existing layout, maps each real collider to a matching visible surface, places giant decorative props on non-colliding depth bands, and replaces the procedural Ancient Predator silhouette with a dedicated Sir Chinellus sprite. Visual danger feedback is computed by a pure controller and consumed by the scene.

**Tech Stack:** Phaser 3.90, TypeScript, Vite, PNG RGBA runtime assets, existing pure-test runner, Vercel Git integration.

**Spec:** `docs/superpowers/specs/2026-09-19-visual-gameplay-sprint-bible-01-design.md`

## Global Constraints

- Preserve player values exactly: walk `105`, run `185`, gravity `1050`, jump `-360`, max fall `520`, coyote `100 ms`, jump buffer `110 ms`, dodge `160 ms @ 330 px/s`, cooldown `420 ms`.
- Preserve chase values exactly: trigger `640`, warning `650 ms`, threat start `260`, threat speed `205 px/s`, catch distance `54`, escape `1875`.
- Preserve world size `2176 × 576`, tile basis `32 × 32`, checkpoint `x=544 y=480`.
- No combat, Adaptation Engine, Adaptive Stress, power-up inventory, new movement abilities, mobile controls, backend or login in Sprint A.
- Collision remains authored by `FIRST_THREAT_LAYOUT`; decorative art must never become collision authority.
- No new runtime framework or shader dependency.
- Pixel-art rendering and Vercel deployment must remain compatible with the current project.

## Review Focus

1. **False platforms:** a decorative surface must never appear walkable where no collider exists; Task 4 pins visible platform geometry to `FIRST_THREAT_LAYOUT.platforms`.
2. **Player readability during chase:** danger tint and foreground must not obscure the protagonist; Task 6 caps overlay intensity and keeps player depth above foreground occluders near the route.
3. **Missing runtime assets:** every manifest path must exist and have a valid PNG signature; Task 2 adds an asset contract test.
4. **Gameplay drift during an art pass:** movement/chase constants must remain byte-for-byte numerically unchanged; Task 1 adds a frozen-baseline regression test.
5. **Art outside world bounds / misleading props:** placement config must stay inside `2176 × 576` unless explicitly marked as background-only; Task 3 validates every gameplay-plane placement.

---

### Task 1: Freeze the approved gameplay baseline

**Files:**
- Create: `src/game/visual/SprintAFreezeContract.test.ts`
- Modify: `tsconfig.pure.json`
- Modify: `scripts/run-pure-tests.mjs`

**Interfaces:**
- Consumes: `PLAYER_MOVEMENT_CONFIG`, `FIRST_THREAT_LAYOUT`.
- Produces: a regression gate that fails if Sprint A changes approved movement/chase/world constants.

- [ ] **Step 1: Write the failing freeze-contract test**

```ts
import { PLAYER_MOVEMENT_CONFIG as P } from '../player/PlayerMovementConfig.js';
import { FIRST_THREAT_LAYOUT as L } from '../world/FirstThreatLayout.js';

function equal(actual: unknown, expected: unknown, label: string) {
  if (!Object.is(actual, expected)) throw new Error(`${label}: expected ${expected}, got ${actual}`);
}

equal(P.walkSpeed, 105, 'walkSpeed');
equal(P.runSpeed, 185, 'runSpeed');
equal(P.gravity, 1050, 'gravity');
equal(P.jumpVelocity, -360, 'jumpVelocity');
equal(P.maxFallSpeed, 520, 'maxFallSpeed');
equal(P.coyoteTimeMs, 100, 'coyoteTimeMs');
equal(P.jumpBufferMs, 110, 'jumpBufferMs');
equal(P.dodgeDurationMs, 160, 'dodgeDurationMs');
equal(P.dodgeSpeed, 330, 'dodgeSpeed');
equal(P.dodgeCooldownMs, 420, 'dodgeCooldownMs');

equal(L.width, 2176, 'world width');
equal(L.height, 576, 'world height');
equal(L.checkpoint.x, 544, 'checkpoint x');
equal(L.checkpoint.y, 480, 'checkpoint y');
equal(L.chase.triggerX, 640, 'triggerX');
equal(L.chase.warningDurationMs, 650, 'warningDurationMs');
equal(L.chase.threatStartX, 260, 'threatStartX');
equal(L.chase.threatSpeed, 205, 'threatSpeed');
equal(L.chase.catchDistance, 54, 'catchDistance');
equal(L.chase.escapeX, 1875, 'escapeX');

console.log('PASS Sprint A frozen gameplay contract');
```

- [ ] **Step 2: Add the test to pure compilation and runner**

Ensure `tsconfig.pure.json` includes `src/game/visual/SprintAFreezeContract.test.ts`, and append:

```js
'.test-dist/game/visual/SprintAFreezeContract.test.js',
```

to the `tests` array in `scripts/run-pure-tests.mjs`.

- [ ] **Step 3: Run tests and verify the new contract passes on the current baseline**

Run:

```bash
npm test
```

Expected: existing 7 test files plus the new freeze contract pass.

- [ ] **Step 4: Commit**

```bash
git add src/game/visual/SprintAFreezeContract.test.ts tsconfig.pure.json scripts/run-pure-tests.mjs
git commit -m "test: freeze Sprint A gameplay baseline"
```

---

### Task 2: Produce and register the runtime art pack

**Files:**
- Create: `public/assets/environment/cellar/floor_wood.png`
- Create: `public/assets/environment/cellar/floor_masonry.png`
- Create: `public/assets/environment/cellar/floor_metal.png`
- Create: `public/assets/environment/cellar/pipe_horizontal.png`
- Create: `public/assets/environment/cellar/fork.png`
- Create: `public/assets/environment/cellar/bottle.png`
- Create: `public/assets/environment/cellar/can.png`
- Create: `public/assets/environment/cellar/crate.png`
- Create: `public/assets/environment/cellar/cable.png`
- Create: `public/assets/environment/cellar/drain.png`
- Create: `public/assets/environment/cellar/grime_decal.png`
- Create: `public/assets/environment/cellar/mold_decal.png`
- Create: `public/assets/environment/cellar/dust_particle.png`
- Create: `public/assets/threats/sir-chinellus/sir_chinellus_silhouette.png`
- Create: `src/assets/environmentAssetKeys.ts`
- Create: `scripts/environment-assets-contract.test.mjs`
- Modify: `scripts/run-pure-tests.mjs`

**Interfaces:**
- Produces: `ENVIRONMENT_ASSET_PATHS: Record<string,string>`, `CELLAR_TEXTURES`, `SIR_CHINELLUS_TEXTURE_KEY`.
- Runtime images are PNG RGBA. Floor textures must tile horizontally without obvious seams.

- [ ] **Step 1: Write the failing asset existence/signature test**

```js
import { existsSync, readFileSync } from 'node:fs';

const paths = [
  'public/assets/environment/cellar/floor_wood.png',
  'public/assets/environment/cellar/floor_masonry.png',
  'public/assets/environment/cellar/floor_metal.png',
  'public/assets/environment/cellar/pipe_horizontal.png',
  'public/assets/environment/cellar/fork.png',
  'public/assets/environment/cellar/bottle.png',
  'public/assets/environment/cellar/can.png',
  'public/assets/environment/cellar/crate.png',
  'public/assets/environment/cellar/cable.png',
  'public/assets/environment/cellar/drain.png',
  'public/assets/environment/cellar/grime_decal.png',
  'public/assets/environment/cellar/mold_decal.png',
  'public/assets/environment/cellar/dust_particle.png',
  'public/assets/threats/sir-chinellus/sir_chinellus_silhouette.png',
];

const pngSignature = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);

for (const path of paths) {
  if (!existsSync(path)) throw new Error(`missing asset: ${path}`);
  const head = readFileSync(path).subarray(0, 8);
  if (!head.equals(pngSignature)) throw new Error(`invalid PNG signature: ${path}`);
}

console.log(`PASS ${paths.length} environment asset files`);
```

- [ ] **Step 2: Run the contract and verify RED**

Run:

```bash
node scripts/environment-assets-contract.test.mjs
```

Expected: FAIL on the first missing Sprint A PNG.

- [ ] **Step 3: Generate approved dark-cellar source art and normalize runtime assets**

Use the approved art direction:
- charcoal/black dominant;
- rust brown;
- controlled amber rim light;
- no bright cartoon background;
- household scale exaggerated;
- transparent background for props/decals;
- seamless 64×32 or 128×32 surface textures;
- Sir Chinellus as a gigantic worn house slipper in ominous silhouette, not an insect.

Normalize with Pillow/ImageMagick as needed to PNG RGBA and place at the exact paths above. Preserve source sheets in `art/source/sprint-a/` when useful, but runtime must use the normalized PNGs.

- [ ] **Step 4: Create the asset registry**

```ts
export const CELLAR_TEXTURES = {
  wood: 'cellar-floor-wood',
  masonry: 'cellar-floor-masonry',
  metal: 'cellar-floor-metal',
  pipe: 'cellar-pipe-horizontal',
  fork: 'cellar-fork',
  bottle: 'cellar-bottle',
  can: 'cellar-can',
  crate: 'cellar-crate',
  cable: 'cellar-cable',
  drain: 'cellar-drain',
  grime: 'cellar-grime',
  mold: 'cellar-mold',
  dust: 'cellar-dust',
} as const;

export const SIR_CHINELLUS_TEXTURE_KEY = 'sir-chinellus-silhouette';

export const ENVIRONMENT_ASSET_PATHS: Record<string, string> = {
  [CELLAR_TEXTURES.wood]: 'assets/environment/cellar/floor_wood.png',
  [CELLAR_TEXTURES.masonry]: 'assets/environment/cellar/floor_masonry.png',
  [CELLAR_TEXTURES.metal]: 'assets/environment/cellar/floor_metal.png',
  [CELLAR_TEXTURES.pipe]: 'assets/environment/cellar/pipe_horizontal.png',
  [CELLAR_TEXTURES.fork]: 'assets/environment/cellar/fork.png',
  [CELLAR_TEXTURES.bottle]: 'assets/environment/cellar/bottle.png',
  [CELLAR_TEXTURES.can]: 'assets/environment/cellar/can.png',
  [CELLAR_TEXTURES.crate]: 'assets/environment/cellar/crate.png',
  [CELLAR_TEXTURES.cable]: 'assets/environment/cellar/cable.png',
  [CELLAR_TEXTURES.drain]: 'assets/environment/cellar/drain.png',
  [CELLAR_TEXTURES.grime]: 'assets/environment/cellar/grime_decal.png',
  [CELLAR_TEXTURES.mold]: 'assets/environment/cellar/mold_decal.png',
  [CELLAR_TEXTURES.dust]: 'assets/environment/cellar/dust_particle.png',
  [SIR_CHINELLUS_TEXTURE_KEY]: 'assets/threats/sir-chinellus/sir_chinellus_silhouette.png',
};
```

- [ ] **Step 5: Wire the contract into `npm test` and run GREEN**

Add:

```js
const environmentAssets = spawnSync(process.execPath, ['scripts/environment-assets-contract.test.mjs'], { stdio: 'inherit' });
if (environmentAssets.status !== 0) process.exit(environmentAssets.status ?? 1);
```

before TypeScript compilation in `scripts/run-pure-tests.mjs`.

Run:

```bash
npm test
```

Expected: asset contract passes and all prior tests remain green.

- [ ] **Step 6: Commit**

```bash
git add public/assets/environment public/assets/threats art/source/sprint-a src/assets/environmentAssetKeys.ts scripts
git commit -m "art: add Sprint A cellar runtime asset pack"
```

---

### Task 3: Define visual placement and material config as pure data

**Files:**
- Create: `src/game/visual/FirstThreatVisualConfig.ts`
- Create: `src/game/visual/FirstThreatVisualConfig.test.ts`
- Modify: `tsconfig.pure.json`
- Modify: `scripts/run-pure-tests.mjs`

**Interfaces:**
- Consumes: `FIRST_THREAT_LAYOUT.platforms`, `CELLAR_TEXTURES`.
- Produces: `FIRST_THREAT_VISUAL_CONFIG`, containing one material key per real platform plus decorative prop placements.

- [ ] **Step 1: Write the failing config test**

```ts
import { FIRST_THREAT_LAYOUT as L } from '../world/FirstThreatLayout.js';
import { FIRST_THREAT_VISUAL_CONFIG as V } from './FirstThreatVisualConfig.js';

function ok(value: unknown, message: string) {
  if (!value) throw new Error(message);
}

ok(V.platformMaterials.length === L.platforms.length, 'every collider platform needs one visual material');

for (const prop of V.props) {
  if (prop.layer === 'gameplay') {
    ok(prop.x >= 0 && prop.x <= L.width, `gameplay prop ${prop.texture} x outside world`);
    ok(prop.y >= 0 && prop.y <= L.height, `gameplay prop ${prop.texture} y outside world`);
  }
  ok(prop.collision === false, `decorative prop ${prop.texture} must not own collision`);
}

ok(V.depths.background < V.depths.gameplay, 'background depth must be behind gameplay');
ok(V.depths.gameplay < V.depths.foreground, 'foreground must be above gameplay');

console.log('PASS FirstThreatVisualConfig');
```

- [ ] **Step 2: Verify RED**

Run the compiled test through `npm test`.

Expected: compile failure because `FirstThreatVisualConfig.ts` does not yet exist.

- [ ] **Step 3: Implement the visual config**

Use a focused data structure:

```ts
import { CELLAR_TEXTURES } from '../../assets/environmentAssetKeys.js';

export type SurfaceMaterial = 'wood' | 'masonry' | 'metal';
export type VisualLayer = 'background' | 'gameplay' | 'foreground';

export type PropPlacement = {
  texture: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  alpha: number;
  layer: VisualLayer;
  collision: false;
};

export const FIRST_THREAT_VISUAL_CONFIG = {
  platformMaterials: [
    'wood','wood','masonry','masonry','metal',
    'metal','masonry','masonry','wood','metal',
  ] as SurfaceMaterial[],
  depths: { background: -16, atmosphere: -8, gameplay: 2, foreground: 28 },
  props: [
    { texture: CELLAR_TEXTURES.fork, x: 355, y: 490, scale: 1.7, rotation: -0.12, alpha: 0.62, layer: 'background', collision: false },
    { texture: CELLAR_TEXTURES.bottle, x: 920, y: 505, scale: 1.55, rotation: 0.04, alpha: 0.52, layer: 'background', collision: false },
    { texture: CELLAR_TEXTURES.can, x: 1330, y: 500, scale: 1.15, rotation: -0.04, alpha: 0.64, layer: 'background', collision: false },
    { texture: CELLAR_TEXTURES.crate, x: 1710, y: 505, scale: 1.25, rotation: 0, alpha: 0.58, layer: 'background', collision: false },
    { texture: CELLAR_TEXTURES.cable, x: 1100, y: 118, scale: 1.2, rotation: 0.08, alpha: 0.42, layer: 'foreground', collision: false },
    { texture: CELLAR_TEXTURES.drain, x: 2010, y: 486, scale: 1.05, rotation: 0, alpha: 0.72, layer: 'gameplay', collision: false },
  ] as PropPlacement[],
} as const;
```

- [ ] **Step 4: Run full tests**

```bash
npm test
```

Expected: new visual config test passes; gameplay tests unchanged.

- [ ] **Step 5: Commit**

```bash
git add src/game/visual tsconfig.pure.json scripts/run-pure-tests.mjs
git commit -m "feat: define M1 cellar visual placement contract"
```

---

### Task 4: Build the cellar renderer and bind visible surfaces to real colliders

**Files:**
- Create: `src/game/visual/CellarArtDirector.ts`
- Modify: `src/game/scenes/BootScene.ts`
- Modify: `src/game/scenes/FirstThreatScene.ts`
- Create: `scripts/cellar-renderer-contract.test.mjs`
- Modify: `scripts/run-pure-tests.mjs`

**Interfaces:**
- Consumes: `FIRST_THREAT_LAYOUT`, `FIRST_THREAT_VISUAL_CONFIG`, `ENVIRONMENT_ASSET_PATHS`.
- Produces: `CellarArtDirector.build(scene, layout): void`.
- Collision remains created by `FirstThreatScene` from layout rectangles; the art director renders only.

- [ ] **Step 1: Write the source-contract test**

```js
import { readFileSync } from 'node:fs';

const scene = readFileSync('src/game/scenes/FirstThreatScene.ts', 'utf8');
const director = readFileSync('src/game/visual/CellarArtDirector.ts', 'utf8');

if (!scene.includes('CellarArtDirector')) throw new Error('FirstThreatScene must delegate environment rendering');
if (!director.includes('tileSprite')) throw new Error('platform visuals must tile against collider dimensions');
if (!scene.includes('setVisible(false)')) throw new Error('physics platform rectangles must be invisible after art binding');

console.log('PASS cellar renderer contract');
```

- [ ] **Step 2: Verify RED**

Run:

```bash
node scripts/cellar-renderer-contract.test.mjs
```

Expected: FAIL because `CellarArtDirector.ts` does not exist.

- [ ] **Step 3: Preload all environment textures**

Update `BootScene.preload()`:

```ts
import { ENVIRONMENT_ASSET_PATHS } from '../../assets/environmentAssetKeys.js';

// after player preload
for (const [key, path] of Object.entries(ENVIRONMENT_ASSET_PATHS)) this.load.image(key, path);
```

- [ ] **Step 4: Implement `CellarArtDirector`**

Core behavior:

```ts
export class CellarArtDirector {
  static build(scene: Phaser.Scene, layout: FirstThreatLayout): void {
    const V = FIRST_THREAT_VISUAL_CONFIG;
    scene.add.rectangle(layout.width / 2, layout.height / 2, layout.width, layout.height, 0x090807, 1)
      .setDepth(-20);

    layout.platforms.forEach((p, index) => {
      const material = V.platformMaterials[index];
      const texture = material === 'wood'
        ? CELLAR_TEXTURES.wood
        : material === 'metal'
          ? CELLAR_TEXTURES.metal
          : CELLAR_TEXTURES.masonry;

      scene.add.tileSprite(p.x, p.y, p.width, p.height, texture)
        .setOrigin(0, 0)
        .setDepth(V.depths.gameplay);
    });

    for (const prop of V.props) {
      const depth = prop.layer === 'background'
        ? V.depths.background
        : prop.layer === 'foreground'
          ? V.depths.foreground
          : V.depths.gameplay - 0.5;

      scene.add.image(prop.x, prop.y, prop.texture)
        .setScale(prop.scale)
        .setRotation(prop.rotation)
        .setAlpha(prop.alpha)
        .setDepth(depth);
    }
  }
}
```

Add cheap dust using the dust texture, not hundreds of new shapes per frame.

- [ ] **Step 5: Make physics rectangles invisible but unchanged**

In `FirstThreatScene`, retain:

```ts
this.physics.add.existing(block, true);
```

but set the debug rectangles:

```ts
block.setVisible(false);
```

Call `CellarArtDirector.build(this, L)` before player creation.

Remove the old `createAtmosphere()` method after the new renderer reproduces the required background/atmosphere responsibilities.

- [ ] **Step 6: Run tests and build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/game/visual src/game/scenes src/assets scripts
git commit -m "feat: render M1 with modular cellar art"
```

---

### Task 5: Replace the procedural Ancient Predator with Sir Chinellus art

**Files:**
- Create: `src/game/threat/SirChinellusVisualConfig.ts`
- Create: `src/game/threat/SirChinellusVisualConfig.test.ts`
- Modify: `src/game/threat/AncientPredator.ts`
- Modify: `tsconfig.pure.json`
- Modify: `scripts/run-pure-tests.mjs`

**Interfaces:**
- Keeps existing `AncientPredator.setThreatX(x)` and `setMood(state)` API unchanged.
- Produces pure `SIR_CHINELLUS_VISUAL` state-to-alpha/scale config.

- [ ] **Step 1: Write the failing visual-state test**

```ts
import { SIR_CHINELLUS_VISUAL as V } from './SirChinellusVisualConfig.js';

if (!(V.alpha.DORMANT < V.alpha.WARNING)) throw new Error('warning must reveal more of Sir Chinellus');
if (!(V.alpha.WARNING < V.alpha.CHASING)) throw new Error('chase must reveal more than warning');
if (V.alpha.CHASING !== 1) throw new Error('chasing silhouette must reach full alpha');
if (V.scale <= 1) throw new Error('Sir Chinellus must read as gigantic');

console.log('PASS Sir Chinellus visual config');
```

- [ ] **Step 2: Verify RED**

Expected: compile failure because the config is absent.

- [ ] **Step 3: Implement config**

```ts
export const SIR_CHINELLUS_VISUAL = {
  scale: 1.55,
  originX: 0.88,
  originY: 1,
  alpha: {
    DORMANT: 0.08,
    WARNING: 0.38,
    CHASING: 1,
    CAUGHT: 1,
    ESCAPED: 0.12,
  },
} as const;
```

- [ ] **Step 4: Replace shape construction in `AncientPredator`**

The container should hold one image:

```ts
this.visual = scene.add.image(0, 0, SIR_CHINELLUS_TEXTURE_KEY)
  .setOrigin(V.originX, V.originY)
  .setScale(V.scale);
this.add(this.visual);
```

`setMood` must read alpha from `SIR_CHINELLUS_VISUAL.alpha[state]`.

Do not change threat position, catch distance, movement speed or timing.

- [ ] **Step 5: Run full tests/build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/game/threat tsconfig.pure.json scripts/run-pure-tests.mjs
git commit -m "art: reveal Ancient Predator as Sir Chinellus"
```

---

### Task 6: Make chase lighting readable and deterministic

**Files:**
- Create: `src/game/visual/DangerVisualController.ts`
- Create: `src/game/visual/DangerVisualController.test.ts`
- Modify: `src/game/scenes/FirstThreatScene.ts`
- Modify: `tsconfig.pure.json`
- Modify: `scripts/run-pure-tests.mjs`

**Interfaces:**
- Produces: `resolveDangerVisual(state, gap): { overlayAlpha:number; amberAlpha:number; dustBoost:number }`.
- Consumes only chase state and player-threat gap; no Phaser dependency.

- [ ] **Step 1: Write failing pure tests**

```ts
import { resolveDangerVisual } from './DangerVisualController.js';

const dormant = resolveDangerVisual('DORMANT', 400);
if (dormant.overlayAlpha !== 0) throw new Error('dormant overlay must be zero');

const far = resolveDangerVisual('CHASING', 220);
const close = resolveDangerVisual('CHASING', 40);
if (!(close.overlayAlpha > far.overlayAlpha)) throw new Error('danger must increase as predator closes');
if (close.overlayAlpha > 0.22) throw new Error('danger overlay must never erase gameplay readability');

console.log('PASS DangerVisualController');
```

- [ ] **Step 2: Verify RED**

Expected: compile failure because controller is absent.

- [ ] **Step 3: Implement minimal controller**

```ts
import type { ThreatChaseState } from '../threat/ThreatChaseController.js';

export function resolveDangerVisual(state: ThreatChaseState, gap: number) {
  if (state !== 'CHASING' && state !== 'CAUGHT') {
    return { overlayAlpha: 0, amberAlpha: state === 'WARNING' ? 0.08 : 0.03, dustBoost: state === 'WARNING' ? 0.35 : 0 };
  }
  const normalized = Math.max(0, Math.min(1, (220 - Math.max(0, gap)) / 220));
  return {
    overlayAlpha: Math.min(0.22, normalized * 0.22),
    amberAlpha: 0.08 + normalized * 0.08,
    dustBoost: 0.45 + normalized * 0.55,
  };
}
```

- [ ] **Step 4: Consume controller in scene**

Replace the inline danger-overlay math in `updateDangerOverlay()` with `resolveDangerVisual`.

Set explicit depths in `FirstThreatScene`: `this.player.setDepth(50)`, `this.dangerOverlay.setDepth(40)`, and keep HUD/warning UI at depth `100+`. This guarantees danger tint is visible without covering the protagonist. Foreground art remains at depth `28`.

Do not alter camera shake durations or chase timings in this task.

- [ ] **Step 5: Run full verification**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/game/visual src/game/scenes/FirstThreatScene.ts tsconfig.pure.json scripts/run-pure-tests.mjs
git commit -m "feat: add readable chase lighting response"
```

---

### Task 7: Final browser/Vercel validation and Sprint A playtest gate

**Files:**
- Create: `docs/SPRINT-A-PLAYTEST.md`
- Create: `docs/SPRINT-A-STATUS.md`
- Modify only if evidence requires it: visual config/assets from Tasks 2–6.

**Interfaces:**
- Produces a documented acceptance gate; no new gameplay API.

- [ ] **Step 1: Run complete local verification**

```bash
npm install
npm test
npm run build
```

Expected:
- every pure/source/asset contract passes;
- Vite production build exits 0;
- no TypeScript inheritance/collider regression.

- [ ] **Step 2: Push the implementation branch and verify Vercel status**

Use the GitHub-linked Vercel preview. Required status: `success`.

If Vercel reports a build error, capture the exact failing file/error before changing code.

- [ ] **Step 3: Perform browser playtest using this checklist**

Write `docs/SPRINT-A-PLAYTEST.md` with checkboxes:

```md
# Sprint A Browser Playtest

- [ ] protagonist is instantly readable in every room segment
- [ ] route is readable while holding run
- [ ] no decorative false platforms
- [ ] 650 ms warning clearly communicates danger
- [ ] Sir Chinellus reads as enormous before full reveal
- [ ] reveal is scary first and funny second
- [ ] cellar identity is obvious without reading text
- [ ] at least one giant prop strongly communicates scale
- [ ] foreground never hides a precision jump
- [ ] chase feel matches approved M1
- [ ] no visible collision/art mismatch
- [ ] Vercel preview remains smooth at target laptop viewport
```

- [ ] **Step 4: Record evidence in status doc**

```md
# Sprint A Status — Environment Art Pass

## Automated
- npm test: PASS
- npm run build: PASS
- Vercel preview: PASS

## Gameplay freeze
- Movement constants: unchanged
- Chase constants: unchanged
- Collision layout: unchanged

## Visual acceptance
- Cellar modular surfaces: PASS
- Giant props: PASS
- Atmosphere/parallax: PASS
- Sir Chinellus silhouette: PASS
- Player readability: PASS

## Remaining gate
Browser playtest approval before merge.
```

- [ ] **Step 5: Request whole-branch review**

Review specifically for:
- accidental gameplay tuning changes;
- false visual affordances;
- missing assets;
- player readability;
- Vercel/build regressions.

- [ ] **Step 6: Commit verification docs**

```bash
git add docs/SPRINT-A-PLAYTEST.md docs/SPRINT-A-STATUS.md
git commit -m "docs: record Sprint A verification gate"
```

- [ ] **Step 7: Open PR as draft until browser approval**

PR title:

```
Sprint A — Environment Art Pass
```

Do not merge until the user confirms the browser playtest preserves the M1 feel.

---

## Execution order summary

1. Freeze gameplay baseline.
2. Produce normalized cellar + Sir Chinellus runtime assets.
3. Define pure visual placement/material data.
4. Build modular cellar renderer and make physics rectangles invisible.
5. Replace procedural Predator art with Sir Chinellus.
6. Add deterministic danger-light response.
7. Verify local build + Vercel + browser playtest, then review and merge.

The branch should remain shippable after every task. No task is allowed to depend on unfinished Sprint B–E systems.

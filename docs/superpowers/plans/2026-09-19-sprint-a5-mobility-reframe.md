# Sprint A.5 — Mobility Reframe Implementation Plan

> Execute only after the design spec is approved. Use TDD for pure movement logic and keep `main` merge-blocked until browser playtest confirms beginner feel.

**Goal:** Make the protagonist move like a cockroach through wing-assisted recovery, wall adhesion/climbing and vertical object-based traversal, then re-author the First Threat around those abilities.

**Design spec:** `docs/superpowers/specs/2026-09-19-sprint-a5-mobility-reframe-design.md`

**Baseline:** current `main` after Sprint A Environment Art Pass.

---

## Task 1 — Add vertical/climb intent without changing current behavior

**Files**
- Modify: `src/game/input/InputController.ts`
- Modify: `src/game/input/KeyboardInputAdapter.ts`
- Create: `scripts/mobility-input-contract.test.mjs`
- Modify: `scripts/run-pure-tests.mjs`

### RED

Add a source contract that requires:

- `PlayerIntent.moveY`;
- `W` + `UP` mapped to climb up;
- `S` + `DOWN` mapped to climb down;
- existing Jump remains `SPACE`;
- no separate flight key.

### GREEN

Extend:

```ts
export type PlayerIntent = {
  moveX: AxisDirection;
  moveY: AxisDirection;
  run: boolean;
  jumpHeld: boolean;
  jumpPressed: boolean;
  jumpReleased: boolean;
  dodgePressed: boolean;
  respawnPressed: boolean;
};
```

Keep every existing field and semantic unchanged.

### Verify

```bash
npm test
npm run build
```

Commit:

```
feat: add vertical mobility intent
```

---

## Task 2 — Introduce Mobility V2 config as a separate tuning surface

**Files**
- Create: `src/game/player/MobilityConfig.ts`
- Create: `src/game/player/MobilityConfig.test.ts`
- Modify: `tsconfig.pure.json`
- Modify: `scripts/run-pure-tests.mjs`

Do not overwrite historical M0/M1 movement numbers immediately. The dedicated Mobility Lab V2 consumes the new config first.

### Proposed initial config

```ts
export const MOBILITY_V2 = {
  walkSpeed: 115,
  runSpeed: 195,
  groundAcceleration: 1500,
  groundDeceleration: 1800,
  airAcceleration: 1000,
  gravity: 900,
  jumpVelocity: -350,
  maxFallSpeed: 420,
  coyoteTimeMs: 140,
  jumpBufferMs: 160,
  jumpCutMultiplier: 0.58,
  dodgeDurationMs: 160,
  dodgeSpeed: 330,
  dodgeCooldownMs: 380,

  wingFlaps: 2,
  wingFlapVelocity: -230,
  wingFlapCooldownMs: 130,
  glideMaxFallSpeed: 150,
  glideBudgetMs: 650,

  stableWallGripResetMs: 150,
  wallClimbSpeed: 80,
  wallSlideSpeed: 45,
  wallJumpVelocityX: 190,
  wallJumpVelocityY: -310,
  wallDetachLockMs: 120,

  ledgeAssistHorizontalPx: 10,
  ledgeAssistVerticalPx: 12,
} as const;
```

### Tests

Validate:
- speeds positive;
- jump/wall-jump Y negative;
- `wingFlaps >= 1`;
- glide fall cap below normal fall cap;
- climb speed below run speed;
- all timing windows finite/nonnegative.

Commit:

```
feat: define beginner mobility v2 tuning
```

---

## Task 3 — Build WingMobilityController with pure TDD

**Files**
- Create: `src/game/player/WingMobilityController.ts`
- Create: `src/game/player/WingMobilityController.test.ts`

### Required behavior

- starts with 2 available flaps;
- ground contact fully resets flaps;
- one valid flap consumes exactly one;
- cannot flap twice inside cooldown;
- stable valid wall grip restores flaps after `stableWallGripResetMs`;
- glide is available only airborne/descending while Jump is held;
- glide consumes a bounded time budget;
- release Jump exits glide;
- respawn resets wing state.

Suggested API:

```ts
class WingMobilityController {
  reset(): void;
  noteGrounded(nowMs: number): void;
  noteStableWallGrip(nowMs: number, climbable: boolean): void;
  tryFlap(nowMs: number, airborne: boolean): boolean;
  resolveVerticalVelocity(currentVy: number): number;
  updateGlide(nowMs: number, jumpHeld: boolean, descending: boolean): boolean;
  get flapsRemaining(): number;
}
```

The controller should not import Phaser.

Commit:

```
feat: add wing flutter and glide controller
```

---

## Task 4 — Build surface taxonomy + WallMobilityController

**Files**
- Create: `src/game/world/SurfaceType.ts`
- Create: `src/game/player/WallMobilityController.ts`
- Create: `src/game/player/WallMobilityController.test.ts`

Surface types:

```ts
export type SurfaceType =
  | 'GROUND'
  | 'ROUGH_CLIMB'
  | 'SMOOTH_LOCKED'
  | 'GREASY_SLIDE'
  | 'HAZARDOUS_CLIMB'
  | 'DECORATIVE';
```

Wall controller must resolve:

- whether attachment is legal;
- cling vs climb;
- climb velocity from `moveY`;
- passive wall slide velocity;
- wall-jump X/Y impulses;
- short detach lock to stop immediate reattachment;
- no adhesion on `SMOOTH_LOCKED` or `GREASY_SLIDE`.

Suggested pure input:

```ts
type WallFacts = {
  touchingLeft: boolean;
  touchingRight: boolean;
  moveX: -1 | 0 | 1;
  moveY: -1 | 0 | 1;
  surface: SurfaceType | null;
  nowMs: number;
};
```

Commit:

```
feat: add surface-aware wall mobility
```

---

## Task 5 — Extend player state model

**Files**
- Modify: `src/game/player/PlayerState.ts`
- Modify: `src/game/player/PlayerStateMachine.ts`
- Modify: `src/game/player/PlayerStateMachine.test.ts`
- Modify: `src/game/player/PlayerAnimationController.ts`

Add:

- `WING_FLAP`
- `GLIDE`
- `WALL_CLING`
- `WALL_CLIMB`
- `WALL_JUMP`

Precedence remains:

`RESPAWN > DEATH > HURT > DODGE > wall/wing special state > ordinary air > ground`

Prototype animations may temporarily reuse existing jump/fall/run frames, but states must be distinct.

Commit:

```
feat: add cockroach mobility states
```

---

## Task 6 — Integrate Mobility V2 into Player without making Player.ts monolithic

**Files**
- Modify: `src/game/player/Player.ts`
- Create: `scripts/player-mobility-integration-contract.test.mjs`
- Modify: `scripts/run-pure-tests.mjs`

### Integration rules

`Player.ts` should orchestrate:
- input;
- timers;
- `WingMobilityController`;
- `WallMobilityController`;
- damage;
- animation.

It should not implement flap counters or surface rules inline.

### Runtime sequence

1. sample intent;
2. determine grounded/wall contact;
3. resolve contacted surface tag;
4. update ground/wall reset signals;
5. handle damage locks;
6. ground jump or wall jump;
7. wing flap;
8. glide/fall cap;
9. horizontal acceleration;
10. wall climb/slide override;
11. resolve animation state.

### Source contract

Fail if:
- wing counters appear as ad-hoc fields in `Player.ts`;
- surface type is inferred from texture name;
- `Player.ts` implements hard-coded `wingFlaps = 2` rather than consuming config/controller.

Commit:

```
feat: integrate wing and wall mobility into player
```

---

## Task 7 — Create MobilityLabV2 layout with recovery routes

**Files**
- Create: `src/game/world/MobilityLabV2Layout.ts`
- Create: `src/game/world/MobilityLabV2Layout.test.ts`

Suggested world:
- width: `1792`;
- height: `928`;
- spawn near lower-left;
- upper goal near upper-right;
- no mandatory death void in the tutorial route.

Layout entities need surface tags.

Example:

```ts
type MobilitySurface = RectSpec & {
  surface: SurfaceType;
  role: 'route' | 'recovery' | 'boundary';
};
```

### Test invariants

- all early fall zones have recovery surface below;
- at least 3 `ROUGH_CLIMB` walls;
- no required upward gap exceeds combined intended mobility envelope;
- start and goal inside bounds;
- every climb wall has a visible landing or continuation;
- at least one slower safe route and one expressive route exist.

Commit:

```
feat: author vertical mobility lab v2
```

---

## Task 8 — Implement MobilityLabV2Scene + beginner camera

**Files**
- Create: `src/game/scenes/MobilityLabV2Scene.ts`
- Modify: `src/main.ts`
- Modify: `src/game/scenes/BootScene.ts`
- Create: `scripts/mobility-lab-scene-contract.test.mjs`

During this tuning phase Boot should start `mobility-lab-v2`, not First Threat.

### Scene requirements

- render 1792×928 world;
- camera follows X and Y;
- larger vertical deadzone;
- smooth Y follow;
- temporary instructional text;
- recovery floor instead of death for early misses;
- collision surfaces carry tags used by wall controller;
- debug HUD may show:
  - state;
  - flaps remaining;
  - surface type.

No predator.

Commit:

```
feat: add beginner mobility lab v2
```

---

## Task 9 — Build the Pantry Ascent handcrafted set-piece

**Files**
- Create/modify: `src/game/visual/MobilityLabArtDirector.ts`
- Create: `src/game/visual/MobilityLabVisualConfig.ts`
- Add/replace runtime art under `public/assets/environment/pantry/`

Composition:

1. broken cardboard box;
2. tipped can;
3. rough wood shelf support;
4. pipe;
5. cable;
6. diagonal fork bridge;
7. bottle/jar silhouette;
8. upper shelf goal.

### Rule

The player should read **objects and surfaces**, not floating rectangular platforms.

Collision may still use simple rectangles behind the art.

### Visual acceptance

Take a screenshot with debug collision disabled. A reviewer should be able to describe the route in household-object terms without seeing the layout data.

Commit:

```
art: build handcrafted Pantry Ascent mobility set-piece
```

---

## Task 10 — Tune in browser before reintroducing danger

**Files**
- Create: `docs/SPRINT-A5-MOBILITY-PLAYTEST.md`
- Create: `docs/SPRINT-A5-STATUS.md`

Browser checklist:

- [ ] normal jump feels immediate;
- [ ] first wing flap is understood with one prompt;
- [ ] a missed jump can be rescued with a flap;
- [ ] two flaps feel useful but not like unrestricted flight;
- [ ] holding Jump makes descent visibly controllable;
- [ ] wall attachment does not require pixel precision;
- [ ] climb up/down is understandable;
- [ ] wall jump does not immediately re-stick to the same wall;
- [ ] a wall grip can refresh the wing loop;
- [ ] early falls land on recovery paths;
- [ ] vertical camera never fights the player;
- [ ] first-time route can be completed with few/no deaths;
- [ ] player feels recognizably cockroach-like before enemies exist.

Tune only config values where possible.

Commit:

```
docs: record Sprint A.5 mobility tuning gate
```

---

## Task 11 — Re-author First Threat for the accepted moveset

Only begin after Task 10 is approved.

**Files**
- Modify: `src/game/world/FirstThreatLayout.ts`
- Modify: `src/game/scenes/FirstThreatScene.ts`
- Modify tests/contracts that currently freeze old M1 geometry/tuning.
- Preserve historical values in docs rather than pretending they never existed.

### New chase structure

Before trigger, player must have already completed:
- wing use;
- wall use;
- combined ascent.

Chase route should contain:
- one wall recovery;
- one optional flap shortcut;
- one lower recovery route;
- fewer binary death gaps.

Predator speed/timing must be retuned against the accepted V2 movement.

Do not copy old `205 px/s` merely because it existed.

Commit:

```
feat: re-author First Threat around cockroach mobility
```

---

## Task 12 — Replace incorrect Sir Chinellus art

**Files**
- Replace: `public/assets/threats/sir-chinellus/sir_chinellus_silhouette.png`
- Update asset/source documentation.

Generate/draw a dedicated unmistakable worn slipper.

Acceptance:
- reads as slipper in silhouette at gameplay size;
- no insect wings;
- no accidental creature anatomy;
- terror first, mundane reveal second.

Commit:

```
art: correct Sir Chinellus slipper silhouette
```

---

## Task 13 — Full verification and PR

Run:

```bash
npm test
npm run build
```

Then verify Vercel preview.

Required final evidence:
- pure tests PASS;
- source contracts PASS;
- asset contracts PASS;
- Vite production build PASS;
- Vercel PASS;
- MobilityLab V2 browser playtest approved;
- First Threat browser playtest approved;
- no regression in respawn/damage lifecycle.

Open implementation PR as Draft until both browser gates are explicitly approved.

---

# Execution rule

Do not solve beginner difficulty by merely slowing the predator.

The order is:

**make movement expressive → teach it safely → build vertical geometry around it → then retune the chase.**

This keeps the core problem solved at the system level rather than masking it with easier numbers.

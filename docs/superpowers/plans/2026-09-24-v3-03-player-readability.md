# V3-03 Player Readability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the premium roach immediately readable in the complete Cellar while keeping it physically tiny and making render scale incapable of changing grounding/collision behavior.

**Architecture:** Split the current player presentation from the authoritative Arcade physics actor. Physics owns body geometry, feet, sensors, spawn and respawn; a child/follower visual owns premium rendering, visual scale and art offset. Add restrained readability and camera composition only after the decoupling contract is proven.

**Tech Stack:** TypeScript, Phaser 3 / Arcade Physics, existing pure Node test harness, Vite/Vercel.

**Spec:** `docs/superpowers/specs/2026-09-24-v3-03-player-readability.md`

## Global Constraints
- Canonical principle: the roach must look small in the world, but never small to the player.
- Keep 0.375 as implementation baseline, not final scale lock.
- Render scale must never mutate physics body dimensions/offset or safe spawn.
- No permanent debug dot, neon aura, thick outline or giant player marker as shipping readability.
- Do not add Fear/Barata Tonta, Panic Flight or enemy-reactive horror in V3-03.

## Review Focus
- Render scale 0.375 -> 0.50 must leave physics snapshot identical.
- Respawn after a real fall must resolve to the same grounded feet coordinate regardless of render scale.
- Facing/animation changes must not drift visual feet away from actor feet.
- Dense dark backgrounds must not erase antenna/leg silhouette.
- Camera framing must not reveal outside scene bounds or make vertical traversal nauseating.

---

### Task 1: Freeze the physics contract
**Files:**
- Create: `src/game/player/PlayerPhysicsContract.ts`
- Create: `src/game/player/PlayerPhysicsContract.test.ts`
- Modify: `tsconfig.pure.json`
- Modify: `scripts/run-pure-tests.mjs`

- [ ] Encode canonical body width, height, offsets and feet anchor independently of `ROACH_WORLD_SCALE`.
- [ ] Write failing tests proving snapshots are identical for visual scales 0.25, 0.375 and 0.50.
- [ ] Implement minimal immutable physics contract.
- [ ] Run pure suite and confirm PASS.
- [ ] Commit `test(V3-03): freeze player physics geometry`.

### Task 2: Separate premium visual from physics actor
**Files:**
- Create: `src/game/player/RoachVisual.ts`
- Create: `src/game/player/RoachVisualContract.ts`
- Create: `src/game/player/RoachVisualContract.test.ts`
- Modify: `src/game/player/Player.ts`

- [ ] Write failing contract test showing visual scale can change without changing physics geometry.
- [ ] Move premium texture/render-scale/art-offset ownership into `RoachVisual`.
- [ ] Keep `Player` as authoritative physics actor and state machine.
- [ ] Synchronize visual x/y/facing/state from actor each update.
- [ ] Ensure actor visibility/debug settings do not accidentally hide the visual.
- [ ] Run pure tests/build.
- [ ] Commit `refactor(V3-03): decouple roach visual from physics actor`.

### Task 3: Make body and sensors consume the fixed physics contract
**Files:**
- Modify: `src/game/player/Player.ts`
- Modify: `src/game/player/WallContactSensor.ts` and/or its caller if required
- Modify: `src/game/scenes/MobilityLabV2Scene.ts`

- [ ] Add regression test for fixed body geometry after visual-scale changes.
- [ ] Replace texture/scale-derived body setup with `PlayerPhysicsContract` values.
- [ ] Make wall-contact geometry use authoritative body bounds rather than visual dimensions.
- [ ] Keep `SafeSpawnResolver` feet/checkpoint semantics unchanged.
- [ ] Run pure tests/build.
- [ ] Commit `fix(V3-03): make collision geometry render-scale invariant`.

### Task 4: Reproduce and kill the 0.50 fall-loop regression
**Files:**
- Create/modify focused regression test near player physics/spawn contracts.
- Modify runtime code only if Task 1-3 reveal an invariant violation.

- [ ] Re-run 0.375 baseline.
- [ ] Switch only `RoachVisual` to 0.50.
- [ ] Verify body snapshot is byte-for-byte/equivalent unchanged.
- [ ] Verify initial grounded idle >= 5 s.
- [ ] Verify five intentional fall -> respawn -> grounded cycles.
- [ ] Return visual baseline to 0.375 after the regression proof unless 0.50 is separately approved later.
- [ ] Commit `test(V3-03): prevent visual scale from reviving fall loop`.

### Task 5: Add cinematic player readability
**Files:**
- Create: `src/game/visual/PlayerReadabilityDirector.ts`
- Create: `src/game/visual/PlayerReadabilityDirector.test.ts`
- Modify: `src/game/scenes/MobilityLabV2Scene.ts`

- [ ] Define deterministic readability inputs: player position, locomotion state, local scene density/zone if available.
- [ ] Write pure tests for bounded intensity and deterministic output.
- [ ] Implement subtle local separation compatible with cellar lighting.
- [ ] Preserve antenna/leg silhouette without permanent outline/aura.
- [ ] Disable the red player probe in normal runtime; retain only explicit debug mode if useful.
- [ ] Run tests/build and capture dense-scene evidence.
- [ ] Commit `feat(V3-03): add cinematic player readability`.

### Task 6: Compose the exploration camera
**Files:**
- Create: `src/game/visual/PlayerCameraDirector.ts`
- Create: `src/game/visual/PlayerCameraDirector.test.ts`
- Modify: `src/game/scenes/MobilityLabV2Scene.ts`

- [ ] Encode deterministic normal-exploration zoom/follow offsets/deadzone behavior.
- [ ] Test bounds and velocity transitions.
- [ ] Replace ad-hoc camera tuning with director output.
- [ ] Validate giant-world scale remains obvious while player stays readable.
- [ ] Run tests/build.
- [ ] Commit `feat(V3-03): compose readable exploration camera`.

### Task 7: Complete Cellar acceptance gate
**Files:**
- Update relevant V3 docs/issue evidence.

- [ ] Run full automated suite.
- [ ] Run production build.
- [ ] Deploy preview.
- [ ] Capture same Cellar framing used for 0.25/0.375 comparisons with debug marker disabled.
- [ ] Confirm immediate player identification, grounded idle and five respawn cycles.
- [ ] Confirm door/crates/barrels still read as huge human-scale objects.
- [ ] Only then propose final V3-02 scale lock.
- [ ] Commit evidence/docs and open PR for review.

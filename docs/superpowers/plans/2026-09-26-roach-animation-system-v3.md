# Roach Animation System V3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a deterministic, testable cockroach presentation system with living legs/antennae and wings visible only during flap/glide, without changing locked Player physics.

**Architecture:** Keep gameplay state authoritative in `Player`; resolve it into immutable animation descriptors in a pure module, then let `RoachVisual` render body and wing channels. Binary art remains replaceable behind stable animation keys, so code correctness does not depend on conceptual sheets.

**Tech Stack:** TypeScript 5.9, Phaser 3.90, Vite 7, Node pure-test runner.

**Spec:** `docs/superpowers/specs/2026-09-26-roach-animation-system-v3.md`

## Global Constraints
- Visual scale: `0.500`.
- Arcade body: `30x18`.
- Body offset: `17,42`.
- Animation presentation never mutates Player physics.
- Open wings are legal only in `WING_FLAP` and `GLIDE`.
- Body/base art must not expose a second baked-open wing pair.
- Existing gameplay state names remain authoritative.

## Review Focus
- Rapid state changes must not leave wings visible after returning to a non-wing state.
- Missing optional wing texture must degrade to body-only rendering without breaking gameplay.
- Facing flips must affect presentation without changing registration/collider.
- Respawn/death transitions must reset wing visibility deterministically.
- Repeated updates in the same state must not recreate visual objects or jitter origin.

---

### Task 1: Pure Animation Descriptor Contract

**Files:**
- Create: `src/game/player/RoachAnimationV3.ts`
- Create: `src/game/player/RoachAnimationV3.test.ts`
- Modify: `tsconfig.pure.json`
- Modify: `scripts/run-pure-tests.mjs`

**Interfaces:**
- Produces: `resolveRoachAnimationV3(state: string): RoachAnimationDescriptor`.
- Descriptor exposes `bodyKey`, `loop`, `fps`, `wingsVisible`, `wingMode` and presentation-only transform metadata.

- [ ] Write failing tests covering every canonical state and asserting wings are true only for `WING_FLAP`/`GLIDE`.
- [ ] Run `npm test`; expect failure because the resolver does not exist.
- [ ] Implement immutable descriptors with no Phaser dependency.
- [ ] Add the test/module to the pure compile and official runner.
- [ ] Run `npm test`; expect the animation contract plus existing suite to pass.
- [ ] Commit `feat(V3): add pure roach animation contract`.

### Task 2: Two-Channel Roach Visual

**Files:**
- Modify: `src/game/player/RoachVisual.ts`
- Create: `src/game/player/RoachVisualContract.ts`
- Create: `src/game/player/RoachVisualContract.test.ts`

**Interfaces:**
- Consumes: `RoachAnimationDescriptor` from Task 1.
- Produces: deterministic body/wing visibility state independent of physics.

- [ ] Write failing pure tests proving non-wing states always resolve hidden wings, respawn/death clear wings, and scale remains `0.500`.
- [ ] Run `npm test`; expect contract failure.
- [ ] Refactor `RoachVisual` into a presentation root with body and wing channels while preserving registration and Player attachment.
- [ ] Ensure absent wing assets result in hidden wing channel rather than an exception.
- [ ] Run `npm test` and `npm run build`; expect PASS.
- [ ] Commit `feat(V3): split roach body and wing presentation channels`.

### Task 3: Controller Integration

**Files:**
- Modify: `src/game/player/PlayerAnimationController.ts`
- Modify: `src/game/player/Player.ts`
- Create: `src/game/player/PlayerAnimationV3Integration.test.ts`

**Interfaces:**
- Consumes: resolver from Task 1 and two-channel visual from Task 2.
- Produces: one state-driven presentation update path; Player physics API remains unchanged.

- [ ] Write failing tests for `IDLE -> WING_FLAP -> FALL`, `GLIDE -> WALL_CLING`, `HURT -> RESPAWN`, and facing flips.
- [ ] Run `npm test`; expect integration failures.
- [ ] Route controller state changes through the V3 descriptor and visual application API.
- [ ] Verify no animation method writes body size, body offset, Player x/y, or velocity.
- [ ] Run `npm test` and `npm run build`; expect PASS.
- [ ] Commit `feat(V3): drive roach presentation from gameplay states`.

### Task 4: Motion Cadence and Fallback Frame Families

**Files:**
- Modify: `src/game/player/RoachAnimationV3.ts`
- Modify: `src/assets/assetKeys.ts`
- Modify: existing premium frame manifest/loader files discovered in the branch.
- Test: `src/game/player/RoachAnimationV3.test.ts`

**Interfaces:**
- Consumes: stable state keys.
- Produces: explicit cadence/fallback mapping for ground, air, wall and reaction families.

- [ ] Extend tests to distinguish idle/walk/run cadence and verify wall/reaction mappings.
- [ ] Run `npm test`; expect failure for missing mappings.
- [ ] Map existing premium body frames as temporary production fallbacks without treating the conceptual sheet as final art.
- [ ] Keep wing assets independently addressable and optional.
- [ ] Run `npm test` and `npm run build`; expect PASS.
- [ ] Commit `feat(V3): map premium roach motion families`.

### Task 5: Physics Invariant Regression Gate

**Files:**
- Create: `src/game/player/RoachAnimationPhysicsGate.test.ts`
- Modify: `scripts/run-pure-tests.mjs`
- Modify: `tsconfig.pure.json`

**Interfaces:**
- Consumes: V3 animation contracts and existing Player scale/body contracts.
- Produces: regression evidence that animation cannot alter locked physics values.

- [ ] Add assertions for visual `0.500`, body `30x18`, offset `17,42`, and presentation-only authority.
- [ ] Add wing-legality assertions across all canonical states.
- [ ] Run `npm test`; expect PASS only when all V3 invariants coexist.
- [ ] Run `npm run build`; expect successful TypeScript/Vite build.
- [ ] Commit `test(V3): gate animation against locked player physics`.

### Task 6: Browser/Deployment Acceptance

**Files:**
- Modify only if fresh runtime evidence identifies a defect.

**Interfaces:**
- Consumes: completed Tasks 1–5.
- Produces: deployable V3 animation runtime ready for final binary-art replacement.

- [ ] Verify the branch HEAD receives a successful Vercel deployment.
- [ ] Inspect normal-scale behavior for idle/walk/run distinction, leg/antenna life, wall states and flight transitions.
- [ ] Confirm wings disappear immediately after leaving flap/glide and never reveal baked open wings underneath.
- [ ] Confirm no spawn/fall-loop, collider, camera, or traversal regression.
- [ ] Record concrete acceptance evidence in PR #77; do not declare PASS for checks not actually executed.

## Self-review
Spec coverage: all state families, wing separation, motion language, asset fallback, physics invariants and testing requirements are assigned. Type flow is one-way: gameplay state -> pure descriptor -> presentation channels. Binary-art generation remains intentionally outside code correctness, allowing final PNG replacement without redesigning gameplay or state interfaces.

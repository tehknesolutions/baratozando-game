# ENV-07A Horror/Tension Core Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the deterministic TENSION brain for BARATOZANDO and integrate it into FirstThreat without changing player/enemy mechanics.

**Architecture:** A pure `HorrorReactiveState` consumes an immutable input sample and resolves a normalized tension value plus semantic band. `FirstThreatScene` constructs samples from the already-existing chase state, threat gap, damage/respawn state and optional zone intensity; presentation reads the result. ENV-07A does not implement FEAR or Modo Barata Tonta yet, but creates the stable output those stages will consume.

**Tech Stack:** TypeScript 5.9, Phaser 3.90, Node pure-test runner, Vite.

**Spec:** `docs/superpowers/specs/2026-09-23-env-07-reactive-horror-design.md`

## Global Constraints
- No `Math.random` in ENV-07 core state.
- TENSION is always clamped to `0..1`.
- Same ordered input samples produce the same output.
- ENV-07A mutates no player/enemy gameplay, physics or colliders.
- Cosmetic horror does not degrade input fidelity.
- Respawn/reset returns transient tension to a defined safe baseline.
- Player readability/depth `50` remains unchanged.
- ENV-07A does not implement FEAR, Barata Tonta, Panic Flight or GHOWL.

## Review Focus
- Negative/NaN/infinite gap values: resolver must sanitize rather than emit NaN/out-of-range tension.
- Invalid authored zone intensity: clamp to `0..1`.
- `ESCAPED` and respawn: tension must return toward/snap to safe baseline instead of retaining chase panic.
- `CAUGHT`: output remains deterministic and bounded even at zero gap.
- Repeated identical samples: output and band are identical with no hidden time/random state.

---

### Task 1: Pure HorrorReactiveState contract

**Files:**
- Create: `src/game/horror/HorrorReactiveState.ts`
- Create: `src/game/horror/HorrorReactiveState.test.ts`
- Modify: `tsconfig.pure.json`
- Modify: `scripts/run-pure-tests.mjs`

**Interfaces:**
- Consumes: `ThreatChaseState` from `src/game/threat/ThreatChaseController.ts`.
- Produces: `resolveHorrorReactiveState(input: HorrorReactiveInput): HorrorReactiveOutput` where output is `{ tension: number; band: HorrorTensionBand }` and `HorrorTensionBand = 'CALM' | 'OMEN' | 'ALERT' | 'DANGER' | 'CHASE' | 'PANIC'`.

- [ ] **Step 1: Write the failing pure test**

Create `src/game/horror/HorrorReactiveState.test.ts` with assertions covering dormant calm, warning omen/alert, chase proximity escalation, caught panic, escaped safe output, zone clamping, respawn override, malformed gaps and repeated-sample determinism. Use Node `assert/strict`; explicitly assert every returned tension is finite and in `0..1`.

- [ ] **Step 2: Register the test and compile scope**

Add `src/game/horror/*.ts` to `tsconfig.pure.json` `include`. Add `.test-dist/game/horror/HorrorReactiveState.test.js` to the `tests` array in `scripts/run-pure-tests.mjs`.

- [ ] **Step 3: Run the suite and verify RED**

Run: `npm test`

Expected: TypeScript/test failure because `HorrorReactiveState.ts` or its exports do not exist yet.

- [ ] **Step 4: Implement the minimal deterministic resolver**

Create `src/game/horror/HorrorReactiveState.ts`. Define `clamp01`, sanitize non-finite inputs, derive a proximity factor from a fixed authored danger distance, map chase states to base pressure, combine `max(basePressure, proximityPressure, zoneIntensity)` with a bounded recent-damage bump, and force safe output while respawning/escaped. Map normalized tension to the six semantic bands with fixed thresholds. Do not store mutable module state and do not use time or randomness.

Required public shape:

```ts
export type HorrorTensionBand = 'CALM' | 'OMEN' | 'ALERT' | 'DANGER' | 'CHASE' | 'PANIC';

export type HorrorReactiveInput = {
  chaseState: ThreatChaseState;
  threatGap: number;
  recentDamage: boolean;
  respawning: boolean;
  zoneIntensity?: number;
};

export type HorrorReactiveOutput = {
  tension: number;
  band: HorrorTensionBand;
};

export function resolveHorrorReactiveState(input: HorrorReactiveInput): HorrorReactiveOutput;
```

- [ ] **Step 5: Run pure tests and verify GREEN**

Run: `npm test`

Expected: all existing tests plus `HorrorReactiveState.test.js` pass.

- [ ] **Step 6: Commit Task 1**

```bash
git add src/game/horror/HorrorReactiveState.ts src/game/horror/HorrorReactiveState.test.ts tsconfig.pure.json scripts/run-pure-tests.mjs
git commit -m "ENV-07A: add deterministic horror tension core"
```

### Task 2: FirstThreat integration without gameplay mutation

**Files:**
- Modify: `src/game/scenes/FirstThreatScene.ts`
- Create: `scripts/environment-reactive-horror-contract.test.mjs`
- Modify: `scripts/run-pure-tests.mjs`

**Interfaces:**
- Consumes: `resolveHorrorReactiveState(...)` from Task 1 and existing `ThreatChaseController`, player damage/respawn and danger visual handles.
- Produces: scene-local current horror output used only by presentation in ENV-07A.

- [ ] **Step 1: Write the failing integration contract**

Create `scripts/environment-reactive-horror-contract.test.mjs`. Read `HorrorReactiveState.ts` and `FirstThreatScene.ts`. Assert the core contains no `Math.random`, `physics.`, `.add.collider` or `.add.overlap`; assert the scene imports/calls `resolveHorrorReactiveState`; assert it supplies `this.chase.state`, a threat gap, damage/respawn facts; assert `this.player.setDepth(50)` remains present. Also assert no Barata Tonta/Panic Flight implementation tokens are introduced by ENV-07A.

- [ ] **Step 2: Register the contract and verify RED**

Add `scripts/environment-reactive-horror-contract.test.mjs` to the `contracts` array in `scripts/run-pure-tests.mjs`.

Run: `npm test`

Expected: contract fails because `FirstThreatScene` is not wired to the resolver.

- [ ] **Step 3: Wire FirstThreatScene**

Import `resolveHorrorReactiveState` and its output type. Add a scene-local horror state initialized to `{ tension: 0, band: 'CALM' }`. After chase update, compute gap as `Math.max(0, this.player.x - this.chase.threatX)` and resolve tension from current chase state, gap, `this.player.damage.isHurt(time)`, `this.player.damage.respawning`, and zone intensity `0`. Reset the scene-local horror output in `resetChase()`.

Do not alter `ThreatChaseController`, player velocity, damage, colliders or input.

- [ ] **Step 4: Make existing danger presentation consume TENSION without changing ceilings**

In `updateDangerVisual`, preserve the existing `resolveDangerVisual` behavior and use the scene-local `tension` only as a bounded presentation amplifier. Overlay must remain `<= 0.22`, amber must remain within the existing readable range, and dust must remain `<= 0.28`. The gameplay path remains untouched.

- [ ] **Step 5: Run all tests**

Run: `npm test`

Expected: all contracts and pure tests pass.

- [ ] **Step 6: Build production bundle**

Run: `npm run build`

Expected: TypeScript and Vite build succeed with exit code `0`.

- [ ] **Step 7: Commit Task 2**

```bash
git add src/game/scenes/FirstThreatScene.ts scripts/environment-reactive-horror-contract.test.mjs scripts/run-pure-tests.mjs
git commit -m "ENV-07A: wire reactive tension into FirstThreat"
```

### Task 3: Runtime/readability gate

**Files:**
- Modify only if a verified defect is found in Task 1/2 files.

**Interfaces:**
- Consumes: completed ENV-07A integration.
- Produces: release evidence for the ENV-07A PR.

- [ ] **Step 1: Start the production preview**

Run: `npm run build && npm run preview -- --port 4173`

Expected: preview server starts successfully.

- [ ] **Step 2: Inspect FirstThreat runtime**

Verify CALM before trigger, visible but restrained WARNING escalation, stronger CHASING response as threat gap closes, PANIC/CAUGHT ceiling without obscuring the player, and reset after respawn/escape. Confirm player remains depth `50` and input/movement feel unchanged.

- [ ] **Step 3: Inspect MobilityLabV2 regression**

Verify ENV-06 ambience still runs and ENV-07A introduces no enemy/tension behavior there yet.

- [ ] **Step 4: Run final verification**

Run: `npm test && npm run build`

Expected: both commands exit `0`.

- [ ] **Step 5: Commit any verification-only correction if required**

If runtime inspection exposed a defect, fix only the responsible ENV-07A file, rerun Step 4, and commit with a narrowly descriptive message. If no defect exists, create no empty commit.

## Completion Gate
ENV-07A is complete only when the pure resolver is deterministic, all normalized/error inputs are bounded, FirstThreat consumes the resolver without gameplay mutation, all tests pass, production build passes, and runtime inspection confirms readable escalation/reset. ENV-07B (FEAR) starts only after this gate is merged/reviewed.

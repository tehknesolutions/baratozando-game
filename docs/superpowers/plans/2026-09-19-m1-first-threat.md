# M1 First Threat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first deterministic chase sequence to BARATOZANDO without introducing combat or adaptation systems.

**Architecture:** A pure `ThreatChaseController` owns all chase timing/state math and is tested without Phaser. `FirstThreatScene` renders the threat and reacts to controller state while reusing `Player`, movement, damage and existing procedural environment patterns.

**Tech Stack:** Phaser 3.90, TypeScript, pure Node/TypeScript test runner.

**Spec:** `docs/superpowers/specs/2026-09-19-m1-first-threat-design.md`

## Global Constraints

- Preserve M0 movement values and player APIs.
- No new runtime dependency.
- No combat or Adaptation Engine.
- Chase timing must be timestamp-based, not frame-count based.
- Catch must reuse the existing death/respawn behavior.

## Review Focus

- Player crosses trigger then immediately retreats: warning still progresses once triggered.
- Large frame delta: threat position remains deterministic from elapsed time.
- Player reaches escape boundary on same update catch would occur: escape wins.
- Caught state must not repeatedly damage/kill each frame.
- Respawn/reset must restore threat and allow a second chase attempt.

---

### Task 1: Pure chase state machine

**Files:**
- Create: `src/game/threat/ThreatChaseController.test.ts`
- Create: `src/game/threat/ThreatChaseController.ts`
- Modify: `scripts/run-pure-tests.mjs`

**Interfaces:**
- Produces: `ThreatChaseController`, `ThreatChaseState`, `ThreatChaseConfig`, `update(nowMs, playerX)`, `reset()`.

- [ ] Write failing tests for trigger/warning/chasing, deterministic position, escape priority, catch and reset.
- [ ] Run `npm test` and verify RED because controller module is absent.
- [ ] Implement minimal timestamp-based controller.
- [ ] Run `npm test` and verify GREEN.

### Task 2: M1 layout invariants

**Files:**
- Create: `src/game/world/FirstThreatLayout.test.ts`
- Create: `src/game/world/FirstThreatLayout.ts`
- Modify: `scripts/run-pure-tests.mjs`

**Interfaces:**
- Produces: `FIRST_THREAT_LAYOUT` including spawn, platforms, checkpoint, trigger and escape coordinates.

- [ ] Write failing tests proving trigger < escape, pre-chase checkpoint < trigger, width contains escape and maximum authored upward step remains reachable.
- [ ] Run `npm test` and verify RED because layout module is absent.
- [ ] Implement minimal layout derived from M0 route.
- [ ] Run full test suite and verify GREEN.

### Task 3: Procedural threat presentation and scene

**Files:**
- Create: `src/game/threat/AncientPredator.ts`
- Create: `src/game/scenes/FirstThreatScene.ts`
- Modify: `src/game/scenes/BootScene.ts`
- Modify: `src/main.ts`

**Interfaces:**
- Consumes: `ThreatChaseController`, `FIRST_THREAT_LAYOUT`, existing `Player`.
- Produces: playable Phaser scene `first-threat`.

- [ ] Wire the controller to a giant procedural silhouette and `CORRA.` warning.
- [ ] Reuse player damage/respawn; catch calls `player.takeDamage()` enough to enter death once, then waits for respawn/reset.
- [ ] Switch BootScene to M1 and register FirstThreatScene.
- [ ] Run `npm test` and `npm run build:offline`.

### Task 4: M1 verification docs

**Files:**
- Create: `docs/M1-STATUS.md`
- Create: `docs/M1-PLAYTEST.md`

- [ ] Record automated evidence and environment limitations honestly.
- [ ] Add human chase-playtest checklist for readability, tension, fairness and clean retry.
- [ ] Re-run `npm test` and `npm run build:offline` before handoff.

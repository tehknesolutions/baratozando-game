# M0 Cockroach Movement Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a one-room Phaser 3.90 movement laboratory proving BARATOZANDO's cockroach locomotion, dodge, hurt, death, and fast respawn loop.

**Architecture:** Phaser owns rendering/Arcade Physics and scene composition. Deterministic player rules live in small pure TypeScript modules so timing/state transitions can be driven by tests; the Phaser `Player` class adapts those rules to velocity, collisions, sprite state, and camera.

**Tech Stack:** Phaser 3.90.x, TypeScript, Vite, Vitest, Arcade Physics, PNG assets from Asset Pack V0.1.

**Spec:** `docs/superpowers/specs/2026-09-19-m0-cockroach-movement-lab-design.md`

## Global Constraints

- World grid is exactly 32×32.
- Player visual canvas is 64×64 with origin `(0.5, 1.0)`.
- Phaser rendering uses `pixelArt: true`, `roundPixels: true`, `antialias: false`.
- Movement baseline: walk 105, run 185, ground accel 1200, ground decel 1500, air accel 700, gravity 1050, jump -360, fall cap 520 px/s.
- Coyote time 100 ms; jump buffer 110 ms; variable jump cut multiplier 0.48.
- Dodge: 160 ms, 330 px/s, 420 ms cooldown, no invulnerability.
- M0 HP 3; hazard damage 1; hurt lock 220 ms; post-hurt protection 700 ms.
- M0 excludes enemies, attacks, adaptation, power-ups, inventory, metamorphosis, backend, procedural generation, and touch UI.

## Review Focus

- A held jump key must not repeatedly auto-jump; jump intent is edge-triggered while jump buffering still works.
- Walking off a ledge must allow a jump for at most 100 ms and not beyond it.
- Pressing dodge during cooldown must leave normal movement active rather than freezing the player.
- Hazard overlap during the 700 ms protection window must not remove extra HP.
- Respawn must restore HP and position while clearing stale velocity/timers so death cannot immediately retrigger.

---

### Task 1: Project shell and deterministic configuration

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `index.html`
- Create: `src/game/player/PlayerMovementConfig.ts`
- Test: `src/game/player/PlayerMovementConfig.test.ts`

**Interfaces:**
- Produces: `PLAYER_MOVEMENT_CONFIG` and `validateMovementConfig()`.

- [ ] Write tests asserting exact spec values and rejecting invalid/non-positive timing/speed values.
- [ ] Run the test and verify RED because the module does not exist.
- [ ] Implement the config and validator minimally.
- [ ] Run the test and full suite; verify GREEN.
- [ ] Commit `chore: scaffold Phaser movement lab`.

### Task 2: Input edge model and movement timers

**Files:**
- Create: `src/game/input/InputController.ts`
- Create: `src/game/player/MovementTimers.ts`
- Test: `src/game/player/MovementTimers.test.ts`

**Interfaces:**
- Consumes: `PLAYER_MOVEMENT_CONFIG`.
- Produces: `PlayerIntent`, `MovementTimers.update()`, `canConsumeBufferedJump()`, `canCoyoteJump()`, `tryStartDodge()`.

- [ ] Write tests for jump edge/buffer expiration, coyote expiration, dodge cooldown, and dodge during cooldown.
- [ ] Run and verify RED.
- [ ] Implement timer state and input intent types.
- [ ] Run task tests + suite; verify GREEN.
- [ ] Commit `feat: add movement timing rules`.

### Task 3: Player state resolution

**Files:**
- Create: `src/game/player/PlayerState.ts`
- Create: `src/game/player/PlayerStateMachine.ts`
- Test: `src/game/player/PlayerStateMachine.test.ts`

**Interfaces:**
- Consumes: grounded/velocity/input/dodge/hurt/death facts.
- Produces: `resolvePlayerState(facts): PlayerState`.

- [ ] Write tests for IDLE/WALK/RUN/JUMP/FALL/DODGE/HURT/DEATH precedence.
- [ ] Run and verify RED.
- [ ] Implement pure state resolver with lifecycle precedence `DEATH > HURT > DODGE > airborne > grounded`.
- [ ] Run task tests + suite; verify GREEN.
- [ ] Commit `feat: add player state resolver`.

### Task 4: Damage and respawn lifecycle

**Files:**
- Create: `src/game/player/PlayerDamageController.ts`
- Test: `src/game/player/PlayerDamageController.test.ts`

**Interfaces:**
- Produces: `damage(now)`, `tick(now)`, `beginRespawn()`, `completeRespawn()`, HP/lifecycle getters.

- [ ] Write tests for single damage, 700 ms protection, lethal damage, and complete respawn resetting HP/lifecycle.
- [ ] Run and verify RED.
- [ ] Implement minimal damage lifecycle.
- [ ] Run task tests + suite; verify GREEN.
- [ ] Commit `feat: add damage and respawn lifecycle`.

### Task 5: Phaser integration and one-room lab

**Files:**
- Create: `src/main.ts`
- Create: `src/game/scenes/BootScene.ts`, `src/game/scenes/MovementLabScene.ts`
- Create: `src/game/input/KeyboardInputAdapter.ts`
- Create: `src/game/player/Player.ts`, `src/game/player/PlayerAnimationController.ts`
- Create: `src/game/world/MovementLabLayout.ts`, `src/game/world/Hazard.ts`, `src/game/world/Checkpoint.ts`
- Create: `src/assets/assetKeys.ts`
- Copy: prototype player frames to `public/assets/player/`

**Interfaces:**
- Consumes all Tasks 1–4.
- Produces a playable room implementing keyboard movement, camera, collision, hazard, checkpoint, hurt/death/respawn.

- [ ] Add a lightweight integration test that imports `MovementLabLayout` and asserts room bounds/platform/hazard/checkpoint invariants; verify RED.
- [ ] Implement static room layout as data first, then Phaser scene composition.
- [ ] Implement player acceleration, jump buffer/coyote/variable jump, dodge, fall cap, state/animation mapping, damage/respawn.
- [ ] Add atmospheric silhouettes/fog/amber light with geometry/graphics only; do not add gameplay scope.
- [ ] Run task test + full suite; verify GREEN.
- [ ] Commit `feat: build M0 cockroach movement lab`.

### Task 6: Production verification and handoff

**Files:**
- Modify: `README.md`
- Create: `docs/M0-PLAYTEST.md`

**Interfaces:**
- Produces: reproducible run/build instructions and manual acceptance checklist.

- [ ] Run `npm test` and record zero failures.
- [ ] Run `npm run build` and require exit 0.
- [ ] Serve `dist/` locally and smoke-check `index.html` plus emitted JS/assets via HTTP.
- [ ] Verify source has no forbidden M1 systems.
- [ ] Document controls and manual playtest checklist.
- [ ] Commit `docs: add M0 playtest handoff`.

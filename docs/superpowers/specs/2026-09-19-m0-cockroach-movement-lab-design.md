# BARATOZANDO — M0 Cockroach Movement Lab Design

**Project:** BARATOZANDO / Roachin' Around  
**Studio:** Tehkné Solutions  
**Milestone:** M0 — Cockroach Movement Lab  
**Status:** DESIGN APPROVAL CANDIDATE  
**Date:** 2026-09-19

## 1. Purpose

Prove that controlling the protagonist is enjoyable before combat, adaptation, inventory, enemies, procedural systems, or content expansion are added.

M0 succeeds only if movement alone communicates the protagonist fantasy: a small, nervous, fast, resilient cockroach navigating a giant hostile environment.

## 2. Scope

M0 contains exactly one playable room and these player states:

`BOOT → IDLE → WALK → RUN → JUMP → FALL → DODGE → HURT → DEATH → RESPAWN`

M0 also contains:

- one static test room;
- platform and wall collision;
- one non-combat damage hazard;
- one checkpoint/respawn point;
- horizontal camera follow;
- subtle camera look-ahead;
- keyboard input;
- gamepad-ready input abstraction;
- placeholder atmospheric background layers;
- approved prototype cockroach frames from Asset Pack V0.1.

M0 explicitly excludes:

- enemies;
- attack/combat implementation;
- Adaptation Engine;
- power-ups;
- inventory;
- metamorphosis;
- dialogue;
- save slots;
- backend/login;
- procedural generation;
- mobile touch UI.

## 3. Technical Stack

- Phaser 3.90.x
- TypeScript
- Vite
- Arcade Physics
- Tiled JSON-compatible 32×32 world grid
- 64×64 transparent player frame canvas
- Vercel-compatible static build

Phaser configuration:

- `pixelArt: true`
- `roundPixels: true`
- `antialias: false`
- transparent PNG assets

## 4. Player Visual Contract

World tile grid: `32×32`.

Player animation frame canvas: `64×64`.

Approximate visible body target:

- height: ~32 px;
- length: ~48 px;
- antennae may extend beyond the physical body.

Player origin:

- `x = 0.5`
- `y = 1.0`

Prototype physics body:

- width: 30 px;
- height: 18 px;
- offsetX: 17 px;
- offsetY: 42 px.

The visual sprite may be larger than the collision body. Antennae never affect collision.

## 5. Control Philosophy

The cockroach must feel quick without feeling slippery.

The user should be able to distinguish three movement moods:

1. **Cautious exploration** — slow walk.
2. **Normal traversal** — fast ground movement.
3. **Panic escape** — run + dodge + jump chained fluidly.

Movement must prioritize responsiveness over physical realism.

## 6. Input Contract

Initial keyboard bindings:

- `A / Left Arrow`: move left
- `D / Right Arrow`: move right
- `Shift`: run
- `Space`: jump
- `Ctrl` or `K`: dodge
- `R`: debug respawn

Input is read through a dedicated `InputController`, not directly inside the player state code.

The API must allow later gamepad/touch adapters without rewriting player movement.

## 7. Movement Values — Initial Tuning Baseline

These are tuning defaults, not immutable canon.

- walk speed: `105 px/s`
- run speed: `185 px/s`
- ground acceleration: `1200 px/s²`
- ground deceleration: `1500 px/s²`
- air acceleration: `700 px/s²`
- gravity: `1050 px/s²`
- jump velocity: `-360 px/s`
- max fall speed: `520 px/s`
- coyote time: `100 ms`
- jump buffer: `110 ms`
- variable jump cut multiplier: `0.48`

The implementation must centralize these values in `PlayerMovementConfig`.

## 8. Dodge

Dodge expresses cockroach survival instinct.

Initial behavior:

- duration: `160 ms`
- speed: `330 px/s`
- cooldown: `420 ms`
- uses current facing direction if no directional input exists;
- temporarily suppresses normal horizontal acceleration;
- may leave the ground edge during dodge;
- does not grant combat invulnerability in M0.

M0 dodge is movement-only. Invulnerability frames are deferred to combat milestones.

## 9. Jump Feel

Jump must include:

- coyote time;
- jump buffering;
- variable jump height;
- fast transition from rising to falling;
- readable takeoff/landing feedback.

The game should accept a jump command shortly before landing and immediately execute it on contact.

Short taps create short jumps. Holding jump creates the full jump.

## 10. State Model

Player runtime states:

### BOOT
Initialize physics, input, spawn point, animation controller.

### IDLE
Grounded with no horizontal input.

### WALK
Grounded movement without run modifier.

### RUN
Grounded movement with run modifier.

### JUMP
Vertical velocity is upward.

### FALL
Player is airborne and no longer rising.

### DODGE
Temporary high-speed movement override.

### HURT
Short movement lock after environmental damage.

### DEATH
Movement input disabled; death animation/effect plays.

### RESPAWN
Reset player to checkpoint and return to IDLE.

State changes must be decided by one state machine/controller. Animations consume state; animations do not decide movement state.

## 11. Health and Damage — M0 Only

M0 uses a temporary health model solely to test hurt/death/respawn.

- max HP: `3`
- test hazard damage: `1`
- hurt lock: `220 ms`
- post-hurt protection: `700 ms`

M0 health is not the final HUD design and does not implement Adaptive Stress.

## 12. Respawn

One checkpoint exists in the room.

On death:

1. disable movement input;
2. play death state;
3. wait briefly;
4. reset velocity;
5. restore HP;
6. move player to checkpoint;
7. restore camera/player control;
8. return to IDLE.

Respawn must be fast enough to encourage experimentation.

## 13. Camera

Camera requirements:

- smooth follow;
- no visible subpixel jitter;
- modest horizontal look-ahead toward facing direction;
- slight vertical freedom during jump;
- clamp to room bounds;
- no cinematic camera logic in M0.

The protagonist should occupy approximately the lower-middle portion of the frame during standard traversal.

## 14. Test Room

The single M0 room must contain:

- flat starting zone;
- low step;
- short gap;
- elevated ledge;
- narrow platform;
- descending section;
- damage hazard;
- checkpoint;
- final run corridor.

The room exists to expose movement problems, not to be beautiful.

Recommended room length: ~50–70 world tiles.

## 15. Visual Atmosphere

Even in greybox, the room must preserve the approved dark identity:

- charcoal foreground;
- low-key ambient lighting;
- warm amber backlight;
- fog/parallax silhouettes;
- oversized domestic/industrial shapes in the background;
- restrained particle dust.

Atmosphere must not obscure platforms or collision readability.

## 16. Animation Contract

Target prototype animation timing:

- idle: 4 frames @ 6 fps, loop
- walk: 6 frames @ 8 fps, loop
- run: 8 frames @ 12 fps, loop
- jump: 4 frames @ 10 fps
- fall: 2 frames @ 8 fps, loop
- dodge: 5 frames @ 14 fps
- hurt: 3 frames @ 8 fps
- death: 6 frames @ 8 fps

Missing final frames may temporarily reuse/duplicate approved prototype frames. Movement validation must not be blocked by final art cleanup.

## 17. Architecture

Recommended modules:

```text
src/
  game/
    scenes/
      BootScene.ts
      MovementLabScene.ts
    player/
      Player.ts
      PlayerState.ts
      PlayerStateMachine.ts
      PlayerMovementConfig.ts
      PlayerAnimationController.ts
      PlayerDamageController.ts
    input/
      InputController.ts
      KeyboardInputAdapter.ts
    world/
      Checkpoint.ts
      Hazard.ts
      MovementLabLayout.ts
  assets/
    assetKeys.ts
  main.ts
```

Responsibilities must stay isolated:

- `InputController` exposes intent.
- `PlayerStateMachine` decides current state.
- `Player` applies physics.
- `PlayerAnimationController` maps state → animation.
- `PlayerDamageController` handles HP/hurt/death lifecycle.
- scene composes the room and systems.

## 18. Data Flow

Per simulation frame:

1. input adapter updates intent;
2. player reads intent;
3. movement timers update;
4. state machine resolves movement state;
5. physics velocity is updated;
6. Arcade Physics resolves collision;
7. grounded/contact data is updated;
8. animation controller reads resolved state;
9. camera follows player.

Damage events bypass ordinary movement only for HURT/DEATH lifecycle.

## 19. Testing Strategy

Automated tests should cover pure logic wherever possible:

- movement config validity;
- state transition rules;
- coyote time;
- jump buffering;
- dodge cooldown;
- damage protection window;
- death → respawn lifecycle.

Manual playtest checklist:

- walking starts/stops responsively;
- running is clearly faster than walking;
- reversing direction does not feel slippery;
- short/full jumps are distinct;
- coyote jump works at platform edge;
- buffered jump works before landing;
- dodge can chain naturally into run/jump;
- hazard damage cannot rapid-fire through protection window;
- death/respawn is fast;
- sprite does not visibly jitter;
- camera does not reveal outside room bounds.

## 20. Definition of Done

M0 is complete only when:

1. production build succeeds;
2. automated movement-state tests pass;
3. the entire room can be traversed without debug controls;
4. hurt/death/respawn works repeatedly;
5. keyboard input is stable;
6. game can be served as a static Vite build;
7. movement is subjectively fun enough to continue into M1.

## 21. M1 Gate

M1 — First Threat may start only after M0 is accepted.

M1 introduces the first chase/threat and tests the fantasy:

**“MEU DEUS, CORRE!”**

No Adaptation Engine is added until basic movement and threat interaction are proven.

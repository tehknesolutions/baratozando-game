# ENV-07 — Reactive Horror Direction Design

**Status:** Approved design
**Date:** 2026-09-23
**Baseline:** `022c3918d7d72095adc5e26070e3d847f41fa617` (ENV-06)

## Intent

BARATOZANDO should make danger feel physically legible through the cockroach before danger becomes a conventional UI message. Horror is reactive: environments, enemies, and the roach respond to proximity, pursuit, damage, vulnerability, and tension zones. The roach's fear is not merely a penalty. At extreme fear it activates recognizable cockroach survival behavior: frantic motion, stronger escape capability, increased offensive survival response, and emergency use of the wings.

The player must retain precise control. Presentation may look desperate and chaotic, but cosmetic horror must never silently degrade input fidelity.

## Core model

ENV-07 separates external dramatic pressure from the roach's internal response.

`world/enemy signals -> HorrorReactiveState -> TENSION 0..1`

`TENSION + exposure/recovery -> RoachFearState -> FEAR 0..1`

`FEAR -> survival thresholds -> movement/combat/wing presentation`

TENSION and FEAR are deliberately different values. A room can foreshadow danger before the roach panics, and fear can persist briefly after the external threat falls.

## ENV-07A — Horror/Tension Core

Introduce a deterministic `HorrorReactiveState` that consumes already-existing gameplay facts rather than owning gameplay rules. Initial inputs are threat/chase state, threat distance, recent damage, respawn/recovery state, and optional authored tension-zone intensity.

The output is normalized to `0..1` and includes a semantic band suitable for presentation (`CALM`, `OMEN`, `ALERT`, `DANGER`, `CHASE`, `PANIC`). Values are clamped, deterministic, and independent of frame-rate-specific randomness.

The first integration target is `FirstThreatScene`, which already exposes chase state, threat position, damage/HP and danger presentation. `MobilityLabV2` may consume authored tension zones later without inventing an enemy.

## ENV-07B — Roach Fear

Introduce `RoachFearState`. Fear rises from sustained tension, direct threat exposure, chase and damage shocks; it falls with hysteresis after safety returns. It must not equal TENSION directly. This prevents flicker at thresholds and preserves the emotional tail of an encounter.

Fear exposes normalized `fear` and a small semantic state family: `CALM`, `ALERT`, `FEAR`, `PANIC`, `SURVIVAL_PANIC`.

Damage can spike fear, but repeatedly taking damage must not become the optimal way to charge the system. Proximity, pursuit, being cornered and authored horror events are the primary sources.

## ENV-07C — Survival Instinct

High FEAR activates survival benefits rather than pure debuffs. Initial balance values remain configuration, not immutable canon. The system may boost run speed/acceleration and attack survival output at high thresholds, but buffs must be capped and testable.

The key rule is: fear makes the roach more intensely cockroach-like, not less controllable.

## ENV-07D — Panic Flight

Panic Flight is **not free flight**.

It is aerial platforming inspired by a float/multi-jump feel: the wings provide discrete emergency flaps and controlled fall extension while gravity and level geometry remain authoritative.

Canonical movement vocabulary:

`ground jump -> PANIC FLAP -> optional additional PANIC FLAPS -> WING GLIDE -> landing`

Fear thresholds determine availability/capacity. A low fear state may expose no wing assistance; increasing fear may unlock progressively more emergency aerial impulses. Exact flap counts and force values are tuning parameters until playtested.

Holding the jump action during eligible airborne states can reduce fall speed through `WING GLIDE`. Pressing the jump action in air can consume a `PANIC FLAP` charge and produce a bounded upward impulse. Horizontal control remains precise.

Landing resets the aerial panic sequence according to the movement contract. The feature must not allow indefinite hovering, map bypass, or infinite altitude gain.

## ENV-07E — Roach Ghowl / Wing Shockwave

`GHOWL` is a stylized BARATOZANDO survival action combining violent wing vibration and bodily panic response. At low intensity it is presentation. At sufficiently high fear it may create a short-range defensive shockwave/interrupt and aerial recoil.

GHOWL must have explicit resource/cooldown constraints and must not become an unlimited stun loop. Exact damage, knockback and cooldown values are balance parameters.

## ENV-07F — Reactive Enemy Horror

Threats should communicate intent instead of jumping directly from idle to chase. The desired dramatic vocabulary is:

`IDLE -> SUSPICIOUS -> INVESTIGATE -> SPOT -> FREEZE -> PREPARE -> ATTACK/CHASE -> SEARCH -> RELEASE`

Not every enemy must implement every state. The important contract is readable anticipation: freeze, orientation and preparation can create terror before acceleration/attack. Enemy presentation can become more intense with TENSION, but combat truth remains owned by enemy/gameplay systems.

## ENV-07G — Reactive Environment

ENV-06's deterministic ambience becomes a consumer of TENSION. Flicker, haze breathing, shadows, dust and selected drips can modulate within readability ceilings. The reactive layer may amplify presentation but cannot add physics, colliders or hidden gameplay effects.

Player readability remains protected: environmental effects stay below player depth `50` unless an explicitly reviewed foreground effect requires otherwise.

## ENV-07H — Encounter Choreography

Authored encounters coordinate environmental foreshadowing, enemy anticipation, roach fear and escape routes. Some spaces may contain panic routes reachable through temporary wing-assisted movement, but required progression must not depend on accidental fear farming unless the encounter explicitly guarantees the required fear state.

The desired horror rhythm is:

`CALM -> OMEN -> SUSPICION -> REVEAL -> CHASE/PANIC -> ESCAPE -> RECOVERY`

## ENV-07I — Cinematic Polish and Balance

Tune curves only after the deterministic contracts work. Camera shake, vignette, animation intensity, wing motion, particles and audio hooks are presentation consumers. They must have ceilings so maximum panic remains readable rather than becoming visual noise.

## Data ownership and isolation

- `HorrorReactiveState` reads gameplay facts and produces tension; it does not mutate player/enemy gameplay.
- `RoachFearState` owns fear accumulation/decay and semantic fear bands.
- Player movement/combat explicitly consumes survival modifiers; no visual class may change physics.
- Environment renderers consume tension/fear presentation values only.
- Enemy AI owns enemy decisions; reactive horror presentation may mirror those states but cannot fabricate collision/damage truth.
- All tuning constants live in focused configuration rather than being scattered through scenes.

## Determinism

No ENV-07 core state may use `Math.random`. Given the same ordered input samples and deltas, TENSION/FEAR outputs must be reproducible. Visual ambience may continue deterministic authored sequences/tweens as established by ENV-06.

## Control fidelity

Cosmetic panic cannot inject unrequested movement, random direction changes, missed inputs, input delay or arbitrary control inversion. Apparent desperation belongs primarily to animation, pose, antennae, wings, camera and controlled authored movement abilities.

Actual movement changes are explicit abilities/modifiers with tests and tuning values.

## Failure and recovery rules

- Inputs outside expected normalized ranges are clamped.
- Missing optional zone intensity is treated as zero.
- Respawn/reset returns transient chase/tension/fear state to a defined safe baseline.
- Fear thresholds use hysteresis/decay so presentation does not rapidly toggle at boundaries.
- Panic Flight charges cannot go negative and cannot regenerate indefinitely while airborne.
- GHOWL cannot retrigger before its explicit cooldown/resource gate.

## Testing gates

Each stage receives a contract test before integration. Required global gates remain:

1. deterministic core tests;
2. no `Math.random` in reactive-state core;
3. no visual layer adding physics/colliders;
4. player depth/readability invariant;
5. movement tests for flap/glide ceilings and reset behavior;
6. fear/tension reset and hysteresis tests;
7. full `npm test`;
8. production build;
9. visual/runtime inspection of `FirstThreat` and `MobilityLabV2` when relevant;
10. deployment validation after merged implementation.

## Delivery order

1. ENV-07A — Horror/Tension Core
2. ENV-07B — Roach Fear
3. ENV-07C — Survival Instinct
4. ENV-07D — Panic Flight
5. ENV-07E — Ghowl / Wing Shockwave
6. ENV-07F — Reactive Enemy Horror
7. ENV-07G — Reactive Environment
8. ENV-07H — Encounter Choreography
9. ENV-07I — Cinematic Polish + Balance

Each stage must remain independently reviewable. Later stages consume explicit interfaces from earlier stages rather than reaching into their internals.

## Definition of success

BARATOZANDO communicates escalating danger through world, enemy and roach behavior; the roach becomes recognizably frantic and more survival-capable under extreme fear; Panic Flight behaves as bounded multi-jump/glide rather than free flight; and maximum cinematic horror never sacrifices deterministic behavior, platforming readability or precise player control.

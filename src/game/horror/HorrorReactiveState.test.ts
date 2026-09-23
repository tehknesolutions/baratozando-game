# ENV-07 — Reactive Horror Direction Design

**Status:** Approved design — amended with Modo Barata Tonta
**Date:** 2026-09-23
**Baseline:** `022c3918d7d72095adc5e26070e3d847f41fa617` (ENV-06)

## Intent
BARATOZANDO makes danger physically legible through the cockroach before danger becomes a conventional UI message. External danger produces TENSION; the roach converts that pressure into FEAR. Extreme FEAR activates the canonical **MODO BARATA TONTA**: visually frantic, frighteningly chaotic survival behavior while player control remains precise.

`world/enemy signals -> HorrorReactiveState -> TENSION 0..1`

`TENSION + exposure/recovery -> RoachFearState -> FEAR 0..1`

`FEAR -> BARATA_TONTA -> survival boosts + panic wings + fear output`

TENSION and FEAR are distinct. A space can foreshadow danger before the roach panics, and fear can persist briefly after external danger falls.

## ENV-07A — Horror/Tension Core
Introduce deterministic `HorrorReactiveState`. Inputs: threat/chase state, threat distance, recent damage, respawn/recovery state, optional authored tension-zone intensity. Output is normalized `0..1` plus `CALM | OMEN | ALERT | DANGER | CHASE | PANIC`. Values are clamped and reproducible. First integration target: `FirstThreatScene`.

## ENV-07B — Roach Fear
`RoachFearState` accumulates and decays FEAR with hysteresis. Semantic states: `CALM | ALERT | FEAR | PANIC | BARATA_TONTA`. Damage may spike fear but cannot be the optimal charging strategy; proximity, pursuit, cornering and authored horror events are primary sources.

## ENV-07C — Modo Barata Tonta / Survival Instinct
**MODO BARATA TONTA** is the player-facing identity of maximum survival panic. The roach becomes desperate enough to become frightening to its threats. It may receive capped speed/acceleration and offensive-survival boosts. Presentation becomes frantic — antennae, body, legs and wings — without randomizing or degrading input.

Barata Tonta also introduces **FEAR OUTPUT**: selected enemies can react to the roach's extreme survival display. Enemy response is capability-based: susceptible enemies may hesitate/recoil; larger or resistant enemies may only stagger or acknowledge the display. Boss immunity/resistance is explicit, never assumed.

## ENV-07D — Panic Flight
Panic Flight is **not free flight**. It is bounded aerial platforming: `ground jump -> PANIC FLAP -> optional additional PANIC FLAPS -> WING GLIDE -> landing`. Fear thresholds determine wing assistance. Holding jump during eligible descent can extend/reduce fall; pressing jump airborne can consume a bounded flap charge. Gravity and level geometry remain authoritative. No infinite hover, altitude gain or accidental map bypass.

## ENV-07E — Roach Ghowl / Wing Shockwave
`GHOWL` is a stylized survival action combining violent wing vibration and bodily panic response. At low intensity it is presentation; under Barata Tonta it may produce short-range defensive fear/interrupt/knockback and aerial recoil. Explicit cooldown/resource gates prevent stun loops.

## ENV-07F — Reactive Enemy Horror
Desired dramatic vocabulary: `IDLE -> SUSPICIOUS -> INVESTIGATE -> SPOT -> FREEZE -> PREPARE -> ATTACK/CHASE -> SEARCH -> RELEASE`. Not every enemy implements every state. Enemy AI owns combat truth. Barata Tonta FEAR OUTPUT may feed an explicit enemy fear/reaction interface without fabricating collision or damage.

## ENV-07G — Reactive Environment
ENV-06 deterministic ambience consumes TENSION. Flicker, haze, shadows, dust and selected drips may modulate within readability ceilings. Visual layers add no physics/colliders. Environmental effects remain below player depth `50` unless separately reviewed.

## ENV-07H — Encounter Choreography
Encounters coordinate foreshadowing, enemy anticipation, roach fear, Barata Tonta and escape routes. Desired rhythm: `CALM -> OMEN -> SUSPICION -> REVEAL -> CHASE/PANIC -> BARATA_TONTA -> ESCAPE -> RECOVERY`. Required progression cannot depend on accidental fear farming unless the encounter guarantees the state.

## ENV-07I — Cinematic Polish and Balance
Tune curves only after deterministic contracts work. Camera, vignette, animation intensity, wing motion, particles and audio hooks have ceilings so maximum panic stays readable.

## Data ownership
- `HorrorReactiveState`: reads gameplay facts, produces TENSION, mutates no gameplay.
- `RoachFearState`: owns FEAR accumulation/decay and fear bands.
- Barata Tonta: explicit survival modifier interface; no visual class changes physics.
- Player movement/combat explicitly consumes modifiers.
- Environment consumes presentation values only.
- Enemy AI owns decisions; FEAR OUTPUT is an explicit input to capable enemies.
- Tuning constants remain centralized.

## Determinism and control fidelity
No ENV-07 core state uses `Math.random`. Same ordered inputs and deltas produce the same TENSION/FEAR outputs. Cosmetic panic cannot inject unrequested movement, random direction changes, missed inputs, input delay or control inversion. The roach may **look out of control while remaining tightly controlled by the player**.

## Failure/recovery rules
- Clamp normalized inputs.
- Missing zone intensity = zero.
- Respawn/reset returns transient TENSION/FEAR to safe baseline.
- Fear thresholds use hysteresis.
- Panic Flight charges never go negative or regenerate indefinitely airborne.
- GHOWL obeys explicit cooldown/resource gates.
- FEAR OUTPUT affects only enemies declaring support/resistance behavior.

## Testing gates
1. deterministic core tests;
2. no `Math.random` in reactive core;
3. no visual physics/colliders;
4. player readability invariant;
5. flap/glide ceilings and reset tests;
6. fear/tension reset and hysteresis tests;
7. Barata Tonta activation/deactivation and capped modifier tests;
8. FEAR OUTPUT resistance/capability tests;
9. full `npm test`;
10. production build;
11. runtime inspection of relevant scenes;
12. deployment validation after merge.

## Delivery order
1. ENV-07A — Horror/Tension Core
2. ENV-07B — Roach Fear
3. ENV-07C — **Modo Barata Tonta** / Survival Instinct + FEAR OUTPUT contract
4. ENV-07D — Panic Flight
5. ENV-07E — Ghowl / Wing Shockwave
6. ENV-07F — Reactive Enemy Horror
7. ENV-07G — Reactive Environment
8. ENV-07H — Encounter Choreography
9. ENV-07I — Cinematic Polish + Balance

Each stage is independently reviewable and later stages consume explicit interfaces.

## Definition of success
Danger escalates coherently through world, enemy and roach behavior. At maximum fear the roach enters the memorable **Modo Barata Tonta**: desperate, fast, wing-ready and scary enough to produce fear reactions in susceptible threats, while deterministic platforming and precise player control remain intact.

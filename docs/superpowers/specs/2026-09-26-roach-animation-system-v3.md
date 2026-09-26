# Roach Animation System V3 — Design Spec

## Goal
Make the BARATOZANDO protagonist read as a living cockroach in every gameplay state while preserving the already locked physics contract.

## Canonical invariants
- Visual scale remains `0.500`.
- Arcade body remains `30x18`.
- Body offset remains `17,42`.
- Animation is presentation-only and cannot resize, translate, teleport, or otherwise mutate the physics body.
- The terrestrial/body base contains no exposed/open wings.
- Wings are a separate visual concern and are visible only in `WING_FLAP` and `GLIDE`.
- Legs and antennae must visibly change pose across locomotion frames rather than relying on whole-sprite translation.

## State families
1. Ground: `IDLE`, `WALK`, `RUN`.
2. Air/body-only: `JUMP`, `FALL`.
3. Air/winged: `WING_FLAP`, `GLIDE`.
4. Wall: `WALL_CLING`, `WALL_CLIMB`, `WALL_JUMP`.
5. Reactions: `DODGE`, `HURT`, `DEATH`, `RESPAWN`.

## Visual architecture
`RoachVisual` remains the presentation root attached to Player. `PlayerAnimationController` resolves gameplay state into a visual animation descriptor. V3 formalizes two channels: `body` and `wings`. The body channel is always authoritative for silhouette, legs and antennae; the wings channel defaults hidden and may become visible only for `WING_FLAP` or `GLIDE`.

Until final binary art is available, the runtime must support the contract without pretending conceptual sheets are production frames. Existing premium PNG frames may remain as body fallbacks, but wing visibility and animation-state semantics must be deterministic and testable independently of those binaries.

## Motion language
- `IDLE`: subtle abdomen breathing plus asynchronous antenna/foreleg micro-motion.
- `WALK`: readable alternating tripod rhythm; medium cadence.
- `RUN`: longer leg reach, lower body posture, faster cadence.
- `JUMP`: legs compress then extend; no wings.
- `FALL`: legs slightly spread for balance; no wings unless gameplay transitions to glide/flap.
- `WING_FLAP`: body remains readable while a separate wing layer performs rapid beats.
- `GLIDE`: wing layer stays open with restrained oscillation.
- `WALL_CLING`: legs brace toward contact surface.
- `WALL_CLIMB`: climbing leg cycle with antennae biased toward travel direction.
- `WALL_JUMP`: body pushes away from contact; wings remain hidden.
- `DODGE`: short squash/lean presentation only.
- `HURT`: recoil without physics-body mutation.
- `DEATH`: presentation collapse/fade while gameplay authority remains outside the visual system.
- `RESPAWN`: presentation re-entry with wings hidden.

## State contract
The resolver returns an immutable descriptor containing body animation key, body frame cadence/loop intent, wing visibility, wing mode and presentation transforms. `wingsVisible === true` is legal only for `WING_FLAP` and `GLIDE`.

## Asset contract
Final production art should live under `assets/player/premium-v1/` (or a versioned successor) with body frames and wing frames separable. Body assets must never bake open wings into ground, jump, fall, wall, reaction or respawn silhouettes. Transparent PNGs must share stable registration/origin so animation does not jitter.

## Testing
Pure tests must prove state-to-animation mapping, wing legality, invariant scale, and presentation-only authority. The official `npm test` runner must include the animation contract tests. Build/deploy success is not a substitute for these tests.

## Acceptance
A player watching the character at normal gameplay scale can distinguish idle/walk/run, see leg movement, see antenna life, perceive wall locomotion, and understand flight instantly. Opening wings never reveals a second baked pair beneath them. Physics behavior remains unchanged from the locked V3 contract.

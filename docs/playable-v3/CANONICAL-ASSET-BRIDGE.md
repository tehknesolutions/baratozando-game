# PLAYABLE V3 — Canonical Asset Bridge

Status: ACTIVE
Issue: #66
Baseline: 277cc3f3a8b877535a655da4ba83cb1bcd3be0d4

## Source of truth

ROACH_MASTER_PREMIUM_V1 owns the approved visual identity: anatomy, silhouette, materials, wings, antennae, leg readability, proportions and premium horror finish.

`art/source/player/final-v1/` owns the existing runtime state vocabulary and animation extraction: idle, walk, run, jump, fall, dodge, attack, hurt, death and climb.

The Playable V3 target is `ROACH_PLAYABLE_V3`: runtime animation behavior rebuilt/preserved around the approved premium identity, not a scaled-up approximation of the old 64x64 extraction.

## Hard rules

1. Do not distort the canonical roach to fit prototype assumptions.
2. Six legs, antennae, wings and complete body silhouette must remain visually legible in gameplay.
3. Visual representation and gameplay collider are separate contracts.
4. Scale is centralized in V3-02; scenes must not invent local roach scale values.
5. Camera/environment adapt to the canonical roach scale.
6. Reference-board crops are not runtime sprites by themselves.
7. Existing 64x64 final-v1 frames are animation/state evidence, not sufficient proof of V3 visual fidelity.

## Bridge mapping

| Runtime family | Canonical requirement |
| --- | --- |
| idle | full silhouette, antenna life, grounded legs |
| walk | six-leg locomotion readable, no body deformation |
| run | frantic but anatomically coherent gait |
| jump | complete body + legs, wing state controlled by movement contract |
| fall | silhouette readable against dark Cellar |
| dodge | compact survival movement without anatomy collapse |
| attack | approved body/material identity preserved |
| hurt | readable reaction without sprite deformation |
| death | complete silhouette through death sequence |
| climb | leg contact and orientation remain believable |

## V3-01 acceptance gate

- Gameplay renderer points to a V3 canonical asset contract rather than silently treating reference boards as sprites.
- Asset contract records premium identity source and runtime animation source separately.
- No scene owns an ad-hoc replacement identity.
- Runtime implementation can migrate state-by-state without changing gameplay physics.
- V3-02 may define the single `ROACH_WORLD_SCALE` only after V3-01 identity bridge is established.

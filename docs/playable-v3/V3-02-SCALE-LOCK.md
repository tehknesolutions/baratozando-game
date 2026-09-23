# V3-02 — Scale Lock

`ROACH_WORLD_SCALE` is centralized in `PlayableV3Scale.ts` and scenes are not allowed to invent local player scales.

Initial canonical runtime lock: **0.25**.

Rationale: premium player art is authored on a 256 px canvas while the established gameplay footprint is 64 px. `256 × 0.25 = 64`, preserving the existing world-space character footprint while using the premium source frames.

This is the code-level scale lock. Final acceptance still requires visual runtime inspection in the complete Cellar. Collider geometry is intentionally a separate V3-03 contract and must not be silently retuned as part of this scale-only change.

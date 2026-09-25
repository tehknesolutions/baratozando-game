# Playable V3 — Final Cellar Composition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the stable V3 cellar laboratory into the first production-quality BARATOZANDO horror gameplay composition without regressing player physics, scale, spawn or respawn.

**Architecture:** Preserve `Player` as invisible Arcade authority and `RoachVisual` as presentation authority. Move environmental composition responsibilities out of the scene into focused visual components/contracts so parallax, lighting, foreground occlusion and camera framing can evolve independently while the gameplay geometry remains authoritative and unchanged.

**Tech Stack:** TypeScript, Phaser 3, Arcade Physics, existing Vite web runtime, Node assertion-style contract tests.

**Spec:** `docs/superpowers/specs/2026-09-25-playable-v3-cellar-final.md`

## Global Constraints

- Premium roach visual scale is locked at `0.500`.
- Arcade body is locked at `30x18`.
- Arcade body offset is locked at `17,42`.
- Physics actor and premium render remain separate authorities.
- No red dot, player marker, outline, gameplay halo, enlarged collider or scene-local player scaling.
- Safe spawn and intentional fall -> respawn -> stable supported state must remain valid.
- Readability comes from composition, value separation, environmental light and camera framing.
- Current cellar traversal geometry remains gameplay authority.

## Review Focus

1. Parallax at world edges must not reveal empty/out-of-bounds art.
2. Foreground occluders must not hide the player during critical jump/landing decisions.
3. Lighting/readability must not become a visible player-following glow.
4. Camera look-ahead must remain stable during rapid facing changes and vertical movement.
5. Visual refactors must not mutate physics body, offsets, spawn resolution or respawn behavior.

---

### Task 1: Canonical V3 Lock Contract

**Files:**
- Create: `src/game/player/PlayableV3FinalLock.ts`
- Create: `src/game/player/PlayableV3FinalLock.test.ts`
- Modify: `src/game/player/PlayableV3Scale.ts`

- [ ] Write a failing contract test asserting visual scale `0.500`, physics `30x18`, offset `17,42`, render/physics separation, and no scene-local scale authority.
- [ ] Run the isolated test and verify it fails before the lock module exists.
- [ ] Implement `PlayableV3FinalLock` by composing existing scale/physics contracts rather than duplicating runtime geometry.
- [ ] Run the isolated test and existing player contract tests; verify PASS.
- [ ] Commit: `test(V3): lock final player scale and physics invariants`.

**Gate:** A reviewer can reject any later visual task that changes these values.

### Task 2: Cellar Layer Composition Contract

**Files:**
- Create: `src/game/visual/CellarLayerModel.ts`
- Create: `src/game/visual/CellarLayerModel.test.ts`
- Modify: `src/game/visual/MobilityLabArtDirector.ts`

- [ ] Write failing tests for ordered layers: far darkness, rear architecture, gameplay plane, character plane, near foreground, screen-space presentation.
- [ ] Add edge-case coverage ensuring parallax factors remain bounded and gameplay collision ownership stays outside visual layers.
- [ ] Implement the minimal layer model with named depths and parallax factors.
- [ ] Refactor `MobilityLabArtDirector` to consume layer depths instead of scattered magic numbers where applicable.
- [ ] Run tests and build.
- [ ] Commit: `refactor(V3): formalize cellar depth and parallax layers`.

**Gate:** Existing scene should look materially unchanged before new art treatment is added.

### Task 3: Environmental Readability Lighting

**Files:**
- Create: `src/game/visual/CellarReadabilityDirector.ts`
- Create: `src/game/visual/CellarReadabilityDirector.test.ts`
- Modify: `src/game/scenes/MobilityLabV2Scene.ts`

- [ ] Write failing tests for bounded light alpha, broad light dimensions, and absence of physics/gameplay authority.
- [ ] Pin the current approved warm separation field as an environmental readability primitive, not a player marker.
- [ ] Add static environmental light pools at route decision points using low-alpha warm/cool value separation.
- [ ] Ensure no light changes collision geometry or player scale.
- [ ] Run contract tests/build and deploy preview.
- [ ] Manual gate: idle screenshot finds the roach quickly but no obvious halo follows it.
- [ ] Commit: `feat(V3): direct cellar readability with environmental light`.

### Task 4: Rear Architecture and Parallax

**Files:**
- Create: `src/game/visual/CellarParallaxDirector.ts`
- Create: `src/game/visual/CellarParallaxDirector.test.ts`
- Modify: `src/game/visual/MobilityLabArtDirector.ts`
- Modify: `src/game/scenes/MobilityLabV2Scene.ts`

- [ ] Write failing tests for far/rear parallax ratios and world-edge clamping.
- [ ] Implement slow far-darkness and rear-architecture movement relative to camera scroll.
- [ ] Add structural silhouettes/material masses only from existing approved cellar vocabulary.
- [ ] Clamp/repeat visual coverage so camera bounds never reveal blank seams.
- [ ] Run tests/build and deploy preview.
- [ ] Manual gate: world feels deeper while traversal surfaces remain readable.
- [ ] Commit: `feat(V3): add bounded cellar rear parallax`.

### Task 5: Near Foreground and Occlusion Safety

**Files:**
- Create: `src/game/visual/CellarForegroundDirector.ts`
- Create: `src/game/visual/CellarForegroundDirector.test.ts`
- Modify: `src/game/scenes/MobilityLabV2Scene.ts`

- [ ] Write failing tests defining maximum occluder opacity/coverage near critical traversal zones.
- [ ] Encode exclusion zones around spawn, landing edges and wall-climb decision areas.
- [ ] Add sparse near-camera debris/structural silhouettes with faster parallax than the gameplay plane.
- [ ] Ensure foreground objects are non-physical and cannot own traversal state.
- [ ] Run tests/build and deploy preview.
- [ ] Manual gate: foreground creates depth but never conceals the roach across a required decision.
- [ ] Commit: `feat(V3): add safe cinematic foreground depth`.

### Task 6: Camera Composition Director

**Files:**
- Create: `src/game/visual/CellarCameraDirector.ts`
- Create: `src/game/visual/CellarCameraDirector.test.ts`
- Modify: `src/game/scenes/MobilityLabV2Scene.ts`

- [ ] Extract current approved deadzone/look-ahead behavior into a pure camera resolver.
- [ ] Write tests for idle, run-left/right, jump, fall, wall-climb and rapid facing reversal.
- [ ] Add clamping so offsets cannot expose outside the cellar bounds or obscure imminent landing space.
- [ ] Wire scene update to the director without changing player movement.
- [ ] Run tests/build and deploy preview.
- [ ] Manual gate: movement feels cinematic without camera hunting or losing the player.
- [ ] Commit: `refactor(V3): stabilize cinematic cellar camera framing`.

### Task 7: Object Integration and Contact Treatment

**Files:**
- Create: `src/game/visual/CellarSetDressingDirector.ts`
- Create: `src/game/visual/CellarSetDressingDirector.test.ts`
- Modify: `src/game/visual/MobilityLabArtDirector.ts`

- [ ] Write tests guaranteeing set dressing is visual-only and references the canonical gameplay geometry rather than creating alternate colliders.
- [ ] Add contact-shadow/overlap treatment for crates, cans, pipes, masonry and traversal props.
- [ ] Normalize local contrast so traversal objects read as part of one cellar instead of isolated sprites.
- [ ] Preserve collision geometry byte-for-byte/contract-for-contract.
- [ ] Run tests/build and deploy preview.
- [ ] Manual gate: props feel embedded in the environment and scale relationships remain convincing.
- [ ] Commit: `feat(V3): integrate cellar set dressing and contact depth`.

### Task 8: Full V3 Regression Gate

**Files:**
- Create: `src/game/visual/PlayableV3FinalComposition.test.ts`
- Modify: `docs/superpowers/specs/2026-09-25-playable-v3-cellar-final.md` only to record verified evidence/status.

- [ ] Add aggregate contract test importing final lock, layer, lighting, parallax, foreground and camera contracts.
- [ ] Run full automated test suite and build.
- [ ] Verify diagnostics show `BODY 30x18` and `VISUAL SCALE 0.500`.
- [ ] Manual runtime: idle for at least 10 seconds with no fall loop.
- [ ] Manual runtime: walk/run/jump/wall traversal without losing player readability.
- [ ] Manual runtime: intentional fall -> respawn -> remain grounded/stable.
- [ ] Capture final idle and traversal screenshots for review.
- [ ] Commit: `test(V3): certify final cellar playable composition`.

**Final Gate:** Only after all automated and manual evidence passes may the V3-03 branch be promoted/merged as the Playable V3 cellar baseline.

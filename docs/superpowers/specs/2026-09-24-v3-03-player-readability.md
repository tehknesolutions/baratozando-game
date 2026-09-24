# V3-03 — Player Readability Architecture

## Intent
Playable V3 must preserve the fantasy that the roach is physically tiny in a gigantic human cellar while making the player immediately readable at all times.

Canonical principle:

> The roach must look small in the world, but never small to the player.

## Runtime evidence
- 0.25 / 64px: grounded but visually disappears into the environment.
- 0.375 / 96px: materially more readable and observed grounded/stable, but still loses silhouette against cellar props/materials.
- 0.50 / 128px: reproduces the fall/respawn loop and therefore cannot be used as a scale-only solution.
- The 0.375 -> 0.50 experiment changed only the global scale contract/test, strongly motivating explicit separation between render scale and physics geometry.

## Architecture
### 1. Physics Body
Physics is authoritative for locomotion and grounding. Body dimensions, body offset, feet position, collision probes, checkpoint coordinates and respawn behavior must not be derived from render scale.

Changing visual scale must not change:
- body width/height;
- body offset;
- grounded contact;
- wall sensor geometry;
- safe spawn/checkpoint position;
- death/fall thresholds.

### 2. Roach Visual
The premium roach renderer is presentation attached to the physics actor. It follows actor position/facing/state but owns its own visual scale and visual offset.

A visual-scale change must be possible without changing the actor physics contract.

Baseline during implementation: 0.375. This is a safe reference, not final art lock.

### 3. Player Readability
Readability must come from cinematic separation rather than arcade UI decoration.

Allowed tools:
- controlled local contrast around the player;
- subtle scene-consistent rim/key response;
- preservation of antenna/leg silhouette;
- restrained background contrast suppression near the player;
- motion-state emphasis where useful.

Not acceptable as the shipping solution:
- debug red dot;
- permanent neon aura;
- thick outline;
- giant marker/arrow;
- simply making the roach unrealistically huge.

### 4. Camera Composition
Camera should preserve the giant-world fantasy while keeping the roach legible. Exploration framing may become more intimate than the current Cellar baseline, but camera changes must not alter physics.

Camera tuning should consider movement direction, vertical movement, panic/fear states later, and environmental storytelling. V3-03 only establishes the normal exploration baseline.

## Acceptance gates
1. Spawn in complete Cellar and remain grounded >= 5 seconds without input.
2. Intentional fall -> respawn -> grounded >= 5 seconds, repeated 5 times.
3. Changing render scale between calibration candidates does not change physics body dimensions/offset.
4. Remove/hide debug player probe and identify the roach immediately in a visually dense Cellar frame.
5. Roach remains physically small relative to door, crates, barrels and architecture.
6. Antennae, legs and facing direction remain readable during idle and locomotion.
7. No permanent neon outline/aura/marker is required for player tracking.
8. 0.50 regression must not be able to reintroduce fall-loop merely by changing render scale.

## Non-goals
- Fear / Barata Tonta mechanics.
- Panic Flight tuning.
- Enemy-reactive horror.
- Final global scale lock.
- Re-authoring Cellar geometry.

Those resume only after the Playable V3 foundation passes this contract.

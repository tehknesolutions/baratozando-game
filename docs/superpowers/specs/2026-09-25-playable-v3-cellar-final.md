# Playable V3 — Final Cellar Composition Spec

## Intent
Turn the current stable Mobility Lab / cellar into the first scene that visually reads as BARATOZANDO: a tiny but readable cockroach moving through an oppressive, oversized horror cellar. Preserve all runtime stability gained in V3-03.

## Canonical locks
These are invariants for this work and must not be recalibrated as art parameters:
- Premium roach visual scale: `0.500`.
- Arcade body: `30x18`.
- Arcade body offset: `17,42`.
- Physics actor and premium render remain separate authorities.
- No player marker, red dot, outline, gameplay halo, or enlarged collider.
- Current safe spawn / respawn stability must remain intact.

## Visual direction
The cellar is dark, dramatic and suspenseful rather than merely underexposed. The world must feel enormous relative to the roach. Readability comes from composition, value separation, selective warm light, silhouette and camera framing—not from UI markers.

The approved readability field remains subtle enough to be perceived as scene lighting rather than an aura attached to the player.

## Layer model
1. Far darkness / structural silhouettes: low contrast, slowest parallax.
2. Rear architecture: pipes, masonry, cellar structure and large shadow masses.
3. Gameplay plane: collision-bearing platforms and traversal objects; strongest material legibility near the player route.
4. Character plane: premium roach at depth above gameplay art, with physics actor invisible.
5. Near foreground: sparse occluding silhouettes/debris, fastest parallax, never hiding the player for a dangerous duration.
6. Screen-space presentation: tutorial/HUD diagnostics only while V3 remains a lab candidate.

## Lighting and readability
- Maintain the current warm local separation around the roach, but keep alpha low and broad.
- Use environmental pools of light to establish route hierarchy.
- Keep surrounding blacks rich while preserving enough local texture to understand surfaces.
- Avoid uniformly brightening the scene.
- Avoid neon, magical glow or an explicit spotlight that follows the player.

## Camera
- Preserve the current follow model as baseline.
- Horizontal look-ahead follows facing/speed.
- Vertical composition reacts to jump/fall/wall climb.
- Camera movement must not expose outside world bounds or make landing surfaces unreadable.
- No camera change may alter player physics.

## Environment integration
Objects must feel embedded in the cellar rather than placed as isolated sprites. Contact shadows, overlap, scale relationships and foreground/rear separation should visually anchor crates, cans, pipes, masonry and traversal surfaces.

## Acceptance gates
1. Static readability: in an idle screenshot, a new viewer can find the roach quickly without a marker.
2. Scale fantasy: the roach remains visibly tiny relative to the cellar while still reading as the protagonist.
3. Motion readability: walking/running/jumping/falling does not lose the player against the environment.
4. Horror preservation: readability improvements do not turn the scene bright, arcade-like or glowing.
5. Physics regression: body remains `30x18`, offset `17,42`, visual remains `0.500`, and idle does not re-enter the fall loop.
6. Respawn regression: intentional fall -> respawn -> stable supported state.
7. Occlusion safety: foreground layers cannot conceal the roach across critical landing/jump decisions.

## Non-goals
- New gameplay mechanics.
- Rebuilding player movement.
- Recalibrating roach scale/collider.
- Final production HUD/menu.
- New level beyond the current cellar composition.

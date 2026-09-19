# BARATOZANDO — Sprint A.5 Mobility Reframe

**Status:** Design proposal after first M1/Sprint A browser playtest  
**Project:** BARATOZANDO / Roachin' Around  
**Date:** 2026-09-19  
**Scope:** player mobility, beginner onboarding, vertical level design, and first-threat pacing  
**Baseline:** current `main` after Sprint A Environment Art Pass

---

## 1. Why this sprint exists

The first playable build succeeded at an important thing: it already feels like a game.

The browser playtest also exposed two structural problems that should be solved before investing in more enemies, hazards or environment art:

1. the environment still reads as a sequence of authored rectangles with decoration rather than a place the cockroach can exploit;
2. the player's locomotion is still too close to a conventional platform character and is unforgiving for a beginner.

BARATOZANDO should not feel like "a hard platformer whose avatar happens to be a cockroach."

The cockroach fantasy must be part of the controls:

- hard to stop;
- able to improvise in the air;
- able to grip and climb;
- able to recover from mistakes;
- able to use objects as a vertical route;
- able to survive by movement before it becomes strong in combat.

The new core statement is:

> **THE COCKROACH DOES NOT CONQUER THE WORLD BY JUMPING FARTHER. IT FINDS ANOTHER SURFACE.**

---

## 2. Evidence from the recorded playtest

The supplied ~46 second browser recording confirms the design issue.

### Observed sequence

- the player begins on a mostly horizontal route;
- within roughly 9 seconds the chase already reaches `CORRA.`;
- the first visible crush happens around 15 seconds;
- subsequent attempts repeat the same pattern and end in additional crushes;
- the route asks for several binary horizontal platform jumps while the player is also under chase pressure;
- falling generally means losing progress instead of discovering a recovery route;
- there is almost no vertical traversal;
- the player cannot use walls, pipes, crates or background architecture as locomotion tools.

This means the build currently teaches pressure before it teaches the fantasy of being a cockroach.

### Visual note

The current asset labeled as Sir Chinellus does not yet read clearly as a household slipper in the recorded build. It reads closer to a large winged/crowned creature.

This asset is **not accepted as the final Sir Chinellus visual**. A dedicated unmistakable slipper silhouette is required before the First Threat art is considered canonical.

---

# 3. Design goal

Sprint A.5 should make a first-time player think:

> "Ah, I can save this jump with my wings."

then:

> "Wait, I can cling to this wall."

then:

> "Ohhh... I can use basically everything to climb."

Only after that should the game ask:

> "Can you do all of that while something enormous tries to crush you?"

The first threat becomes the exam, not the tutorial.

---

# 4. Core mobility philosophy

BARATOZANDO uses **mobility recovery**, not precision punishment, as the beginner experience.

A missed jump should often create a new decision:

- flap;
- glide;
- catch a wall;
- scramble upward;
- fall to a lower recovery route;
- reposition and try again.

Only later areas should turn missed movement into immediate death.

The player should feel resourceful before feeling skillful.

---

# 5. Canonical innate cockroach mobility — V1

These abilities are proposed as **innate baseline locomotion**, not adaptation rewards.

They define what it means to control a cockroach.

## 5.1 Ground locomotion

- walk;
- six-leg sprint;
- responsive turning;
- short dodge.

Sprint remains the fast "MEU DEUS, CORRE" state.

## 5.2 Ground jump

A conventional jump remains the first vertical verb, but it becomes slightly more forgiving and more controllable in air.

## 5.3 Wing Flutter

Primary new signature mechanic.

Pressing Jump while airborne causes a short wing-assisted lift.

This is **not free flight**.

It should feel closer to repeated desperate wing beats:

`JUMP → FLAP → FLAP → GLIDE / FIND A SURFACE`

Default proposal:

- 2 airborne wing flaps after leaving a stable surface;
- each flap gives a predictable upward impulse;
- flaps have a short anti-spam interval;
- landing fully restores flaps;
- gripping a valid climbable wall long enough also restores flaps.

This creates the desired "multi-jump amplified by wings" rhythm.

## 5.4 Short Glide

Holding Jump while descending opens the wings and reduces fall speed.

Goals:

- give beginners time to correct;
- allow horizontal repositioning;
- create routes involving fans/air currents later;
- make falls less binary.

It is controlled descent, not horizontal powered flight.

## 5.5 Wall Cling

When the player contacts a climbable surface and intentionally pushes toward it, the cockroach grips the wall.

While gripping:

- falling is strongly reduced or stopped;
- the player can look/reposition;
- wings can recover after a brief stable grip;
- Jump launches away from the wall.

## 5.6 Wall Crawl

A cockroach should be able to actually climb, not only wall-jump.

On surfaces tagged as climbable:

- Up climbs;
- Down descends;
- horizontal input into the wall maintains attachment;
- releasing away from the surface detaches.

Base wall crawl should be slower than sprinting, but reliable.

## 5.7 Wall Scramble Jump

Jumping from a wall gives:

- outward horizontal launch;
- useful upward impulse;
- air-control recovery.

This creates expressive chains:

`GROUND JUMP → FLAP → WALL CLING → CLIMB → WALL JUMP → FLAP → LEDGE`

## 5.8 Ledge Assist

A small accessibility-oriented edge correction catches near-miss ledges.

This is not a visible "magnet" and should not teleport the player across large mistakes.

It exists to remove the classic frustration of clipping a platform edge by a few pixels.

---

# 6. What remains progression / adaptation

The cockroach should begin capable, but not omnipotent.

Innate mobility handles ordinary rough household surfaces.

Future adaptations expand **where** and **how** the same movement can be used.

## Baseline innate

- rough wall adhesion;
- short wall crawl;
- 2 wing flaps;
- short glide;
- wall jump.

## Future adaptation examples

### Smooth Surface Adhesion
Climb glass, polished metal and ceramic.

### Wet Grip
Maintain adhesion on wet/slimy surfaces.

### Ceiling Crawl
Traverse ceilings for sustained sections.

### Extended Wing Membrane
Longer glide and stronger air-current interaction.

### Wing Burst
Single stronger directional aerial burst.

### Chemical Grip
Climb contaminated surfaces safely.

This preserves metroidvania progression without making the starting cockroach strangely incapable of basic cockroach behavior.

---

# 7. Surface taxonomy

Environment materials become gameplay language.

The renderer and level layout should stop treating every rectangle as equivalent.

Initial surface tags:

- `GROUND` — ordinary walkable surface;
- `ROUGH_CLIMB` — wood, cracked masonry, rough fabric, oxidized material;
- `SMOOTH_LOCKED` — glass, polished tile/metal; later adaptation;
- `GREASY_SLIDE` — weak or no adhesion;
- `HAZARDOUS_CLIMB` — physically climbable but dangerous;
- `DECORATIVE` — never part of movement/collision.

This is a key bridge between the visual problem and the gameplay problem.

A wall should visually tell the player something about whether the cockroach can use it.

---

# 8. Proposed beginner-friendly movement tuning

These values are a starting hypothesis for a dedicated movement laboratory, not a final promise.

The existing M1 tuning remains the historical baseline; Sprint A.5 explicitly authorizes retuning.

## Ground / air

| Parameter | Current | A.5 starting proposal |
| --- | ---: | ---: |
| walk speed | 105 | 115 |
| run speed | 185 | 195 |
| ground acceleration | 1200 | 1500 |
| ground deceleration | 1500 | 1800 |
| air acceleration | 700 | 1000 |
| gravity | 1050 | 900 |
| jump velocity | -360 | -350 |
| max fall speed | 520 | 420 |
| coyote time | 100 ms | 140 ms |
| jump buffer | 110 ms | 160 ms |
| jump cut multiplier | 0.48 | 0.58 |
| dodge cooldown | 420 ms | 380 ms |

The goal is not "floaty easy mode." The goal is more control and more time to recover.

## Wings

Starting proposal:

- airborne flaps: `2`;
- flap velocity target: approximately `-230 px/s`;
- minimum interval between flaps: `130 ms`;
- glide max fall speed: approximately `150 px/s`;
- continuous glide budget: approximately `650 ms`;
- flap reset: ground;
- flap reset: stable `ROUGH_CLIMB` wall grip after approximately `150 ms`.

Exact feel must be tuned in browser.

## Wall movement

Starting proposal:

- wall crawl speed: `80 px/s`;
- passive wall slide cap: `45 px/s`;
- wall-jump horizontal impulse: `190 px/s`;
- wall-jump vertical impulse: approximately `-310 px/s`;
- detach input lock: approximately `120 ms`.

These numbers are deliberately separated into a config module so browser tuning does not require rewriting movement logic.

---

# 9. Input design

The controls should remain easy to discover.

## Keyboard

- A/D or Left/Right — move;
- Shift — sprint;
- Space — jump / wing flap / hold to glide;
- Up/Down or W/S — climb while attached;
- Ctrl/K — dodge;
- R — debug respawn.

The key design decision is:

> **Jump, flap and glide share one button.**

No "fly mode" button is required.

Context chooses the verb:

- grounded + press Jump → jump;
- airborne + press Jump + flap available → wing flap;
- descending + hold Jump → glide;
- wall attached + press Jump → wall scramble jump.

This keeps the feature set rich without making controls complex for beginners.

---

# 10. Player state architecture

The current state set is too small for the new fantasy.

Add explicit movement states or animation states for:

- `WING_FLAP`;
- `GLIDE`;
- `WALL_CLING`;
- `WALL_CLIMB`;
- `WALL_JUMP`.

Potential later:
- `CEILING_CRAWL`;
- `WING_BURST`.

Damage/death/respawn retain highest state precedence.

---

# 11. Mobility resource model

Avoid a traditional stamina bar in the first implementation.

The first version should be legible from the character:

- closed wings = normal;
- wing beat = one flap consumed;
- wings visibly tire/fold after the second flap;
- stable landing/wall grip restores the ability.

This keeps HUD noise low.

If a resource display becomes necessary later, it should be diegetic/minimal.

---

# 12. Mobility Lab V2

Do **not** retune the First Threat scene directly first.

Create a separate safe scene:

## `MobilityLabV2Scene`

Its job is to answer one question:

> Is controlling this cockroach fun before anything is trying to kill it?

### World shape

The room should be substantially more vertical than M1.

Suggested authoring envelope:

- width: ~1600–1900 px;
- height: ~850–1000 px;
- camera follows both X and Y;
- no instant-death void under the learning route.

### Segment 1 — Run and easy jump
Very wide surfaces.

No danger.

### Segment 2 — First wing rescue
A gap intentionally slightly too large for a comfortable normal jump.

The first flap saves it.

Missing the flap lands on a recovery floor rather than killing the player.

### Segment 3 — Wall discovery
A tall rough wooden crate/wall.

A normal jump cannot reach the top.

Cling + climb solves it.

### Segment 4 — Combined ascent
Crate → pipe → wall → wing flap → shelf.

The environment becomes a ladder without literal floating platforms.

### Segment 5 — Glide
The player drops from a high shelf and uses glide to choose among two landing zones.

### Segment 6 — Expression challenge
A vertical chamber where multiple solutions work:

- climb longer;
- chain wall jump + flap;
- take a safe slower route.

### Segment 7 — Optional secret
A route visible but not reachable without creatively combining wall and wings.

This proves exploration potential.

---

# 13. Beginner onboarding rules

## Rule 1 — Teach one recovery verb at a time

Do not introduce wall climb and wing flaps simultaneously in the first jump.

## Rule 2 — Misses become lower routes

Early mistakes should frequently land the player somewhere playable.

This creates "oops, keep going" rather than "oops, respawn."

## Rule 3 — First success before first threat

The player must perform several satisfying movement chains before the chase begins.

## Rule 4 — Prompts fade after demonstrated success

Example:

`SPACE — BATER AS ASAS`

disappears after the player completes the first successful flap crossing.

## Rule 5 — Geometry demonstrates the answer

Use environment composition to communicate:

- rough vertical surface = climb;
- open air = flap/glide;
- smooth surface = not yet;
- low recovery route = safe failure.

Avoid over-explaining with text.

---

# 14. Level-design shift: from platform blocks to climbable set pieces

The environment should be authored as **objects with traversable affordances**.

Bad mental model:

`platform → gap → platform → gap → platform`

BARATOZANDO model:

`crate → bottle neck → cracked wall → pipe → cable → shelf → ventilation gap`

The player reads objects, not rectangles.

Collision can remain simple under the hood, but the authored route must be shaped by recognizable objects.

---

# 15. First handcrafted vertical set-piece

Recommended first production set-piece:

## "THE PANTRY ASCENT"

A single composition:

1. broken cardboard box creates the starting ramp;
2. tipped can forms a mid-height ledge;
3. rough wooden shelf support becomes climbable wall;
4. hanging cable offers a narrow landing;
5. fork becomes a diagonal bridge;
6. bottle/jar creates a large silhouette and alternate route;
7. upper shelf reveals the next room.

This one scene should contain fewer repeated tiles and more meaningful silhouettes than the entire current chase corridor.

The player uses objects to go **up**, exactly as proposed in the playtest feedback.

---

# 16. Revised First Threat pacing

The current chase begins too early for a beginner.

A.5 changes the structure:

## Before chase

The player should first demonstrate:

- ground jump;
- at least one successful wing flap;
- one wall cling/climb;
- one combined mobility chain.

Only then can the Ancient Predator sequence trigger.

## Chase philosophy

The chase should test **route improvisation**, not only raw forward speed.

During the chase, the player can:

- climb a short wall instead of clearing a precision gap;
- use one flap to recover;
- glide to a lower safe route;
- take a slightly slower beginner route or faster expert route.

## Failure

Not every mistake should mean Sir Chinellus instantly catches the player.

Add one or two recovery opportunities.

The predator remains scary because it closes distance while the player recovers.

---

# 17. Sir Chinellus correction

The final visual must be unmistakably:

> **an enormous worn household slipper**

from the cockroach's point of view.

Required silhouette traits:

- sole;
- open foot cavity / strap;
- recognizable slipper shape;
- exaggerated front or sole impact zone;
- no wings;
- no insect anatomy;
- no crown unless it exists as a clearly separate comic/lore accessory and still reads as a slipper.

The current winged/crowned-looking asset is a temporary mistake and should be replaced.

The joke only works when the player realizes:

> "Wait... that terrifying monster is a slipper."

---

# 18. Camera changes

Vertical mobility requires camera behavior to change.

Proposed:

- larger vertical deadzone;
- gentle Y follow;
- look-ahead in travel direction;
- slight look-up bias while climbing;
- slight look-down bias during glide/fall;
- no aggressive snapping when attaching to a wall.

During chase, the camera must still preserve enough space behind the player to read Sir Chinellus.

---

# 19. Technical decomposition

Keep movement rules mostly pure/testable.

Suggested modules:

`src/game/player/MobilityConfig.ts`
- V2 numerical configuration.

`src/game/player/WingMobilityController.ts`
- flap counts;
- flap cooldown;
- glide eligibility;
- reset rules.

`src/game/player/WallMobilityController.ts`
- wall attachment;
- climb intent;
- wall-jump resolution;
- surface compatibility.

`src/game/player/SurfaceType.ts`
- surface taxonomy.

`src/game/world/MobilityLabV2Layout.ts`
- authored collision + surface tags.

`src/game/scenes/MobilityLabV2Scene.ts`
- browser tuning environment.

Do not bury all new behavior in `Player.ts`.

`Player.ts` orchestrates the controllers and applies resolved velocity/state.

---

# 20. Collision / wall sensing

Phaser Arcade Physics can provide initial wall contact from:

- `body.blocked.left`;
- `body.blocked.right`;
- `body.touching.left`;
- `body.touching.right`.

The collider must also expose the surface tag involved in the contact.

If Arcade callbacks become insufficient to identify the contacted surface reliably, introduce small side sensors rather than inferring climbability from artwork.

Visual pixels must never be collision authority.

---

# 21. Animation requirements

New prototype animations:

## Wing flap
Fast wing reveal and beat.

The motion should look slightly frantic, not elegant.

## Glide
Wings partially open, body stabilized.

## Wall cling
Body flattened close to the wall.

## Wall crawl
Leg cadence visibly different from horizontal run.

## Wall jump
Compressed pose followed by explosive detach.

Temporary reuse/duplication of frames is allowed for the first feel-test, but the state transitions must exist before final animation work.

---

# 22. Audio requirements

Mobility should be satisfying even with placeholder visuals.

Prototype audio cues later:

- subtle wing buzz per flap;
- lighter sustained buzz during glide;
- tiny leg scratch on wall crawl;
- grip/release tick on wall contact;
- stronger six-leg scuttle during sprint.

Audio must not become noisy at high input frequency.

---

# 23. Accessibility / novice assists

The base game should already be forgiving, but architecture should allow optional assistance later.

Potential settings:

- +1 wing flap;
- longer glide;
- stronger ledge assist;
- slower chase;
- stronger climb grip.

Do not implement a full accessibility menu in Sprint A.5.

Design controllers so these values can become config multipliers later.

---

# 24. Playtest targets

The next browser test should validate movement before enemies.

A new player should be able to:

1. understand a normal jump immediately;
2. discover the first wing flap with one short prompt;
3. recover a failed jump using a flap;
4. attach to the first climbable wall without precision positioning;
5. reach the top of the training room without mandatory damage;
6. combine wall + wing at least once;
7. describe the character as "a cockroach" based on movement alone.

Quantitative starting targets for the manual test:

- first tutorial route: ideally 0 deaths;
- reach the top within roughly 2–4 minutes on first exposure;
- no mandatory jump requiring pixel-perfect edge takeoff;
- every early large fall has a recovery floor;
- first chase occurs only after the player has used both wing and wall locomotion successfully.

---

# 25. Sprint A.5 implementation order

## Phase 1 — Movement model
- input intent adds held Jump and vertical climb intent;
- Mobility V2 config;
- wing controller;
- wall controller;
- new movement states;
- pure tests.

## Phase 2 — Safe Mobility Lab V2
- vertical room;
- recovery floors;
- tagged climb surfaces;
- camera Y behavior;
- temporary instructional prompts.

## Phase 3 — Browser tuning
Tune:
- jump;
- flap;
- glide;
- wall climb;
- wall jump;
- camera.

No predator yet.

## Phase 4 — Handcrafted set-piece
Replace abstract vertical blocks with the Pantry Ascent composition.

## Phase 5 — First Threat integration
Port the accepted movement model into the chase scene.

Re-author the chase route around multiple recovery options.

## Phase 6 — Sir Chinellus art correction
Replace the incorrect current creature-like silhouette with a dedicated slipper asset.

## Phase 7 — Final beginner playtest
Only after this should Sprint B hazards/enemies continue.

---

# 26. Explicit non-goals

Sprint A.5 does not yet add:

- free unrestricted flight;
- infinite generic wall climb on every material;
- ceiling crawl;
- combat;
- enemy roster;
- Adaptation Engine;
- Adaptive Stress;
- inventory;
- skill tree;
- procedural level generation;
- full Sir Chinellus boss fight.

---

# 27. Success criteria

Sprint A.5 is successful when:

- controlling the protagonist feels character-specific;
- wings save mistakes without becoming free flight;
- wall movement works reliably on tagged surfaces;
- a beginner can traverse the lab with low punishment;
- vertical routes are more important than repeated horizontal gaps;
- the environment looks authored around household objects rather than floating blocks;
- the movement system naturally supports future metroidvania locks;
- the First Threat becomes easier to read without becoming trivial;
- the player can escape using improvisation, not only perfect jump timing;
- the phrase "use the obstacles to climb" is visibly true in gameplay.

---

# 28. Canonical mobility fantasy

The protagonist should eventually be remembered for this rhythm:

> **RUN. JUMP. FLAP. GRAB. CLIMB. GLIDE. ESCAPE.**

That is more important to BARATOZANDO than making the first combat system deeper.

The first promise of the game is not:

> "You can kill things."

It is:

> **"You can get almost anywhere."**

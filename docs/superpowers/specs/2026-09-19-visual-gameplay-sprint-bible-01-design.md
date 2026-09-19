# BARATOZANDO — Visual & Gameplay Sprint Bible 01

**Status:** Approved Design Baseline  
**Project:** BARATOZANDO / Roachin' Around  
**Date:** 2026-09-19  
**Current runtime baseline:** M1 — First Threat, merged on `main`  
**Purpose:** define the canonical visual/gameplay direction for the next production phase without changing the movement/chase feel that has already been playtested positively.

---

## 1. Product intent

BARATOZANDO is a dark cinematic survival-platformer/metroidvania in which a tiny cockroach survives a gigantic hostile world and turns observation, suffering and survival into adaptation.

The experience should evolve emotionally through:

`FEAR → CURIOSITY → EXPERIMENT → SURVIVAL → LEARNING → POWER → NEW FEAR`

The player should initially read the world as a predator-filled environment, then gradually understand its systems, and finally learn to exploit those same systems.

Success for this design means:

1. five seconds of gameplay are visually recognizable as BARATOZANDO;
2. ordinary domestic objects feel monumental from the protagonist's scale;
3. the environment itself creates gameplay, not only background decoration;
4. enemies feel like members of an ecosystem and potential teachers;
5. adaptations visibly change exploration and body language;
6. the dark/horror tone remains readable and occasionally funny through scale contrast.

---

## 2. Architectural decomposition

This Bible is intentionally broader than one implementation cycle. It is decomposed into five independent production sprints so each can be implemented and evaluated without hiding regressions behind unrelated changes.

### Sprint A — Environment Art Pass
Goal: make the existing M1 chase look unmistakably like BARATOZANDO while preserving its gameplay behavior.

### Sprint B — Environmental Hazards
Goal: prove that the scenario itself can create readable, systemic gameplay.

### Sprint C — Living Ecosystem
Goal: introduce the first reusable enemy behavior families.

### Sprint D — Adaptation Foundation
Goal: separate Adaptive Stress from HP and record experience events that can later unlock adaptation.

### Sprint E — First Metroidvania Loop
Goal: use one adaptation to turn a previously blocked or hostile route into a new traversal path.

Only Sprint A is the next implementation unit. Sprints B–E remain approved direction, not implementation scope for the next branch.

---

## 3. Non-negotiable visual pillars

### 3.1 Absurd scale
Everyday objects become geography.

Examples:
- fork = bridge / monument;
- bottle = tower / cavern;
- drain = gate;
- droplet = falling boulder;
- slipper = giant predator;
- refrigerator = fortress.

Scale must frequently create both horror and humor.

### 3.2 Silhouette first
The player, predators, obstacles, routes and bosses must remain understandable in near-black scenes before texture detail is considered.

### 3.3 Light communicates state
Canonical light language:

- amber: protagonist, safety, learning, adaptation;
- burnt red: immediate danger;
- yellow-green: toxin, decay, chemistry;
- cold blue/white: human technology and hostile machinery;
- subtle violet: strange/unknown phenomena.

Lighting is information, not decoration.

### 3.4 Dirt has mechanics
Materials should imply behavior.

- grease → low friction;
- mold → spores;
- rust → brittle/breakable surface;
- water → flow/force;
- adhesive → mobility loss;
- dust → vibration/track readability.

### 3.5 Domestic horror
Normal household events become terrifying from the cockroach perspective: lights turning on, drawers closing, footsteps, tap water, vacuum cleaner, insecticide, cat movement, appliances starting.

### 3.6 Humor by contrast
Comedy comes from epic presentation of mundane threats, not from making the entire world colorful or silly.

Canonical example:
`ANCIENT PREDATOR — THE CRUSHER OF THOUSANDS`
reveals an old slipper.

### 3.7 Adaptation remains visible
Long-term learning should eventually leave visual evidence on the body: amber micro-fissures, antenna changes, leg modifications, plates, membranes, glands or posture changes.

---

## 4. Visual DNA

### World palette
- void charcoal: `#090807`
- rust brown: `#30241D`
- dark metal: `#1A1E20`
- wet gray: `#343536`

### Protagonist
- deep shell brown: `#3A251B`
- adaptive amber: `#E38A38`
- luminous amber: `#FFB45E`

### Danger
- rust red: `#9E3023`
- impact red: `#E64A34`

### Toxin
- decay green: `#69823A`
- chemical green: `#A7D64F`

### Human technology
- cold blue: `#658CA0`
- industrial white: `#D7DFDF`

These colors are semantic tokens. Individual assets may vary around them, but should not redefine their meaning.

---

## 5. Scene layering contract

Every major scene should be built from five depth bands.

1. **Void** — near-black visual limit.
2. **Macro silhouette** — furniture, machines, pipes, architecture; slow parallax.
3. **Atmosphere** — fog, dust, steam, condensation, spores.
4. **Gameplay plane** — collision surfaces, hazards, enemies; highest readability.
5. **Foreground** — cables, grates, nearby debris, droplets; cinematic framing without hiding traversal.

Foreground elements must never obscure critical hazards or the protagonist long enough to create unfair deaths.

---

## 6. World progression map

Approved first-campaign sequence:

1. **Origin Nest** — movement and scale.
2. **Forgotten Pantry** — territorial life, crumbs, grease, cracks.
3. **Pipes** — water, steam, slime, vertical pressure.
4. **Giant's Kitchen** — first major domestic-horror spectacle.
5. **Predator Corridor** — first chase / Ancient Predator reveal.
6. **Shadow Sewers** — first broader metroidvania network.
7. **Extermination Laboratory** — chemistry, machines, mutation, deeper lore.
8. **Deep Nest** — insectoid society / advanced ecosystem.

This is a campaign direction, not a requirement to build all zones before validating the first vertical slice.

---

## 7. Enemy ecosystem baseline

Every enemy must answer:

1. what does it want?
2. what does it teach?
3. what telegraphs its attack?
4. how does it interact with the environment?
5. what can the player potentially learn from it?

Approved initial roster:

- Dust Mite — crawler / reflex timing.
- Hungry Larva — ambusher / environmental observation.
- Worker Ant — walker / attention and signaling.
- Soldier Ant — charger / can break world objects.
- Rot Fly — flyer / movement tracking.
- Pipe Spider — hunter / ceiling ambush and adhesion.
- Crack Centipede — large predator / vibration.
- Armored Beetle — tank / positional problem solving.
- Acid Larva — environmental shooter / corrosion.
- Wounded Roach — mirror / narrative warning about failed adaptation.
- Fumigator Drone — machine hunter / scanning and chemical pressure.
- Cat — kaiju environmental predator / stealth and vibration.

Large predators such as Sir Chinellus, the vacuum cleaner, the cat, a lizard and colony queens do not need to follow normal enemy-combat rules.

---

## 8. Canonical obstacle baseline

Approved environmental systems:

- flowing water;
- giant falling droplets;
- timed steam;
- adhesive/grease;
- spores;
- human glue trap;
- UV light;
- fan/air current;
- electrical cable;
- crusher;
- vibrating floor.

Rule: a good obstacle should serve at least two of:
- threat;
- movement;
- puzzle;
- enemy interaction;
- adaptation opportunity.

Pure "touch red thing, lose HP" hazards should be minimized.

---

## 9. Adaptation direction

Approved early adaptation concepts:

- sensory antenna pulse;
- body compression for cracks;
- reactive shell;
- thanatosis / playing dead;
- chemical tolerance;
- advanced adhesion;
- decay metabolism;
- vibration perception.

Temporary power-ups remain separate from permanent adaptation.

**Temporary power-up:** "I possess this now."  
**Adaptation:** "My organism learned something."

Potential temporary forms include wasp wings, beetle shell, spider legs, firebug gland, slime membrane and shadow dust.

---

## 10. Sound and animation direction

Danger should frequently be heard before it is seen.

Examples:
- slipper: heavy `THUMP`;
- spider: near-silent thread movement;
- cat: distant breath/purr;
- vacuum: motor spin-up;
- steam: pressure buildup.

Player animation rules:
- antennae remain active at idle;
- run lowers the body and visibly engages all six legs;
- jump compresses before launch;
- fall lets antennae trail upward;
- dodge is low and explosive;
- hurt communicates shell shock rather than gore.

The run state should embody the internal production phrase:
**"MEU DEUS, CORRE."**

---

# 11. Sprint A — Environment Art Pass

## 11.1 Goal

Transform the already-playable M1 First Threat scene from procedural greybox into the first recognizable BARATOZANDO environment while preserving the controls and chase tuning that the user has already positively playtested.

This sprint is primarily a rendering/content pass.

## 11.2 Frozen gameplay baseline

Sprint A must not retune these values without a separate explicit gameplay decision:

### Player movement
- walkSpeed: `105`
- runSpeed: `185`
- gravity: `1050`
- jumpVelocity: `-360`
- maxFallSpeed: `520`
- coyoteTimeMs: `100`
- jumpBufferMs: `110`
- dodgeDurationMs: `160`
- dodgeSpeed: `330`
- dodgeCooldownMs: `420`

### Chase
- triggerX: `640`
- warningDurationMs: `650`
- threatStartX: `260`
- threatSpeed: `205`
- catchDistance: `54`
- escapeX: `1875`

### World
- size: `2176 × 576`
- tile basis: `32 × 32`
- checkpoint: `x=544, y=480`

Collision geometry should remain functionally equivalent. Art may visually extend beyond colliders, but must not imply false walkable or lethal surfaces.

## 11.3 Sprint A art targets

Replace generic rectangles/silhouettes with a coherent cellar/pantry environment composed from reusable modules.

Required environment families:

### Structural
- cellar floor;
- aged wood;
- masonry/concrete;
- rusted metal;
- pipe segments;
- cracks/frets.

### Giant household props
At minimum:
- fork;
- bottle/jar;
- tin/can;
- box/crate;
- cable;
- screw/metal part;
- drain/vent;
- slipper silhouette.

### Surface decals
- grease;
- moisture;
- grime;
- mold;
- rust;
- cracks.

### Atmospheric FX
- suspended dust;
- low fog;
- condensation/drips;
- subtle amber light pockets;
- danger-state red response during chase.

## 11.4 First Threat visual treatment

The chase should visually progress through three beats:

### DORMANT
The predator is not immediately legible. The environment is quiet, mostly charcoal/brown, with warm local pockets.

### WARNING
Vibration, shadow growth and/or environmental movement foreshadow the threat during the existing 650 ms warning window.

Do not change the warning duration in Sprint A.

### CHASING
The scene can add:
- stronger red/amber contrast;
- foreground motion;
- dust release;
- silhouette intrusion;
- subtle screen-space danger treatment.

The player and traversal route must remain more readable than the effect layer.

### REVEAL
The Ancient Predator should begin reading as a giant slipper rather than an abstract rectangle/ellipse, while preserving the comic-horror reveal.

This is the first production target for **Sir Chinellus / Ancient Predator visual identity**, not yet a full boss implementation.

---

## 12. Asset architecture for Sprint A

Prefer modular reusable assets over one giant painted background.

Recommended families:

`public/assets/environment/cellar/`
- tiles/
- props/
- decals/
- fx/

`public/assets/threats/sir-chinellus/`

The current 32×32 world grid remains the authoring reference, but props may span many tiles.

Gameplay collision must continue to come from authored layout data, not from opaque image bounds.

The scene should be able to swap artwork without rewriting movement or chase rules.

---

## 13. Readability constraints

1. protagonist silhouette must remain distinguishable against every gameplay surface;
2. walkable surfaces must use stronger edge contrast than background silhouettes;
3. decorative foreground cannot hide the player during precision jumps;
4. red danger tint may not erase amber player readability;
5. apparent platforms must match real collision;
6. hazards must telegraph before dealing unavoidable damage;
7. visual noise must decrease around the player during high-speed chase moments.

---

## 14. Performance constraints

Sprint A should stay compatible with the current web-first Phaser/Vite stack.

Requirements:
- pixel-art rendering remains enabled;
- avoid per-frame allocation of large graphics collections;
- reuse textures and particles where practical;
- parallax layers should be static or cheaply animated;
- no shader dependency is required for Sprint A;
- no backend dependency;
- no login;
- no new runtime framework.

The art pass should be deployable through the existing Vercel Git integration.

---

## 15. Testing and validation

Automated tests cannot prove visual quality, but they must prevent the art pass from breaking gameplay.

Sprint A implementation must preserve:

- Player movement tests;
- Player inheritance regression contract;
- FirstThreatLayout invariants;
- ThreatChaseController tests;
- build success with `npm run build`.

Add structural tests or source contracts where useful to catch:
- missing asset paths;
- accidental gameplay constant changes;
- collision-layout changes not explicitly approved.

Manual browser playtest checklist:

1. can the protagonist always be located instantly?
2. is the route readable at running speed?
3. does the 650 ms warning visually communicate danger?
4. does the predator feel huge?
5. does the reveal feel scary before it becomes funny?
6. does the scene look like a cellar rather than abstract platforms?
7. do giant props communicate scale?
8. does the chase still feel as responsive as the approved prototype?
9. are there any decorative false platforms?
10. does the game retain good readability on a typical laptop viewport?

---

## 16. Sprint A acceptance criteria

Sprint A is accepted when:

- M1 movement and chase tuning remain unchanged;
- the Vercel build passes;
- no M0/M1 automated regression appears;
- procedural greybox surfaces are visually replaced by a coherent cellar art language;
- at least one giant household prop creates a strong scale read;
- the Ancient Predator visibly reads as an enormous slipper silhouette;
- lighting follows the canonical color semantics;
- depth layering includes macro background, atmosphere, gameplay plane and foreground;
- the player remains readable during the entire chase;
- browser playtest confirms the existing "game feel" was preserved.

---

## 17. Explicit non-goals for Sprint A

Do not add yet:

- combat system;
- twelve enemies;
- Adaptation Engine;
- Adaptive Stress;
- power-up inventory;
- full Sir Chinellus boss fight;
- new biome progression;
- backend;
- account/login;
- mobile controls;
- new movement abilities;
- chase retuning unless a separate playtest decision explicitly requests it.

---

## 18. Approved roadmap after Sprint A

### Sprint B — "The scenario wants me dead"
Steam, water, adhesive and crusher as systemic hazards.

### Sprint C — "The world is alive"
Dust Mite, Larva and Pipe Spider using reusable enemy behavior foundations.

### Sprint D — "I can learn"
Adaptive Stress + Experience Event foundation.

### Sprint E — "Metroidvania begins"
One adaptation changes traversal and enables meaningful backtracking.

---

## 19. Production rule

Do not create an asset only because it looks cool.

Every asset should materially serve at least one of:

- atmosphere;
- gameplay;
- narrative;
- adaptation.

The best assets should serve several at once.

---

## 20. Guiding statement

At first:

> **THE WORLD IS THE MONSTER.**

Then:

> **YOU LEARN HOW IT WORKS.**

Finally:

> **YOU LEARN TO USE IT.**

That progression is the core identity of BARATOZANDO.

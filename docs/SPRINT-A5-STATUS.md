# Sprint A.5 Status — Mobility Reframe

## Implemented in Mobility Lab V2 scope
- vertical input (W/S and arrows)
- opt-in Mobility V2 tuning; First Threat remains legacy
- 2-charge Wing Flutter
- bounded glide that cannot be refreshed by release/re-hold
- landing immediately restores flaps and clears flap cooldown
- wall cling / wall crawl
- wall scramble jump with detach lock
- stable wall grip restores the wing loop
- new mobility animation states
- 1792×928 vertical training layout
- recovery floors
- progressive one-concept-at-a-time tutorial prompts
- handcrafted Pantry Ascent visual composition using existing BARATOZANDO assets
- vertical camera behavior

## Automated / build evidence
- local `npm test`: PASS — 13/13 A.5 workspace test files plus source contracts
- local `npm run build:offline`: PASS
- canonical Vercel / Vite build: PASS
- verified code commit: `f6b0404d38fbd9508124fc1b5b87a1c74223fd22`

## Isolation evidence
- `FirstThreatScene.ts`: unchanged
- `FirstThreatLayout.ts`: unchanged
- First Threat/chase remains legacy until Mobility Lab V2 is approved

## Self-review fixes before playtest
- fixed initial spawn embedded inside the start crate
- fixed glide-budget exploit caused by release/re-hold
- changed onboarding from all-controls-at-once to progressive prompts
- fixed landing so the next wing flap is immediately responsive

## Deferred minor
- ledge-assist values exist in Mobility V2 config, but ledge assist is intentionally not implemented yet. We should first determine whether wing recovery + wall mobility + recovery floors already make beginner traversal forgiving enough.

## Remaining gate
Browser playtest approval of Mobility Lab V2 before First Threat is re-authored or Sir Chinellus is revisited.

## Review note
Whole-branch review was a self-review because no independent subagent reviewer was available in this harness.

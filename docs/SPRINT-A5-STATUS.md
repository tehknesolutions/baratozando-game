# Sprint A.5 Status — Mobility Reframe

## Implemented in Mobility Lab V2 scope
- vertical input (W/S and arrows)
- opt-in Mobility V2 tuning; First Threat remains legacy
- 2-charge Wing Flutter
- bounded glide
- wall cling / wall crawl
- wall scramble jump with detach lock
- wall grip wing reset
- new mobility animation states
- 1792×928 vertical training layout
- recovery floors
- handcrafted Pantry Ascent visual composition using existing BARATOZANDO assets
- vertical camera behavior

## Automated evidence
- local `npm test`: PASS — 12/12 test files plus source contracts
- local `npm run build:offline`: PASS
- canonical Vite/Vercel build: PENDING

## Explicitly unchanged
- First Threat layout and chase tuning
- combat
- enemies
- Adaptation Engine / Adaptive Stress
- unrestricted flight
- ceiling crawl

## Remaining gate
Browser playtest approval of Mobility Lab V2 before First Threat is re-authored.

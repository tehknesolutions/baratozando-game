# ROACH-10 — Visual Lock Checklist

The master cannot move beyond CANDIDATE until every item is explicitly verified against the canonical reference.

## Binary
- [ ] `roach_side_right_master.png` exists in the repository.
- [ ] PNG with real alpha channel.
- [ ] Long edge >= 2048 px.
- [ ] No presentation board, labels, background, floor, baked shadow or checkerboard.
- [ ] Dimensions, byte size and SHA-256 recorded in the manifest.

## Identity
- [ ] Right-facing silhouette matches the approved premium identity.
- [ ] Exactly six legs, with coherent attachment points.
- [ ] Exactly two antennae with stable roots.
- [ ] Head, pronotum and abdomen proportions are stable.
- [ ] Elytra and wing anatomy are coherent.
- [ ] Dark realistic chitin/material language is preserved.
- [ ] No independent redesign that breaks continuity with the canonical reference.

## Production
- [ ] Authority remains `CANDIDATE` during review.
- [ ] `runtimeReady=false` during review.
- [ ] Explicit visual approval recorded before `APPROVED`.
- [ ] `LOCKED` requires checksum freeze.
- [ ] Runtime derivatives are generated only from the LOCKED master.

Any failed item blocks merge as a completed visual lock.

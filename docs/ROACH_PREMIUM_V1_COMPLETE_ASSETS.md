# ROACH PREMIUM V1 — Complete Board Extraction

Issue: #21  
Branch: art/roach-premium-v1-complete-assets  
Status: REFERENCE_ASSET_PACKAGE

The approved 1536x1024 delivery board has been decomposed into 37 named reference assets across canonical views, scale, anatomy, materials, key poses, context, identity and atlas preview.

These crops are intentionally **not** runtime sprites. The board contains presentation backgrounds/checkerboards and does not satisfy the transparent-master gate. Runtime promotion remains BLOCKED until isolated RGBA masters pass identity, alpha, bounds, scale/origin and pose-continuity QA.

The package manifest records the family counts. Binary presence must be complete before this PR may be merged.

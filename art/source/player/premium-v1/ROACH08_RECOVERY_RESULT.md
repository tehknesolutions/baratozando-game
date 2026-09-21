# ROACH-08 recovery result

## Search result
The historical source binary declared by `roach_master_hd_v1.manifest.json` could not be recovered from the repository or the available project/user asset locations.

Expected locked source:
- file: `roach_master_hd_v1.png`
- dimensions: 1812x1163
- SHA-256: `68b101d1208b4ac4280edf7e46e918ae30f01005ba8e2f7b2e5a7b4e30a7dbd9`

Only the 1024x657 runtime reference was found locally:
- `roach_master_hd_v1_1024.png`
- SHA-256: `6493461b077da87709a23771e5752944444c343729ccb813d7966144a7daca0d`

## Decision
Do not impersonate the 1024 reference as the missing locked master.
The historical lock is now treated as provenance evidence only until the exact binary is recovered.

## Production path
ROACH PREMIUM V1 must create a new isolated high-resolution side-right master under the repository-first contract. It begins as CANDIDATE and requires explicit visual approval before APPROVED/LOCKED.

No presentation-board generation is part of this path.
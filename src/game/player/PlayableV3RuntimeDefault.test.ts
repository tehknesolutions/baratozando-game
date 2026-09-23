import assert from 'node:assert/strict';
import { PLAYABLE_V3_RUNTIME_DEFAULT } from './PlayableV3RuntimeDefault.js';

assert.equal(PLAYABLE_V3_RUNTIME_DEFAULT.assetContractId, 'ROACH_PLAYABLE_V3');
assert.equal(PLAYABLE_V3_RUNTIME_DEFAULT.premiumVisualByDefault, true);
assert.equal(PLAYABLE_V3_RUNTIME_DEFAULT.legacyVisualRequiresExplicitOptIn, true);
assert.equal(PLAYABLE_V3_RUNTIME_DEFAULT.sceneMaySilentlyDowngrade, false);

console.log('Playable V3 runtime default contract: PASS');

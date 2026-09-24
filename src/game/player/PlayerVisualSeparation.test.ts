import assert from 'node:assert/strict';
import { PLAYER_VISUAL_SEPARATION } from './PlayerVisualSeparation.js';

assert.equal(PLAYER_VISUAL_SEPARATION.actorOwnsPremiumTexture, false);
assert.equal(PLAYER_VISUAL_SEPARATION.actorOwnsPremiumScale, false);
assert.equal(PLAYER_VISUAL_SEPARATION.visualOwnsPremiumTexture, true);
assert.equal(PLAYER_VISUAL_SEPARATION.visualOwnsPremiumScale, true);
assert.equal(PLAYER_VISUAL_SEPARATION.visualHasPhysicsBody, false);
assert.equal(PLAYER_VISUAL_SEPARATION.actorHasPhysicsBody, true);

console.log('Player/RoachVisual authority separation contract: PASS');

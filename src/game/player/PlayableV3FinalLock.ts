import { PLAYABLE_V3_SCALE } from './PlayableV3Scale.js';
import { PLAYER_PHYSICS_CONTRACT } from './PlayerPhysicsContract.js';
import { PLAYER_VISUAL_SEPARATION } from './PlayerVisualSeparation.js';

/** Single composed authority for the final Playable V3 player invariants. */
export const PLAYABLE_V3_FINAL_LOCK = Object.freeze({
  contractId: 'PLAYABLE_V3_FINAL_LOCK',
  visualScale: PLAYABLE_V3_SCALE.worldScale,
  sceneLocalScaleAllowed: PLAYABLE_V3_SCALE.sceneLocalScaleAllowed,
  bodyWidth: PLAYER_PHYSICS_CONTRACT.bodyWidth,
  bodyHeight: PLAYER_PHYSICS_CONTRACT.bodyHeight,
  bodyOffsetX: PLAYER_PHYSICS_CONTRACT.bodyOffsetX,
  bodyOffsetY: PLAYER_PHYSICS_CONTRACT.bodyOffsetY,
  actorOwnsPremiumScale: PLAYER_VISUAL_SEPARATION.actorOwnsPremiumScale,
  visualOwnsPremiumScale: PLAYER_VISUAL_SEPARATION.visualOwnsPremiumScale,
  visualHasPhysicsBody: PLAYER_VISUAL_SEPARATION.visualHasPhysicsBody,
} as const);

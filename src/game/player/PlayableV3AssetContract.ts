export const PLAYABLE_V3_ASSET_CONTRACT = Object.freeze({
  id: 'ROACH_PLAYABLE_V3',
  visualIdentity: 'ROACH_MASTER_PREMIUM_V1',
  visualIdentityPath: 'art/source/player/premium-v1-complete',
  animationSource: 'ROACH_PLAYER_DARK_HORROR_V1',
  animationSourcePath: 'art/source/player/final-v1',
  referenceBoardsAreRuntimeSprites: false,
  sceneLocalScaleAllowed: false,
  requiredAnatomy: Object.freeze([
    'complete-body',
    'six-legs',
    'antennae',
    'wings',
  ]),
  requiredStates: Object.freeze([
    'idle',
    'walk',
    'run',
    'jump',
    'fall',
    'dodge',
    'attack',
    'hurt',
    'death',
    'climb',
  ]),
} as const);

export type PlayableV3AssetContract = typeof PLAYABLE_V3_ASSET_CONTRACT;

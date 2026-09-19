export const CELLAR_TEXTURES = {
  wood: 'cellar-floor-wood',
  masonry: 'cellar-floor-masonry',
  metal: 'cellar-floor-metal',
  pipe: 'cellar-pipe-horizontal',
  fork: 'cellar-fork',
  bottle: 'cellar-bottle',
  can: 'cellar-can',
  crate: 'cellar-crate',
  cable: 'cellar-cable',
  drain: 'cellar-drain',
  grime: 'cellar-grime',
  mold: 'cellar-mold',
  dust: 'cellar-dust',
} as const;

export const SIR_CHINELLUS_TEXTURE_KEY = 'sir-chinellus-silhouette';

export const ENVIRONMENT_ASSET_PATHS: Record<string, string> = {
  [CELLAR_TEXTURES.wood]: 'assets/environment/cellar/floor_wood.png',
  [CELLAR_TEXTURES.masonry]: 'assets/environment/cellar/floor_masonry.png',
  [CELLAR_TEXTURES.metal]: 'assets/environment/cellar/floor_metal.png',
  [CELLAR_TEXTURES.pipe]: 'assets/environment/cellar/pipe_horizontal.png',
  [CELLAR_TEXTURES.fork]: 'assets/environment/cellar/fork.png',
  [CELLAR_TEXTURES.bottle]: 'assets/environment/cellar/bottle.png',
  [CELLAR_TEXTURES.can]: 'assets/environment/cellar/can.png',
  [CELLAR_TEXTURES.crate]: 'assets/environment/cellar/crate.png',
  [CELLAR_TEXTURES.cable]: 'assets/environment/cellar/cable.png',
  [CELLAR_TEXTURES.drain]: 'assets/environment/cellar/drain.png',
  [CELLAR_TEXTURES.grime]: 'assets/environment/cellar/grime_decal.png',
  [CELLAR_TEXTURES.mold]: 'assets/environment/cellar/mold_decal.png',
  [CELLAR_TEXTURES.dust]: 'assets/environment/cellar/dust_particle.png',
  [SIR_CHINELLUS_TEXTURE_KEY]: 'assets/threats/sir-chinellus/sir_chinellus_silhouette.png',
};

import { existsSync, readFileSync } from 'node:fs';

const paths = [
  'public/assets/environment/cellar/floor_wood.png',
  'public/assets/environment/cellar/floor_masonry.png',
  'public/assets/environment/cellar/floor_metal.png',
  'public/assets/environment/cellar/pipe_horizontal.png',
  'public/assets/environment/cellar/fork.png',
  'public/assets/environment/cellar/bottle.png',
  'public/assets/environment/cellar/can.png',
  'public/assets/environment/cellar/crate.png',
  'public/assets/environment/cellar/cable.png',
  'public/assets/environment/cellar/drain.png',
  'public/assets/environment/cellar/grime_decal.png',
  'public/assets/environment/cellar/mold_decal.png',
  'public/assets/environment/cellar/dust_particle.png',
  'public/assets/threats/sir-chinellus/sir_chinellus_silhouette.png',
];

const pngSignature = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);

for (const path of paths) {
  if (!existsSync(path)) throw new Error(`missing asset: ${path}`);
  const head = readFileSync(path).subarray(0, 8);
  if (!head.equals(pngSignature)) throw new Error(`invalid PNG signature: ${path}`);
}

console.log(`PASS ${paths.length} environment asset files`);

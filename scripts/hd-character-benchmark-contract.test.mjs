import { existsSync, readFileSync } from 'node:fs';

const keys = readFileSync('src/assets/assetKeys.ts', 'utf8');
const boot = readFileSync('src/game/scenes/BootScene.ts', 'utf8');
const player = readFileSync('src/game/player/Player.ts', 'utf8');
const animator = readFileSync('src/game/player/PlayerAnimationController.ts', 'utf8');
const lab = readFileSync('src/game/scenes/MobilityLabV2Scene.ts', 'utf8');

for (const key of ['player-hd-master', 'player-hd-wing', 'player-hd-wall']) {
  if (!keys.includes(key)) throw new Error(`missing HD benchmark texture key: ${key}`);
}
for (const path of [
  'assets/player/hd-v2/roach_master_hd_v1_1024.png',
  'assets/player/hd-v2/roach_wing_hd_v1_1024.png',
  'assets/player/hd-v2/roach_wall_hd_v1_1024.png',
]) {
  if (!keys.includes(path)) throw new Error(`missing HD benchmark asset path: ${path}`);
}
for (const path of [
  'public/assets/player/hd-v2/roach_master_hd_v1_1024.png',
  'public/assets/player/hd-v2/roach_wing_hd_v1_1024.png',
  'public/assets/player/hd-v2/roach_wall_hd_v1_1024.png',
]) {
  if (!existsSync(path)) throw new Error(`missing HD benchmark binary: ${path}`);
}

if (!boot.includes('HD_PLAYER_ASSET_PATHS')) throw new Error('BootScene must preload HD benchmark assets');
if (!player.includes('hdCharacterBenchmark?: boolean')) throw new Error('HD benchmark must remain explicit opt-in');
if (!player.includes('body.setSize(30, 18, false)')) throw new Error('HD benchmark must not change the 30x18 physics body');
if (!animator.includes('IDLE: HD_PLAYER_BENCHMARK.idle')) throw new Error('IDLE must map to HD master');
if (!animator.includes('WING_FLAP: HD_PLAYER_BENCHMARK.wing')) throw new Error('WING_FLAP must map to HD wing');
if (!animator.includes('GLIDE: HD_PLAYER_BENCHMARK.wing')) throw new Error('GLIDE must map to HD wing');
if (!animator.includes('WALL_CLING: HD_PLAYER_BENCHMARK.wall')) throw new Error('WALL_CLING must map to HD wall');
if (!animator.includes('WALL_CLIMB: HD_PLAYER_BENCHMARK.wall')) throw new Error('WALL_CLIMB must map to HD wall');
if (!lab.includes('hdCharacterBenchmark: true')) throw new Error('Mobility Lab V2 must explicitly enable HD benchmark');
console.log('PASS HD character benchmark code contract');

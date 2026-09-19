import { existsSync, readFileSync } from 'node:fs';

const required = [
  'art/source/player/roach_master.svg',
  'art/source/player/roach_master.manifest.json',
  'public/assets/player/wall_climb_01.png',
  'public/assets/player/wall_climb_02.png',
  'public/assets/player/wall_climb_03.png',
  'public/assets/player/wall_climb_04.png',
];

for (const p of required) {
  if (!existsSync(p)) throw new Error(`missing A6.1 asset: ${p}`);
}

function pngSize(path) {
  const b = readFileSync(path);
  const sig = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
  if (!b.subarray(0,8).equals(sig)) throw new Error(`invalid PNG: ${path}`);
  return { w:b.readUInt32BE(16), h:b.readUInt32BE(20), bytes:b.length };
}

for (let i=1;i<=4;i++) {
  const s = pngSize(`public/assets/player/wall_climb_0${i}.png`);
  if (s.w !== 64 || s.h !== 64) {
    throw new Error(`runtime wall climb ${i} must be 64x64 during compatibility pilot`);
  }
}

const master = readFileSync('art/source/player/roach_master.svg','utf8');
for (const id of ['roach-rig','antennae','abdomen','elytra','legs-far','legs-near','thorax','head','adaptive-seam']) {
  if (!master.includes(`id="${id}"`)) throw new Error(`master rig missing named group ${id}`);
}

const meta = JSON.parse(readFileSync('art/source/player/roach_master.manifest.json','utf8'));
if (meta.canvas?.width !== 256 || meta.canvas?.height !== 256) throw new Error('master canvas must be 256x256');
if (meta.pivotPx?.x !== 128 || meta.pivotPx?.y !== 218) throw new Error('master pivot changed unexpectedly');
if (meta.animation?.wallClimb?.frames?.length !== 4) throw new Error('wall climb pilot must contain exactly 4 frames');

console.log('PASS A6.1 wall climb asset contract');

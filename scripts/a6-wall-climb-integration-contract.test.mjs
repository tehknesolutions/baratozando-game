import { readFileSync } from 'node:fs';

const keys = readFileSync('src/assets/assetKeys.ts','utf8');
const anim = readFileSync('src/game/player/PlayerAnimationController.ts','utf8');

if (!/wallClimb\s*:\s*\[/.test(keys)) throw new Error('PLAYER_FRAMES.wallClimb is missing');

for (let i=1;i<=4;i++) {
  const k = `player-wall-climb-0${i}`;
  if (!keys.includes(k)) throw new Error(`missing key ${k}`);
  if (!keys.includes(`assets/player/wall_climb_0${i}.png`)) throw new Error(`missing runtime path for frame ${i}`);
}

if (!/WALL_CLIMB:\s*\{\s*frames:\s*PLAYER_FRAMES\.wallClimb/.test(anim)) {
  throw new Error('WALL_CLIMB still does not use dedicated wallClimb frames');
}

console.log('PASS A6.1 wall climb integration contract');

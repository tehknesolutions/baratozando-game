import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/game/player/Player.ts', import.meta.url), 'utf8');

if (/private\s+readonly\s+input\s*:\s*InputController/.test(source)) {
  console.error('FAIL Player must not shadow Phaser Sprite.input with a private input field');
  process.exit(1);
}

if (/this\.input\.sample\(\)/.test(source)) {
  console.error('FAIL Player must read controls through inputController, not Sprite.input');
  process.exit(1);
}

console.log('PASS Player inheritance contract');

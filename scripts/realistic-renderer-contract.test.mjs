import { readFileSync } from 'node:fs';

const main=readFileSync('src/main.ts','utf8');
const css=readFileSync('src/style.css','utf8');
const player=readFileSync('src/game/player/Player.ts','utf8');

for (const token of ['pixelArt: false','roundPixels: false','antialias: true']) {
  if (!main.includes(token)) throw new Error(`realistic renderer lock missing: ${token}`);
}
if (/pixelArt:\s*true/.test(main)) throw new Error('pixelArt must remain disabled for realistic premium art');
if (/roundPixels:\s*true/.test(main)) throw new Error('roundPixels must remain disabled for subpixel smooth rendering');
if (/antialias:\s*false/.test(main)) throw new Error('antialias must remain enabled');
if (!/canvas\s*\{[^}]*image-rendering:\s*auto/i.test(css)) throw new Error('canvas CSS must use image-rendering:auto');
if (/image-rendering:\s*(pixelated|crisp-edges)/i.test(css)) throw new Error('browser must not force pixelated scaling');
if (!player.includes('body.setSize(30, 18, false)') || !player.includes('body.setOffset(17, 42)')) {
  throw new Error('renderer promotion must not alter player physics body');
}
console.log('PASS ENV-01 realistic renderer lock contract');

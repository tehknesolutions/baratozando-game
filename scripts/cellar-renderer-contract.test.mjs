import { readFileSync, existsSync } from 'node:fs';

if (!existsSync('src/game/visual/CellarArtDirector.ts')) throw new Error('CellarArtDirector.ts missing');
const scene = readFileSync('src/game/scenes/FirstThreatScene.ts', 'utf8');
const director = readFileSync('src/game/visual/CellarArtDirector.ts', 'utf8');

if (!scene.includes('CellarArtDirector')) throw new Error('FirstThreatScene must delegate environment rendering');
if (!director.includes('tileSprite')) throw new Error('platform visuals must tile against collider dimensions');
if (!scene.includes('setVisible(false)')) throw new Error('physics platform rectangles must be invisible after art binding');

console.log('PASS cellar renderer contract');

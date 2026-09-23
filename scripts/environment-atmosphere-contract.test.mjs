import { readFileSync, existsSync } from 'node:fs';

const atmospherePath='src/game/visual/CellarAtmosphere.ts';
if (!existsSync(atmospherePath)) throw new Error('CellarAtmosphere.ts missing');

const atmosphere=readFileSync(atmospherePath,'utf8');
const cellar=readFileSync('src/game/visual/CellarArtDirector.ts','utf8');
const mobility=readFileSync('src/game/visual/MobilityLabArtDirector.ts','utf8');
const player=readFileSync('src/game/player/Player.ts','utf8');

for (const token of ['addDepthHaze','addSoftLight','addContactShadow','addScreenVignette','Phaser.BlendModes.ADD']) {
  if (!atmosphere.includes(token)) throw new Error(`atmosphere primitive missing: ${token}`);
}
for (const [name,source] of [['cellar',cellar],['mobility',mobility]]) {
  for (const token of ['CellarAtmosphere.addDepthHaze','CellarAtmosphere.addContactShadow','CellarAtmosphere.addSoftLight','CellarAtmosphere.addScreenVignette']) {
    if (!source.includes(token)) throw new Error(`${name} realistic pass missing: ${token}`);
  }
}
if (!player.includes('body.setSize(30, 18, false)') || !player.includes('body.setOffset(17, 42)')) {
  throw new Error('ENV-02 must not alter player physics');
}
if (!cellar.includes('layout.platforms.forEach') || !mobility.includes('layout.surfaces')) {
  throw new Error('ENV-02 must decorate existing authored geometry rather than replace it');
}
console.log('PASS ENV-02 realistic atmosphere/depth/lighting contract');

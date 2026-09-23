import { existsSync, readFileSync } from 'node:fs';

const path='src/game/visual/CellarCinematicComposition.ts';
if (!existsSync(path)) throw new Error('ENV-04 cinematic composition layer missing');

const cinematic=readFileSync(path,'utf8');
const cellar=readFileSync('src/game/visual/CellarArtDirector.ts','utf8');
const mobility=readFileSync('src/game/visual/MobilityLabArtDirector.ts','utf8');
const firstThreat=readFileSync('src/game/scenes/FirstThreatScene.ts','utf8');
const mobilityScene=readFileSync('src/game/scenes/MobilityLabV2Scene.ts','utf8');

for (const token of [
  'FIRST_THREAT_FOREGROUND',
  'FIRST_THREAT_FOCALS',
  'FIRST_THREAT_SHADOWS',
  'MOBILITY_FOREGROUND',
  'MOBILITY_FOCALS',
  'MOBILITY_SHADOWS',
  'CELLAR_TEXTURE_DISPLAY_SCALE',
  'Phaser.BlendModes.ADD',
  'setScrollFactor(cue.scrollFactor)',
]) {
  if (!cinematic.includes(token)) throw new Error(`ENV-04 composition primitive missing: ${token}`);
}

const foregroundDepths=[...cinematic.matchAll(/depth:\s*(3[2-6])/g)].map(m=>Number(m[1]));
if (foregroundDepths.length < 6) throw new Error('ENV-04 foreground cue matrix incomplete');
if (foregroundDepths.some(d=>d>=50)) throw new Error('ENV-04 foreground occluders must remain below player depth 50');

const parallax=[...cinematic.matchAll(/scrollFactor:\s*(1\.\d+)/g)].map(m=>Number(m[1]));
if (parallax.length < 6 || parallax.some(v=>v<=1)) throw new Error('ENV-04 near-camera parallax cues missing');

if (!cellar.includes('CellarCinematicComposition.addFirstThreat(scene)')) throw new Error('FirstThreat cinematic composition not wired');
if (!mobility.includes('CellarCinematicComposition.addMobilityLab(scene)')) throw new Error('MobilityLab cinematic composition not wired');

if (!firstThreat.includes('this.player.setDepth(50)')) throw new Error('FirstThreat player readability depth changed');
if (!mobilityScene.includes('this.player.setDepth(50)')) throw new Error('MobilityLab player readability depth changed');

if (!cellar.includes('layout.platforms.forEach') || !mobility.includes('layout.surfaces')) {
  throw new Error('ENV-04 must decorate existing authored gameplay geometry');
}

console.log('PASS ENV-04 cinematic foreground/focal/readability contract');

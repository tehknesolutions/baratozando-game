import { existsSync, readFileSync } from 'node:fs';

const path='src/game/visual/CellarNarrativeDressing.ts';
if (!existsSync(path)) throw new Error('ENV-05 narrative dressing layer missing');

const dressing=readFileSync(path,'utf8');
const cellar=readFileSync('src/game/visual/CellarArtDirector.ts','utf8');
const mobility=readFileSync('src/game/visual/MobilityLabArtDirector.ts','utf8');
const firstThreatScene=readFileSync('src/game/scenes/FirstThreatScene.ts','utf8');
const mobilityScene=readFileSync('src/game/scenes/MobilityLabV2Scene.ts','utf8');

for (const token of [
  'FIRST_THREAT_PROPS',
  'FIRST_THREAT_STAINS',
  'FIRST_THREAT_SCRATCHES',
  'FIRST_THREAT_DEBRIS',
  'MOBILITY_PROPS',
  'MOBILITY_STAINS',
  'MOBILITY_SCRATCHES',
  'MOBILITY_DEBRIS',
  'addLocalizedGrime',
  'collision: false',
]) {
  if (!dressing.includes(token)) throw new Error(`ENV-05 narrative primitive missing: ${token}`);
}

if (dressing.includes('.add.text(')) throw new Error('ENV-05 must tell story without text overlays');

const propEntries=[...dressing.matchAll(/texture:\s*CELLAR_TEXTURES\.(\w+),\s*x:/g)];
if (propEntries.length < 10) throw new Error('ENV-05 narrative prop matrix incomplete');

const collisionFlags=[...dressing.matchAll(/collision:\s*false/g)];
if (collisionFlags.length < 10) throw new Error('ENV-05 dressing props must be non-colliding');

const depths=[...dressing.matchAll(/depth:\s*(\d+(?:\.\d+)?)/g)].map(m=>Number(m[1]));
if (depths.some(d=>d>=50)) throw new Error('ENV-05 narrative dressing must remain below player depth 50');

const alphas=[...dressing.matchAll(/alpha:\s*(0\.\d+)/g)].map(m=>Number(m[1]));
if (alphas.some(a=>a>0.80)) throw new Error('ENV-05 dressing must remain restrained for gameplay readability');

if (!cellar.includes('CellarNarrativeDressing.addFirstThreat(scene)')) throw new Error('FirstThreat narrative dressing not wired');
if (!mobility.includes('CellarNarrativeDressing.addMobilityLab(scene)')) throw new Error('MobilityLab narrative dressing not wired');

if (!firstThreatScene.includes('this.player.setDepth(50)')) throw new Error('FirstThreat player readability depth changed');
if (!mobilityScene.includes('this.player.setDepth(50)')) throw new Error('MobilityLab player readability depth changed');

console.log('PASS ENV-05 narrative set-dressing/readability contract');

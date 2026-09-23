import { existsSync, readFileSync } from 'node:fs';

const path='src/game/visual/CellarAmbientMotion.ts';
if (!existsSync(path)) throw new Error('ENV-06 ambient motion layer missing');

const motion=readFileSync(path,'utf8');
const cellar=readFileSync('src/game/visual/CellarArtDirector.ts','utf8');
const mobility=readFileSync('src/game/visual/MobilityLabArtDirector.ts','utf8');
const firstThreatScene=readFileSync('src/game/scenes/FirstThreatScene.ts','utf8');
const mobilityScene=readFileSync('src/game/scenes/MobilityLabV2Scene.ts','utf8');

for (const token of [
  'addDeterministicFlicker',
  'addDustDrift',
  'addHazeBreathing',
  'addShadowOscillation',
  'addDrips',
  'scene.time.addEvent',
  'scene.tweens.add',
  'repeat: -1',
  'CELLAR_TEXTURES.dust',
]) {
  if (!motion.includes(token)) throw new Error(`ENV-06 motion primitive missing: ${token}`);
}

if (motion.includes('Math.random')) throw new Error('ENV-06 visual motion must remain deterministic');
if (motion.includes('physics.')) throw new Error('ENV-06 must not touch gameplay physics');
if (motion.includes('.add.collider') || motion.includes('.add.overlap')) throw new Error('ENV-06 must not add gameplay collision');

const depths=[...motion.matchAll(/\.setDepth\(([-\d.]+)\)/g)].map(m=>Number(m[1]));
if (depths.some(d=>d>=50)) throw new Error('ENV-06 effect depth must remain below player depth 50');

const alphas=[...motion.matchAll(/setAlpha\((0\.\d+)/g)].map(m=>Number(m[1]));
if (alphas.some(a=>a>0.20)) throw new Error('ENV-06 animated alpha exceeds readability ceiling');

if (!cellar.includes('CellarAmbientMotion.addFirstThreat(scene)')) throw new Error('FirstThreat ambient motion not wired');
if (!mobility.includes('CellarAmbientMotion.addMobilityLab(scene)')) throw new Error('MobilityLab ambient motion not wired');

if (!firstThreatScene.includes('this.player.setDepth(50)')) throw new Error('FirstThreat player readability depth changed');
if (!mobilityScene.includes('this.player.setDepth(50)')) throw new Error('MobilityLab player readability depth changed');

console.log('PASS ENV-06 dynamic horror ambience/readability contract');

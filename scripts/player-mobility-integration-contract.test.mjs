import { readFileSync } from 'node:fs';
const source = readFileSync('src/game/player/Player.ts', 'utf8');
for (const token of ['WingMobilityController', 'WallMobilityController', 'MOBILITY_V2', 'setWallContactProvider']) {
  if (!source.includes(token)) throw new Error(`Player integration missing ${token}`);
}
if (/wingFlaps\s*=\s*2/.test(source)) throw new Error('Player must not own hard-coded flap counts');
if (/texture.*ROUGH_CLIMB|ROUGH_CLIMB.*texture/i.test(source)) throw new Error('Player must not infer surfaces from texture names');
if (!source.includes("mobilityV2?: boolean")) throw new Error('Mobility V2 must be opt-in so M1 remains legacy');
console.log('PASS Player mobility integration contract');

import { readFileSync } from 'node:fs';
const registry=readFileSync('src/assets/roachPremiumV1Package.ts','utf8');
const manifest=JSON.parse(readFileSync('art/source/player/premium-v1-complete/manifest.json','utf8'));
if(manifest.issue!==21) throw new Error('wrong ROACH issue');
if(manifest.count!==37) throw new Error('expected 37 extracted references');
if(!registry.includes("runtimeReady: false")) throw new Error('board crops must not be runtime-ready');
if(!registry.includes("runtimePromotion: 'BLOCKED'")) throw new Error('runtime promotion gate must remain blocked');
console.log('PASS ROACH premium V1 package contract');

import { readFileSync } from 'node:fs';

const registry = readFileSync('src/assets/roachPremiumV1Board.ts', 'utf8');
if (!registry.includes('assetCount: 39')) throw new Error('ROACH-06 must track 39 extracted assets');
if (!registry.includes("authority: 'REFERENCE'")) throw new Error('board assets must remain REFERENCE');
if (!registry.includes('runtimeReady: false')) throw new Error('board assets must not be runtime-ready');
if (!registry.includes('assertRoach06RuntimePromotion')) throw new Error('runtime promotion guard missing');
console.log('PASS ROACH-06 board asset governance contract');

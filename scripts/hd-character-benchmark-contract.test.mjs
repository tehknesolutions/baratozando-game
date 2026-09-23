import { readFileSync } from 'node:fs';

const boot=readFileSync('src/game/scenes/BootScene.ts','utf8');
const player=readFileSync('src/game/player/Player.ts','utf8');
const lab=readFileSync('src/game/scenes/MobilityLabV2Scene.ts','utf8');
const keys=readFileSync('src/assets/assetKeys.ts','utf8');

if (boot.includes('HD_PLAYER_ASSET_PATHS')) throw new Error('retired HD benchmark must not be preloaded by BootScene');
if (!boot.includes('PREMIUM_PLAYER_ASSET_PATHS')) throw new Error('BootScene must preload canonical premium player assets');
if (!player.includes('premiumVisual?: boolean')) throw new Error('Player must expose canonical premium visual runtime option');
if (!lab.includes('premiumVisual: true')) throw new Error('Mobility Lab V2 must enable canonical premium runtime');
if (!keys.includes('export const PREMIUM_PLAYER = PREMIUM_PLAYER_QA')) throw new Error('canonical premium player alias missing');
console.log('PASS legacy HD benchmark retirement / premium runtime replacement contract');

import { existsSync, readFileSync } from 'node:fs';

const promotionPath='art/source/player/premium-v1/runtime/premium_runtime_promotion.json';
if (!existsSync(promotionPath)) throw new Error('missing premium runtime promotion manifest');
const promotion=JSON.parse(readFileSync(promotionPath,'utf8'));
if (promotion.status!=='RUNTIME_READY_V1') throw new Error('promotion must be runtime ready after final gate');
if (promotion.runtimeReady!==true) throw new Error('promotion must be runtime-ready after final gate');
if (promotion.physicsBody.join(',')!=='30,18') throw new Error('physics body drift');
if (promotion.physicsOffset.join(',')!=='17,42') throw new Error('physics offset drift');
if (promotion.families.length!==14) throw new Error('premium family matrix incomplete');

const animator=readFileSync('src/game/player/PlayerAnimationController.ts','utf8');
const player=readFileSync('src/game/player/Player.ts','utf8');
const boot=readFileSync('src/game/scenes/BootScene.ts','utf8');
const lab=readFileSync('src/game/scenes/MobilityLabV2Scene.ts','utf8');
const movement=readFileSync('src/game/scenes/MovementLabScene.ts','utf8');
const threat=readFileSync('src/game/scenes/FirstThreatScene.ts','utf8');

if (!animator.includes('PREMIUM_PLAYER')) throw new Error('animator must use canonical premium player mapping');
if (animator.includes("state === 'IDLE' || state === 'BOOT' || state === 'RESPAWN'")) throw new Error('RESPAWN is shadowed by idle branch');
for (const token of ['respawnFrames','dodgeFrames','hurtFrames','deathFrames','wallJumpFrames','wingFlapFrames']) {
  if (!animator.includes(token)) throw new Error(`animator missing premium runtime family: ${token}`);
}
if (player.includes('TEMP QA - hard render lock')) throw new Error('temporary hard render lock must be removed');
if (!player.includes('body.setSize(30, 18, false)') || !player.includes('body.setOffset(17, 42)')) throw new Error('physics body changed during visual promotion');
if (!player.includes('delayedCall(400')) throw new Error('respawn visual window not integrated');
if (player.includes('this.setAlpha(0.25)')) throw new Error('sprite alpha must not double-attenuate baked respawn alpha frames');
if (!boot.includes('PREMIUM_PLAYER_ASSET_PATHS')) throw new Error('premium assets not preloaded');
for (const [name,source] of [['mobility',lab],['movement',movement],['threat',threat]]) {
  if (!source.includes('premiumVisual: true')) throw new Error(`${name} scene does not enable premium runtime`);
}
console.log('PASS ROACH-19 premium runtime final runtime integration contract');

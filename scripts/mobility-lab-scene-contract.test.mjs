import { existsSync, readFileSync } from 'node:fs';
if (!existsSync('src/game/scenes/MobilityLabV2Scene.ts')) throw new Error('MobilityLabV2Scene missing');
const scene = readFileSync('src/game/scenes/MobilityLabV2Scene.ts','utf8');
const boot = readFileSync('src/game/scenes/BootScene.ts','utf8');
const main = readFileSync('src/main.ts','utf8');
for (const token of ["super('mobility-lab-v2')", 'mobilityV2: true', 'setWallContactProvider', 'setDeadzone']) {
  if (!scene.includes(token)) throw new Error(`MobilityLabV2Scene missing ${token}`);
}
if (!boot.includes("this.scene.start('mobility-lab-v2')")) throw new Error('BootScene must start Mobility Lab V2 during tuning');
if (!main.includes('MobilityLabV2Scene')) throw new Error('main.ts must register MobilityLabV2Scene');
console.log('PASS MobilityLabV2Scene contract');

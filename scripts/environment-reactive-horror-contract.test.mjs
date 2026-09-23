import { readFileSync } from 'node:fs';

const core = readFileSync('src/game/horror/HorrorReactiveState.ts', 'utf8');
const scene = readFileSync('src/game/scenes/FirstThreatScene.ts', 'utf8');

for (const forbidden of ['Math.random', 'physics.', '.add.collider', '.add.overlap']) {
  if (core.includes(forbidden)) throw new Error(`ENV-07A core must not contain ${forbidden}`);
}

for (const token of [
  "from '../horror/HorrorReactiveState.js'",
  'resolveHorrorReactiveState({',
  'chaseState: this.chase.state',
  'threatGap: gap',
  'recentDamage: this.player.damage.isHurt(time)',
  'respawning: this.player.damage.respawning',
  'this.player.setDepth(50)',
  'this.horror.tension',
]) {
  if (!scene.includes(token)) throw new Error(`ENV-07A FirstThreat integration missing: ${token}`);
}

for (const premature of ['RoachFearState', 'BARATA_TONTA', 'PanicFlight', 'GHOWL']) {
  if (scene.includes(premature) || core.includes(premature)) throw new Error(`ENV-07A must not implement ${premature}`);
}

if (!scene.includes('Math.min(0.22')) throw new Error('ENV-07A overlay readability ceiling missing');
if (!scene.includes('Math.min(0.28')) throw new Error('ENV-07A dust readability ceiling missing');

console.log('PASS ENV-07A reactive horror integration contract');

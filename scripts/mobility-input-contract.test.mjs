import { readFileSync } from 'node:fs';

const intent = readFileSync('src/game/input/InputController.ts', 'utf8');
const keyboard = readFileSync('src/game/input/KeyboardInputAdapter.ts', 'utf8');

if (!intent.includes('moveY: AxisDirection')) throw new Error('PlayerIntent must expose moveY');
for (const token of ["up: 'W'", "upArrow: 'UP'", "down: 'S'", "downArrow: 'DOWN'"]) {
  if (!keyboard.includes(token)) throw new Error(`missing climb key mapping: ${token}`);
}
if (!keyboard.includes('moveY:')) throw new Error('KeyboardInputAdapter must resolve moveY');
if (!keyboard.includes("jump: 'SPACE'")) throw new Error('SPACE must remain the contextual mobility button');
if (/fly\s*:|flight\s*:/i.test(keyboard)) throw new Error('no separate flight key is allowed');

console.log('PASS mobility input contract');

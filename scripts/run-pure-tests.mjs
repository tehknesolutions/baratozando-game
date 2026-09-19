import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';

rmSync('.test-dist', { recursive: true, force: true });
const inheritanceContract = spawnSync(process.execPath, ['scripts/player-inheritance-contract.test.mjs'], { stdio: 'inherit' });
if (inheritanceContract.status !== 0) process.exit(inheritanceContract.status ?? 1);
const compile = spawnSync('tsc', ['-p', 'tsconfig.pure.json'], { stdio: 'inherit', shell: process.platform === 'win32' });
if (compile.status !== 0) process.exit(compile.status ?? 1);

const tests = [
  '.test-dist/game/player/PlayerMovementConfig.test.js',
  '.test-dist/game/player/MovementTimers.test.js',
  '.test-dist/game/player/PlayerStateMachine.test.js',
  '.test-dist/game/player/PlayerDamageController.test.js',
  '.test-dist/game/world/MovementLabLayout.test.js',
  '.test-dist/game/threat/ThreatChaseController.test.js',
  '.test-dist/game/world/FirstThreatLayout.test.js',
  '.test-dist/game/visual/SprintAFreezeContract.test.js',
];

for (const file of tests) {
  const run = spawnSync(process.execPath, [file], { stdio: 'inherit' });
  if (run.status !== 0) process.exit(run.status ?? 1);
}
console.log(`PASS ${tests.length}/${tests.length} test files`);

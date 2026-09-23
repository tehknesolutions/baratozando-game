import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';

rmSync('.test-dist', { recursive: true, force: true });

const contracts = [
  'scripts/player-inheritance-contract.test.mjs',
  'scripts/environment-assets-contract.test.mjs',
  'scripts/cellar-renderer-contract.test.mjs',
  'scripts/mobility-input-contract.test.mjs',
  'scripts/player-mobility-integration-contract.test.mjs',
  'scripts/mobility-lab-scene-contract.test.mjs',
  'scripts/a6-wall-climb-assets-contract.test.mjs',
  'scripts/a6-wall-climb-integration-contract.test.mjs',
  'scripts/hd-character-benchmark-contract.test.mjs',
  'scripts/realistic-renderer-contract.test.mjs',
  'scripts/environment-atmosphere-contract.test.mjs',
  'scripts/environment-premium-materials-contract.test.mjs',
  'scripts/environment-cinematic-composition-contract.test.mjs',
  'scripts/environment-narrative-dressing-contract.test.mjs',
  'scripts/environment-ambient-motion-contract.test.mjs',
  'scripts/premium-player-runtime-contract.test.mjs',
  'scripts/roach-premium-idle-family-contract.test.mjs',
  'scripts/roach-premium-walk-family-contract.test.mjs',
  'scripts/roach-premium-run-family-contract.test.mjs',
  'scripts/roach-premium-air-family-contract.test.mjs',
  'scripts/roach-premium-wing-family-contract.test.mjs',
  'scripts/roach-premium-wall-family-contract.test.mjs',
  'scripts/roach-premium-damage-family-contract.test.mjs',
];

for (const file of contracts) {
  const run = spawnSync(process.execPath, [file], { stdio: 'inherit' });
  if (run.status !== 0) process.exit(run.status ?? 1);
}

const compile = spawnSync('tsc', ['-p', 'tsconfig.pure.json'], { stdio: 'inherit', shell: process.platform === 'win32' });
if (compile.status !== 0) process.exit(compile.status ?? 1);

const tests = [
  '.test-dist/game/player/PlayerMovementConfig.test.js',
  '.test-dist/game/player/MobilityConfig.test.js',
  '.test-dist/game/player/WingMobilityController.test.js',
  '.test-dist/game/player/WallMobilityController.test.js',
  '.test-dist/game/player/WallContactSensor.test.js',
  '.test-dist/game/player/MovementTimers.test.js',
  '.test-dist/game/player/PlayerStateMachine.test.js',
  '.test-dist/game/player/PlayerDamageController.test.js',
  '.test-dist/game/world/MovementLabLayout.test.js',
  '.test-dist/game/world/MobilityLabV2Layout.test.js',
  '.test-dist/game/visual/MobilityLabVisualConfig.test.js',
  '.test-dist/game/visual/MobilityTutorial.test.js',
  '.test-dist/game/threat/ThreatChaseController.test.js',
  '.test-dist/game/world/FirstThreatLayout.test.js',
  '.test-dist/game/visual/SprintAFreezeContract.test.js',
  '.test-dist/game/visual/FirstThreatVisualConfig.test.js',
  '.test-dist/game/threat/SirChinellusVisualConfig.test.js',
  '.test-dist/game/visual/DangerVisualController.test.js',
];

for (const file of tests) {
  const run = spawnSync(process.execPath, [file], { stdio: 'inherit' });
  if (run.status !== 0) process.exit(run.status ?? 1);
}

console.log(`PASS ${tests.length}/${tests.length} test files`);

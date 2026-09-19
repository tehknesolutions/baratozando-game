import { spawnSync } from 'node:child_process';
import { rmSync } from 'node:fs';

rmSync('.test-dist', { recursive: true, force: true });
const inheritanceContract = spawnSync(process.execPath, ['scripts/player-inheritance-contract.test.mjs'], { stdio: 'inherit' });
if (inheritanceContract.status !== 0) process.exit(inheritanceContract.status ?? 1);
const environmentAssets = spawnSync(process.execPath, ['scripts/environment-assets-contract.test.mjs'], { stdio: 'inherit' });
if (environmentAssets.status !== 0) process.exit(environmentAssets.status ?? 1);
const cellarRenderer = spawnSync(process.execPath, ['scripts/cellar-renderer-contract.test.mjs'], { stdio: 'inherit' });
if (cellarRenderer.status !== 0) process.exit(cellarRenderer.status ?? 1);
const mobilityInput = spawnSync(process.execPath, ['scripts/mobility-input-contract.test.mjs'], { stdio: 'inherit' });
if (mobilityInput.status !== 0) process.exit(mobilityInput.status ?? 1);
const mobilityIntegration = spawnSync(process.execPath, ['scripts/player-mobility-integration-contract.test.mjs'], { stdio: 'inherit' });
if (mobilityIntegration.status !== 0) process.exit(mobilityIntegration.status ?? 1);
const mobilityLabScene = spawnSync(process.execPath, ['scripts/mobility-lab-scene-contract.test.mjs'], { stdio: 'inherit' });
if (mobilityLabScene.status !== 0) process.exit(mobilityLabScene.status ?? 1);
const compile = spawnSync('tsc', ['-p', 'tsconfig.pure.json'], { stdio: 'inherit', shell: process.platform === 'win32' });
if (compile.status !== 0) process.exit(compile.status ?? 1);

const tests = [
  '.test-dist/game/player/PlayerMovementConfig.test.js',
  '.test-dist/game/player/MobilityConfig.test.js',
  '.test-dist/game/player/WingMobilityController.test.js',
  '.test-dist/game/player/WallMobilityController.test.js',
  '.test-dist/game/player/MovementTimers.test.js',
  '.test-dist/game/player/PlayerStateMachine.test.js',
  '.test-dist/game/player/PlayerDamageController.test.js',
  '.test-dist/game/world/MovementLabLayout.test.js',
  '.test-dist/game/world/MobilityLabV2Layout.test.js',
  '.test-dist/game/visual/MobilityLabVisualConfig.test.js',
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

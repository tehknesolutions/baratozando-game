import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';

const outDir = '.tmp-tests';
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const compile = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['tsc', '-p', 'tsconfig.pure.json'], { stdio: 'inherit' });
if (compile.status !== 0) process.exit(compile.status ?? 1);

const tests = [
  'PlayerDamageController.test.js',
  'ThreatChaseController.test.js',
  'WingMobilityController.test.js',
  'PlayerMotionController.test.js',
  'HorrorReactiveState.test.js',
  'PlayableV3AssetContract.test.js',
  'PlayableV3RuntimeDefault.test.js',
  'PlayableV3Scale.test.js',
  'SafeSpawnResolver.test.js',
];

for (const test of tests) {
  const candidates = [`${outDir}/${test}`, `${outDir}/player/${test}`, `${outDir}/threat/${test}`, `${outDir}/horror/${test}`];
  const file = candidates.find((candidate) => existsSync(candidate));
  if (!file) { console.error(`Missing compiled test: ${test}`); process.exit(1); }
  const result = spawnSync(process.execPath, [file], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log('Pure gameplay tests: PASS');

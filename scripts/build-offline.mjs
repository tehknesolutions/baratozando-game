import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

rmSync('.browser-build', { recursive: true, force: true });
rmSync('dist', { recursive: true, force: true });
const compile = spawnSync('tsc', ['-p', 'tsconfig.browser.json'], { stdio: 'inherit', shell: process.platform === 'win32' });
if (compile.status !== 0) process.exit(compile.status ?? 1);

mkdirSync('dist', { recursive: true });
cpSync('.browser-build', 'dist', { recursive: true });
cpSync('public/assets', 'dist/assets', { recursive: true });
cpSync('src/style.css', 'dist/style.css');

const mainPath = join('dist', 'main.js');
const main = readFileSync(mainPath, 'utf8').replace("import './style.css';\n", '');
writeFileSync(mainPath, main);

writeFileSync('dist/index.html', `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#080706" />
  <title>BARATOZANDO — Roachin' Around | M0</title>
  <link rel="stylesheet" href="./style.css" />
  <script type="importmap">
    {"imports":{"phaser":"https://unpkg.com/phaser@3.90.0/dist/phaser.esm.min.js"}}
  </script>
</head>
<body>
  <div id="game"></div>
  <script type="module" src="./main.js"></script>
</body>
</html>`);
console.log('Offline fallback build written to dist/ (Phaser loads from CDN at runtime).');

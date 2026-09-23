import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const manifestPath='art/source/environment/cellar/premium-v1/premium_materials_v1.manifest.json';
if (!existsSync(manifestPath)) throw new Error('missing ENV-03 premium materials manifest');
const manifest=JSON.parse(readFileSync(manifestPath,'utf8'));

if (manifest.status!=='RUNTIME_CANDIDATE') throw new Error('ENV-03 must remain a runtime candidate before final gate');
if (manifest.runtimeReady!==false) throw new Error('ENV-03 promoted before final runtime gate');
if (manifest.intrinsicScale!==4 || manifest.displayScale!==0.25) throw new Error('ENV-03 scale contract drift');
if (manifest.assets.length!==13) throw new Error('ENV-03 asset matrix incomplete');

const keys=readFileSync('src/assets/environmentAssetKeys.ts','utf8');
if (!keys.includes('export const CELLAR_TEXTURE_DISPLAY_SCALE = 0.25')) throw new Error('cellar display scale lock missing');
if (!keys.includes('assets/environment/cellar/premium-v1/floor_wood.png')) throw new Error('premium environment path mapping missing');

const cellar=readFileSync('src/game/visual/CellarArtDirector.ts','utf8');
const mobility=readFileSync('src/game/visual/MobilityLabArtDirector.ts','utf8');
if (!cellar.includes('.setTileScale(CELLAR_TEXTURE_DISPLAY_SCALE, CELLAR_TEXTURE_DISPLAY_SCALE)')) throw new Error('FirstThreat tile scale lock missing');
if (!mobility.includes('.setTileScale(CELLAR_TEXTURE_DISPLAY_SCALE, CELLAR_TEXTURE_DISPLAY_SCALE)')) throw new Error('MobilityLab tile scale lock missing');
for (const src of [cellar,mobility]) {
  if (!src.includes('prop.scale * CELLAR_TEXTURE_DISPLAY_SCALE')) throw new Error('premium prop world-scale lock missing');
}

for (const row of manifest.assets) {
  if (!existsSync(row.output)) throw new Error(`missing premium environment asset: ${row.output}`);
  const buf=readFileSync(row.output);
  if (buf.toString('hex',0,8)!=='89504e470d0a1a0a') throw new Error(`not PNG: ${row.output}`);
  if (createHash('sha256').update(buf).digest('hex')!==row.outputSha256) throw new Error(`hash drift: ${row.name}`);
  if (buf.readUInt32BE(16)!==row.outputSize[0] || buf.readUInt32BE(20)!==row.outputSize[1]) throw new Error(`dimension drift: ${row.name}`);
}

console.log('PASS ENV-03 premium material runtime scale-lock contract');

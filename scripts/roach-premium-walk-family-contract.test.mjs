import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const manifestPath='art/source/player/premium-v1/frames/walk/walk_family.manifest.json';
if (!existsSync(manifestPath)) throw new Error('missing walk manifest');
const manifest=JSON.parse(readFileSync(manifestPath,'utf8'));
if (manifest.status!=='RUNTIME_READY_V1') throw new Error('walk articulation status drift');
if (manifest.cadenceQa!=='APPROVED_BY_CREATOR_2026-09-22') throw new Error('walk cadence approval drift');
if (manifest.runtimeReady!==true) throw new Error('walk not promoted after integration QA');
if (manifest.playbackFps!==8 || manifest.frames.length!==6) throw new Error('walk contract drift');
if (manifest.technicalQa!=='PASS_2026-09-22') throw new Error('walk technical QA drift');
if (manifest.visualApproval!=='APPROVED_BY_CREATOR_2026-09-22') throw new Error('walk visual approval drift');

for (const frame of manifest.frames) {
  if (!existsSync(frame.path)) throw new Error(`missing walk frame ${frame.index}`);
  const buf=readFileSync(frame.path);
  if (buf.toString('hex',0,8)!=='89504e470d0a1a0a') throw new Error(`walk frame ${frame.index} not PNG`);
  if (buf.readUInt32BE(16)!==256 || buf.readUInt32BE(20)!==256) throw new Error(`walk frame ${frame.index} size drift`);
  if (createHash('sha256').update(buf).digest('hex')!==frame.sha256) throw new Error(`walk frame ${frame.index} hash drift`);
}
console.log('PASS ROACH-13 walk articulation visual-approved contract (01-06)');

import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const manifestPath='art/source/player/premium-v1/frames/run/run_family.manifest.json';
if (!existsSync(manifestPath)) throw new Error('missing run manifest');
const manifest=JSON.parse(readFileSync(manifestPath,'utf8'));
if (manifest.status!=='RUNTIME_READY_V1') throw new Error('run articulation status drift');
if (manifest.cadenceQa!=='APPROVED_BY_CREATOR_2026-09-22') throw new Error('run cadence approval drift');
if (manifest.runtimeReady!==true) throw new Error('run not promoted after integration QA');
if (manifest.playbackFps!==12 || manifest.frames.length!==8) throw new Error('run contract drift');
if (manifest.technicalQa!=='PASS_2026-09-22') throw new Error('run technical QA drift');
if (manifest.visualApproval!=='APPROVED_BY_CREATOR_2026-09-22') throw new Error('run visual approval drift');

for (const frame of manifest.frames) {
  if (!existsSync(frame.path)) throw new Error(`missing run frame ${frame.index}`);
  const buf=readFileSync(frame.path);
  if (buf.toString('hex',0,8)!=='89504e470d0a1a0a') throw new Error(`run frame ${frame.index} not PNG`);
  if (buf.readUInt32BE(16)!==256 || buf.readUInt32BE(20)!==256) throw new Error(`run frame ${frame.index} size drift`);
  if (createHash('sha256').update(buf).digest('hex')!==frame.sha256) throw new Error(`run frame ${frame.index} hash drift`);
}
console.log('PASS ROACH-14 run articulation visual-approved contract (01-08)');

import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const manifestPath='art/source/player/premium-v1/frames/idle/idle_family.manifest.json';
if (!existsSync(manifestPath)) throw new Error('missing idle manifest');
const manifest=JSON.parse(readFileSync(manifestPath,'utf8'));
if (manifest.identityMasterSha256!=='2401227bf0d73e27c3c7df3630e8b755c54beb9dd1a4a866d9de983812c3286e') throw new Error('master identity drift');
if (manifest.status!=='RUNTIME_READY_V1') throw new Error('idle approval status drift');
if (manifest.visualApproval!=='APPROVED_BY_CREATOR_2026-09-23') throw new Error('idle visual approval drift');
if (manifest.runtimeReady!==true) throw new Error('idle not promoted after integration QA');
if (manifest.playbackFps!==4 || manifest.frames.length!==4) throw new Error('idle timing/frame drift');
for (const frame of manifest.frames) {
  if (!existsSync(frame.path)) throw new Error(`missing idle frame ${frame.index}`);
  const buf=readFileSync(frame.path);
  if (buf.toString('hex',0,8)!=='89504e470d0a1a0a') throw new Error('idle frame not PNG');
  if (buf.readUInt32BE(16)!==256 || buf.readUInt32BE(20)!==256) throw new Error('idle frame size drift');
  if (createHash('sha256').update(buf).digest('hex')!==frame.sha256) throw new Error(`idle hash drift ${frame.index}`);
}
console.log('PASS ROACH-19 idle visual-approved runtime-ready contract');

import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const manifestPath = 'art/source/player/premium-v1/frames/run/run_family.manifest.json';
if (!existsSync(manifestPath)) throw new Error('missing run manifest');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.status !== 'CADENCE_APPROVED_ARTICULATION_PENDING') throw new Error('run status drift');
if (manifest.cadenceQa !== 'APPROVED_BY_CREATOR_2026-09-22') throw new Error('run cadence approval drift');
if (manifest.runtimeReady !== false) throw new Error('run promoted too early');
if (manifest.playbackFps !== 12 || manifest.frames.length !== 8) throw new Error('run contract drift');
for (const frame of manifest.frames) {
  if (!existsSync(frame.path)) throw new Error(`missing run frame ${frame.index}`);
  const buf=readFileSync(frame.path);
  if (buf.toString('hex',0,8)!=='89504e470d0a1a0a') throw new Error('run frame not PNG');
  if (buf.readUInt32BE(16)!==256 || buf.readUInt32BE(20)!==256) throw new Error('run frame size drift');
  if (createHash('sha256').update(buf).digest('hex')!==frame.sha256) throw new Error(`run frame ${frame.index} hash drift`);
}
console.log('PASS ROACH-12 run cadence-approved contract (01-08)');
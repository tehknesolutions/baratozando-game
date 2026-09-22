import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const manifestPath = 'art/source/player/premium-v1/frames/walk/walk_family.manifest.json';
if (!existsSync(manifestPath)) throw new Error('missing walk manifest');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.status !== 'CADENCE_APPROVED_ARTICULATION_PENDING') throw new Error('walk status drift');
if (manifest.cadenceQa !== 'APPROVED_BY_CREATOR_2026-09-22') throw new Error('walk cadence approval drift');
if (manifest.runtimeReady !== false) throw new Error('walk promoted too early');
if (manifest.playbackFps !== 8 || manifest.frames.length !== 6) throw new Error('walk contract drift');

for (const frame of manifest.frames) {
  if (!existsSync(frame.path)) throw new Error(`missing walk frame ${frame.index}`);
  const buf=readFileSync(frame.path);
  if (buf.toString('hex',0,8)!=='89504e470d0a1a0a') throw new Error('walk frame not PNG');
  if (buf.readUInt32BE(16)!==256 || buf.readUInt32BE(20)!==256) throw new Error('walk frame size drift');
  if (createHash('sha256').update(buf).digest('hex')!==frame.sha256) throw new Error(`walk frame ${frame.index} hash drift`);
}
console.log('PASS ROACH-12 walk cadence-approved contract (01-06)');
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const defs = [
  ['dodge',5,14,'CANDIDATE_MOTION_BLOCKOUT'],
  ['hurt',3,8,'CANDIDATE_IMPACT_BLOCKOUT'],
  ['death',6,8,'CANDIDATE_MOTION_BLOCKOUT'],
  ['respawn',4,6,'CANDIDATE_VISIBILITY_BLOCKOUT'],
];

for (const [name,count,fps,status] of defs) {
  const manifestPath=`art/source/player/premium-v1/frames/${name}/${name}_family.manifest.json`;
  if (!existsSync(manifestPath)) throw new Error(`missing ${name} manifest`);
  const manifest=JSON.parse(readFileSync(manifestPath,'utf8'));
  if (manifest.status!==status) throw new Error(`${name} status drift`);
  if (manifest.runtimeReady!==false) throw new Error(`${name} promoted too early`);
  if (manifest.playbackFps!==fps || manifest.frames.length!==count) throw new Error(`${name} contract drift`);
  for (const frame of manifest.frames) {
    if (!existsSync(frame.path)) throw new Error(`missing ${name} frame ${frame.index}`);
    const buf=readFileSync(frame.path);
    if (buf.toString('hex',0,8)!=='89504e470d0a1a0a') throw new Error(`${name} frame not PNG`);
    if (buf.readUInt32BE(16)!==256 || buf.readUInt32BE(20)!==256) throw new Error(`${name} frame size drift`);
    if (createHash('sha256').update(buf).digest('hex')!==frame.sha256) throw new Error(`${name} hash drift ${frame.index}`);
  }
}
console.log('PASS ROACH-12 dodge/hurt/death/respawn blockout contracts');

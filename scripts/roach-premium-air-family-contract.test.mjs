import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

for (const [name,count,fps] of [['jump',4,10],['fall',2,8]]) {
  const manifestPath = `art/source/player/premium-v1/frames/${name}/${name}_family.manifest.json`;
  if (!existsSync(manifestPath)) throw new Error(`missing ${name} manifest`);
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.status !== 'ARTICULATION_CANDIDATE_V1') throw new Error(`${name} articulation status drift`);
  if (manifest.cadenceQa !== 'APPROVED_BY_CREATOR_2026-09-22') throw new Error(`${name} cadence approval drift`);
  if (manifest.runtimeReady !== false) throw new Error(`${name} promoted too early`);
  if (manifest.playbackFps !== fps || manifest.frames.length !== count) throw new Error(`${name} contract drift`);
  if (manifest.technicalQa !== 'PASS_2026-09-22') throw new Error(`${name} technical QA drift`);
  if (manifest.visualApproval !== 'PENDING') throw new Error(`${name} visual approval must remain pending`);
  for (const frame of manifest.frames) {
    if (!existsSync(frame.path)) throw new Error(`missing ${name} frame ${frame.index}`);
    const buf=readFileSync(frame.path);
    if (buf.toString('hex',0,8)!=='89504e470d0a1a0a') throw new Error(`${name} frame not PNG`);
    if (buf.readUInt32BE(16)!==256 || buf.readUInt32BE(20)!==256) throw new Error(`${name} frame size drift`);
    if (createHash('sha256').update(buf).digest('hex')!==frame.sha256) throw new Error(`${name} frame ${frame.index} hash drift`);
  }
}
console.log('PASS ROACH-15 jump/fall articulation candidate contracts');

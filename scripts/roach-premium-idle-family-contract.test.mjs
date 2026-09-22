import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const manifestPath = 'art/source/player/premium-v1/frames/idle/idle_family.manifest.json';
if (!existsSync(manifestPath)) throw new Error('missing idle manifest');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.identityMasterSha256 !== '2401227bf0d73e27c3c7df3630e8b755c54beb9dd1a4a866d9de983812c3286e') throw new Error('master identity drift');
if (manifest.runtimeReady !== false) throw new Error('idle family promoted too early');
if (manifest.status !== 'CANDIDATE_LOOP_COMPLETE') throw new Error('idle loop is not complete');
if (manifest.playbackFps !== 4) throw new Error('idle playback fps drift');

const expected = [
  '1336c96baa6f30fdcba60167591b3b79657bae25a9221251cc9c3a356d556308',
  '6bc253743c7caededd801837e3349a45d40eedf2b42490b050c2a9c5c8758b84',
  'b0f6d06361c634d5aa8ad504b169d681259a29506cf28114203f3b3178c24096',
  '6bc253743c7caededd801837e3349a45d40eedf2b42490b050c2a9c5c8758b84',
];
if (manifest.frames.length !== 4) throw new Error('idle family must contain four frames');
for (let i = 0; i < 4; i++) {
  const frame = manifest.frames[i]; if (!existsSync(frame.path)) throw new Error(`missing frame ${i + 1}`);
  const buf = readFileSync(frame.path);
  if (buf.toString('hex', 0, 8) !== '89504e470d0a1a0a') throw new Error(`frame ${i + 1} is not PNG`);
  if (buf.readUInt32BE(16) !== 256 || buf.readUInt32BE(20) !== 256) throw new Error(`frame ${i + 1} must be 256x256`);
  const sha = createHash('sha256').update(buf).digest('hex');
  if (sha !== expected[i] || frame.sha256 !== expected[i]) throw new Error(`frame ${i + 1} hash drift`);
}
console.log('PASS ROACH-12 idle loop contract (01-04)');
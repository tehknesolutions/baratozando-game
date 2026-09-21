import { readFileSync } from 'node:fs';

const pipeline = readFileSync('src/assets/roachPremiumPipeline.ts', 'utf8');
const doc = readFileSync('docs/ROACH_PREMIUM_RUNTIME_PIPELINE_V1.md', 'utf8');

for (const token of [
  'MASTER_IDENTITY_LOCK',
  'RGBA_BOUNDS_QA',
  'SCALE_ORIGIN_CAMERA_LOCK',
  'POSE_LOCK',
  'PLAYER_VISUAL_INTEGRATION',
]) {
  if (!pipeline.includes(token) || !doc.includes(token)) {
    throw new Error(`missing premium gate: ${token}`);
  }
}
if (!pipeline.includes("physicsFrozen: true")) throw new Error('premium art pipeline must not mutate physics');
if (!pipeline.includes("independentFrameRedesign: false")) throw new Error('independent frame redesign must stay forbidden');
console.log('PASS roach premium pipeline contract');

import { existsSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';

const manifestPath = 'art/source/player/premium-v1/masters/roach_side_right_master.manifest.json';
const binaryPath = 'art/source/player/premium-v1/masters/roach_side_right_master.png';

if (!existsSync(manifestPath)) throw new Error('missing ROACH-10 manifest');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
if (manifest.authority !== 'CANDIDATE') throw new Error('master must begin as CANDIDATE');
if (manifest.runtimeReady !== false) throw new Error('runtime promotion is forbidden before visual lock');
if (manifest.canonicalFacing !== 'right') throw new Error('canonical facing must be right');
if (manifest.minLongEdge < 2048) throw new Error('minimum long edge must be >= 2048');
if (!existsSync(binaryPath)) throw new Error('BLOCKED: missing isolated master binary');

const png = readFileSync(binaryPath);
if (png.length < 8 || png.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('master is not a PNG');
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
const colorType = png[25];
if (Math.max(width, height) < 2048) throw new Error(`master too small: ${width}x${height}`);
if (colorType !== 4 && colorType !== 6) throw new Error(`PNG has no alpha channel; colorType=${colorType}`);
const sha256 = createHash('sha256').update(png).digest('hex');
console.log(`PASS ROACH-10 binary gate ${width}x${height} bytes=${statSync(binaryPath).size} sha256=${sha256}`);

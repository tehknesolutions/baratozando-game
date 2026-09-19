import type { PointSpec, RectSpec } from './MovementLabLayout.js';
import type { ThreatChaseConfig } from '../threat/ThreatChaseController.js';

export type FirstThreatLayout = {
  tileSize: 32;
  width: number;
  height: number;
  spawn: PointSpec;
  platforms: RectSpec[];
  hazards: RectSpec[];
  checkpoint: PointSpec;
  chase: ThreatChaseConfig;
  upwardPlatformPairs: Array<[number, number]>;
};

export const FIRST_THREAT_LAYOUT: FirstThreatLayout = {
  tileSize: 32,
  width: 2176,
  height: 576,
  spawn: { x: 96, y: 450 },
  platforms: [
    { x: 0, y: 512, width: 704, height: 64 },
    { x: 448, y: 480, width: 96, height: 32 },
    { x: 736, y: 512, width: 256, height: 64 },
    { x: 832, y: 464, width: 160, height: 32 },
    { x: 1056, y: 432, width: 128, height: 24 },
    { x: 1248, y: 464, width: 160, height: 32 },
    { x: 1216, y: 512, width: 384, height: 64 },
    { x: 1632, y: 512, width: 544, height: 64 },
    { x: 1728, y: 464, width: 96, height: 24 },
    { x: 1888, y: 432, width: 128, height: 24 },
  ],
  hazards: [
    { x: 1460, y: 488, width: 96, height: 24 },
  ],
  checkpoint: { x: 544, y: 480 },
  chase: {
    triggerX: 640,
    warningDurationMs: 650,
    threatStartX: 260,
    threatSpeed: 205,
    catchDistance: 54,
    escapeX: 1875,
  },
  upwardPlatformPairs: [[0, 1], [2, 3], [3, 4], [7, 8], [8, 9]],
};

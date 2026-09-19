import type { PointSpec, RectSpec } from './MovementLabLayout.js';
import type { SurfaceType } from './SurfaceType.js';

export type MobilitySurface = RectSpec & {
  id: string;
  surface: SurfaceType;
  role: 'route' | 'recovery' | 'boundary';
};

export type MobilityLabV2Layout = {
  tileSize: 32;
  width: number;
  height: number;
  spawn: PointSpec;
  goal: PointSpec;
  surfaces: MobilitySurface[];
  routePairs: Array<[string, string]>;
};

export const MOBILITY_LAB_V2: MobilityLabV2Layout = {
  tileSize: 32,
  width: 1792,
  height: 928,
  spawn: { x: 104, y: 690 },
  goal: { x: 1660, y: 112 },
  surfaces: [
    { id: 'recovery-floor', x: 0, y: 880, width: 1792, height: 48, surface: 'GROUND', role: 'recovery' },
    { id: 'start-crate', x: 64, y: 752, width: 288, height: 128, surface: 'ROUGH_CLIMB', role: 'route' },
    { id: 'low-recovery', x: 352, y: 824, width: 280, height: 32, surface: 'GROUND', role: 'recovery' },
    { id: 'tipped-can', x: 400, y: 688, width: 176, height: 40, surface: 'GROUND', role: 'route' },
    { id: 'shelf-support-a', x: 624, y: 480, width: 64, height: 248, surface: 'ROUGH_CLIMB', role: 'route' },
    { id: 'pipe-a', x: 688, y: 472, width: 304, height: 32, surface: 'GROUND', role: 'route' },
    { id: 'mid-recovery', x: 720, y: 752, width: 352, height: 32, surface: 'GROUND', role: 'recovery' },
    { id: 'shelf-support-b', x: 1024, y: 304, width: 64, height: 200, surface: 'ROUGH_CLIMB', role: 'route' },
    { id: 'upper-shelf', x: 1088, y: 296, width: 320, height: 32, surface: 'GROUND', role: 'route' },
    { id: 'cable-landing', x: 1392, y: 248, width: 80, height: 24, surface: 'GROUND', role: 'route' },
    { id: 'shelf-support-c', x: 1504, y: 96, width: 64, height: 176, surface: 'ROUGH_CLIMB', role: 'route' },
    { id: 'goal-shelf', x: 1568, y: 96, width: 224, height: 32, surface: 'GROUND', role: 'route' },
    { id: 'left-boundary', x: 0, y: 0, width: 32, height: 880, surface: 'ROUGH_CLIMB', role: 'boundary' },
    { id: 'right-boundary', x: 1760, y: 0, width: 32, height: 880, surface: 'ROUGH_CLIMB', role: 'boundary' },
  ],
  routePairs: [
    ['start-crate', 'tipped-can'],
    ['tipped-can', 'shelf-support-a'],
    ['shelf-support-a', 'pipe-a'],
    ['pipe-a', 'shelf-support-b'],
    ['shelf-support-b', 'upper-shelf'],
    ['upper-shelf', 'cable-landing'],
    ['cable-landing', 'shelf-support-c'],
    ['shelf-support-c', 'goal-shelf'],
  ],
};

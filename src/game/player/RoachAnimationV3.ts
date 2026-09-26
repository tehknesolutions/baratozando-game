import type { PlayerState } from './PlayerState.js';

export type RoachWingMode = 'HIDDEN' | 'FLAP' | 'GLIDE';

export type RoachAnimationDescriptor = Readonly<{
  bodyKey: string;
  fps: number;
  loop: boolean;
  wingsVisible: boolean;
  wingMode: RoachWingMode;
  presentationOnly: true;
  scale: 0.5;
}>;

const descriptor = (bodyKey: string, fps: number, loop: boolean, wingMode: RoachWingMode = 'HIDDEN'): RoachAnimationDescriptor => Object.freeze({
  bodyKey,
  fps,
  loop,
  wingsVisible: wingMode !== 'HIDDEN',
  wingMode,
  presentationOnly: true as const,
  scale: 0.5 as const,
});

const ROACH_ANIMATION_V3: Readonly<Record<PlayerState, RoachAnimationDescriptor>> = Object.freeze({
  BOOT: descriptor('idle', 6, true),
  IDLE: descriptor('idle', 6, true),
  WALK: descriptor('walk', 8, true),
  RUN: descriptor('run', 12, true),
  JUMP: descriptor('jump', 10, false),
  FALL: descriptor('fall', 8, true),
  WING_FLAP: descriptor('jump', 14, false, 'FLAP'),
  GLIDE: descriptor('fall', 6, true, 'GLIDE'),
  WALL_CLING: descriptor('wallCling', 6, true),
  WALL_CLIMB: descriptor('wallClimb', 10, true),
  WALL_JUMP: descriptor('wallJump', 12, false),
  DODGE: descriptor('dodge', 14, false),
  HURT: descriptor('hurt', 8, false),
  DEATH: descriptor('death', 8, false),
  RESPAWN: descriptor('respawn', 6, false),
});

export function resolveRoachAnimationV3(state: PlayerState): RoachAnimationDescriptor {
  return ROACH_ANIMATION_V3[state];
}

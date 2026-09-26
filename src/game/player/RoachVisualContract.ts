import type { RoachAnimationDescriptor } from './RoachAnimationV3.js';

export type RoachVisualSnapshot = Readonly<{
  scale: number;
  originX: number;
  originY: number;
  offsetX: number;
  offsetY: number;
  physicsAuthority: false;
}>;

export type RoachChannelSnapshot = Readonly<{
  bodyVisible: true;
  wingsVisible: boolean;
  wingMode: 'HIDDEN' | 'FLAP' | 'GLIDE';
  scale: 0.5;
  physicsAuthority: false;
}>;

export function createRoachVisualSnapshot(scale: number): RoachVisualSnapshot {
  if (!Number.isFinite(scale) || scale <= 0) throw new Error('Roach visual scale must be a positive finite number');
  return Object.freeze({ scale, originX: 0.5, originY: 1, offsetX: 0, offsetY: 0, physicsAuthority: false });
}

export function resolveRoachChannels(descriptor: RoachAnimationDescriptor): RoachChannelSnapshot {
  const legalWingState = descriptor.wingMode === 'FLAP' || descriptor.wingMode === 'GLIDE';
  return Object.freeze({
    bodyVisible: true as const,
    wingsVisible: legalWingState && descriptor.wingsVisible,
    wingMode: legalWingState && descriptor.wingsVisible ? descriptor.wingMode : 'HIDDEN',
    scale: 0.5 as const,
    physicsAuthority: false as const,
  });
}

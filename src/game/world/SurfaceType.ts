export type SurfaceType =
  | 'GROUND'
  | 'ROUGH_CLIMB'
  | 'SMOOTH_LOCKED'
  | 'GREASY_SLIDE'
  | 'HAZARDOUS_CLIMB'
  | 'DECORATIVE';

export function isBaseClimbableSurface(surface: SurfaceType | null): boolean {
  return surface === 'ROUGH_CLIMB' || surface === 'HAZARDOUS_CLIMB';
}

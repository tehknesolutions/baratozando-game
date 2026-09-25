export const CELLAR_CAMERA = Object.freeze({
  mutatesPhysics: false,
  lerp: Object.freeze({ x: 0.105, y: 0.09 }),
  deadzone: Object.freeze({ width: 180, height: 145 }),
  lead: Object.freeze({ normal: 62, fast: 78, speedThreshold: 170 }),
  vertical: Object.freeze({ wallClimb: -78, falling: 60, rising: -28, speedThreshold: 170 }),
} as const);

export function resolveCameraIntent(facing: number, velocityY: number, state: string, horizontalSpeed = Math.abs(velocityY)): Readonly<{ x: number; y: number }> {
  const fast = horizontalSpeed > CELLAR_CAMERA.lead.speedThreshold;
  const lead = fast ? CELLAR_CAMERA.lead.fast : CELLAR_CAMERA.lead.normal;
  const x = -facing * lead;
  const y = state === 'WALL_CLIMB'
    ? CELLAR_CAMERA.vertical.wallClimb
    : velocityY > CELLAR_CAMERA.vertical.speedThreshold
      ? CELLAR_CAMERA.vertical.falling
      : velocityY < -CELLAR_CAMERA.vertical.speedThreshold
        ? CELLAR_CAMERA.vertical.rising
        : 0;
  return Object.freeze({ x, y });
}

export class CellarCameraDirector {
  static configure(camera: any): void {
    camera.setDeadzone(CELLAR_CAMERA.deadzone.width, CELLAR_CAMERA.deadzone.height);
  }

  static update(camera: any, facing: number, velocityX: number, velocityY: number, state: string): void {
    const intent = resolveCameraIntent(facing, velocityY, state, Math.abs(velocityX));
    camera.setFollowOffset(intent.x, intent.y);
  }
}

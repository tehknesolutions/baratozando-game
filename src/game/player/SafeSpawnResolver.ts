export type SpawnPoint = { x: number; y: number };
export type SpawnSurface = { x: number; y: number; width: number; height: number; role?: string };
export type SafeSpawnOptions = { bodyHeight: number; clearance?: number };

export type SafeSpawn = SpawnPoint & { surfaceY: number };

export function resolveSafeSpawn(
  requested: SpawnPoint,
  surfaces: readonly SpawnSurface[],
  options: SafeSpawnOptions,
): SafeSpawn {
  const clearance = options.clearance ?? 0;
  const candidates = surfaces
    .filter((surface) => requested.x >= surface.x && requested.x <= surface.x + surface.width)
    .filter((surface) => surface.y >= requested.y)
    .sort((a, b) => a.y - b.y);

  const support = candidates[0];
  if (!support) {
    throw new Error(`No safe spawn support below (${requested.x}, ${requested.y})`);
  }

  // Player origin is at its feet (0.5, 1). Keep the feet just above the static surface.
  return {
    x: requested.x,
    y: support.y - clearance,
    surfaceY: support.y,
  };
}

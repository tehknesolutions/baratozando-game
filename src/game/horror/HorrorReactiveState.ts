import type { ThreatChaseState } from '../threat/ThreatChaseController.js';

export type HorrorTensionBand = 'CALM' | 'OMEN' | 'ALERT' | 'DANGER' | 'CHASE' | 'PANIC';

export type HorrorReactiveInput = {
  chaseState: ThreatChaseState;
  threatGap: number;
  recentDamage: boolean;
  respawning: boolean;
  zoneIntensity?: number;
};

export type HorrorReactiveOutput = {
  tension: number;
  band: HorrorTensionBand;
};

const DANGER_DISTANCE = 320;

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

function sanitizedGap(value: number): number {
  if (!Number.isFinite(value)) return DANGER_DISTANCE;
  return Math.max(0, value);
}

function basePressure(state: ThreatChaseState): number {
  switch (state) {
    case 'WARNING': return 0.28;
    case 'CHASING': return 0.58;
    case 'CAUGHT': return 1;
    case 'DORMANT':
    case 'ESCAPED':
    default: return 0;
  }
}

function bandFor(tension: number): HorrorTensionBand {
  if (tension >= 0.92) return 'PANIC';
  if (tension >= 0.72) return 'CHASE';
  if (tension >= 0.52) return 'DANGER';
  if (tension >= 0.32) return 'ALERT';
  if (tension >= 0.12) return 'OMEN';
  return 'CALM';
}

export function resolveHorrorReactiveState(input: HorrorReactiveInput): HorrorReactiveOutput {
  if (input.respawning || input.chaseState === 'ESCAPED') {
    return { tension: 0, band: 'CALM' };
  }

  const gap = sanitizedGap(input.threatGap);
  const proximity = clamp01((DANGER_DISTANCE - gap) / DANGER_DISTANCE);
  const proximityPressure = input.chaseState === 'CHASING' || input.chaseState === 'CAUGHT'
    ? 0.42 + proximity * 0.53
    : 0;
  const zonePressure = clamp01(input.zoneIntensity ?? 0);
  const damageBump = input.recentDamage ? 0.12 : 0;
  const tension = clamp01(Math.max(basePressure(input.chaseState), proximityPressure, zonePressure) + damageBump);

  return { tension, band: bandFor(tension) };
}

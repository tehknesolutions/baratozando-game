import type { ThreatChaseState } from '../threat/ThreatChaseController.js';

export type DangerVisualState = {
  overlayAlpha: number;
  amberAlpha: number;
  dustBoost: number;
};

export function resolveDangerVisual(state: ThreatChaseState, gap: number): DangerVisualState {
  if (state !== 'CHASING' && state !== 'CAUGHT') {
    return {
      overlayAlpha: 0,
      amberAlpha: state === 'WARNING' ? 0.08 : 0.03,
      dustBoost: state === 'WARNING' ? 0.35 : 0,
    };
  }

  const normalized = Math.max(0, Math.min(1, (220 - Math.max(0, gap)) / 220));
  return {
    overlayAlpha: Math.min(0.22, normalized * 0.22),
    amberAlpha: 0.08 + normalized * 0.08,
    dustBoost: 0.45 + normalized * 0.55,
  };
}

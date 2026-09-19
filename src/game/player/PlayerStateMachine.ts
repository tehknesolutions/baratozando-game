import type { PlayerState } from './PlayerState.js';

export type PlayerStateFacts = {
  grounded: boolean;
  velocityY: number;
  moveX: -1 | 0 | 1;
  run: boolean;
  dodging: boolean;
  hurt: boolean;
  dead: boolean;
  respawning?: boolean;
};

export function resolvePlayerState(facts: PlayerStateFacts): PlayerState {
  if (facts.respawning) return 'RESPAWN';
  if (facts.dead) return 'DEATH';
  if (facts.hurt) return 'HURT';
  if (facts.dodging) return 'DODGE';
  if (!facts.grounded) return facts.velocityY < 0 ? 'JUMP' : 'FALL';
  if (facts.moveX === 0) return 'IDLE';
  return facts.run ? 'RUN' : 'WALK';
}

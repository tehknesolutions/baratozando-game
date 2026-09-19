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
  wingFlap?: boolean;
  gliding?: boolean;
  wallAttached?: boolean;
  climbing?: boolean;
  wallJumping?: boolean;
};

export function resolvePlayerState(facts: PlayerStateFacts): PlayerState {
  if (facts.respawning) return 'RESPAWN';
  if (facts.dead) return 'DEATH';
  if (facts.hurt) return 'HURT';
  if (facts.dodging) return 'DODGE';
  if (facts.wallJumping) return 'WALL_JUMP';
  if (facts.wingFlap) return 'WING_FLAP';
  if (facts.wallAttached) return facts.climbing ? 'WALL_CLIMB' : 'WALL_CLING';
  if (facts.gliding) return 'GLIDE';
  if (!facts.grounded) return facts.velocityY < 0 ? 'JUMP' : 'FALL';
  if (facts.moveX === 0) return 'IDLE';
  return facts.run ? 'RUN' : 'WALK';
}

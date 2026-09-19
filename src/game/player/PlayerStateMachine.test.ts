import { resolvePlayerState } from './PlayerStateMachine.js';

function eq(a: unknown, b: unknown, m: string) { if (!Object.is(a,b)) throw new Error(`${m}: expected ${b}, got ${a}`); }
let passed=0; function test(name:string,fn:()=>void){ fn(); passed++; console.log(`✓ ${name}`); }

const base = { grounded: true, velocityY: 0, moveX: 0 as -1|0|1, run: false, dodging: false, hurt: false, dead: false };

test('ground states resolve IDLE WALK RUN', () => {
  eq(resolvePlayerState(base), 'IDLE', 'idle');
  eq(resolvePlayerState({ ...base, moveX: 1 }), 'WALK', 'walk');
  eq(resolvePlayerState({ ...base, moveX: -1, run: true }), 'RUN', 'run');
});

test('airborne resolves JUMP while rising and FALL otherwise', () => {
  eq(resolvePlayerState({ ...base, grounded: false, velocityY: -20 }), 'JUMP', 'jump');
  eq(resolvePlayerState({ ...base, grounded: false, velocityY: 0 }), 'FALL', 'fall zero');
  eq(resolvePlayerState({ ...base, grounded: false, velocityY: 40 }), 'FALL', 'fall positive');
});

test('lifecycle precedence is DEATH over HURT over DODGE', () => {
  eq(resolvePlayerState({ ...base, dodging: true }), 'DODGE', 'dodge');
  eq(resolvePlayerState({ ...base, dodging: true, hurt: true }), 'HURT', 'hurt beats dodge');
  eq(resolvePlayerState({ ...base, dodging: true, hurt: true, dead: true }), 'DEATH', 'death beats all');
});

console.log(`PASS ${passed}/${passed} PlayerStateMachine tests`);

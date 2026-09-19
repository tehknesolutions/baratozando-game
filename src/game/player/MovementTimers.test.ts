import { PLAYER_MOVEMENT_CONFIG } from './PlayerMovementConfig.js';
import { MovementTimers } from './MovementTimers.js';

function ok(v: unknown, m: string) { if (!v) throw new Error(m); }
function no(v: unknown, m: string) { if (v) throw new Error(m); }
let passed=0; function test(name:string, fn:()=>void){ fn(); passed++; console.log(`✓ ${name}`); }

test('coyote jump expires after 100 ms', () => {
  const t = new MovementTimers(PLAYER_MOVEMENT_CONFIG);
  t.noteGrounded(1000);
  ok(t.canCoyoteJump(1100), '100 ms boundary should be allowed');
  no(t.canCoyoteJump(1101), 'coyote must expire after 100 ms');
});

test('coyote availability can be consumed so a second air press cannot double-jump', () => {
  const t = new MovementTimers(PLAYER_MOVEMENT_CONFIG);
  t.noteGrounded(1000);
  ok(t.canCoyoteJump(1050), 'coyote initially available');
  t.consumeCoyote();
  no(t.canCoyoteJump(1051), 'consumed coyote must stay unavailable until grounded again');
});

test('jump buffer expires after 110 ms and can be consumed once', () => {
  const t = new MovementTimers(PLAYER_MOVEMENT_CONFIG);
  t.bufferJump(2000);
  ok(t.canConsumeBufferedJump(2110), '110 ms boundary should be allowed');
  ok(t.consumeBufferedJump(2110), 'buffer should consume once');
  no(t.consumeBufferedJump(2110), 'consumed jump must not repeat');
  t.bufferJump(3000);
  no(t.canConsumeBufferedJump(3111), 'buffer must expire after 110 ms');
});

test('dodge respects duration and cooldown without freezing movement', () => {
  const t = new MovementTimers(PLAYER_MOVEMENT_CONFIG);
  ok(t.tryStartDodge(1000), 'first dodge starts');
  ok(t.isDodging(1159), 'dodge active before 160 ms');
  no(t.isDodging(1160), 'dodge ends at 160 ms');
  no(t.tryStartDodge(1419), 'cooldown blocks early dodge');
  ok(t.tryStartDodge(1420), 'cooldown allows exact boundary');
});

console.log(`PASS ${passed}/${passed} MovementTimers tests`);

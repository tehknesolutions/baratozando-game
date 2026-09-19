import { FIRST_THREAT_LAYOUT } from './FirstThreatLayout.js';
import { PLAYER_MOVEMENT_CONFIG } from '../player/PlayerMovementConfig.js';

function ok(v: unknown, m: string){ if(!v) throw new Error(m); }
let passed=0; function test(name:string,fn:()=>void){ fn(); passed++; console.log(`✓ ${name}`); }

test('checkpoint is before chase trigger and escape is inside the room', () => {
  ok(FIRST_THREAT_LAYOUT.checkpoint.x < FIRST_THREAT_LAYOUT.chase.triggerX, 'checkpoint must precede trigger');
  ok(FIRST_THREAT_LAYOUT.chase.triggerX < FIRST_THREAT_LAYOUT.chase.escapeX, 'trigger must precede escape');
  ok(FIRST_THREAT_LAYOUT.chase.escapeX < FIRST_THREAT_LAYOUT.width, 'escape must be inside room');
});

test('chase route is long enough to create pressure without becoming a marathon', () => {
  const route = FIRST_THREAT_LAYOUT.chase.escapeX - FIRST_THREAT_LAYOUT.chase.triggerX;
  ok(route >= 1000, `chase route too short: ${route}`);
  ok(route <= 1500, `chase route too long: ${route}`);
});

test('all authored rectangles stay inside M1 room bounds', () => {
  for (const r of [...FIRST_THREAT_LAYOUT.platforms, ...FIRST_THREAT_LAYOUT.hazards]) {
    ok(r.x >= 0 && r.y >= 0, 'rect cannot start outside room');
    ok(r.x + r.width <= FIRST_THREAT_LAYOUT.width, 'rect exceeds width');
    ok(r.y + r.height <= FIRST_THREAT_LAYOUT.height, 'rect exceeds height');
  }
});

test('authored upward chase steps remain below comfortable jump apex', () => {
  const jumpApexPx = (PLAYER_MOVEMENT_CONFIG.jumpVelocity ** 2) / (2 * PLAYER_MOVEMENT_CONFIG.gravity);
  const comfortableClimb = jumpApexPx * 0.9;
  const pairs = FIRST_THREAT_LAYOUT.upwardPlatformPairs;
  for (const [from, to] of pairs) {
    const climb = FIRST_THREAT_LAYOUT.platforms[from].y - FIRST_THREAT_LAYOUT.platforms[to].y;
    ok(climb <= comfortableClimb, `platform ${from}→${to} climb ${climb}px exceeds ${comfortableClimb.toFixed(1)}px`);
  }
});

console.log(`PASS ${passed}/${passed} FirstThreatLayout tests`);

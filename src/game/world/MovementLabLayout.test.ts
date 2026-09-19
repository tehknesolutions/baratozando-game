import { MOVEMENT_LAB_LAYOUT } from './MovementLabLayout.js';
import { PLAYER_MOVEMENT_CONFIG } from '../player/PlayerMovementConfig.js';

function ok(v: unknown, m: string){ if(!v) throw new Error(m); }
function eq(a:unknown,b:unknown,m:string){ if(!Object.is(a,b)) throw new Error(`${m}: expected ${b}, got ${a}`); }
let passed=0; function test(name:string,fn:()=>void){ fn(); passed++; console.log(`✓ ${name}`); }

test('room length stays within the approved 50–70 tile lab envelope', () => {
  const tiles = MOVEMENT_LAB_LAYOUT.width / MOVEMENT_LAB_LAYOUT.tileSize;
  ok(tiles >= 50 && tiles <= 70, `room tiles out of range: ${tiles}`);
  eq(MOVEMENT_LAB_LAYOUT.tileSize, 32, 'tileSize');
});

test('layout includes traversal features, hazard, checkpoint and finish', () => {
  ok(MOVEMENT_LAB_LAYOUT.platforms.length >= 7, 'needs varied platforms');
  ok(MOVEMENT_LAB_LAYOUT.hazards.length >= 1, 'needs hazard');
  ok(MOVEMENT_LAB_LAYOUT.checkpoints.length === 1, 'exactly one checkpoint');
  ok(MOVEMENT_LAB_LAYOUT.finish.x > MOVEMENT_LAB_LAYOUT.width * 0.8, 'finish should be near room end');
});

test('all authored rectangles stay inside room bounds', () => {
  const rects = [...MOVEMENT_LAB_LAYOUT.platforms, ...MOVEMENT_LAB_LAYOUT.hazards];
  for (const r of rects) {
    ok(r.x >= 0 && r.y >= 0, 'rect cannot start outside room');
    ok(r.x + r.width <= MOVEMENT_LAB_LAYOUT.width, 'rect exceeds width');
    ok(r.y + r.height <= MOVEMENT_LAB_LAYOUT.height, 'rect exceeds height');
  }
});

test('authored upward steps fit comfortably inside the jump apex', () => {
  const jumpApexPx = (PLAYER_MOVEMENT_CONFIG.jumpVelocity ** 2) / (2 * PLAYER_MOVEMENT_CONFIG.gravity);
  const comfortableClimb = jumpApexPx * 0.9;
  const pairs: Array<[number, number]> = [[0,1],[2,3],[3,4],[7,8],[8,9]];
  for (const [from, to] of pairs) {
    const climb = MOVEMENT_LAB_LAYOUT.platforms[from].y - MOVEMENT_LAB_LAYOUT.platforms[to].y;
    ok(climb <= comfortableClimb, `platform ${from}→${to} climb ${climb}px exceeds ${comfortableClimb.toFixed(1)}px`);
  }
});

console.log(`PASS ${passed}/${passed} MovementLabLayout tests`);

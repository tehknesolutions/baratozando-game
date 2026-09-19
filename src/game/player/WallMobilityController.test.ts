import { MOBILITY_V2 } from './MobilityConfig.js';
import { WallMobilityController } from './WallMobilityController.js';

function ok(v: unknown, m: string): void { if (!v) throw new Error(m); }
function equal(a: unknown,b:unknown,m:string):void{if(!Object.is(a,b))throw new Error(`${m}: expected ${b}, got ${a}`)}

const w = new WallMobilityController(MOBILITY_V2);
let r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: -1, moveY: -1, surface: 'ROUGH_CLIMB', nowMs: 1000 });
ok(r.attached, 'rough wall with input should attach');
equal(r.climbVelocityY, -MOBILITY_V2.wallClimbSpeed, 'up climbs');

r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: -1, moveY: 0, surface: 'SMOOTH_LOCKED', nowMs: 1100 });
ok(!r.attached, 'smooth locked surface must reject attachment');
r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: -1, moveY: 0, surface: 'GREASY_SLIDE', nowMs: 1200 });
ok(!r.attached, 'greasy surface must reject attachment');

r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: -1, moveY: 0, surface: 'ROUGH_CLIMB', nowMs: 1300 });
equal(r.wallSide, -1, 'left wall side');
const jump = w.wallJump(1300, -1);
equal(jump.velocityX, MOBILITY_V2.wallJumpVelocityX, 'left wall jump pushes right');
equal(jump.velocityY, MOBILITY_V2.wallJumpVelocityY, 'wall jump rises');

r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: -1, moveY: 0, surface: 'ROUGH_CLIMB', nowMs: 1350 });
ok(!r.attached, 'detach lock blocks immediate reattachment');
r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: -1, moveY: 0, surface: 'ROUGH_CLIMB', nowMs: 1500 });
ok(r.attached, 'reattachment allowed after lock');

console.log('PASS WallMobilityController');

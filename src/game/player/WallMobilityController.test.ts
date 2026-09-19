import { MOBILITY_V2 } from './MobilityConfig.js';
import { WallMobilityController } from './WallMobilityController.js';

function ok(v: unknown, m: string): void { if (!v) throw new Error(m); }
function equal(a: unknown,b:unknown,m:string):void{if(!Object.is(a,b))throw new Error(`${m}: expected ${b}, got ${a}`)}

const w = new WallMobilityController(MOBILITY_V2);

// Core beginner behavior: touching a climbable wall + W/Up is enough.
// Horizontal spam into the wall must not be required.
let r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: 0, moveY: -1, surface: 'ROUGH_CLIMB', nowMs: 1000 });
ok(r.attached, 'vertical input alone should attach to a climbable wall');
equal(r.climbVelocityY, -MOBILITY_V2.wallClimbSpeed, 'W/Up climbs continuously');

// Once attached, neutral input keeps the cling instead of immediately dropping.
r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: 0, moveY: 0, surface: 'ROUGH_CLIMB', nowMs: 1016 });
ok(r.attached, 'neutral input should preserve an existing wall cling');
equal(r.slideVelocityY, MOBILITY_V2.wallSlideSpeed, 'neutral cling uses controlled slide cap');

// Down descends while remaining attached.
r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: 0, moveY: 1, surface: 'ROUGH_CLIMB', nowMs: 1032 });
ok(r.attached, 'S/Down should keep wall attachment');
equal(r.climbVelocityY, MOBILITY_V2.wallClimbSpeed, 'S/Down descends');

// Explicit input away from the wall releases immediately.
r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: 1, moveY: 0, surface: 'ROUGH_CLIMB', nowMs: 1048 });
ok(!r.attached, 'pressing away from the wall should release cling');

// Pushing into a climbable wall still works as before.
r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: -1, moveY: 0, surface: 'ROUGH_CLIMB', nowMs: 1064 });
ok(r.attached, 'pushing into a rough wall should attach');

// Non-climbable materials remain rejected.
r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: 0, moveY: -1, surface: 'SMOOTH_LOCKED', nowMs: 1100 });
ok(!r.attached, 'smooth locked surface must reject vertical attachment');
r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: 0, moveY: -1, surface: 'GREASY_SLIDE', nowMs: 1200 });
ok(!r.attached, 'greasy surface must reject vertical attachment');

// Wall jump remains a deliberate SPACE action and creates a short detach lock.
r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: 0, moveY: -1, surface: 'ROUGH_CLIMB', nowMs: 1300 });
equal(r.wallSide, -1, 'left wall side');
const jump = w.wallJump(1300, -1);
equal(jump.velocityX, MOBILITY_V2.wallJumpVelocityX, 'left wall jump pushes right');
equal(jump.velocityY, MOBILITY_V2.wallJumpVelocityY, 'wall jump rises');

r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: 0, moveY: -1, surface: 'ROUGH_CLIMB', nowMs: 1350 });
ok(!r.attached, 'detach lock blocks immediate reattachment even with vertical input');
r = w.resolve({ touchingLeft: true, touchingRight: false, moveX: 0, moveY: -1, surface: 'ROUGH_CLIMB', nowMs: 1500 });
ok(r.attached, 'vertical input can reattach after detach lock');

console.log('PASS WallMobilityController');

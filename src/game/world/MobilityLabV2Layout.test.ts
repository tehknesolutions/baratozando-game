import { MOBILITY_LAB_V2 } from './MobilityLabV2Layout.js';

function ok(v: unknown, m: string): void { if (!v) throw new Error(m); }
const L = MOBILITY_LAB_V2;
ok(L.width === 1792 && L.height === 928, 'approved lab envelope');
ok(L.spawn.x >= 0 && L.spawn.x <= L.width && L.spawn.y >= 0 && L.spawn.y <= L.height, 'spawn inside bounds');
ok(L.goal.x >= 0 && L.goal.x <= L.width && L.goal.y >= 0 && L.goal.y <= L.height, 'goal inside bounds');
for (const s of L.surfaces) {
  ok(s.x >= 0 && s.y >= 0 && s.x + s.width <= L.width && s.y + s.height <= L.height, `surface ${s.id} inside bounds`);
}
const climbWalls = L.surfaces.filter(s => s.surface === 'ROUGH_CLIMB');
ok(climbWalls.length >= 3, 'at least three rough climb surfaces');
const recovery = L.surfaces.filter(s => s.role === 'recovery');
ok(recovery.some(s => s.width >= L.width * 0.8 && s.y > 800), 'large recovery floor below training route');
ok(L.routePairs.length >= 6, 'authored route has multiple learning beats');
for (const [aId,bId] of L.routePairs) {
  const a=L.surfaces.find(s=>s.id===aId); const b=L.surfaces.find(s=>s.id===bId);
  ok(a && b, `route pair ${aId}->${bId} exists`);
  ok(Math.abs((a!.y)-(b!.y)) <= 300, `route rise ${aId}->${bId} stays within combined mobility envelope`);
}
ok(L.surfaces.some(s=>s.role==='recovery' && s.id!=='recovery-floor'), 'secondary recovery route exists');
console.log('PASS MobilityLabV2Layout');

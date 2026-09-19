import { PlayerDamageController } from './PlayerDamageController.js';

function eq(a: unknown,b:unknown,m:string){ if(!Object.is(a,b)) throw new Error(`${m}: expected ${b}, got ${a}`); }
let passed=0; function test(name:string,fn:()=>void){ fn(); passed++; console.log(`✓ ${name}`); }

test('damage removes one HP and opens hurt/protection windows', () => {
  const d = new PlayerDamageController();
  eq(d.damage(1000), 'HURT', 'accepted damage');
  eq(d.hp, 2, 'hp');
  eq(d.isHurt(1219), true, 'hurt before 220');
  eq(d.isHurt(1220), false, 'hurt ends at 220');
  eq(d.isProtected(1699), true, 'protected before 700');
  eq(d.isProtected(1700), false, 'protection ends at 700');
});

test('protection window rejects rapid repeated hazard overlap', () => {
  const d = new PlayerDamageController();
  d.damage(1000);
  eq(d.damage(1200), 'IGNORED', 'damage ignored during protection');
  eq(d.hp, 2, 'hp unchanged');
  eq(d.damage(1700), 'HURT', 'damage accepted at boundary');
  eq(d.hp, 1, 'hp decremented once');
});

test('lethal damage enters death and complete respawn clears stale lifecycle', () => {
  const d = new PlayerDamageController();
  d.damage(0);
  d.damage(700);
  eq(d.damage(1400), 'DEATH', 'third hit lethal');
  eq(d.dead, true, 'dead');
  d.beginRespawn();
  eq(d.respawning, true, 'respawning');
  d.completeRespawn();
  eq(d.hp, 3, 'hp restored');
  eq(d.dead, false, 'death cleared');
  eq(d.respawning, false, 'respawn cleared');
  eq(d.isHurt(1400), false, 'hurt timer cleared');
  eq(d.isProtected(1400), false, 'protection timer cleared');
});

console.log(`PASS ${passed}/${passed} PlayerDamageController tests`);

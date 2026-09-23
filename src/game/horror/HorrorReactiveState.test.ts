import { resolveHorrorReactiveState, type HorrorReactiveInput } from './HorrorReactiveState.js';

function equal(actual: unknown, expected: unknown, message: string): void {
  if (!Object.is(actual, expected)) throw new Error(`${message}: expected ${expected}, got ${actual}`);
}

function ok(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

function resolve(overrides: Partial<HorrorReactiveInput> = {}) {
  return resolveHorrorReactiveState({
    chaseState: 'DORMANT',
    threatGap: 500,
    recentDamage: false,
    respawning: false,
    zoneIntensity: 0,
    ...overrides,
  });
}

const dormant = resolve();
equal(dormant.tension, 0, 'dormant tension');
equal(dormant.band, 'CALM', 'dormant band');

const warning = resolve({ chaseState: 'WARNING' });
ok(warning.tension > dormant.tension, 'warning must raise tension');
equal(warning.band, 'OMEN', 'warning band');

const farChase = resolve({ chaseState: 'CHASING', threatGap: 300 });
const closeChase = resolve({ chaseState: 'CHASING', threatGap: 40 });
ok(closeChase.tension > farChase.tension, 'closing threat must raise tension');
ok(['DANGER', 'CHASE', 'PANIC'].includes(closeChase.band), 'close chase must reach a danger band');

const caught = resolve({ chaseState: 'CAUGHT', threatGap: 0 });
equal(caught.tension, 1, 'caught tension');
equal(caught.band, 'PANIC', 'caught band');

const escaped = resolve({ chaseState: 'ESCAPED', threatGap: 0, recentDamage: true, zoneIntensity: 1 });
equal(escaped.tension, 0, 'escaped must be safe');
equal(escaped.band, 'CALM', 'escaped band');

const zoneHigh = resolve({ zoneIntensity: 4 });
equal(zoneHigh.tension, 1, 'zone intensity must clamp high');
const zoneLow = resolve({ zoneIntensity: -3 });
equal(zoneLow.tension, 0, 'zone intensity must clamp low');

const respawn = resolve({ chaseState: 'CAUGHT', threatGap: 0, recentDamage: true, zoneIntensity: 1, respawning: true });
equal(respawn.tension, 0, 'respawn must override danger');

for (const threatGap of [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, -50]) {
  const output = resolve({ chaseState: 'CHASING', threatGap });
  ok(Number.isFinite(output.tension), `tension must be finite for gap ${threatGap}`);
  ok(output.tension >= 0 && output.tension <= 1, `tension must be bounded for gap ${threatGap}`);
}

const damaged = resolve({ chaseState: 'WARNING', recentDamage: true });
ok(damaged.tension > warning.tension, 'recent damage must add a bounded tension bump');

const sample: HorrorReactiveInput = {
  chaseState: 'CHASING', threatGap: 90, recentDamage: true, respawning: false, zoneIntensity: 0.44,
};
const first = resolveHorrorReactiveState(sample);
const second = resolveHorrorReactiveState(sample);
equal(first.tension, second.tension, 'identical samples must resolve identically');
equal(first.band, second.band, 'identical samples must keep the same band');

for (const output of [dormant, warning, farChase, closeChase, caught, escaped, zoneHigh, zoneLow, respawn, damaged, first]) {
  ok(Number.isFinite(output.tension), 'every tension must be finite');
  ok(output.tension >= 0 && output.tension <= 1, 'every tension must remain in 0..1');
}

console.log('PASS HorrorReactiveState');

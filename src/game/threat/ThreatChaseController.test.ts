import { ThreatChaseController, type ThreatChaseConfig } from './ThreatChaseController.js';

function equal(actual: unknown, expected: unknown, message = 'values differ') {
  if (!Object.is(actual, expected)) throw new Error(`${message}: expected ${expected}, got ${actual}`);
}

const config: ThreatChaseConfig = {
  triggerX: 640,
  warningDurationMs: 650,
  threatStartX: 260,
  threatSpeed: 205,
  catchDistance: 54,
  escapeX: 1875,
};

{
  const chase = new ThreatChaseController(config);
  equal(chase.state, 'DORMANT');
  equal(chase.threatX, 260);
  chase.update(1000, 639);
  equal(chase.state, 'DORMANT');
  chase.update(1010, 640);
  equal(chase.state, 'WARNING');
  chase.update(1659, 400);
  equal(chase.state, 'WARNING');
  chase.update(1660, 400);
  equal(chase.state, 'CHASING');
}

{
  const chase = new ThreatChaseController(config);
  chase.update(0, 640);
  chase.update(650, 700);
  chase.update(1650, 900);
  equal(chase.threatX, 465);
}

{
  const chase = new ThreatChaseController(config);
  chase.update(0, 640);
  chase.update(650, 700);
  chase.update(1000, 1875);
  equal(chase.state, 'ESCAPED', 'escape must win before catch resolution');
}

{
  const chase = new ThreatChaseController(config);
  chase.update(0, 640);
  chase.update(650, 700);
  const result = chase.update(1650, 510);
  equal(result.caughtNow, true);
  equal(chase.state, 'CAUGHT');
  equal(chase.update(1660, 510).caughtNow, false, 'caught event must be emitted once');
}

{
  const chase = new ThreatChaseController(config);
  chase.update(0, 640);
  chase.update(650, 700);
  chase.update(1650, 510);
  chase.reset();
  equal(chase.state, 'DORMANT');
  equal(chase.threatX, 260);
  equal(chase.update(2000, 639).triggeredNow, false);
}

console.log('PASS ThreatChaseController');

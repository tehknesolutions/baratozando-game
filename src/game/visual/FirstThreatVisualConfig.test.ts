import { FIRST_THREAT_LAYOUT as L } from '../world/FirstThreatLayout.js';
import { FIRST_THREAT_VISUAL_CONFIG as V } from './FirstThreatVisualConfig.js';

function ok(value: unknown, message: string) {
  if (!value) throw new Error(message);
}

ok(V.platformMaterials.length === L.platforms.length, 'every collider platform needs one visual material');

for (const prop of V.props) {
  if (prop.layer === 'gameplay') {
    ok(prop.x >= 0 && prop.x <= L.width, `gameplay prop ${prop.texture} x outside world`);
    ok(prop.y >= 0 && prop.y <= L.height, `gameplay prop ${prop.texture} y outside world`);
  }
  ok(prop.collision === false, `decorative prop ${prop.texture} must not own collision`);
}

ok(V.depths.background < V.depths.gameplay, 'background depth must be behind gameplay');
ok(V.depths.gameplay < V.depths.foreground, 'foreground must be above gameplay');

console.log('PASS FirstThreatVisualConfig');

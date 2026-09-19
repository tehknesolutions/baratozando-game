import { MOBILITY_LAB_VISUAL } from './MobilityLabVisualConfig.js';

function ok(v: unknown, m: string): void { if (!v) throw new Error(m); }
const names = new Set(MOBILITY_LAB_VISUAL.props.map(p => p.name));
for (const name of ['broken-crate','tipped-can','rough-shelf','pipe-route','hanging-cable','fork-bridge','bottle-landmark']) {
  ok(names.has(name), `missing handcrafted set-piece prop ${name}`);
}
ok(MOBILITY_LAB_VISUAL.props.length <= 12, 'set-piece should be deliberate, not prop spam');
ok(MOBILITY_LAB_VISUAL.surfaceMaterials.length >= 8, 'route surfaces need authored material bindings');
console.log('PASS MobilityLabVisualConfig');

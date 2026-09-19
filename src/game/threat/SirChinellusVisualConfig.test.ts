import { SIR_CHINELLUS_VISUAL as V } from './SirChinellusVisualConfig.js';

if (!(V.alpha.DORMANT < V.alpha.WARNING)) throw new Error('warning must reveal more of Sir Chinellus');
if (!(V.alpha.WARNING < V.alpha.CHASING)) throw new Error('chase must reveal more than warning');
if (V.alpha.CHASING !== 1) throw new Error('chasing silhouette must reach full alpha');
if (V.scale <= 1) throw new Error('Sir Chinellus must read as gigantic');

console.log('PASS Sir Chinellus visual config');

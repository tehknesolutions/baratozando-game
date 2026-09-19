import { resolveDangerVisual } from './DangerVisualController.js';

const dormant = resolveDangerVisual('DORMANT', 400);
if (dormant.overlayAlpha !== 0) throw new Error('dormant overlay must be zero');

const warning = resolveDangerVisual('WARNING', 300);
if (!(warning.amberAlpha > dormant.amberAlpha)) throw new Error('warning must increase amber atmosphere');

const far = resolveDangerVisual('CHASING', 220);
const close = resolveDangerVisual('CHASING', 40);
if (!(close.overlayAlpha > far.overlayAlpha)) throw new Error('danger must increase as predator closes');
if (close.overlayAlpha > 0.22) throw new Error('danger overlay must never erase gameplay readability');
if (!(close.dustBoost > far.dustBoost)) throw new Error('dust response must rise as predator closes');

console.log('PASS DangerVisualController');

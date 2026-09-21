import { existsSync, readFileSync } from 'node:fs';
const p='art/source/player/premium-v1/asset-spec.json'; if(!existsSync(p)) throw new Error('missing premium asset spec');
const s=JSON.parse(readFileSync(p,'utf8')); if(s.masterFormat!=='PNG RGBA transparent') throw new Error('master must be transparent RGBA PNG'); if(s.masterMinLongEdge<2048) throw new Error('premium master resolution too low'); if(!s.identityInvariants.includes('six legs')) throw new Error('six-leg invariant missing');
const r=readFileSync('src/assets/roachPremiumV1.ts','utf8'); if(!r.includes('runtimeReady:false')) throw new Error('runtime must remain blocked'); console.log('PASS roach premium v1 repository contract');

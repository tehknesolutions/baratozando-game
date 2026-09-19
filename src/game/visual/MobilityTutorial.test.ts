import { resolveMobilityTutorial } from './MobilityTutorial.js';

function eq(a:string,b:string,m:string){if(a!==b)throw new Error(`${m}: expected ${b}, got ${a}`)}
eq(resolveMobilityTutorial(120, 760), 'SPACE — PULAR', 'start teaches jump only');
eq(resolveMobilityTutorial(430, 700), 'NO AR: SPACE — BATER AS ASAS', 'second beat teaches flap');
eq(resolveMobilityTutorial(700, 600), 'SEGURE A/D CONTRA A MADEIRA + W/S — ESCALAR', 'third beat teaches wall');
eq(resolveMobilityTutorial(1180, 520), 'SEGURE SPACE AO CAIR — PLANAR', 'fourth beat teaches glide');
eq(resolveMobilityTutorial(1500, 220), 'COMBINE PAREDE + ASAS — CHEGUE AO TOPO', 'final beat combines movement');
console.log('PASS MobilityTutorial');

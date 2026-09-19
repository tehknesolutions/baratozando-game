export function resolveMobilityTutorial(x: number, y: number): string {
  if (x < 330) return 'SPACE — PULAR';
  if (x < 620) return 'NO AR: SPACE — BATER AS ASAS';
  if (x < 1030) return 'SEGURE A/D CONTRA A MADEIRA + W/S — ESCALAR';
  if (x < 1400 && y > 360) return 'SEGURE SPACE AO CAIR — PLANAR';
  return 'COMBINE PAREDE + ASAS — CHEGUE AO TOPO';
}

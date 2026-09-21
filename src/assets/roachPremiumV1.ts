export type RoachAssetAuthority = 'CANDIDATE' | 'APPROVED' | 'LOCKED' | 'RUNTIME_READY';
export interface RoachPremiumAsset { key:string; sourcePath:string; runtimePath?:string; authority:RoachAssetAuthority; transparent:true }
export const ROACH_PREMIUM_V1 = { issue:24, canonicalFacing:'right', runtimeReady:false, masters:[] as readonly RoachPremiumAsset[] } as const;
export function requireRoachPremiumRuntimeReady(): void { if (!ROACH_PREMIUM_V1.runtimeReady) throw new Error('ROACH PREMIUM V1 has no LOCKED runtime assets yet.'); }

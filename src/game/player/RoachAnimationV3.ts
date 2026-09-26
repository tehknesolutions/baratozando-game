import type { PlayerState } from './PlayerState.js';
export type RoachWingMode = 'HIDDEN' | 'FLAP' | 'GLIDE';
export type RoachLegMotion = 'MICRO_SHIFT'|'TRIPOD'|'TRIPOD_EXTENDED'|'COMPRESS'|'BALANCE_SPREAD'|'AIR_TUCK'|'BRACE'|'CLIMB_ALTERNATE'|'PUSH_OFF'|'DODGE_TUCK'|'RECOIL'|'COLLAPSE'|'RESET';
export type RoachAntennaMotion = 'ASYNC_SCAN'|'FORWARD_SCAN'|'FAST_FORWARD'|'AIR_FORWARD'|'AIR_BALANCE'|'WIND_BACK'|'WIND_GLIDE'|'WALL_PROBE'|'CLIMB_PROBE'|'PUSH_AWAY'|'DODGE_BACK'|'RECOIL'|'DROOP'|'RESET';
export type RoachAnimationDescriptor = Readonly<{ bodyKey:string; fps:number; loop:boolean; wingsVisible:boolean; wingMode:RoachWingMode; legMotion:RoachLegMotion; antennaMotion:RoachAntennaMotion; presentationOnly:true; scale:0.5 }>;
const descriptor=(bodyKey:string,fps:number,loop:boolean,legMotion:RoachLegMotion,antennaMotion:RoachAntennaMotion,wingMode:RoachWingMode='HIDDEN'):RoachAnimationDescriptor=>Object.freeze({bodyKey,fps,loop,wingsVisible:wingMode!=='HIDDEN',wingMode,legMotion,antennaMotion,presentationOnly:true as const,scale:0.5 as const});
const ROACH_ANIMATION_V3:Readonly<Record<PlayerState,RoachAnimationDescriptor>>=Object.freeze({
 BOOT:descriptor('idle',6,true,'MICRO_SHIFT','ASYNC_SCAN'), IDLE:descriptor('idle',6,true,'MICRO_SHIFT','ASYNC_SCAN'),
 WALK:descriptor('walk',8,true,'TRIPOD','FORWARD_SCAN'), RUN:descriptor('run',12,true,'TRIPOD_EXTENDED','FAST_FORWARD'),
 JUMP:descriptor('jump',10,false,'COMPRESS','AIR_FORWARD'), FALL:descriptor('fall',8,true,'BALANCE_SPREAD','AIR_BALANCE'),
 WING_FLAP:descriptor('jump',14,false,'AIR_TUCK','WIND_BACK','FLAP'), GLIDE:descriptor('fall',6,true,'BALANCE_SPREAD','WIND_GLIDE','GLIDE'),
 WALL_CLING:descriptor('wallCling',6,true,'BRACE','WALL_PROBE'), WALL_CLIMB:descriptor('wallClimb',10,true,'CLIMB_ALTERNATE','CLIMB_PROBE'),
 WALL_JUMP:descriptor('wallJump',12,false,'PUSH_OFF','PUSH_AWAY'), DODGE:descriptor('dodge',14,false,'DODGE_TUCK','DODGE_BACK'),
 HURT:descriptor('hurt',8,false,'RECOIL','RECOIL'), DEATH:descriptor('death',8,false,'COLLAPSE','DROOP'), RESPAWN:descriptor('respawn',6,false,'RESET','RESET')
});
export function resolveRoachAnimationV3(state:PlayerState):RoachAnimationDescriptor{return ROACH_ANIMATION_V3[state];}

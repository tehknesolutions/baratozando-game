export const HD_PLAYER_BENCHMARK = {
  idle: 'player-hd-master',
  wing: 'player-hd-wing',
  wall: 'player-hd-wall',
} as const;

export const HD_PLAYER_ASSET_PATHS: Record<string, string> = {
  [HD_PLAYER_BENCHMARK.idle]: 'assets/player/hd-v2/roach_master_hd_v1_1024.png',
  [HD_PLAYER_BENCHMARK.wing]: 'assets/player/hd-v2/roach_wing_hd_v1_1024.png',
  [HD_PLAYER_BENCHMARK.wall]: 'assets/player/hd-v2/roach_wall_hd_v1_1024.png',
};

export const PLAYER_FRAMES = {
  idle: ['player-idle-01', 'player-idle-02', 'player-idle-01', 'player-idle-02'],
  walk: ['player-walk-01', 'player-walk-02', 'player-walk-03', 'player-walk-04', 'player-walk-05', 'player-walk-03'],
  run: ['player-run-01', 'player-run-02', 'player-run-03', 'player-run-04', 'player-run-02', 'player-run-03', 'player-run-04', 'player-run-01'],
  jump: ['player-jump-01', 'player-jump-02', 'player-jump-02', 'player-jump-01'],
  fall: ['player-fall-01', 'player-fall-02'],
  wallClimb: ['player-wall-climb-01', 'player-wall-climb-02', 'player-wall-climb-03', 'player-wall-climb-04'],
  dodge: ['player-dodge-01', 'player-dodge-02', 'player-dodge-03', 'player-dodge-04', 'player-dodge-02'],
  hurt: ['player-hurt-01', 'player-hurt-02', 'player-hurt-01'],
  death: ['player-death-01', 'player-death-02', 'player-death-03', 'player-death-03', 'player-death-03', 'player-death-03'],
} as const;

export const PLAYER_ASSET_PATHS: Record<string, string> = {
  'player-idle-01': 'assets/player/idle_01.png',
  'player-idle-02': 'assets/player/idle_02.png',
  'player-walk-01': 'assets/player/walk_01.png',
  'player-walk-02': 'assets/player/walk_02.png',
  'player-walk-03': 'assets/player/walk_03.png',
  'player-walk-04': 'assets/player/walk_04.png',
  'player-walk-05': 'assets/player/walk_05.png',
  'player-run-01': 'assets/player/run_01.png',
  'player-run-02': 'assets/player/run_02.png',
  'player-run-03': 'assets/player/run_03.png',
  'player-run-04': 'assets/player/run_04.png',
  'player-jump-01': 'assets/player/jump_01.png',
  'player-jump-02': 'assets/player/jump_02.png',
  'player-fall-01': 'assets/player/fall_01.png',
  'player-fall-02': 'assets/player/fall_02.png',
  'player-wall-climb-01': 'assets/player/wall_climb_01.png',
  'player-wall-climb-02': 'assets/player/wall_climb_02.png',
  'player-wall-climb-03': 'assets/player/wall_climb_03.png',
  'player-wall-climb-04': 'assets/player/wall_climb_04.png',
  'player-dodge-01': 'assets/player/dodge_01.png',
  'player-dodge-02': 'assets/player/dodge_02.png',
  'player-dodge-03': 'assets/player/dodge_03.png',
  'player-dodge-04': 'assets/player/dodge_04.png',
  'player-hurt-01': 'assets/player/hurt_01.png',
  'player-hurt-02': 'assets/player/hurt_02.png',
  'player-death-01': 'assets/player/death_01.png',
  'player-death-02': 'assets/player/death_02.png',
  'player-death-03': 'assets/player/death_03.png',
};
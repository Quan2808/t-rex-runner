export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 200;

export const PLAYER_ORIGINAL_WIDTH = 88;
export const PLAYER_ORIGINAL_HEIGHT = 94;
export const PLAYER_SCALE_DIVISOR = 1.5;

export const MAX_JUMP_HEIGHT = GAME_HEIGHT;
export const MIN_JUMP_HEIGHT = 150;

export const GROUND_ORIGINAL_WIDTH = 2400;
export const GROUND_ORIGINAL_HEIGHT = 24;

export const GROUND_AND_CACTUS_SPEED = 0.5;

export const GAME_SPEED_START = 0.75;
export const GAME_SPEED_INCREMENT = 0.00001;

export const JUMP_SPEED = 0.6;
export const GRAVITY = 0.4;

export const CACTI_CONFIG = [
  {
    width: 48 / 1.5,
    height: 100 / 1.5,
    src: "assets/cactus/cactus_single.png",
  },
  {
    width: 98 / 1.5,
    height: 100 / 1.5,
    src: "assets/cactus/cactus_double_tall.png",
  },
  {
    width: 68 / 1.5,
    height: 100 / 1.5,
    src: "assets/cactus/cactus_double_compact.png",
  },
];

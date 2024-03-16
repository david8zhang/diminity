export enum Side {
  CPU,
  PLAYER,
}

export class Constants {
  public static WINDOW_WIDTH = 800
  public static WINDOW_HEIGHT = 800
  public static GAME_WIDTH = 800
  public static GAME_HEIGHT = 640
  public static CELL_SIZE = 16
  public static OUTLINE_COLOR = 0x7df9ff
  public static CPU_OUTLINE_COLOR = 0xf6e58d
  public static ACTION_POINT_COLOR = 0x2ecc71
  public static ACTION_POINT_COST_COLOR = 0xd91e18
  public static HP_BAR_COLOR = 0xc41e3a
  public static MAGIC_ARMOR_COLOR = 0x0096ff
  public static PHYSICAL_ARMOR_COLOR = 0xd3d3d3
  public static END_TURN_BUTTON_COLOR = 0x227093

  public static DEFAULT_PLAYER_CONFIG = [
    {
      rowColPos: {
        row: 32,
        col: 23,
      },
      maxHealth: 20,
      apCostPerSquareMoved: 0.5,
      texture: 'wizard',
      actionPointPerTurn: 4,
      initiative: 2,
    },
    {
      rowColPos: {
        row: 32,
        col: 25,
      },
      maxHealth: 30,
      texture: 'fighter',
      apCostPerSquareMoved: 0.5,
      actionPointPerTurn: 3,
      initiative: 3,
    },
    {
      rowColPos: {
        row: 32,
        col: 27,
      },
      maxHealth: 25,
      texture: 'rogue',
      apCostPerSquareMoved: 0.5,
      actionPointPerTurn: 4,
      initiative: 4,
    },
  ]

  public static ENEMY_TYPES = [
    {
      texture: 'rat',
      moveRange: 5,
      maxHealth: 15,
      actionPointPerTurn: 3,
      apCostPerSquareMoved: 1,
      initiative: 1,
    },
    {
      texture: 'spider',
      moveRange: 6,
      maxHealth: 10,
      actionPointPerTurn: 3,
      apCostPerSquareMoved: 1,
      initiative: 2,
    },
  ]
}

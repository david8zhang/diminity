export enum Side {
  PLAYER = 'PLAYER',
  CPU = 'CPU',
}

export class Constants {
  public static WINDOW_WIDTH = 800
  public static WINDOW_HEIGHT = 750
  public static GAME_WIDTH = 800
  public static GAME_HEIGHT = 640
  public static CELL_SIZE = 16
  public static OUTLINE_COLOR = 0x7df9ff

  public static DEFAULT_PLAYER_CONFIG = [
    {
      rowColPos: {
        row: 32,
        col: 23,
      },
      maxHealth: 20,
      moveRange: 4,
      texture: 'wizard',
      actionPointPerTurn: 5,
    },
    {
      rowColPos: {
        row: 32,
        col: 25,
      },
      maxHealth: 30,
      moveRange: 3,
      texture: 'fighter',
      actionPointPerTurn: 3,
    },
    {
      rowColPos: {
        row: 32,
        col: 27,
      },
      maxHealth: 25,
      moveRange: 5,
      texture: 'rogue',
      actionPointPerTurn: 4,
    },
  ]

  public static ENEMY_TYPES = [
    {
      texture: 'rat',
      moveRange: 5,
      maxHealth: 15,
      actionPointPerTurn: 3,
    },
    {
      texture: 'spider',
      moveRange: 6,
      maxHealth: 10,
      actionPointPerTurn: 3,
    },
  ]
}

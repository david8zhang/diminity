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

  public static DEFAULT_PLAYER_CONFIG = [
    {
      rowColPos: {
        row: 32,
        col: 23,
      },
      texture: 'wizard',
    },
    {
      rowColPos: {
        row: 32,
        col: 25,
      },
      texture: 'fighter',
    },
    {
      rowColPos: {
        row: 32,
        col: 27,
      },
      texture: 'rogue',
    },
  ]
}

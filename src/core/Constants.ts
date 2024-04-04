import { ActionNames } from './actions/ActionNames'

export enum Side {
  CPU,
  PLAYER,
}

export enum DamageType {
  MAGIC,
  ARMOR,
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
      maxPhysicalArmor: 5,
      maxMagicArmor: 20,
      apCostPerSquareMoved: 0.1,
      texture: 'wizard',
      actionPointPerTurn: 4,
      strength: 2,
      dexterity: 3,
      initiative: 4,
      animOverrides: {
        [ActionNames.BASIC_ATTACK]: 'bonk',
      },
    },
    {
      rowColPos: {
        row: 32,
        col: 25,
      },
      maxHealth: 30,
      maxPhysicalArmor: 20,
      maxMagicArmor: 5,
      texture: 'fighter',
      apCostPerSquareMoved: 0.5,
      actionPointPerTurn: 3,
      strength: 4,
      dexterity: 2,
      initiative: 3,
      animOverrides: {
        [ActionNames.BASIC_ATTACK]: 'slash',
      },
    },
    {
      rowColPos: {
        row: 32,
        col: 27,
      },
      maxHealth: 25,
      maxPhysicalArmor: 10,
      maxMagicArmor: 10,
      texture: 'rogue',
      apCostPerSquareMoved: 0.1,
      actionPointPerTurn: 4,
      strength: 3,
      dexterity: 4,
      initiative: 4,
      animOverrides: {
        [ActionNames.BASIC_ATTACK]: 'stab',
      },
      actionNames: [ActionNames.PIERCING_SHOT],
    },
  ]

  public static ENEMY_TYPES = [
    {
      texture: 'rat',
      moveRange: 5,
      maxHealth: 15,
      maxPhysicalArmor: 0,
      maxMagicArmor: 0,
      actionPointPerTurn: 3,
      apCostPerSquareMoved: 1,
      strength: 3,
      initiative: 1,
      animOverrides: {
        [ActionNames.BASIC_ATTACK]: 'swipe',
      },
    },
    {
      texture: 'spider',
      moveRange: 6,
      maxHealth: 10,
      maxPhysicalArmor: 0,
      maxMagicArmor: 0,
      actionPointPerTurn: 3,
      apCostPerSquareMoved: 1,
      strength: 3,
      initiative: 2,
      animOverrides: {
        [ActionNames.BASIC_ATTACK]: 'swipe',
      },
    },
  ]
}

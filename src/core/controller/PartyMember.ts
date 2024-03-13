import Game from '../../scenes/Game'
import { Constants, Side } from '../Constants'

export interface PartyMemberConfig {
  id: string
  position: {
    x: number
    y: number
  }
  texture: string
  maxHealth: number
  actionPointPerTurn: number
  apCostPerSquareMoved: number
  initiative: number
  side: Side
}

export class PartyMember {
  protected game: Game
  public sprite: Phaser.GameObjects.Sprite
  public id: string

  public currHealth: number = 0
  public maxHealth: number = 0
  public actionPointPerTurn: number = 0
  public currActionPoints: number = 0
  public apCostPerSquareMoved: number = 0
  public initiative: number = 0
  public side: Side

  constructor(game: Game, config: PartyMemberConfig) {
    this.game = game
    this.id = config.id
    this.currHealth = config.maxHealth
    this.maxHealth = config.maxHealth
    this.actionPointPerTurn = config.actionPointPerTurn
    this.apCostPerSquareMoved = config.apCostPerSquareMoved
    this.initiative = config.initiative
    this.side = config.side
    this.currActionPoints = this.actionPointPerTurn
    this.sprite = this.game.add.sprite(config.position.x, config.position.y, config.texture)
  }

  startTurn() {
    if (Game.instance) {
      Game.instance.postFxPlugin.add(this.sprite, {
        thickness: 2,
        outlineColor: Constants.CPU_OUTLINE_COLOR,
      })
    }
  }
}

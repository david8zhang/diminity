import Game from '../../scenes/Game'

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

  constructor(game: Game, config: PartyMemberConfig) {
    this.game = game
    this.id = config.id
    this.currHealth = config.maxHealth
    this.maxHealth = config.maxHealth
    this.actionPointPerTurn = config.actionPointPerTurn
    this.apCostPerSquareMoved = config.apCostPerSquareMoved
    this.currActionPoints = this.actionPointPerTurn
    this.sprite = this.game.add.sprite(config.position.x, config.position.y, config.texture)
  }
}

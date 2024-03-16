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

  startTurn(outlineColor?: number) {
    this.game.cameras.main.pan(this.sprite.x, this.sprite.y, 500, Phaser.Math.Easing.Sine.InOut)
    // this.game.cameras.main.centerOn(this.sprite.x, this.sprite.y)
    if (Game.instance) {
      Game.instance.postFxPlugin.add(this.sprite, {
        thickness: 2,
        outlineColor: outlineColor ? outlineColor : Constants.CPU_OUTLINE_COLOR,
      })
    }
    this.currActionPoints = this.actionPointPerTurn
  }

  dehighlight() {
    if (Game.instance) {
      Game.instance.postFxPlugin.remove(this.sprite)
    }
  }

  get moveRange() {
    return this.currActionPoints / this.apCostPerSquareMoved
  }

  getMoveableSquares(): { row: number; col: number }[] {
    const { row, col } = this.game.map.getRowColForWorldPosition(this.sprite.x, this.sprite.y)
    const queue = [{ row, col }]
    const seen = new Set<string>()
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]
    const moveableSquares: { row: number; col: number }[] = []
    let distance = 0
    while (queue.length > 0 && distance <= this.moveRange) {
      const queueSize = queue.length
      for (let i = 0; i < queueSize; i++) {
        const cell = queue.shift()
        if (cell) {
          moveableSquares.push(cell)
          directions.forEach((dir) => {
            const newRow = dir[0] + cell.row
            const newCol = dir[1] + cell.col
            if (!seen.has(`${newRow},${newCol}`) && this.game.map.isRowColWithinBounds(row, col)) {
              seen.add(`${newRow},${newCol}`)
              queue.push({ row: newRow, col: newCol })
            }
          })
        }
      }
      distance++
    }
    return moveableSquares
  }

  canMoveToPosition(x: number, y: number) {
    const currPosition = this.game.map.getCenteredWorldPosition(this.sprite.x, this.sprite.y)
    const tileDistance = this.game.map.getTileDistance(currPosition.x, currPosition.y, x, y)
    const isAlreadyAtPosition = currPosition.x == x && currPosition.y == y
    return (
      !isAlreadyAtPosition && tileDistance <= this.moveRange && !this.game.isSpaceOccupied(x, y)
    )
  }
}

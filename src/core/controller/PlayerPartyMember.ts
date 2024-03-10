import { PartyMember, PartyMemberConfig } from './PartyMember'
import { Player } from './Player'
import { Constants } from '../Constants'
import Game from '../../scenes/Game'

export enum ActionState {
  IDLE = 'IDLE',
  SELECTING_MOVE_DEST = 'SELECTING_MOVE_DEST',
  MOVING = 'MOVING',
  ATTACKING = 'ATTACKING',
}

export class PlayerPartyMember extends PartyMember {
  private player: Player
  public actionState: ActionState = ActionState.IDLE

  constructor(game: Game, player: Player, config: PartyMemberConfig) {
    super(game, config)
    this.player = player
    this.sprite.setInteractive({ useHandCursor: 'true' }).on(Phaser.Input.Events.POINTER_UP, () => {
      this.player.handlePartyMemberClick(this.id)
    })
  }

  select() {
    if (Game.instance) {
      Game.instance.postFxPlugin.add(this.sprite, {
        thickness: 2,
        outlineColor: Constants.OUTLINE_COLOR,
      })
    }
  }

  unselect() {
    Game.instance.postFxPlugin.remove(this.sprite)
    this.goBackToIdle()
  }

  beginMoveOrder() {
    if (this.actionState === ActionState.IDLE) {
      this.actionState = ActionState.SELECTING_MOVE_DEST
      this.highlightMoveableSquares()
    }
  }

  moveToPosition(worldX: number, worldY: number) {
    const newPosition = this.game.map.getCenteredWorldPosition(worldX, worldY)
    if (!this.canMoveToPosition(newPosition.x, newPosition.y)) {
      return
    }
    const distance = this.game.map.getTileDistance(
      this.sprite.x,
      this.sprite.y,
      newPosition.x,
      newPosition.y
    )
    this.game.tweens.add({
      targets: [this.sprite],
      x: {
        from: this.sprite.x,
        to: newPosition.x,
      },
      y: {
        from: this.sprite.y,
        to: newPosition.y,
      },
      duration: (distance / 5) * 500,
      ease: Phaser.Math.Easing.Sine.Out,
      onStart: () => {
        this.actionState = ActionState.MOVING
        this.game.map.tintTile(newPosition.x, newPosition.y, 0x00ff00)
      },
      onComplete: () => {
        this.goBackToIdle()
        this.game.map.clearTint(newPosition.x, newPosition.y)
      },
    })
  }

  canMoveToPosition(x: number, y: number) {
    const currPosition = this.game.map.getCenteredWorldPosition(this.sprite.x, this.sprite.y)
    const tileDistance = this.game.map.getTileDistance(currPosition.x, currPosition.y, x, y)
    const isAlreadyAtPosition = currPosition.x == x && currPosition.y == y
    return (
      !isAlreadyAtPosition && tileDistance <= this.moveRange && !this.game.isSpaceOccupied(x, y)
    )
  }

  goBackToIdle() {
    this.actionState = ActionState.IDLE
    this.game.map.dehighlightTiles()
  }

  highlightMoveableSquares() {
    const moveableSquarePositions = this.getMoveableSquares()
    this.game.map.highlightTiles(moveableSquarePositions)
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
    while (queue.length > 0 && distance < this.moveRange) {
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
}

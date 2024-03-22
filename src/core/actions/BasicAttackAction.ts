import Game from '../../scenes/Game'
import { UI } from '../../scenes/UI'
import { PartyMember } from '../controller/PartyMember'
import { Action } from './Action'
import { ActionNames } from './ActionNames'

export class BasicAttackAction extends Action {
  private static ATTACK_RANGE = 2
  private static TILE_HIGHLIGHT_COLOR = 0xff7979

  constructor(partyMember: PartyMember) {
    super(ActionNames.BASIC_ATTACK, 'sword-icon', partyMember)
    this.apCost = 1
  }

  public isValidAttackTarget(partyMember: PartyMember) {
    const tileDistance = Game.instance.map.getTileDistance(
      this.source.sprite.x,
      this.source.sprite.y,
      partyMember.sprite.x,
      partyMember.sprite.y
    )
    return tileDistance <= BasicAttackAction.ATTACK_RANGE && partyMember.side !== this.source.side
  }

  public handleClick(worldX: number, worldY: number): void {
    if (Game.instance.map.isWorldXYWithinBounds(worldX, worldY)) {
      const partyMember = Game.instance.getPartyMemberAtPosition(worldX, worldY)
      if (partyMember && this.isValidAttackTarget(partyMember)) {
        this.execute(partyMember)
      }
    }
  }

  public onSelected() {
    const targetableSquares = this.getTargetableSquares()
    Game.instance.map.tintTiles(targetableSquares, BasicAttackAction.TILE_HIGHLIGHT_COLOR)
  }

  public getTargetableSquares() {
    const { row, col } = Game.instance.map.getRowColForWorldPosition(
      this.source.sprite.x,
      this.source.sprite.y
    )
    const queue = [{ row, col }]
    const seen = new Set<string>()
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]
    const targetableSquares: { row: number; col: number }[] = []
    let distance = 0
    while (queue.length > 0 && distance <= BasicAttackAction.ATTACK_RANGE) {
      const queueSize = queue.length
      for (let i = 0; i < queueSize; i++) {
        const cell = queue.shift()
        if (cell) {
          targetableSquares.push(cell)
          directions.forEach((dir) => {
            const newRow = dir[0] + cell.row
            const newCol = dir[1] + cell.col
            if (
              !seen.has(`${newRow},${newCol}`) &&
              Game.instance.map.isRowColWithinBounds(newRow, newCol) &&
              Game.instance.map.isValidGroundTile(newRow, newCol)
            ) {
              seen.add(`${newRow},${newCol}`)
              queue.push({ row: newRow, col: newCol })
            }
          })
        }
      }
      distance++
    }
    return targetableSquares.filter((ms) => {
      const { x, y } = Game.instance.map.getWorldPositionForRowCol(ms.row, ms.col)
      const partyMemberAtPosition = Game.instance.getPartyMemberAtPosition(x, y)
      return !partyMemberAtPosition || partyMemberAtPosition.side !== this.source.side
    })
  }

  public calculateDamage() {
    return this.source.strength * Phaser.Math.Between(1, 3)
  }

  public execute(target: PartyMember): void {
    Game.instance.player.disablePointerMoveEvents = true
    UI.instance.floatingStatBars.setVisible(true)
    UI.instance.floatingStatBars.selectCurrPartyMember(target)
  }
}

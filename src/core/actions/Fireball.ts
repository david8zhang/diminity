import Game from '../../scenes/Game'
import { Constants } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { Action } from './Action'
import { ActionNames } from './ActionNames'

export class Fireball extends Action {
  private static ATTACK_RANGE = 8.5
  private static AOE_RADIUS = 2.5
  private static AP_COST = 4
  private static ATTACK_RANGE_HIGHLIGHT_COLOR = 0xff0000
  private static AOE_HIGHLIGHT_COLOR = 0xffbf00

  private processingAttack: boolean = false
  private fireballSprite!: Phaser.GameObjects.Sprite
  private showAOERange: boolean = false
  private AOETiles: Phaser.GameObjects.Rectangle[] = []
  private attackRangeTiles: Phaser.GameObjects.Rectangle[] = []

  constructor(partyMember: PartyMember) {
    super(ActionNames.FIREBALL, '', partyMember)
    this.apCost = Fireball.AP_COST
    this.fireballSprite = Game.instance.add.sprite(0, 0, '').setVisible(false)
  }

  public handleHover(worldX: number, worldY: number): void {
    if (!Game.instance.map.isWorldXYWithinBounds(worldX, worldY)) {
      return
    }
    if (this.showAOERange && this.isWithinAttackRange(worldX, worldY)) {
      this.AOETiles.forEach((rect) => {
        rect.destroy()
      })
      const rowCol = Game.instance.map.getRowColForWorldPosition(worldX, worldY)
      const tiles = Game.instance.map.getAllTilesWithinCircleRadius(
        rowCol.row,
        rowCol.col,
        Fireball.AOE_RADIUS
      )
      tiles.forEach((tile) => {
        const worldXY = Game.instance.map.getWorldPositionForRowCol(tile.row, tile.col)
        const newRectangle = Game.instance.add.rectangle(
          worldXY.x,
          worldXY.y,
          Constants.CELL_SIZE,
          Constants.CELL_SIZE,
          Fireball.AOE_HIGHLIGHT_COLOR,
          0.5
        )
        this.AOETiles.push(newRectangle)
      })
    }
  }

  public handleClick(worldX: number, worldY: number): void {
    throw new Error('Method not implemented.')
  }
  public isValidAttackTarget(partyMember: PartyMember): boolean {
    throw new Error('Method not implemented.')
  }
  public execute(target: PartyMember | PartyMember[], onComplete?: Function | undefined): void {
    throw new Error('Method not implemented.')
  }

  public isWithinAttackRange(worldX: number, worldY: number) {
    const rowCol = Game.instance.map.getRowColForWorldPosition(worldX, worldY)
    const attackRangeTiles = this.getAttackRangeTiles()
    for (let i = 0; i < attackRangeTiles.length; i++) {
      const tile = attackRangeTiles[i]
      if (rowCol.row == tile.row && rowCol.col == tile.col) {
        return true
      }
    }
    return false
  }

  public getAttackRangeTiles() {
    const worldRowCol = Game.instance.map.getRowColForWorldPosition(
      this.source.sprite.x,
      this.source.sprite.y
    )
    const tiles = Game.instance.map.getAllTilesWithinCircleRadius(
      worldRowCol.row,
      worldRowCol.col,
      Fireball.ATTACK_RANGE
    )
    const sourceRowCol = Game.instance.map.getRowColForWorldPosition(
      this.source.sprite.x,
      this.source.sprite.y
    )
    const isAtPosition = (row: number, col: number) => {
      return sourceRowCol.row == row && sourceRowCol.col == col
    }

    return tiles.filter((t) => {
      return Game.instance.map.isValidGroundTile(t.row, t.col) && !isAtPosition(t.row, t.col)
    })
  }

  public onDeselect() {
    this.AOETiles.forEach((rect) => {
      rect.destroy()
    })
    this.attackRangeTiles.forEach((rect) => {
      rect.destroy()
    })
  }

  public onSelected(): void {
    this.showAOERange = true
    this.attackRangeTiles.forEach((rect) => {
      rect.destroy()
    })
    const attackRangeTilePositions = this.getAttackRangeTiles()
    attackRangeTilePositions.forEach((position) => {
      const worldXY = Game.instance.map.getWorldPositionForRowCol(position.row, position.col)
      const newRect = Game.instance.add.rectangle(
        worldXY.x,
        worldXY.y,
        Constants.CELL_SIZE,
        Constants.CELL_SIZE,
        Fireball.ATTACK_RANGE_HIGHLIGHT_COLOR,
        0.4
      )
      this.attackRangeTiles.push(newRect)
    })
  }
}

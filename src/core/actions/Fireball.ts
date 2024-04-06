import Game from '../../scenes/Game'
import { PartyMember } from '../controller/PartyMember'
import { Action } from './Action'
import { ActionNames } from './ActionNames'

export class Fireball extends Action {
  private static ATTACK_RANGE = 8.5
  private static AOE_RADIUS = 3.5
  private static AP_COST = 4
  private static ATTACK_RANGE_HIGHLIGHT_COLOR = 0xff7979
  private static AOE_HIGHLIGHT_COLOR = 0xffbf00

  private processingAttack: boolean = false
  private fireballSprite!: Phaser.GameObjects.Sprite
  private showAOERange: boolean = false
  private AOETiles: { row: number; col: number }[] = []
  private attackRangeTiles: { row: number; col: number }[] = []

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
      const rowCol = Game.instance.map.getRowColForWorldPosition(worldX, worldY)
      Game.instance.map.clearTintForTiles(this.AOETiles)
      this.AOETiles = Game.instance.map.getAllTilesWithinCircleRadius(
        rowCol.row,
        rowCol.col,
        Fireball.AOE_RADIUS
      )
      const attackRangeTiles = this.getAttackRangeTiles()
      Game.instance.map.tintTiles(attackRangeTiles, Fireball.ATTACK_RANGE_HIGHLIGHT_COLOR)
      Game.instance.map.tintTiles(this.AOETiles, Fireball.AOE_HIGHLIGHT_COLOR)
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
    return Game.instance.map.getAllTilesWithinCircleRadius(
      worldRowCol.row,
      worldRowCol.col,
      Fireball.ATTACK_RANGE
    )
  }

  public onSelected(): void {
    this.showAOERange = true
    const attackRangeTiles = this.getAttackRangeTiles()
    Game.instance.map.tintTiles(attackRangeTiles, Fireball.ATTACK_RANGE_HIGHLIGHT_COLOR)
  }
}

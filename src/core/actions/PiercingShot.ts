import Game from '../../scenes/Game'
import { UI } from '../../scenes/UI'
import { Constants, DamageType, Side } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { PlayerPartyMember } from '../controller/PlayerPartyMember'
import { Action } from './Action'
import { ActionNames } from './ActionNames'

export class PiercingShot extends Action {
  private static ATTACK_RANGE = 8.5
  private static AP_COST = 3
  private static TILE_HIGHLIGHT_COLOR = 0xff0000
  private processingAttack: boolean = false
  private arrowSprite: Phaser.GameObjects.Sprite
  private attackRangeTiles: Phaser.GameObjects.Rectangle[] = []

  constructor(partyMember: PartyMember) {
    super(ActionNames.PIERCING_SHOT, 'piercing-shot', partyMember)
    this.apCost = PiercingShot.AP_COST
    this.arrowSprite = Game.instance.add.sprite(0, 0, 'arrow').setVisible(false)
  }

  public handleClick(worldX: number, worldY: number): void {
    if (Game.instance.map.isWorldXYWithinBounds(worldX, worldY)) {
      const partyMember = Game.instance.getPartyMemberAtPosition(worldX, worldY)
      if (partyMember && this.isValidAttackTarget(partyMember)) {
        this.execute(partyMember)
      }
    }
  }

  isValidAttackTarget(partyMember: PartyMember) {
    const tileDistance = Game.instance.map.getTileDistance(
      this.source.sprite.x,
      this.source.sprite.y,
      partyMember.sprite.x,
      partyMember.sprite.y
    )
    return tileDistance <= PiercingShot.ATTACK_RANGE && partyMember.side !== this.source.side
  }

  public getAttackRangeTiles() {
    const worldRowCol = Game.instance.map.getRowColForWorldPosition(
      this.source.sprite.x,
      this.source.sprite.y
    )
    const tiles = Game.instance.map.getAllTilesWithinCircleRadius(
      worldRowCol.row,
      worldRowCol.col,
      PiercingShot.ATTACK_RANGE
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

  public calculateDamage() {
    return this.source.dexterity * Phaser.Math.Between(1, 4)
  }

  public execute(target: PartyMember, onComplete?: Function): void {
    if (!this.processingAttack) {
      this.processingAttack = true
      this.source.subtractActionPoints(this.apCost)
      if (this.source.side === Side.PLAYER) {
        Game.instance.player.disablePointerMoveEvents = true
      }
      UI.instance.floatingStatBars.setVisible(true)
      UI.instance.floatingStatBars.selectCurrPartyMember(target)
      this.arrowSprite.setVisible(true).setPosition(this.source.sprite.x, this.source.sprite.y)

      const targetX = target.sprite.x
      const targetY = target.sprite.y
      const sourceX = this.source.sprite.x
      const sourceY = this.source.sprite.y

      const angle = Phaser.Math.Angle.Between(sourceX, sourceY, targetX, targetY)
      this.arrowSprite.setRotation(angle)
      const distance = Game.instance.map.getTileDistance(sourceX, sourceY, targetX, targetY)
      Game.instance.tweens.add({
        targets: [this.arrowSprite],
        x: {
          from: sourceX,
          to: targetX,
        },
        y: {
          from: sourceY,
          to: targetY,
        },
        duration: (distance / 5) * 100,
        onComplete: () => {
          this.arrowSprite.setVisible(false)
          const damage = this.calculateDamage()
          this.dealDamage(target, damage, DamageType.ARMOR, () => {
            this.processingAttack = false
            this.arrowSprite.setVisible(false)
            UI.instance.floatingStatBars.setVisible(false)
            if (this.source.side === Side.PLAYER) {
              Game.instance.player.disablePointerMoveEvents = false
              UI.instance.endTurnButton.setVisible(true)
            }
            if (onComplete) {
              onComplete()
            }
          })
          Game.instance.time.delayedCall(100, () => {
            target.sprite.clearTint()
          })
          if (this.source.side === Side.PLAYER) {
            const playerPartyMember = this.source as PlayerPartyMember
            playerPartyMember.goBackToIdle()
            UI.instance.endTurnButton.setVisible(false)
          }
        },
      })
    }
  }

  public onDeselect() {
    this.attackRangeTiles.forEach((rect) => {
      rect.destroy()
    })
  }

  public onSelected(): void {
    const attackableTiles = this.getAttackRangeTiles()
    this.attackRangeTiles.forEach((rect) => {
      rect.destroy()
    })
    attackableTiles.forEach((position) => {
      const worldXY = Game.instance.map.getWorldPositionForRowCol(position.row, position.col)
      const newRect = Game.instance.add.rectangle(
        worldXY.x,
        worldXY.y,
        Constants.CELL_SIZE,
        Constants.CELL_SIZE,
        PiercingShot.TILE_HIGHLIGHT_COLOR,
        0.4
      )
      this.attackRangeTiles.push(newRect)
    })
  }
}

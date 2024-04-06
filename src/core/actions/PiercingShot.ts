import Game from '../../scenes/Game'
import { UI } from '../../scenes/UI'
import { DamageType, Side } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { PlayerPartyMember } from '../controller/PlayerPartyMember'
import { Action } from './Action'
import { ActionNames } from './ActionNames'

export class PiercingShot extends Action {
  private static ATTACK_RANGE = 8
  private static AP_COST = 3
  private static TILE_HIGHLIGHT_COLOR = 0xff7979
  private processingAttack: boolean = false
  private arrowSprite: Phaser.GameObjects.Sprite

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

  public getTargetableSquares() {
    const { row, col } = Game.instance.map.getRowColForWorldPosition(
      this.source.sprite.x,
      this.source.sprite.y
    )
    const targetableSquares = Game.instance.map.getAllValidSquaresWithinRange(
      { row, col },
      PiercingShot.ATTACK_RANGE
    )
    return targetableSquares.filter((ms) => {
      const { x, y } = Game.instance.map.getWorldPositionForRowCol(ms.row, ms.col)
      const partyMemberAtPosition = Game.instance.getPartyMemberAtPosition(x, y)
      return !partyMemberAtPosition || partyMemberAtPosition.side !== this.source.side
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
  public onSelected(): void {
    const targetableSquares = this.getTargetableSquares()
    Game.instance.map.tintTiles(targetableSquares, PiercingShot.TILE_HIGHLIGHT_COLOR)
  }
}

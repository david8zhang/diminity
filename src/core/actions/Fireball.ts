import Game from '../../scenes/Game'
import { UI } from '../../scenes/UI'
import { Constants, DamageType, Side } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { PlayerPartyMember } from '../controller/PlayerPartyMember'
import { Action } from './Action'
import { ActionNames } from './ActionNames'

export class Fireball extends Action {
  private static ATTACK_RANGE = 8.5
  private static AOE_RADIUS = 2.5
  // private static AP_COST = 4
  private static AP_COST = 0
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
    this.fireballSprite = Game.instance.add.sprite(0, 0, 'fireball').setVisible(false).setScale(1.5)
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
    if (Game.instance.map.isWorldXYWithinBounds(worldX, worldY)) {
      const partyMember = Game.instance.getPartyMemberAtPosition(worldX, worldY)
      if (partyMember && this.isValidAttackTarget(partyMember)) {
        this.execute(partyMember)
      }
    }
  }

  public isValidAttackTarget(partyMember: PartyMember): boolean {
    const tileDistance = Game.instance.map.getTileDistance(
      this.source.sprite.x,
      this.source.sprite.y,
      partyMember.sprite.x,
      partyMember.sprite.y
    )
    return tileDistance <= Fireball.ATTACK_RANGE && partyMember.side !== this.source.side
  }

  public calculateDamage() {
    return this.source.wisdom * Phaser.Math.Between(1, 2)
  }

  public execute(target: PartyMember, onComplete?: Function): void {
    if (!this.processingAttack) {
      this.attackRangeTiles.forEach((tile) => {
        tile.setVisible(false)
      })
      this.processingAttack = true
      this.source.subtractActionPoints(this.apCost)
      if (this.source.side === Side.PLAYER) {
        Game.instance.player.disablePointerMoveEvents = true
      }
      UI.instance.floatingStatBars.setVisible(true)
      UI.instance.floatingStatBars.selectCurrPartyMember(target)
      this.fireballSprite.setVisible(true).setPosition(this.source.sprite.x, this.source.sprite.y)

      const targetX = target.sprite.x
      const targetY = target.sprite.y
      const sourceX = this.source.sprite.x
      const sourceY = this.source.sprite.y

      const angle = Phaser.Math.Angle.Between(sourceX, sourceY, targetX, targetY)
      this.fireballSprite.setRotation(angle)

      Game.instance.postFxPlugin.add(this.fireballSprite, {
        thickness: 2,
        outlineColor: 0xffff00,
      })

      const distance = Game.instance.map.getTileDistance(sourceX, sourceY, targetX, targetY)
      Game.instance.tweens.add({
        targets: [this.fireballSprite],
        x: {
          from: sourceX,
          to: targetX,
        },
        y: {
          from: sourceY,
          to: targetY,
        },
        duration: (distance / 5) * 200,
        onComplete: () => {
          this.fireballSprite.setVisible(false)
          const damage = this.calculateDamage()
          this.dealDamage(target, damage, DamageType.MAGIC, () => {
            this.processingAttack = false
            this.fireballSprite.setVisible(false)
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

  public isWithinAttackRange(worldX: number, worldY: number) {
    const rowCol = Game.instance.map.getRowColForWorldPosition(worldX, worldY)
    const attackRangeTiles = this.getAttackRangeTiles(Fireball.ATTACK_RANGE)
    for (let i = 0; i < attackRangeTiles.length; i++) {
      const tile = attackRangeTiles[i]
      if (rowCol.row == tile.row && rowCol.col == tile.col) {
        return true
      }
    }
    return false
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
    const attackRangeTilePositions = this.getAttackRangeTiles(Fireball.ATTACK_RANGE)
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

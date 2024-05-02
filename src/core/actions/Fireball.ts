import Game from '../../scenes/Game'
import { UI } from '../../scenes/UI'
import { Constants, DamageType, Side } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { PlayerPartyMember } from '../controller/PlayerPartyMember'
import { BurningGroundEffect } from '../effects/BurningGroundEffect'
import { Action } from './Action'
import { ActionNames } from './ActionNames'

export class Fireball extends Action {
  private static ATTACK_RANGE = 8.5
  private static AOE_RADIUS = 2.5
  private static AP_COST = 4
  private static COOLDOWN = 3
  private static ATTACK_RANGE_HIGHLIGHT_COLOR = 0xff0000
  private static AOE_HIGHLIGHT_COLOR = 0xffbf00

  private processingAttack: boolean = false
  private fireballSprite!: Phaser.GameObjects.Sprite
  private showAOERange: boolean = false
  private AOETiles: Phaser.GameObjects.Rectangle[] = []
  private attackRangeTiles: Phaser.GameObjects.Rectangle[] = []

  constructor(partyMember: PartyMember) {
    super(ActionNames.FIREBALL, 'fireball-icon', partyMember)
    this.apCost = Fireball.AP_COST
    this.fireballSprite = Game.instance.add.sprite(0, 0, 'fireball').setVisible(false).setScale(1.5)
    this.fireballSprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, (_, frame) => {
      if (frame.index == 3) {
        Game.instance.effects.push(
          new BurningGroundEffect({
            position: {
              x: this.fireballSprite.x,
              y: this.fireballSprite.y,
            },
            radius: Fireball.AOE_RADIUS,
            turnsRemaining: 3,
          })
        )
      }
    })
    this.range = Fireball.ATTACK_RANGE
    this.cooldown = 0
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
      this.execute({
        x: worldX,
        y: worldY,
      })
    }
  }

  public calculateDamage() {
    return this.source.wisdom * Phaser.Math.Between(1, 2)
  }

  public getAllEnemyPartyMembersWithinRadius(centerPosition: { x: number; y: number }) {
    const gameInstance = Game.instance
    const enemyPartyMembers =
      this.source.side === Side.CPU
        ? gameInstance.player.allPartyMembers
        : gameInstance.cpu.allPartyMembers
    const radiusPixels = Fireball.AOE_RADIUS * Constants.CELL_SIZE

    return enemyPartyMembers.filter((pm) => {
      const distToCenter = Phaser.Math.Distance.Between(
        pm.sprite.x,
        pm.sprite.y,
        centerPosition.x,
        centerPosition.y
      )
      return pm.currHealth > 0 && distToCenter <= radiusPixels
    })
  }

  public execute(targetPosition: { x: number; y: number }, onComplete?: Function): void {
    if (!this.processingAttack) {
      this.attackRangeTiles.forEach((tile) => {
        tile.setVisible(false)
      })
      this.processingAttack = true
      this.source.subtractActionPoints(this.apCost)
      this.cooldown = Fireball.COOLDOWN
      UI.instance.actionMenu.displayActionsForPartyMember(this.source)

      if (this.source.side === Side.PLAYER) {
        Game.instance.player.disablePointerMoveEvents = true
      }
      UI.instance.hideFloatingStatBars()
      Game.instance.postFxPlugin.add(this.fireballSprite, {
        thickness: 2,
        outlineColor: 0xffff00,
      })

      this.fireballSprite
        .setVisible(true)
        .setPosition(this.source.sprite.x, this.source.sprite.y)
        .setScale(1.5)
        .setTexture('fireball')

      const targetX = targetPosition.x
      const targetY = targetPosition.y
      const sourceX = this.source.sprite.x
      const sourceY = this.source.sprite.y

      const angle = Phaser.Math.Angle.Between(sourceX, sourceY, targetX, targetY)
      this.fireballSprite.setRotation(angle)
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
          Game.instance.cameras.main.shake(150, 0.001)
          Game.instance.postFxPlugin.remove(this.fireballSprite)
          Game.instance.postFxPlugin.add(this.fireballSprite, {
            thickness: 2,
            outlineColor: 0xffbf00,
          })
          this.fireballSprite.setDepth(1000)
          this.fireballSprite.play('fireball-explosion')

          // Deal damage to all enemies within the affected radius
          const affectedEnemies = this.getAllEnemyPartyMembersWithinRadius(targetPosition)
          affectedEnemies.forEach((enemy) => {
            const damage = this.calculateDamage()
            this.dealDamage(enemy, damage, DamageType.MAGIC, () => {})
            Game.instance.time.delayedCall(100, () => {
              enemy.sprite.clearTint()
            })
          })

          // Go back to idle after fireball lands
          if (this.source.side === Side.PLAYER) {
            const playerPartyMember = this.source as PlayerPartyMember
            playerPartyMember.goBackToIdle()
            UI.instance.endTurnButton.setVisible(false)
          }

          Game.instance.time.delayedCall(1000, () => {
            this.processingAttack = false
            this.fireballSprite.setVisible(false)
            Game.instance.postFxPlugin.remove(this.fireballSprite)
            UI.instance.floatingStatBars.setVisible(false)
            if (this.source.side === Side.PLAYER) {
              Game.instance.player.disablePointerMoveEvents = false
              UI.instance.endTurnButton.setVisible(true)
            }
            if (onComplete) {
              onComplete()
            }
          })
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

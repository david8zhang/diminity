import Game from '../../scenes/Game'
import { UI } from '../../scenes/UI'
import { Constants, DamageType, Side } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { PlayerPartyMember } from '../controller/PlayerPartyMember'
import { Action } from './Action'
import { ActionNames } from './ActionNames'

export class TremorStrike extends Action {
  public static ATTACK_RANGE = 5.5
  private static ATTACK_RANGE_HIGHLIGHT_COLOR = 0xd3d3d3
  private static AOE_RANGE_HIGHLIGHT_COLOR = 0xff0000
  private static ANGLE_RANGE = 20
  private static AP_COST = 2
  private static COOLDOWN = 3

  public showAOERange: boolean = false
  private AOETiles: Phaser.GameObjects.Rectangle[] = []
  public attackRangeTiles: Phaser.GameObjects.Rectangle[] = []

  constructor(partyMember: PartyMember) {
    super(ActionNames.TREMOR_STRIKE, 'tremor-strike-icon', partyMember)
  }

  public handleClick(worldX: number, worldY: number): void {
    if (Game.instance.map.isWorldXYWithinBounds(worldX, worldY)) {
      this.execute({
        x: worldX,
        y: worldY,
      })
    }
  }

  public execute(target: { x: number; y: number }, onComplete?: Function | undefined): void {
    this.AOETiles.forEach((tile) => tile.setVisible(false))
    this.attackRangeTiles.forEach((tile) => tile.destroy())
    this.attackRangeTiles = []
    UI.instance.endTurnButton.setVisible(false)
    this.source.subtractActionPoints(TremorStrike.AP_COST)
    this.cooldown = TremorStrike.COOLDOWN
    UI.instance.actionMenu.displayActionsForPartyMember(this.source)

    const sourceSprite = this.source.sprite
    const line = new Phaser.Geom.Line()
    const angleBetween = Phaser.Math.Angle.Between(
      sourceSprite.x,
      sourceSprite.y,
      target.x,
      target.y
    )

    Phaser.Geom.Line.SetToAngle(
      line,
      sourceSprite.x,
      sourceSprite.y,
      angleBetween,
      TremorStrike.ATTACK_RANGE * Constants.CELL_SIZE
    )
    const animationPoints = [line.getPoint(0.25), line.getPoint(0.5), line.getPoint(0.75)]

    const tremorShockwave = Game.instance.add
      .sprite(sourceSprite.x, sourceSprite.y, '')
      .setScale(1.5)
      .setDepth(1000)

    tremorShockwave.setRotation(angleBetween)
    tremorShockwave.play('tremor-shockwave')

    Game.instance.time.addEvent({
      repeat: animationPoints.length - 1,
      delay: 200,
      callback: () => {
        if (animationPoints.length > 0) {
          const tremorStrike = Game.instance.add
            .sprite(sourceSprite.x, sourceSprite.y, '')
            .setDepth(1000)
            .setScale(1.5)
            .on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
              if (animationPoints.length == 0) {
                tremorStrike.destroy()
              }
            })
          Game.instance.cameras.main.shake(150, 0.001)
          const nextPosition = animationPoints.shift()!
          tremorStrike.setPosition(nextPosition.x, nextPosition.y)
          tremorStrike.play('tremor-strike')
        }
      },
      startAt: 200,
    })

    Game.instance.tweens.add({
      targets: [tremorShockwave],
      duration: 500,
      x: {
        from: sourceSprite.x,
        to: target.x,
      },
      y: {
        from: sourceSprite.y,
        to: target.y,
      },
      alpha: {
        from: 1,
        to: 0,
      },
      ease: Phaser.Math.Easing.Sine.Out,
      onComplete: () => {
        tremorShockwave.destroy()
      },
    })

    const affectedPartyMembers = this.getAllAffectedEnemies()
    affectedPartyMembers.forEach((pm) => {
      const damage = this.calculateDamage()
      this.dealDamage(pm, damage, DamageType.ARMOR, () => {
        if (onComplete) {
          onComplete()
        }
      })
      Game.instance.time.delayedCall(250, () => {
        pm.sprite.clearTint()
      })
    })

    if (this.source.side === Side.PLAYER) {
      Game.instance.player.disablePointerMoveEvents = false
      UI.instance.endTurnButton.setVisible(true)
      const playerPartyMember = this.source as PlayerPartyMember
      playerPartyMember.goBackToIdle()
      UI.instance.endTurnButton.setVisible(false)
    }
  }

  isIncludedInAOETiles(partyMember: PartyMember) {
    for (let i = 0; i < this.AOETiles.length; i++) {
      const tile = this.AOETiles[i]
      if (partyMember.sprite.x == tile.x && partyMember.sprite.y == tile.y) {
        return true
      }
    }
    return false
  }

  public calculateDamage() {
    return this.source.strength * Phaser.Math.Between(1, 3)
  }

  public getAllAffectedEnemies() {
    const cpuPartyMembers = Game.instance.cpu.allPartyMembers
    return cpuPartyMembers.filter((pm) => {
      return this.isIncludedInAOETiles(pm)
    })
  }

  public handleHover(worldX: number, worldY: number) {
    this.AOETiles.forEach((tile) => tile.destroy())
    this.AOETiles = []
    if (!Game.instance.map.isWorldXYWithinBounds(worldX, worldY)) {
      return
    }
    let angleBetween = Phaser.Math.RadToDeg(
      Phaser.Math.Angle.Between(this.source.sprite.x, this.source.sprite.y, worldX, worldY)
    )

    const tilesWithinWedge = this.attackRangeTiles.filter((rect) => {
      return this.tileWithinAngles(
        rect,
        angleBetween - TremorStrike.ANGLE_RANGE,
        angleBetween + TremorStrike.ANGLE_RANGE
      )
    })

    tilesWithinWedge.forEach((tileRect) => {
      const newRect = Game.instance.add.rectangle(
        tileRect.x,
        tileRect.y,
        tileRect.displayWidth,
        tileRect.displayHeight,
        TremorStrike.AOE_RANGE_HIGHLIGHT_COLOR,
        0.5
      )
      this.AOETiles.push(newRect)
    })
  }

  public tileWithinAngles(rect: Phaser.GameObjects.Rectangle, angleLow: number, angleHigh: number) {
    const topLeft = new Phaser.Math.Vector2(
      rect.x - rect.displayWidth / 2,
      rect.y - rect.displayHeight / 2
    )
    const topRight = new Phaser.Math.Vector2(
      rect.x + rect.displayWidth / 2,
      rect.y - rect.displayHeight / 2
    )
    const bottomLeft = new Phaser.Math.Vector2(
      rect.x - rect.displayWidth / 2,
      rect.y + rect.displayHeight / 2
    )
    const bottomRight = new Phaser.Math.Vector2(
      rect.x + rect.displayWidth / 2,
      rect.y + rect.displayHeight / 2
    )
    const corners = [topLeft, topRight, bottomLeft, bottomRight]
    const sourceSprite = this.source.sprite
    for (let i = 0; i < corners.length; i++) {
      const corner = corners[i]

      let angleBetween = Phaser.Math.RadToDeg(
        Phaser.Math.Angle.Between(sourceSprite.x, sourceSprite.y, corner.x, corner.y)
      )
      if (angleBetween >= angleLow && angleBetween <= angleHigh) {
        return true
      }
    }
    return false
  }

  public onDeselect(): void {
    this.AOETiles.forEach((tile) => {
      tile.destroy()
    })
    this.attackRangeTiles.forEach((tile) => {
      tile.destroy()
    })
  }

  public onSelected(): void {
    this.showAOERange = true

    this.attackRangeTiles.forEach((rect) => {
      rect.destroy()
    })
    const attackRangeTilePositions = this.getAttackRangeTiles(TremorStrike.ATTACK_RANGE)
    attackRangeTilePositions.forEach((position) => {
      const worldXY = Game.instance.map.getWorldPositionForRowCol(position.row, position.col)
      const newRect = Game.instance.add.rectangle(
        worldXY.x,
        worldXY.y,
        Constants.CELL_SIZE,
        Constants.CELL_SIZE,
        TremorStrike.ATTACK_RANGE_HIGHLIGHT_COLOR,
        0.4
      )
      this.attackRangeTiles.push(newRect)
    })
  }
}

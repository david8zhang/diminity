import Game from '../../scenes/Game'
import { Constants } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { Action } from './Action'
import { ActionNames } from './ActionNames'

export class TremorStrike extends Action {
  public static ATTACK_RANGE = 5.5
  private static ATTACK_RANGE_HIGHLIGHT_COLOR = 0xd3d3d3
  private static AOE_RANGE_HIGHLIGHT_COLOR = 0xff0000
  private static ANGLE_RANGE = 20

  public showAOERange: boolean = false
  private AOETiles: Phaser.GameObjects.Rectangle[] = []
  public attackRangeTiles: Phaser.GameObjects.Rectangle[] = []

  constructor(partyMember: PartyMember) {
    super(ActionNames.TREMOR_STRIKE, 'tremor-strike', partyMember)
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
    this.AOETiles.forEach((tile) => tile.destroy())
    this.AOETiles = []
    this.attackRangeTiles.forEach((tile) => tile.destroy())
    this.attackRangeTiles = []

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
    const animationPoints = [
      line.getPoint(0.25),
      line.getPoint(0.5),
      line.getPoint(0.75),
      line.getPoint(1),
    ]
    const animationSprite = Game.instance.add
      .sprite(sourceSprite.x, sourceSprite.y, '')
      .setTintFill(0x7b3f00)
      .setScale(3)
      .setDepth(1000)
    animationSprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      if (animationPoints.length > 0) {
        const point = animationPoints.shift()!
        animationSprite.setPosition(point.x, point.y)
        animationSprite.play('bleed')
      }
    })
    const point = animationPoints.shift()!
    animationSprite.setPosition(point.x, point.y)
    animationSprite.play('bleed')
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

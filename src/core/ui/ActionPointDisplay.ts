import { UI } from '../../scenes/UI'
import { Constants } from '../Constants'
import { PartyMember } from '../controller/PartyMember'

export class ActionPointDisplay {
  private uiScene: UI
  private actionPointCircles: Phaser.GameObjects.Arc[] = []
  private bgRect: Phaser.GameObjects.Rectangle

  private static ACTION_POINT_DISPLAY_WIDTH = 200
  private static ACTION_POINT_DISPLAY_HEIGHT = 40
  private static MAXIMUM_ACTION_POINTS = 5

  constructor(uiScene: UI) {
    this.uiScene = uiScene

    this.bgRect = this.uiScene.add
      .rectangle(
        Constants.WINDOW_WIDTH / 2,
        Constants.GAME_HEIGHT - 5,
        ActionPointDisplay.ACTION_POINT_DISPLAY_WIDTH,
        ActionPointDisplay.ACTION_POINT_DISPLAY_HEIGHT,
        0x333333
      )
      .setStrokeStyle(2, 0x888888)
      .setOrigin(0.5, 0)

    this.setupActionPointOrbs()
  }

  public setupActionPointOrbs() {
    const padding = 10
    const orbWidth =
      (ActionPointDisplay.ACTION_POINT_DISPLAY_WIDTH -
        padding * 2 -
        (ActionPointDisplay.MAXIMUM_ACTION_POINTS - 1) * padding) /
      ActionPointDisplay.MAXIMUM_ACTION_POINTS
    let x = this.bgRect.x - this.bgRect.displayWidth / 2 + padding + orbWidth / 2
    for (let i = 0; i < ActionPointDisplay.MAXIMUM_ACTION_POINTS; i++) {
      const orb = this.uiScene.add
        .circle(
          x,
          this.bgRect.y + (ActionPointDisplay.ACTION_POINT_DISPLAY_HEIGHT - orbWidth) / 2,
          orbWidth / 2,
          0x444444
        )
        .setOrigin(0.5, 0)
      x += orb.displayWidth + padding
      this.actionPointCircles.push(orb)
    }
  }

  public showAvailableActionPoints(partyMember: PartyMember) {
    // Reset fill style
    this.actionPointCircles.forEach((circle) => {
      circle.setFillStyle(0x444444)
    })

    for (let i = 0; i < partyMember.currActionPoints; i++) {
      const actionPointOrb = this.actionPointCircles[i]
      actionPointOrb.setFillStyle(Constants.ACTION_POINT_COLOR)
    }
  }

  public displayActionPotentialPointCost(partyMember: PartyMember, cost: number) {
    // Reset available action points
    this.showAvailableActionPoints(partyMember)

    const lastOrbIndex = partyMember.currActionPoints - 1
    for (let i = lastOrbIndex; i >= lastOrbIndex - cost; i--) {
      const actionPointOrb = this.actionPointCircles[i]
      actionPointOrb.setFillStyle(Constants.ACTION_POINT_COST_COLOR)
    }
  }
}

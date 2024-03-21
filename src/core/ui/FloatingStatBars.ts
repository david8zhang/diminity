import { UI } from '../../scenes/UI'
import { Constants } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { StatBars } from './StatBars'

export class FloatingStatBars {
  private bgRect: Phaser.GameObjects.Rectangle
  private statBars: StatBars
  private ui: UI

  constructor(ui: UI) {
    this.ui = ui
    this.bgRect = this.ui.add
      .rectangle(Constants.WINDOW_WIDTH / 2, 145, 300, 90)
      .setFillStyle(0x555555)
      .setStrokeStyle(2, 0xffffff)
      .setVisible(false)

    this.statBars = new StatBars(this.ui, {
      healthBarPosition: {
        x: Constants.WINDOW_WIDTH / 2 - 125,
        y: this.bgRect.y,
      },
      physicalArmorPosition: {
        x: Constants.WINDOW_WIDTH / 2 - 125,
        y: this.bgRect.y - 20,
      },
      magicArmorPosition: {
        x: Constants.WINDOW_WIDTH / 2 + 5,
        y: this.bgRect.y - 20,
      },
    })
  }

  selectCurrPartyMember(partyMember: PartyMember) {
    this.statBars.selectCurrPartyMember(partyMember)
  }

  setVisible(isVisible: boolean) {
    this.bgRect.setVisible(isVisible)
    this.statBars.setVisible(isVisible)
  }
}

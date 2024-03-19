import { UI } from '../../scenes/UI'
import { Constants } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { StatBars } from './StatBars'

export class FloatingStatBars extends StatBars {
  private bgRect: Phaser.GameObjects.Rectangle
  private statBars: StatBars

  constructor(ui: UI) {
    super(ui)
    this.bgRect = this.ui.add
      .rectangle(Constants.WINDOW_WIDTH / 2, 145, 300, 100)
      .setFillStyle(0x555555)
      .setStrokeStyle(2, 0xffffff)
      .setVisible(false)

    this.statBars = new StatBars(this.ui)
  }

  selectCurrPartyMember(partyMember: PartyMember) {
    this.statBars.selectCurrPartyMember(partyMember)
  }
}

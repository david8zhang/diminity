import { UI } from '../../scenes/UI'
import { Constants } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { StatBars } from './StatBars'

export class FloatingStatBars extends StatBars {
  private bgRect: Phaser.GameObjects.Rectangle
  private partyMemberName!: Phaser.GameObjects.Text
  private static Y_POS = 175

  constructor(ui: UI) {
    super(ui, {
      healthBarPosition: {
        x: Constants.WINDOW_WIDTH / 2 - 125,
        y: FloatingStatBars.Y_POS,
      },
      physicalArmorPosition: {
        x: Constants.WINDOW_WIDTH / 2 - 125,
        y: FloatingStatBars.Y_POS - 20,
      },
      magicArmorPosition: {
        x: Constants.WINDOW_WIDTH / 2 + 2,
        y: FloatingStatBars.Y_POS - 20,
      },
    })
    this.bgRect = this.ui.add
      .rectangle(Constants.WINDOW_WIDTH / 2, 165, 300, 120)
      .setFillStyle(0x555555)
      .setStrokeStyle(2, 0xffffff)
      .setVisible(false)

    this.partyMemberName = this.ui.add
      .text(Constants.WINDOW_WIDTH / 2, FloatingStatBars.Y_POS - 45, 'Party Member', {
        fontSize: '20px',
        color: 'white',
      })
      .setOrigin(0.5, 0.5)
    this.setVisible(false)
  }

  setVisible(isVisible: boolean) {
    super.setVisible(isVisible)
    this.bgRect.setVisible(isVisible)
    this.partyMemberName.setVisible(isVisible)
  }

  selectCurrPartyMember(partyMember: PartyMember): void {
    super.selectCurrPartyMember(partyMember)
    this.partyMemberName.setText(partyMember.name)
  }
}

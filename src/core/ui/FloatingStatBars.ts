import { UI } from '../../scenes/UI'
import { Constants } from '../Constants'
import { StatBars } from './StatBars'

export class FloatingStatBars extends StatBars {
  private bgRect: Phaser.GameObjects.Rectangle
  private static Y_POS = 145

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
      .rectangle(Constants.WINDOW_WIDTH / 2, 145, 300, 90)
      .setFillStyle(0x555555)
      .setStrokeStyle(2, 0xffffff)
      .setVisible(false)
    this.setVisible(false)
  }

  setVisible(isVisible: boolean) {
    super.setVisible(isVisible)
    this.bgRect.setVisible(isVisible)
  }
}

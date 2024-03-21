import { UI } from '../../scenes/UI'
import { Constants } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { UIValueBar } from './UIValueBar'

export interface StatBarConfig {
  healthBarPosition: { x: number; y: number }
  physicalArmorPosition: { x: number; y: number }
  magicArmorPosition: { x: number; y: number }
}

export class StatBars {
  protected healthBar: UIValueBar
  protected healthText: Phaser.GameObjects.Text
  protected magicArmor: UIValueBar
  protected physicalArmor: UIValueBar
  protected ui: UI

  constructor(ui: UI, config: StatBarConfig) {
    this.ui = ui
    this.healthBar = new UIValueBar(this.ui, {
      width: 250,
      height: 25,
      x: config.healthBarPosition.x,
      y: config.healthBarPosition.y,
      // x: Constants.WINDOW_WIDTH / 2 - 125,
      // y: Constants.GAME_HEIGHT + 50,
      borderWidth: 0,
      bgColor: 0x222222,
      maxValue: 100,
    })

    this.magicArmor = new UIValueBar(this.ui, {
      width: 120,
      height: 10,
      // x: Constants.WINDOW_WIDTH / 2 + 5,
      // y: Constants.GAME_HEIGHT + 30,
      x: config.magicArmorPosition.x,
      y: config.magicArmorPosition.y,
      borderWidth: 0,
      bgColor: 0x222222,
      maxValue: 100,
      fillColor: Constants.MAGIC_ARMOR_COLOR,
    })

    this.physicalArmor = new UIValueBar(this.ui, {
      width: 120,
      height: 10,
      // x: Constants.WINDOW_WIDTH / 2 - 125,
      // y: Constants.GAME_HEIGHT + 30,
      x: config.physicalArmorPosition.x,
      y: config.physicalArmorPosition.y,
      borderWidth: 0,
      bgColor: 0x222222,
      maxValue: 100,
      fillColor: Constants.PHYSICAL_ARMOR_COLOR,
    })

    this.healthText = this.ui.add
      .text(
        this.healthBar.x + this.healthBar.width / 2,
        this.healthBar.y + this.healthBar.height / 2,
        '',
        {
          fontSize: '16px',
          color: 'white',
        }
      )
      .setOrigin(0.5, 0.5)
      .setDepth(this.physicalArmor.depth + 1)
  }

  selectCurrPartyMember(partyMember: PartyMember) {
    this.healthBar.setCurrValue(partyMember.currHealth)
    this.healthBar.setMaxValue(partyMember.maxHealth)
    this.healthText.setText(`${partyMember.currHealth}/${partyMember.maxHealth}`)
  }

  setVisible(isVisible: boolean) {
    this.healthBar.setVisible(isVisible)
    this.healthText.setVisible(isVisible)
    this.magicArmor.setVisible(isVisible)
    this.physicalArmor.setVisible(isVisible)
  }
}

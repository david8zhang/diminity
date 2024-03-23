import { UI } from '../../scenes/UI'
import { Constants } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { UINumber } from './UINumber'
import { UIValueBar } from './UIValueBar'

export interface StatBarConfig {
  healthBarPosition: { x: number; y: number }
  physicalArmorPosition: { x: number; y: number }
  magicArmorPosition: { x: number; y: number }
}

export class StatBars {
  protected healthBar: UIValueBar
  protected healthText: Phaser.GameObjects.Text
  protected physicalArmorText: Phaser.GameObjects.Text
  protected magicArmorText: Phaser.GameObjects.Text
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
      borderWidth: 0,
      bgColor: 0x222222,
      maxValue: 100,
    })

    this.magicArmor = new UIValueBar(this.ui, {
      width: 122,
      height: 15,
      x: config.magicArmorPosition.x,
      y: config.magicArmorPosition.y,
      borderWidth: 0,
      bgColor: 0x222222,
      maxValue: 100,
      fillColor: Constants.MAGIC_ARMOR_COLOR,
    })

    this.physicalArmor = new UIValueBar(this.ui, {
      width: 122,
      height: 15,
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

    this.physicalArmorText = this.ui.add
      .text(
        this.physicalArmor.x + this.physicalArmor.width / 2,
        this.physicalArmor.y + this.physicalArmor.height / 2,
        '',
        {
          fontSize: '13px',
          color: 'black',
        }
      )
      .setOrigin(0.5, 0.5)
      .setDepth(this.physicalArmor.depth + 1)

    this.magicArmorText = this.ui.add
      .text(
        this.magicArmor.x + this.magicArmor.width / 2,
        this.magicArmor.y + this.magicArmor.height / 2,
        '',
        {
          fontSize: '13px',
          color: 'white',
        }
      )
      .setOrigin(0.5, 0.5)
      .setDepth(this.magicArmor.depth + 1)
  }

  selectCurrPartyMember(partyMember: PartyMember) {
    this.healthBar.setCurrValue(partyMember.currHealth)
    this.healthBar.setMaxValue(partyMember.maxHealth)
    this.healthText.setText(`${partyMember.currHealth}/${partyMember.maxHealth}`)

    if (partyMember.maxMagicArmor == 0) {
      this.magicArmor.setVisible(false)
      this.magicArmorText.setVisible(false)
    } else {
      this.magicArmor.setVisible(true)
      this.magicArmorText.setVisible(true)
      this.magicArmor.setCurrValue(partyMember.currMagicArmor)
      this.magicArmor.setMaxValue(partyMember.maxMagicArmor)
      this.magicArmorText.setText(`${partyMember.currMagicArmor}/${partyMember.maxMagicArmor}`)
    }

    if (partyMember.maxPhysicalArmor == 0) {
      this.physicalArmor.setVisible(false)
      this.physicalArmorText.setVisible(false)
    } else {
      this.physicalArmor.setVisible(true)
      this.physicalArmorText.setVisible(true)
      this.physicalArmor.setCurrValue(partyMember.currPhysicalArmor)
      this.physicalArmor.setMaxValue(partyMember.maxPhysicalArmor)
      this.physicalArmorText.setText(
        `${partyMember.currPhysicalArmor}/${partyMember.maxPhysicalArmor}`
      )
    }
  }

  updateStats(partyMember: PartyMember) {
    this.selectCurrPartyMember(partyMember)
  }

  displayDamage(partyMember: PartyMember) {
    this.healthBar.setCurrValue(partyMember.currHealth)
    this.healthText.setText(`${partyMember.currHealth}/${partyMember.maxHealth}`)
  }

  setVisible(isVisible: boolean) {
    this.healthBar.setVisible(isVisible)
    this.healthText.setVisible(isVisible)
    this.magicArmor.setVisible(isVisible)
    this.physicalArmor.setVisible(isVisible)
    this.magicArmorText.setVisible(isVisible)
    this.physicalArmorText.setVisible(isVisible)
  }
}

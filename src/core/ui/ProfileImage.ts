import { UI } from '../../scenes/UI'
import { Constants } from '../Constants'
import { PartyMember } from '../controller/PartyMember'

export class ProfileImage {
  private ui: UI
  public sprite: Phaser.GameObjects.Sprite
  public bgRect: Phaser.GameObjects.Rectangle

  constructor(ui: UI) {
    this.ui = ui
    this.bgRect = this.ui.add
      .rectangle(10, Constants.GAME_HEIGHT + 90, UI.ICON_BOX_SIZE, UI.ICON_BOX_SIZE)
      .setFillStyle(0x777777)
      .setStrokeStyle(2, 0xffffff)
      .setOrigin(0, 0)
      .setVisible(false)

    this.sprite = this.ui.add
      .sprite(this.bgRect.x, this.bgRect.y, '')
      .setVisible(false)
      .setOrigin(0, 0)
  }

  displayProfileImage(partyMember: PartyMember) {
    this.sprite.setTexture(partyMember.sprite.texture.key).setDisplaySize(48, 48)
    this.sprite.setPosition(
      this.bgRect.x + (this.bgRect.displayWidth - this.sprite.displayWidth) / 2,
      this.bgRect.y + (this.bgRect.displayHeight - this.sprite.displayHeight) / 2
    )
    this.bgRect.setVisible(true)
    this.sprite.setVisible(true)
  }
}

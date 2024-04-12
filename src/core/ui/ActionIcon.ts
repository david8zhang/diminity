import Game from '../../scenes/Game'
import { UI } from '../../scenes/UI'
import { Action } from '../actions/Action'
import { ActionNames } from '../actions/ActionNames'
import { ActionState } from '../controller/PlayerPartyMember'

export interface ActionIconConfig {
  position: {
    x: number
    y: number
  }
}

export class ActionIcon {
  private ui: UI
  private bgRect: Phaser.GameObjects.Rectangle
  private sprite: Phaser.GameObjects.Sprite
  private cooldownOverlay: Phaser.GameObjects.Rectangle
  private cooldownText: Phaser.GameObjects.Text
  private currActionName: ActionNames | null = null

  constructor(ui: UI, config: ActionIconConfig) {
    this.ui = ui
    this.bgRect = this.ui.add
      .rectangle(config.position.x, config.position.y, UI.ICON_BOX_SIZE, UI.ICON_BOX_SIZE)
      .setFillStyle(UI.ICON_BOX_BG_COLOR)
      .setStrokeStyle(2, 0xffffff)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        this.onActionClicked()
      })

    this.sprite = this.ui.add
      .sprite(this.bgRect.x, this.bgRect.y, '')
      .setVisible(false)
      .setOrigin(0, 0)
      .setScale(0.75)

    this.cooldownOverlay = this.ui.add
      .rectangle(this.bgRect.x, this.bgRect.y, UI.ICON_BOX_SIZE, UI.ICON_BOX_SIZE, 0x000000, 0.5)
      .setOrigin(0, 0)
      .setVisible(false)
    this.cooldownText = this.ui.add
      .text(
        this.bgRect.x + this.bgRect.displayWidth / 2,
        this.bgRect.y + this.bgRect.displayHeight / 2,
        '',
        {
          fontSize: '20px',
        }
      )
      .setOrigin(0.5, 0.5)
      .setColor('#ffffff')
      .setVisible(false)
  }

  displayAction(action: Action) {
    this.currActionName = action.name
    this.sprite.setTexture(action.texture)
    this.sprite.setPosition(
      this.bgRect.x + (this.bgRect.displayWidth - this.sprite.displayWidth) / 2,
      this.bgRect.y + (this.bgRect.displayHeight - this.sprite.displayHeight) / 2
    )
    this.sprite.setVisible(true)
    if (action.cooldown > 0) {
      this.cooldownText.setText(`${action.cooldown}`).setVisible(true)
      this.cooldownOverlay.setVisible(true)
    } else {
      this.cooldownText.setVisible(false)
      this.cooldownOverlay.setVisible(false)
    }
  }

  onActionClicked() {
    if (this.currActionName) {
      const selectedPlayerPm = Game.instance.player.selectedPartyMember
      if (selectedPlayerPm) {
        selectedPlayerPm.onActionClick(this.currActionName)
      }
    }
  }

  onSelect(actionName: string) {
    if (actionName === this.currActionName) {
      this.bgRect.setStrokeStyle(3, 0xffff00)
    } else {
      this.bgRect.setStrokeStyle(2, 0xffffff)
    }
  }

  clear() {
    this.currActionName = null
    this.sprite.setVisible(false)
    this.cooldownOverlay.setVisible(false)
    this.cooldownText.setVisible(false)
  }
}

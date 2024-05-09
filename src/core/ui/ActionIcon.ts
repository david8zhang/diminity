import Game from '../../scenes/Game'
import { UI } from '../../scenes/UI'
import { Action } from '../actions/Action'
import { ActionNames } from '../actions/ActionNames'

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
  private insufficientAPOverlay: Phaser.GameObjects.Rectangle
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
      .on(Phaser.Input.Events.POINTER_MOVE, () => {
        this.onActionHover()
      })
      .on(Phaser.Input.Events.POINTER_OUT, () => {
        UI.instance.actionDescription.setVisible(false)
      })

    this.sprite = this.ui.add
      .sprite(this.bgRect.x, this.bgRect.y, '')
      .setVisible(false)
      .setOrigin(0, 0)

    this.cooldownOverlay = this.ui.add
      .rectangle(this.bgRect.x, this.bgRect.y, UI.ICON_BOX_SIZE, UI.ICON_BOX_SIZE, 0x000000, 0.5)
      .setOrigin(0, 0)
      .setVisible(false)

    this.insufficientAPOverlay = this.ui.add
      .rectangle(this.bgRect.x, this.bgRect.y, UI.ICON_BOX_SIZE, UI.ICON_BOX_SIZE, 0xff0000, 0.5)
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
    this.sprite.setPosition(this.bgRect.x, this.bgRect.y)
    this.sprite.setVisible(true)
    this.sprite.setDisplaySize(this.bgRect.displayWidth, this.bgRect.displayHeight)
    if (action.cooldown > 0) {
      this.cooldownText.setText(`${action.cooldown}`).setVisible(true)
      this.cooldownOverlay.setVisible(true)
    } else {
      this.cooldownText.setVisible(false)
      this.cooldownOverlay.setVisible(false)
    }

    if (action.hasInsufficientAP()) {
      this.insufficientAPOverlay.setVisible(true)
    } else {
      this.insufficientAPOverlay.setVisible(false)
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

  onActionHover() {
    if (this.currActionName) {
      const selectedPlayerPm = Game.instance.player.selectedPartyMember
      if (selectedPlayerPm) {
        const action = selectedPlayerPm.actions[this.currActionName]
        UI.instance.actionDescription.displayAction(action!, {
          x: this.sprite.x,
          y: this.sprite.y - this.sprite.displayHeight / 2 - 50,
        })
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

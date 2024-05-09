import { UI } from '../../scenes/UI'
import { Constants, RenderLayer } from '../Constants'
import { Action } from '../actions/Action'

export interface ActionDescriptionConfig {
  position: {
    x: number
    y: number
  }
}

export class ActionDescription {
  private ui: UI
  private icon: Phaser.GameObjects.Sprite
  private descText: Phaser.GameObjects.Text
  private apCostText: Phaser.GameObjects.Text
  private nameText: Phaser.GameObjects.Text
  private bgRect: Phaser.GameObjects.Rectangle

  private static RECT_WIDTH = 425
  private static RECT_HEIGHT = 100

  constructor(ui: UI, config: ActionDescriptionConfig) {
    this.ui = ui

    this.bgRect = this.ui.add
      .rectangle(
        config.position.x,
        config.position.y,
        ActionDescription.RECT_WIDTH,
        ActionDescription.RECT_HEIGHT,
        0x000000
      )
      .setOrigin(0.5, 0.5)
      .setDepth(Constants.LAYERS[RenderLayer.UI])
      .setAlpha(0.8)
    this.icon = this.ui.add
      .sprite(config.position.x - ActionDescription.RECT_WIDTH / 2, config.position.y, '')
      .setOrigin(0.5, 0.5)
      .setDepth(Constants.LAYERS[RenderLayer.UI])

    this.nameText = this.ui.add
      .text(this.icon.x + this.icon.displayWidth + 10, this.icon.y, '', {
        fontSize: '16px',
        color: 'white',
      })
      .setOrigin(0, 0.5)
      .setWordWrapWidth(ActionDescription.RECT_WIDTH - UI.ICON_BOX_SIZE - 50)
      .setDepth(Constants.LAYERS[RenderLayer.UI])

    this.descText = this.ui.add
      .text(
        this.icon.x + this.icon.displayWidth + 10,
        this.nameText.y + this.nameText.displayHeight,
        '',
        {
          fontSize: '14px',
          color: 'white',
        }
      )
      .setOrigin(0, 0)
      .setWordWrapWidth(ActionDescription.RECT_WIDTH - UI.ICON_BOX_SIZE - 50)
      .setDepth(Constants.LAYERS[RenderLayer.UI])

    this.apCostText = this.ui.add
      .text(
        this.icon.x + this.icon.displayWidth + 10,
        this.descText.y + this.descText.displayHeight,
        '',
        {
          fontSize: '14px',
          color: 'white',
        }
      )
      .setOrigin(0, 0)
      .setWordWrapWidth(ActionDescription.RECT_WIDTH - this.icon.displayWidth - 10)
      .setDepth(Constants.LAYERS[RenderLayer.UI])
    this.setVisible(false)
  }

  setVisible(isVisible: boolean) {
    this.icon.setVisible(isVisible)
    this.nameText.setVisible(isVisible)
    this.descText.setVisible(isVisible)
    this.apCostText.setVisible(isVisible)
    this.bgRect.setVisible(isVisible)
  }

  displayAction(action: Action, position: { x: number; y: number }) {
    this.bgRect.setPosition(position.x, position.y)
    this.icon.setPosition(
      position.x - ActionDescription.RECT_WIDTH / 2 + 50,
      position.y - ActionDescription.RECT_HEIGHT / 2 + 50
    )
    this.nameText.setPosition(
      this.icon.x + this.icon.displayWidth / 2 + 15,
      this.icon.y - this.icon.displayHeight / 2
    )
    this.descText.setPosition(this.nameText.x, this.nameText.y + this.nameText.displayHeight)
    this.apCostText.setPosition(this.nameText.x, this.descText.y + this.descText.displayHeight + 5)

    this.icon.setTexture(action.texture).setDisplaySize(UI.ICON_BOX_SIZE, UI.ICON_BOX_SIZE)
    this.nameText.setText(`${action.name.split('_').join(' ')} | AP Cost: ${action.apCost}`)
    this.descText.setText(action.description)

    this.setVisible(true)
  }
}

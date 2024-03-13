import { UI } from '../../scenes/UI'

export interface TurnOrderCardConfig {
  position: {
    x: number
    y: number
  }
  width: number
  height: number
  texture: string
}

export class TurnOrderCard {
  public bgRect!: Phaser.GameObjects.Rectangle
  public sprite!: Phaser.GameObjects.Sprite
  private ui: UI
  constructor(ui: UI, config: TurnOrderCardConfig) {
    this.ui = ui
    this.bgRect = this.ui.add
      .rectangle(config.position.x, config.position.y, config.width, config.height, 0xdddddd)
      .setStrokeStyle(2, 0x666666)
      .setVisible(false)
      .setOrigin(0.5, 0.5)
    this.sprite = this.ui.add
      .sprite(config.position.x, config.position.y, config.texture)
      .setVisible(false)
      .setOrigin(0.5, 0.5)
      .setScale(2)
  }

  setVisible(isVisible: boolean) {
    this.bgRect.setVisible(isVisible)
    this.sprite.setVisible(isVisible)
  }
}

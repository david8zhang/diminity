import { Constants } from '../core/Constants'

export class UI extends Phaser.Scene {
  constructor() {
    super('ui')
  }

  create() {
    const rectangle = this.add
      .rectangle(
        0,
        Constants.GAME_HEIGHT,
        Constants.GAME_WIDTH,
        Constants.WINDOW_HEIGHT - Constants.GAME_HEIGHT
      )
      .setFillStyle(0x000000)
      .setOrigin(0)
  }
}

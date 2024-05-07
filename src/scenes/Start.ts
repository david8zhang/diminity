import { Constants } from '../core/Constants'

export class Start extends Phaser.Scene {
  constructor() {
    super('start')
  }

  create() {
    this.add
      .image(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2, 'bg')
      .setDisplaySize(Constants.WINDOW_WIDTH, Constants.WINDOW_HEIGHT)
      .setOrigin(0.5, 0.5)
      .setAlpha(0.25)
    const titleText = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2.5, 'Diminity', {
        fontSize: '150px',
        color: 'white',
        fontFamily: 'kelmscot',
      })
      .setOrigin(0.5, 0.5)
      .setStroke('#000000', 20)

    const gradient = titleText.context.createLinearGradient(0, 0, 0, titleText.height)
    gradient.addColorStop(0, '#ffe719')
    gradient.addColorStop(0.75, '#ff7a14')
    gradient.addColorStop(1, '#6E260E')
    titleText.setFill(gradient)
    this.add
      .text(Constants.WINDOW_WIDTH / 2, titleText.y + titleText.displayHeight / 2 + 100, 'Play', {
        fontSize: '40px',
        color: 'white',
        fontFamily: 'kelmscot',
      })
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_DOWN, () => {
        this.scene.start('game')
        this.scene.start('ui')
      })
      .setStroke('#000000', 15)
  }
}

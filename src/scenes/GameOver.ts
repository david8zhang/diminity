import { Constants } from '../core/Constants'
import { Button } from '../core/ui/Button'

export class GameOver extends Phaser.Scene {
  private isVictory: boolean = false
  private headlineText!: Phaser.GameObjects.Text
  private button!: Button

  constructor() {
    super('gameover')
  }

  init(data: { isVictory: boolean }) {
    this.isVictory = data.isVictory
  }

  create() {
    this.headlineText = this.add
      .text(
        Constants.WINDOW_WIDTH / 2,
        Constants.WINDOW_HEIGHT / 3,
        this.isVictory ? 'Victory!' : 'Defeat...',
        {
          fontSize: '80px',
          color: 'white',
          fontFamily: 'kelmscot',
        }
      )
      .setOrigin(0.5, 0.5)

    const gradient = this.headlineText.context.createLinearGradient(
      0,
      0,
      0,
      this.headlineText.height
    )

    if (this.isVictory) {
      gradient.addColorStop(0, '#0BDA51')
      gradient.addColorStop(0.5, '#00A36C')
      gradient.addColorStop(1, '#454B1B')
    } else {
      gradient.addColorStop(0, '#FF0000')
      gradient.addColorStop(0.5, '#C21E56')
      gradient.addColorStop(1, '#4A0404')
    }

    this.headlineText.setFill(gradient)

    this.button = new Button({
      x: this.headlineText.x,
      y: this.headlineText.y + this.headlineText.displayHeight + 40,
      text: 'Continue',
      onClick: () => {
        this.scene.start('game')
        this.scene.start('ui')
      },
      width: 150,
      height: 45,
      scene: this,
      backgroundColor: 0xffffff,
      fontSize: '15px',
      fontFamily: 'kelmscot',
    })
  }
}

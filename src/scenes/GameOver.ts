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
          fontSize: '40px',
          color: 'white',
        }
      )
      .setOrigin(0.5, 0.5)

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
    })
  }
}

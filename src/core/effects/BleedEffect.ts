import Game from '../../scenes/Game'
import { PartyMember } from '../controller/PartyMember'
import { UINumber } from '../ui/UINumber'
import { PartyMemberEffect } from './PartyMemberEffect'

export class BleedEffect extends PartyMemberEffect {
  private bleedTween!: Phaser.Tweens.Tween
  private static TURNS_REMAINING = 3
  private static DAMAGE = 1
  private bloodDripSprite: Phaser.GameObjects.Sprite

  constructor(target: PartyMember) {
    super(target)
    this.turnsRemaining = BleedEffect.TURNS_REMAINING
    this.bloodDripSprite = Game.instance.add
      .sprite(
        target.sprite.x + target.sprite.displayWidth / 2,
        target.sprite.y - target.sprite.displayHeight / 2,
        'blood-drip'
      )
      .setScale(0.5)
      .play('blood-drip')
    this.setupBleedTween()
    Game.instance.events.on('update', () => {
      if (this.target.currHealth == 0) {
        this.teardown()
      }
    })
  }

  setupBleedTween() {
    const primaryColor = Phaser.Display.Color.ValueToColor(0xffffff)
    const newColor = Phaser.Display.Color.ValueToColor(0xff0000)

    this.bleedTween = Game.instance.tweens.addCounter({
      from: 0,
      to: 100,
      repeat: -1,
      duration: 500,
      ease: Phaser.Math.Easing.Sine.InOut,
      yoyo: true,
      onUpdate: (tween) => {
        const value = tween.getValue()
        const colorObject = Phaser.Display.Color.Interpolate.ColorWithColor(
          primaryColor,
          newColor,
          100,
          value
        )
        const color = Phaser.Display.Color.GetColor(colorObject.r, colorObject.g, colorObject.b)
        this.target.sprite.setTint(color)
      },
    })
  }

  public process(): void {
    if (this.target.currHealth > 0) {
      this.target.takePhysicalDamage(1)
      Game.instance.cameras.main.shake(150, 0.001)

      UINumber.createNumber(
        `-${BleedEffect.DAMAGE}`,
        Game.instance,
        this.target.sprite.x,
        this.target.sprite.y,
        'white',
        () => {
          if (this.target.currHealth <= 0) {
            Game.instance.handleDeath(this.target)
          }
        }
      )
    }
  }

  public teardown(): void {
    this.bleedTween.destroy()
    this.bloodDripSprite.destroy()
  }
}

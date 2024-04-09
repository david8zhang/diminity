import Game from '../../scenes/Game'
import { UI } from '../../scenes/UI'
import { Constants, RenderLayer } from '../Constants'
import { UINumber } from '../ui/UINumber'
import { GroundEffect, GroundEffectConfig } from './GroundEffect'

export class BurningGroundEffect extends GroundEffect {
  private effectSprite: Phaser.GameObjects.Arc
  private static DAMAGE = 1

  constructor(config: GroundEffectConfig) {
    super(config)
    this.effectSprite = Game.instance.add
      .circle(
        config.position.x,
        config.position.y,
        config.radius * Constants.CELL_SIZE,
        0xff5f15,
        0.5
      )
      .setDepth(Constants.LAYERS[RenderLayer.EFFECTS])
  }

  public process(): void {
    const partyMembers = this.getAffectedPartyMembers()
    partyMembers.forEach((pm) => {
      pm.takeMagicDamage(BurningGroundEffect.DAMAGE)
      UI.instance.floatingStatBars.displayDamage(pm)
      Game.instance.cameras.main.shake(150, 0.001)
      pm.sprite.setTintFill(0xff0000)
      UINumber.createNumber(
        `-${BurningGroundEffect.DAMAGE}`,
        Game.instance,
        pm.sprite.x,
        pm.sprite.y,
        'white',
        () => {
          if (pm.currHealth <= 0) {
            Game.instance.handleDeath(pm)
          }
        }
      )
      Game.instance.time.delayedCall(100, () => {
        pm.sprite.clearTint()
      })
    })
  }

  teardown() {
    Game.instance.tweens.add({
      targets: [this.effectSprite],
      alpha: {
        from: 1,
        to: 0,
      },
      duration: 500,
      onComplete: () => {
        this.effectSprite.destroy()
      },
    })
  }
}

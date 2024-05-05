import Game from '../../scenes/Game'
import { PartyMember } from '../controller/PartyMember'

export class StunEffect {
  public stunDuration: number = 0
  public partyMember: PartyMember
  public stunTween!: Phaser.Tweens.Tween
  public shouldRestartTween: boolean = false

  constructor(partyMember: PartyMember) {
    this.partyMember = partyMember
  }

  createTween() {
    return Game.instance.tweens.add({
      targets: [this.partyMember.sprite],
      x: '+=3',
      duration: 50,
      repeat: 5,
      yoyo: true,
      onComplete: () => {
        this.stunTween.destroy()
        if (this.isActive) {
          Game.instance.time.delayedCall(2500, () => {
            this.stunTween = this.createTween()
          })
        }
      },
    })
  }

  public get isActive() {
    return this.stunDuration > 0
  }

  public decrementStunDuration() {
    this.stunDuration--
  }

  static activateStun(partyMember: PartyMember, duration: number) {
    const stunEffect = partyMember.stunEffect
    stunEffect.stunDuration = duration
    partyMember.sprite.setTint(0xffff00)
    stunEffect.stunTween = stunEffect.createTween()
  }

  static deactivateStun(partyMember: PartyMember) {
    partyMember.sprite.clearTint()
  }
}

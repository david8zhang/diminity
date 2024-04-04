import Game from '../../scenes/Game'
import { UI } from '../../scenes/UI'
import { DamageType, Side } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { PlayerPartyMember } from '../controller/PlayerPartyMember'
import { UINumber } from '../ui/UINumber'
import { Action } from './Action'
import { ActionNames } from './ActionNames'

export class BasicAttackAction extends Action {
  public static ATTACK_RANGE = 2
  public static AP_COST = 2
  private static TILE_HIGHLIGHT_COLOR = 0xff7979
  private processingAttack: boolean = false
  private animSprite: Phaser.GameObjects.Sprite

  constructor(partyMember: PartyMember) {
    super(ActionNames.BASIC_ATTACK, 'sword-icon', partyMember)
    this.apCost = BasicAttackAction.AP_COST
    this.animSprite = Game.instance.add.sprite(0, 0, '').setVisible(false)
  }

  public isValidAttackTarget(partyMember: PartyMember) {
    const tileDistance = Game.instance.map.getTileDistance(
      this.source.sprite.x,
      this.source.sprite.y,
      partyMember.sprite.x,
      partyMember.sprite.y
    )
    return tileDistance <= BasicAttackAction.ATTACK_RANGE && partyMember.side !== this.source.side
  }

  public handleClick(worldX: number, worldY: number): void {
    if (Game.instance.map.isWorldXYWithinBounds(worldX, worldY)) {
      const partyMember = Game.instance.getPartyMemberAtPosition(worldX, worldY)
      if (partyMember && this.isValidAttackTarget(partyMember)) {
        this.execute(partyMember)
      }
    }
  }

  public onSelected() {
    const targetableSquares = this.getTargetableSquares()
    Game.instance.map.tintTiles(targetableSquares, BasicAttackAction.TILE_HIGHLIGHT_COLOR)
  }

  public getTargetableSquares() {
    const { row, col } = Game.instance.map.getRowColForWorldPosition(
      this.source.sprite.x,
      this.source.sprite.y
    )
    const targetableSquares = Game.instance.map.getAllValidSquaresWithinRange(
      { row, col },
      BasicAttackAction.ATTACK_RANGE
    )
    return targetableSquares.filter((ms) => {
      const { x, y } = Game.instance.map.getWorldPositionForRowCol(ms.row, ms.col)
      const partyMemberAtPosition = Game.instance.getPartyMemberAtPosition(x, y)
      return !partyMemberAtPosition || partyMemberAtPosition.side !== this.source.side
    })
  }

  public calculateDamage() {
    return this.source.strength * Phaser.Math.Between(1, 3)
  }

  handleHover(worldX: number, worldY: number) {
    if (Game.instance.map.isWorldXYWithinBounds(worldX, worldY)) {
      const partyMember = Game.instance.getPartyMemberAtPosition(worldX, worldY)
      if (partyMember && this.isValidAttackTarget(partyMember)) {
        UI.instance.actionPointDisplay.displayActionPotentialPointCost(this.source, this.apCost)
      } else {
        UI.instance.actionPointDisplay.showAvailableActionPoints(this.source)
      }
    }
  }

  public execute(target: PartyMember, onComplete?: Function): void {
    if (!this.processingAttack) {
      this.processingAttack = true
      this.source.subtractActionPoints(this.apCost)
      if (this.source.side === Side.PLAYER) {
        Game.instance.player.disablePointerMoveEvents = true
      }
      UI.instance.floatingStatBars.setVisible(true)
      UI.instance.floatingStatBars.selectCurrPartyMember(target)
      // Play animation for basic attack
      this.animSprite
        .setPosition(target.sprite.x, target.sprite.y)
        .setOrigin(0, 0.5)
        .setVisible(true)
        .setDepth(target.sprite.depth + 1)
      let animName = 'slash'
      if (this.source.animOverrides[ActionNames.BASIC_ATTACK]) {
        animName = this.source.animOverrides[ActionNames.BASIC_ATTACK]
      }
      this.animSprite.play(animName)
      this.animSprite
        .on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
          this.animSprite.removeAllListeners()
          this.animSprite.setVisible(false)
          target.sprite.clearTint()
        })
        .on(Phaser.Animations.Events.ANIMATION_UPDATE, (_, frame) => {
          if (frame.index == 3) {
            const damage = this.calculateDamage()
            this.dealDamage(target, damage, DamageType.ARMOR, () => {
              this.processingAttack = false
              UI.instance.floatingStatBars.setVisible(false)
              if (this.source.side === Side.PLAYER) {
                Game.instance.player.disablePointerMoveEvents = false
                UI.instance.endTurnButton.setVisible(true)
              }
              if (onComplete) {
                onComplete()
              }
            })
            if (this.source.side === Side.PLAYER) {
              const playerPartyMember = this.source as PlayerPartyMember
              playerPartyMember.goBackToIdle()
              UI.instance.endTurnButton.setVisible(false)
            }
          }
        })
    }
  }
}

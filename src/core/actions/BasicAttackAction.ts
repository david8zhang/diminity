import Game from '../../scenes/Game'
import { UI } from '../../scenes/UI'
import { Constants, DamageType, RenderLayer, Side } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { PlayerPartyMember } from '../controller/PlayerPartyMember'
import { Action } from './Action'
import { ActionNames } from './ActionNames'

export class BasicAttackAction extends Action {
  public static ATTACK_RANGE = 2.5
  public static AP_COST = 2
  private static ATTACK_RANGE_HIGHLIGHT_COLOR = 0xff0000
  private static DESCRIPTION = 'A basic attack'

  private processingAttack: boolean = false
  private animSprite: Phaser.GameObjects.Sprite
  private attackRangeTiles: Phaser.GameObjects.Rectangle[] = []

  constructor(partyMember: PartyMember) {
    super(ActionNames.BASIC_ATTACK, 'sword-icon', partyMember, BasicAttackAction.DESCRIPTION)
    this.apCost = BasicAttackAction.AP_COST
    this.animSprite = Game.instance.add.sprite(0, 0, '').setVisible(false)
    this.range = BasicAttackAction.ATTACK_RANGE
  }

  public handleClick(worldX: number, worldY: number): void {
    if (Game.instance.map.isWorldXYWithinBounds(worldX, worldY)) {
      const partyMember = Game.instance.getPartyMemberAtPosition(worldX, worldY)
      if (partyMember && this.isValidAttackTarget(partyMember)) {
        this.execute(partyMember)
      }
    }
  }

  public onDeselect() {
    this.attackRangeTiles.forEach((rect) => {
      rect.destroy()
    })
  }

  public onSelected() {
    this.attackRangeTiles.forEach((rect) => {
      rect.destroy()
    })
    const attackRangeTilePositions = this.getAttackRangeTiles(BasicAttackAction.ATTACK_RANGE)
    attackRangeTilePositions.forEach((position) => {
      const worldXY = Game.instance.map.getWorldPositionForRowCol(position.row, position.col)
      const newRect = Game.instance.add.rectangle(
        worldXY.x,
        worldXY.y,
        Constants.CELL_SIZE,
        Constants.CELL_SIZE,
        BasicAttackAction.ATTACK_RANGE_HIGHLIGHT_COLOR,
        0.4
      )
      this.attackRangeTiles.push(newRect)
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
        .setDepth(Constants.LAYERS[RenderLayer.ATTACKS])
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

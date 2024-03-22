import Game from '../../scenes/Game'
import { UI } from '../../scenes/UI'
import { PartyController, PartyControllerConfig } from './PartyController'
import { PartyMemberConfig } from './PartyMember'
import { ActionState, PlayerPartyMember } from './PlayerPartyMember'

export class Player extends PartyController {
  public disablePointerMoveEvents: boolean = false

  constructor(game: Game, config: PartyControllerConfig) {
    super(game, config)
    this.setupInputListener()
  }

  setupPartyMembers(config: PartyControllerConfig) {
    config.partyConfig.forEach((config: PartyMemberConfig) => {
      this.partyMembers[config.id] = new PlayerPartyMember(this.game, this, config)
    })
  }

  setupInputListener() {
    this.game.input.on(Phaser.Input.Events.POINTER_MOVE, (pointer: Phaser.Input.Pointer) => {
      if (this.selectedPartyMember && !this.disablePointerMoveEvents) {
        switch (this.selectedPartyMember.actionState) {
          case ActionState.SELECTING_MOVE_DEST: {
            if (this.selectedPartyMember.canMoveToPosition(pointer.worldX, pointer.worldY)) {
              this.selectedPartyMember.showActionPointCostForMove(pointer.worldX, pointer.worldY)
            }
            break
          }
        }
        if (Game.instance.map.isWorldXYWithinBounds(pointer.worldX, pointer.worldY)) {
          const partyMember = this.game.getPartyMemberAtPosition(pointer.worldX, pointer.worldY)
          if (partyMember && partyMember.id !== this.selectedPartyMember.id) {
            UI.instance.displayPartyMemberFloatingStatBar(partyMember)
          } else {
            UI.instance.hideFloatingStatBars()
          }
        }
      }
    })

    this.game.input.on(Phaser.Input.Events.POINTER_UP, (pointer: Phaser.Input.Pointer) => {
      if (this.selectedPartyMember && this.isPlayerTurn) {
        const { worldX, worldY } = pointer
        switch (this.selectedPartyMember.actionState) {
          case ActionState.SELECTING_MOVE_DEST: {
            if (this.selectedPartyMember.canMoveToPosition(worldX, worldY)) {
              this.selectedPartyMember.moveToPosition(worldX, worldY)
            }
            break
          }
          case ActionState.PERFORMING_ACTION: {
            const playerPartyMember = this.selectedPartyMember as PlayerPartyMember
            if (playerPartyMember.selectedAction) {
              playerPartyMember.selectedAction?.handleClick(worldX, worldY)
            }
            break
          }
        }
      }
    })
    this.game.input.keyboard!.on(
      Phaser.Input.Keyboard.Events.ANY_KEY_UP,
      (e: Phaser.Input.Keyboard.Key) => {
        if (this.selectedPartyMember) {
          switch (e.keyCode) {
            case Phaser.Input.Keyboard.KeyCodes.ESC: {
              this.selectedPartyMember.goBackToIdle()
              break
            }
            default:
              break
          }
        }
      }
    )
  }

  get isPlayerTurn() {
    return this.partyMembers[this.game.partyMemberToActId] !== undefined
  }

  get selectedPartyMember(): PlayerPartyMember | null {
    if (this.isPlayerTurn) {
      return this.partyMembers[this.game.partyMemberToActId] as PlayerPartyMember
    }
    return null
  }

  handlePartyMemberClick(partyMemberId: string) {
    if (this.game.partyMemberToActId == partyMemberId && this.selectedPartyMember) {
      this.selectedPartyMember.beginMoveOrder()
    }
  }

  endTurn() {
    if (this.selectedPartyMember) {
      this.disablePointerMoveEvents = false
      this.selectedPartyMember.goBackToIdle()
      this.game.endCurrPartyMemberTurn()
    }
  }
}

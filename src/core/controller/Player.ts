import Game from '../../scenes/Game'
import { PartyController, PartyControllerConfig } from './PartyController'
import { PartyMemberConfig } from './PartyMember'
import { ActionState, PlayerPartyMember } from './PlayerPartyMember'

export class Player extends PartyController {
  private selectedPartyMemberId: string = ''

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
      if (this.selectedPartyMember) {
        switch (this.selectedPartyMember.actionState) {
          case ActionState.SELECTING_MOVE_DEST: {
            this.selectedPartyMember.showActionPointCostForMove(pointer.worldX, pointer.worldY)
            break
          }
        }
      }
    })

    this.game.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      if (this.selectedPartyMember) {
        switch (this.selectedPartyMember.actionState) {
          case ActionState.SELECTING_MOVE_DEST: {
            const { worldX, worldY } = pointer
            this.selectedPartyMember.moveToPosition(worldX, worldY)
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
}

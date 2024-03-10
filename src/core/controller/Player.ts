import Game from '../../scenes/Game'
import { PartyController, PartyControllerConfig } from './PartyController'
import { PartyMemberConfig } from './PartyMember'
import { ActionState, PlayerPartyMember } from './PlayerPartyMember'

export class Player extends PartyController {
  private selectedPartyMemberId: string = ''

  constructor(game: Game, config: PartyControllerConfig) {
    super(game, config)
    this.selectedPartyMemberId = config.partyConfig[0].id
    this.setupInputListener()
  }

  setupPartyMembers(config: PartyControllerConfig) {
    config.partyConfig.forEach((config: PartyMemberConfig) => {
      this.partyMembers[config.id] = new PlayerPartyMember(this.game, this, config)
    })
  }

  setupInputListener() {
    this.game.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      switch (this.selectedPartyMember.actionState) {
        case ActionState.SELECTING_MOVE_DEST: {
          const { worldX, worldY } = pointer
          this.selectedPartyMember.moveToPosition(worldX, worldY)
        }
      }
    })
    this.game.input.keyboard!.on(
      Phaser.Input.Keyboard.Events.ANY_KEY_UP,
      (e: Phaser.Input.Keyboard.Key) => {
        switch (e.keyCode) {
          case Phaser.Input.Keyboard.KeyCodes.ESC: {
            this.selectedPartyMember.goBackToIdle()
            break
          }
          default:
            break
        }
      }
    )
  }

  get selectedPartyMember(): PlayerPartyMember {
    return this.partyMembers[this.selectedPartyMemberId] as PlayerPartyMember
  }

  handlePartyMemberClick(partyMemberId: string) {
    if (partyMemberId !== this.selectedPartyMemberId) {
      const prevPartyMemberToAct = this.partyMembers[
        this.selectedPartyMemberId
      ] as PlayerPartyMember
      prevPartyMemberToAct.unselect()
      this.selectedPartyMemberId = partyMemberId
      const partyMemberToAct = this.partyMembers[this.selectedPartyMemberId] as PlayerPartyMember
      partyMemberToAct.select()
    } else {
      this.selectedPartyMember.beginMoveOrder()
    }
  }

  startTurn() {
    this.selectedPartyMember.select()
  }
}

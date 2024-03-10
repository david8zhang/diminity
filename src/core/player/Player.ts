import Game from '../../scenes/Game'
import { PartyMemberConfig } from '../PartyMember'
import { ActionState, PlayerPartyMember } from './PlayerPartyMember'

export interface PlayerConfig {
  party: PartyMemberConfig[]
}

export class Player {
  private scene: Game
  private partyMembers: { [key: string]: PlayerPartyMember } = {}
  private selectedPartyMemberId: string = ''

  constructor(scene: Game, config: PlayerConfig) {
    this.scene = scene
    this.setupPartyMembers(config)
    this.setupInputListener()
  }

  setupPartyMembers(config: PlayerConfig) {
    config.party.forEach((config: PartyMemberConfig) => {
      this.partyMembers[config.id] = new PlayerPartyMember(this.scene, this, config)
    })
    this.selectedPartyMemberId = config.party[0].id
  }

  setupInputListener() {
    this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
      switch (this.selectedPartyMember.actionState) {
        case ActionState.SELECTING_MOVE_DEST: {
          const { worldX, worldY } = pointer
          this.selectedPartyMember.moveToPosition(worldX, worldY)
        }
      }
    })
    this.scene.input.keyboard!.on(
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
    return this.partyMembers[this.selectedPartyMemberId]
  }

  handlePartyMemberClick(partyMemberId: string) {
    if (partyMemberId !== this.selectedPartyMemberId) {
      const prevPartyMemberToAct = this.partyMembers[this.selectedPartyMemberId]
      prevPartyMemberToAct.unselect()
      this.selectedPartyMemberId = partyMemberId
      const partyMemberToAct = this.partyMembers[this.selectedPartyMemberId]
      partyMemberToAct.select()
    } else {
      this.selectedPartyMember.beginMoveOrder()
    }
  }

  startTurn() {
    const partyMemberToMove = this.partyMembers[this.selectedPartyMemberId]
    partyMemberToMove.select()
  }
}

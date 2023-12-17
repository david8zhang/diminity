import Game from '~/scenes/Game'
import { PartyMember, PartyMemberConfig } from './PartyMember'
import { Constants } from './Constants'

export interface PlayerConfig {
  party: PartyMemberConfig[]
}

export class Player {
  private scene: Phaser.Scene
  private partyMembers: PartyMember[] = []
  private memberToActIndex: number = 0

  constructor(scene: Phaser.Scene, config: PlayerConfig) {
    this.scene = scene
    this.setupPartyMembers(config)
    this.setupInputListener()
  }

  setupPartyMembers(config: PlayerConfig) {
    config.party.forEach((config: PartyMemberConfig) => {
      this.partyMembers.push(new PartyMember(this.scene, config))
    })
  }

  setupInputListener() {
    this.scene.input.on(Phaser.Input.Events.POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {})
  }

  highlightPartyMemberToMove(partyMember: PartyMember) {
    Game.instance.postFxPlugin.add(partyMember.sprite, {
      thickness: 2,
      outlineColor: Constants.OUTLINE_COLOR,
    })
  }

  startTurn() {
    const partyMemberToMove = this.partyMembers[this.memberToActIndex]
    this.highlightPartyMemberToMove(partyMemberToMove)
  }
}

import { PartyMember, PartyMemberConfig } from './PartyMember'

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
}

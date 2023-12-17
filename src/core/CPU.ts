import { PartyMember, PartyMemberConfig } from './PartyMember'

export class CPU {
  private scene: Phaser.Scene
  private partyMember: PartyMember[] = []
  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  initializeEnemies(configs: PartyMemberConfig[]) {
    configs.forEach((config) => {
      this.partyMember.push(new PartyMember(this.scene, config))
    })
  }
}

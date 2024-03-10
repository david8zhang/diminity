import Game from '../../scenes/Game'
import { PartyMember, PartyMemberConfig } from '../PartyMember'

export class CPU {
  private scene: Game
  private partyMember: PartyMember[] = []
  constructor(scene: Game) {
    this.scene = scene
  }

  initializeEnemies(configs: PartyMemberConfig[]) {
    configs.forEach((config) => {
      this.partyMember.push(new PartyMember(this.scene, config))
    })
  }
}

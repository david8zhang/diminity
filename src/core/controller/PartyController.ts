import Game from '../../scenes/Game'
import { PartyMember, PartyMemberConfig } from './PartyMember'

export interface PartyControllerConfig {
  partyConfig: PartyMemberConfig[]
}

export class PartyController {
  protected game: Game
  protected partyMembers: { [key: string]: PartyMember } = {}

  constructor(game: Game, config: PartyControllerConfig) {
    this.game = game
    this.setupPartyMembers(config)
  }

  setupPartyMembers(config: PartyControllerConfig) {
    config.partyConfig.forEach((config: PartyMemberConfig) => {
      this.partyMembers[config.id] = new PartyMember(this.game, config)
    })
  }

  isSpaceOccupied(x: number, y: number): boolean {
    return (
      Object.values(this.partyMembers).find((pm) => {
        return pm.sprite.x == x && pm.sprite.y == y
      }) != undefined
    )
  }
}

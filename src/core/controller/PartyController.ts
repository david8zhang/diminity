import Game from '../../scenes/Game'
import { Side } from '../Constants'
import { PartyMember, PartyMemberConfig } from './PartyMember'

export interface PartyControllerConfig {
  partyConfig: PartyMemberConfig[]
}

export class PartyController {
  protected game: Game
  public partyMembers: { [key: string]: PartyMember } = {}

  constructor(game: Game, config: PartyControllerConfig) {
    this.game = game
    this.setupPartyMembers(config)
  }

  setupPartyMembers(config: PartyControllerConfig) {
    config.partyConfig.forEach((pmConfig: PartyMemberConfig) => {
      this.partyMembers[pmConfig.id] = new PartyMember(this.game, { ...pmConfig })
    })
  }

  get allPartyMembers() {
    return Object.values(this.partyMembers)
  }

  isSpaceOccupied(x: number, y: number): boolean {
    return (
      Object.values(this.partyMembers).find((pm) => {
        return pm.sprite.x == x && pm.sprite.y == y
      }) != undefined
    )
  }
}

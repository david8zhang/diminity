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
    const rowCol = this.game.map.getRowColForWorldPosition(x, y)

    return (
      Object.values(this.partyMembers).find((pm) => {
        const { row, col } = this.game.map.getRowColForWorldPosition(pm.sprite.x, pm.sprite.y)
        return row == rowCol.row && col == rowCol.col
      }) != undefined
    )
  }
}

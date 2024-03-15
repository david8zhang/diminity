import Game from '../../scenes/Game'
import { PartyController, PartyControllerConfig } from './PartyController'

export class CPU extends PartyController {
  constructor(game: Game, config: PartyControllerConfig) {
    super(game, config)
  }

  movePartyMember(partyMemberId: string) {
    const currPartyMember = this.partyMembers[partyMemberId]
    if (currPartyMember) {
      // TODO: Add logic for moving enemy
      this.game.time.delayedCall(2000, () => {
        this.game.endCurrPartyMemberTurn()
      })
    }
  }
}

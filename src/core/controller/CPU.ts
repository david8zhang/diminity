import Game from '../../scenes/Game'
import { PartyController, PartyControllerConfig } from './PartyController'

export class CPU extends PartyController {
  constructor(game: Game, config: PartyControllerConfig) {
    super(game, config)
  }
}

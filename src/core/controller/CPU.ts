import Game from '../../scenes/Game'
import { PartyController, PartyControllerConfig } from './PartyController'
import { PartyMember } from './PartyMember'

export class CPU extends PartyController {
  constructor(game: Game, config: PartyControllerConfig) {
    super(game, config)
  }

  movePartyMember(partyMemberId: string) {
    const currPartyMember = this.partyMembers[partyMemberId]
    if (currPartyMember) {
      const closestEnemy = this.getClosestEnemy(currPartyMember)
      const closestSquareToEnemy = this.getSquareClosestToEnemy(currPartyMember, closestEnemy)
      const worldXY = this.game.map.getWorldPositionForRowCol(
        closestSquareToEnemy.row,
        closestSquareToEnemy.col
      )
      currPartyMember.moveToPosition(worldXY.x, worldXY.y, () => {
        this.game.endCurrPartyMemberTurn()
      })
    }
  }

  getClosestEnemy(currPartyMember: PartyMember) {
    const distanceBetween = (p1: PartyMember, p2: PartyMember) => {
      return Phaser.Math.Distance.Between(p1.sprite.x, p1.sprite.y, p2.sprite.x, p2.sprite.y)
    }

    return this.game.player.allPartyMembers.sort((a, b) => {
      return distanceBetween(currPartyMember, a) - distanceBetween(currPartyMember, b)
    })[0]
  }

  getSquareClosestToEnemy(partyMember: PartyMember, closestEnemy: PartyMember) {
    const distanceTo = ({ row, col }: { row: number; col: number }) => {
      const worldXY = this.game.map.getWorldPositionForRowCol(row, col)
      return Phaser.Math.Distance.Between(
        worldXY.x,
        worldXY.y,
        closestEnemy.sprite.x,
        closestEnemy.sprite.y
      )
    }
    const moveableSquares = partyMember.getMoveableSquares()
    return moveableSquares.sort((a, b) => {
      return distanceTo(a) - distanceTo(b)
    })[0]
  }
}

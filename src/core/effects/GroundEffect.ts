import Game from '../../scenes/Game'
import { PartyMember } from '../controller/PartyMember'

export interface GroundEffectConfig {
  position: {
    x: number
    y: number
  }
  turnsRemaining: number
  radius: number
}

export abstract class GroundEffect {
  public turnsRemaining: number = 0
  public radius: number = 0
  public position: {
    x: number
    y: number
  }

  constructor(config: GroundEffectConfig) {
    this.position = config.position
    this.turnsRemaining = config.turnsRemaining
    this.radius = config.radius
  }

  public abstract process(): void

  public abstract teardown(): void

  public getAffectedPartyMembers(): PartyMember[] {
    const rowCol = Game.instance.map.getRowColForWorldPosition(this.position.x, this.position.y)
    const allAffectedTiles = Game.instance.map.getAllTilesWithinCircleRadius(
      rowCol.row,
      rowCol.col,
      this.radius
    )
    const isPartyMemberInsideAffectedArea = (partyMember: PartyMember) => {
      const rowCol = Game.instance.map.getRowColForWorldPosition(
        partyMember.sprite.x,
        partyMember.sprite.y
      )
      for (let i = 0; i < allAffectedTiles.length; i++) {
        const tile = allAffectedTiles[i]
        if (tile.row == rowCol.row && tile.col == rowCol.col) {
          return true
        }
      }
      return false
    }
    const allPartyMembers = Game.instance.cpu.allPartyMembers.concat(
      Game.instance.player.allPartyMembers
    )
    return allPartyMembers.filter((pm) => isPartyMemberInsideAffectedArea(pm) && pm.currHealth > 0)
  }
}

import Game from '../../scenes/Game'
import { UI } from '../../scenes/UI'
import { DamageType } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { UINumber } from '../ui/UINumber'
import { ActionNames } from './ActionNames'

export abstract class Action {
  public name: ActionNames
  public texture: string
  public source: PartyMember
  public apCost: number = 0

  constructor(name: ActionNames, texture: string, source: PartyMember) {
    this.name = name
    this.texture = texture
    this.source = source
  }
  public abstract handleClick(worldX: number, worldY: number): void

  public handleHover(worldX: number, worldY: number) {
    if (Game.instance.map.isWorldXYWithinBounds(worldX, worldY)) {
      const partyMember = Game.instance.getPartyMemberAtPosition(worldX, worldY)
      if (partyMember && this.isValidAttackTarget(partyMember)) {
        UI.instance.actionPointDisplay.displayActionPotentialPointCost(this.source, this.apCost)
      } else {
        UI.instance.actionPointDisplay.showAvailableActionPoints(this.source)
      }
    }
  }

  public abstract isValidAttackTarget(partyMember: PartyMember): boolean
  public abstract execute(target: PartyMember[] | PartyMember, onComplete?: Function): void
  public abstract onSelected(): void
  public onDeselect(): void {
    return
  }

  public getAttackRangeTiles(attackRange: number) {
    const worldRowCol = Game.instance.map.getRowColForWorldPosition(
      this.source.sprite.x,
      this.source.sprite.y
    )
    const tiles = Game.instance.map.getAllTilesWithinCircleRadius(
      worldRowCol.row,
      worldRowCol.col,
      attackRange
    )
    const sourceRowCol = Game.instance.map.getRowColForWorldPosition(
      this.source.sprite.x,
      this.source.sprite.y
    )
    const isAtPosition = (row: number, col: number) => {
      return sourceRowCol.row == row && sourceRowCol.col == col
    }

    return tiles.filter((t) => {
      return Game.instance.map.isValidGroundTile(t.row, t.col) && !isAtPosition(t.row, t.col)
    })
  }

  public dealDamage(
    target: PartyMember,
    damage: number,
    damageType: DamageType,
    onComplete: Function
  ) {
    if (damageType === DamageType.ARMOR) {
      target.takePhysicalDamage(damage)
    } else if (damageType === DamageType.MAGIC) {
      target.takeMagicDamage(damage)
    }
    UI.instance.floatingStatBars.displayDamage(target)
    Game.instance.cameras.main.shake(150, 0.001)
    target.sprite.setTintFill(0xff0000)
    UINumber.createNumber(
      `-${damage}`,
      Game.instance,
      target.sprite.x,
      target.sprite.y,
      'white',
      () => {
        if (target.currHealth <= 0) {
          Game.instance.handleDeath(target)
        }
        if (onComplete) {
          onComplete()
        }
      }
    )
  }
}

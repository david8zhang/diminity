import { PartyMember } from '../controller/PartyMember'
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
    return
  }
  public abstract execute(target: PartyMember[] | PartyMember, onComplete?: Function): void
  public abstract onSelected(): void
}

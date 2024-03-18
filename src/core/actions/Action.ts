import { PartyMember } from '../controller/PartyMember'
import { ActionNames } from './ActionNames'

export abstract class Action {
  public name: ActionNames
  public texture: string
  public source: PartyMember

  constructor(name: ActionNames, texture: string, source: PartyMember) {
    this.name = name
    this.texture = texture
    this.source = source
  }
  public abstract handleClick(): void
  public abstract execute(target: PartyMember[] | PartyMember): void
}

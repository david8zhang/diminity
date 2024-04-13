import { PartyMember } from '../controller/PartyMember'

export abstract class PartyMemberEffect {
  public target: PartyMember
  public turnsRemaining: number = 0

  constructor(target: PartyMember) {
    this.target = target
  }

  public abstract process(): void
  public abstract teardown(): void
}

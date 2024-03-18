import { PartyMember } from '../controller/PartyMember'
import { Action } from './Action'
import { ActionNames } from './ActionNames'

export class BasicAttackAction extends Action {
  constructor(partyMember: PartyMember) {
    super(ActionNames.BASIC_ATTACK, 'sword-icon', partyMember)
  }

  public handleClick(): void {}

  public execute(target: PartyMember): void {}
}

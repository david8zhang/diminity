import { PartyMember } from '../controller/PartyMember'
import { ActionNames } from './ActionNames'
import { BasicAttackAction } from './BasicAttackAction'

export const ACTION_MAPPING = {
  [ActionNames.BASIC_ATTACK]: BasicAttackAction,
}

export class ActionCreator {
  public static createActionMap(actionNames: ActionNames[], partyMember: PartyMember) {
    const mapping = {}
    actionNames.forEach((name) => {
      const ActionClass = ACTION_MAPPING[name]
      if (ActionClass) {
        mapping[name] = new ActionClass(partyMember)
      }
    })
    return mapping
  }
}

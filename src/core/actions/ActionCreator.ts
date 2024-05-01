import { PartyMember } from '../controller/PartyMember'
import { ActionNames } from './ActionNames'
import { BasicAttackAction } from './BasicAttackAction'
import { Fireball } from './Fireball'
import { PiercingShot } from './PiercingShot'
import { TremorStrike } from './TremorStrike'

export const ACTION_MAPPING = {
  [ActionNames.BASIC_ATTACK]: BasicAttackAction,
  [ActionNames.PIERCING_SHOT]: PiercingShot,
  [ActionNames.FIREBALL]: Fireball,
  [ActionNames.TREMOR_STRIKE]: TremorStrike,
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

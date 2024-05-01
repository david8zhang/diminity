import { PartyMember } from '../controller/PartyMember'
import { Action } from './Action'
import { ActionNames } from './ActionNames'

export class TremorStrike extends Action {
  constructor(partyMember: PartyMember) {
    super(ActionNames.TREMOR_STRIKE, 'tremor-strike', partyMember)
  }

  public handleClick(worldX: number, worldY: number): void {}
  public execute(
    target: PartyMember | { x: number; y: number } | PartyMember[],
    onComplete?: Function | undefined
  ): void {}
  public onSelected(): void {}
}

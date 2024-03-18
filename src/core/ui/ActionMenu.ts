import { UI } from '../../scenes/UI'
import { Constants } from '../Constants'
import { PartyMember } from '../controller/PartyMember'
import { ActionIcon } from './ActionIcon'

export class ActionMenu {
  private ui: UI
  private actionIcons: ActionIcon[] = []
  private static TOTAL_ACTIONS = 5

  constructor(ui: UI) {
    this.ui = ui
    this.setupActionIcons()
  }

  setupActionIcons() {
    const padding = 10
    const totalIconWidth =
      UI.ICON_BOX_SIZE * ActionMenu.TOTAL_ACTIONS + padding * (ActionMenu.TOTAL_ACTIONS - 1)

    let x = Constants.WINDOW_WIDTH / 2 - totalIconWidth / 2

    for (let i = 0; i < ActionMenu.TOTAL_ACTIONS; i++) {
      this.actionIcons.push(
        new ActionIcon(this.ui, {
          position: {
            x,
            y: Constants.GAME_HEIGHT + 90,
          },
        })
      )
      x += UI.ICON_BOX_SIZE + 10
    }
  }

  displayActionsForPartyMember(partyMember: PartyMember) {
    // Clear previously displayed actions
    this.actionIcons.forEach((icon) => {
      icon.clear()
    })

    const actions = Object.values(partyMember.actions)
    actions.forEach((action, index) => {
      this.actionIcons[index].displayAction(action)
    })
  }

  highlightSelectedAction(actionName: string) {
    this.actionIcons.forEach((action) => {
      action.onSelect(actionName)
    })
  }
}

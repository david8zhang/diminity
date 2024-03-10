import { Constants } from '../core/Constants'
import { PlayerPartyMember } from '../core/controller/PlayerPartyMember'
import { ActionPointDisplay } from '../core/ui/ActionPointDisplay'
import Game from './Game'

export class UI extends Phaser.Scene {
  public static BOTTOM_BAR_Y_POS = Constants.WINDOW_HEIGHT - Constants.GAME_HEIGHT
  private static _instance: UI
  private actionPointDisplay!: ActionPointDisplay
  private onCreateHook: (() => void) | null = null

  constructor() {
    super('ui')
    if (!UI._instance) {
      UI._instance = this
    }
  }

  public static get instance() {
    return UI._instance
  }

  create() {
    const rectangle = this.add
      .rectangle(0, Constants.GAME_HEIGHT, Constants.GAME_WIDTH, UI.BOTTOM_BAR_Y_POS)
      .setFillStyle(0x000000)
      .setOrigin(0)

    this.actionPointDisplay = new ActionPointDisplay(this)
    if (Game.instance) {
      Game.instance.onUIReady()
    }
  }

  selectPartyMember(partyMember: PlayerPartyMember) {
    this.actionPointDisplay.displayActionPointForPartyMember(partyMember)
  }
}

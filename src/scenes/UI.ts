import { Constants } from '../core/Constants'
import { PlayerPartyMember } from '../core/controller/PlayerPartyMember'
import { ActionPointDisplay } from '../core/ui/ActionPointDisplay'
import { Button } from '../core/ui/Button'
import { TurnOrderCard } from '../core/ui/TurnOrderCard'
import { UIValueBar } from '../core/ui/UIValueBar'
import Game from './Game'

export class UI extends Phaser.Scene {
  public static BOTTOM_BAR_Y_POS = Constants.WINDOW_HEIGHT - Constants.GAME_HEIGHT
  private static TURN_ORDER_CARD_WIDTH = 50
  private static TURN_ORDER_CARD_HEIGHT = 75

  private static _instance: UI
  public actionPointDisplay!: ActionPointDisplay
  public healthBar!: UIValueBar
  public magicArmor!: UIValueBar
  public physicalArmor!: UIValueBar
  public turnOrderCards!: TurnOrderCard[]

  public endTurnButton!: Button

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
    this.add
      .rectangle(0, Constants.GAME_HEIGHT, Constants.GAME_WIDTH, UI.BOTTOM_BAR_Y_POS)
      .setFillStyle(0x000000)
      .setOrigin(0)

    this.healthBar = new UIValueBar(this, {
      width: 250,
      height: 25,
      x: Constants.WINDOW_WIDTH / 2 - 125,
      y: Constants.GAME_HEIGHT + 50,
      borderWidth: 0,
      bgColor: 0x222222,
      maxValue: 100,
    })

    this.magicArmor = new UIValueBar(this, {
      width: 120,
      height: 10,
      x: Constants.WINDOW_WIDTH / 2 + 5,
      y: Constants.GAME_HEIGHT + 30,
      borderWidth: 0,
      bgColor: 0x222222,
      maxValue: 100,
      fillColor: Constants.MAGIC_ARMOR_COLOR,
    })

    this.physicalArmor = new UIValueBar(this, {
      width: 120,
      height: 10,
      x: Constants.WINDOW_WIDTH / 2 - 125,
      y: Constants.GAME_HEIGHT + 30,
      borderWidth: 0,
      bgColor: 0x222222,
      maxValue: 100,
      fillColor: Constants.PHYSICAL_ARMOR_COLOR,
    })

    this.endTurnButton = new Button({
      x: Constants.WINDOW_WIDTH - 60,
      y: Constants.GAME_HEIGHT + 25,
      onClick: () => {},
      text: 'End Turn',
      backgroundColor: Constants.END_TURN_BUTTON_COLOR,
      textColor: '#ffffff',
      fontSize: '12px',
      scene: this,
      width: 100,
      height: 30,
    })

    this.actionPointDisplay = new ActionPointDisplay(this)
    if (Game.instance) {
      Game.instance.onUIReady()
    }

    const padding = 5
    const turnOrder = Game.instance.turnOrder
    const totalWidth =
      UI.TURN_ORDER_CARD_WIDTH * turnOrder.length + (padding * turnOrder.length - 1)
    let x =
      Constants.WINDOW_WIDTH / 2 - totalWidth / 2 + (UI.TURN_ORDER_CARD_WIDTH / 2 + padding / 2)
    turnOrder.forEach((partyMemberId) => {
      const partyMember = Game.instance.getPartyMember(partyMemberId)
      const turnOrderCard = new TurnOrderCard(this, {
        position: {
          x: x,
          y: UI.TURN_ORDER_CARD_HEIGHT / 2 + 10,
        },
        texture: partyMember.sprite.texture.key,
        width: UI.TURN_ORDER_CARD_WIDTH,
        height: UI.TURN_ORDER_CARD_HEIGHT,
      })
      turnOrderCard.setVisible(true)
      x += UI.TURN_ORDER_CARD_WIDTH + padding
    })
  }

  selectPartyMember(partyMember: PlayerPartyMember) {
    this.actionPointDisplay.showAvailableActionPoints(partyMember)
  }
}

import { Constants, Side } from '../core/Constants'
import { PartyMember } from '../core/controller/PartyMember'
import { PlayerPartyMember } from '../core/controller/PlayerPartyMember'
import { ActionMenu } from '../core/ui/ActionMenu'
import { ActionPointDisplay } from '../core/ui/ActionPointDisplay'
import { Button } from '../core/ui/Button'
import { FloatingStatBars } from '../core/ui/FloatingStatBars'
import { ProfileImage } from '../core/ui/ProfileImage'
import { StatBars } from '../core/ui/StatBars'
import { TurnOrderCard } from '../core/ui/TurnOrderCard'
import Game from './Game'

export class UI extends Phaser.Scene {
  public static BOTTOM_BAR_Y_POS = Constants.WINDOW_HEIGHT - Constants.GAME_HEIGHT
  public static ICON_BOX_SIZE = 60
  public static ICON_BOX_BG_COLOR = 0x444444
  private static TURN_ORDER_CARD_WIDTH = 50
  private static TURN_ORDER_CARD_HEIGHT = 75

  private static _instance: UI
  public actionPointDisplay!: ActionPointDisplay
  public statBars!: StatBars
  public floatingStatBars!: FloatingStatBars
  public turnOrderCards: TurnOrderCard[] = []
  public profileImage!: ProfileImage
  public actionMenu!: ActionMenu
  public partyMemberToFocusOnId: string | null = null

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

    this.statBars = new StatBars(this, {
      healthBarPosition: {
        x: Constants.WINDOW_WIDTH / 2 - 125,
        y: Constants.GAME_HEIGHT + 50,
      },
      physicalArmorPosition: {
        x: Constants.WINDOW_WIDTH / 2 - 125,
        y: Constants.GAME_HEIGHT + 30,
      },
      magicArmorPosition: {
        x: Constants.WINDOW_WIDTH / 2 + 2,
        y: Constants.GAME_HEIGHT + 30,
      },
    })
    this.profileImage = new ProfileImage(this)
    this.actionMenu = new ActionMenu(this)

    this.floatingStatBars = new FloatingStatBars(this)

    this.endTurnButton = new Button({
      x: Constants.WINDOW_WIDTH - 60,
      y: Constants.GAME_HEIGHT + 25,
      onClick: () => {
        const currPartyMember = Game.instance.getPartyMember(Game.instance.partyMemberToActId)
        if (currPartyMember.side == Side.PLAYER) {
          Game.instance.player.endTurn()
        }
      },
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
  }

  focusOnPartyMember(partyMemberId: string) {
    const gameInstance = Game.instance
    const partyMemberToPanTo = gameInstance.getPartyMember(partyMemberId)

    // Un-highlight the previous party member
    if (this.partyMemberToFocusOnId) {
      const prevPartyMember = gameInstance.getPartyMember(this.partyMemberToFocusOnId)
      console.log(prevPartyMember)
      gameInstance.postFxPlugin.remove(prevPartyMember.sprite)
    }

    if (gameInstance.partyMemberToActId !== partyMemberId) {
      this.partyMemberToFocusOnId = partyMemberId
      gameInstance.postFxPlugin.add(partyMemberToPanTo.sprite, {
        thickness: 2,
        outlineColor: 0x00ff00,
      })
    }

    gameInstance.cameras.main.pan(partyMemberToPanTo.sprite.x, partyMemberToPanTo.sprite.y, 500)
  }

  createTurnOrderCards() {
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
        partyMemberId: partyMember.id,
        width: UI.TURN_ORDER_CARD_WIDTH,
        height: UI.TURN_ORDER_CARD_HEIGHT,
      })
      turnOrderCard.setVisible(true)
      x += UI.TURN_ORDER_CARD_WIDTH + padding
      this.turnOrderCards.push(turnOrderCard)
    })
  }

  updateTurnOrderCards() {
    this.turnOrderCards.forEach((card) => card.destroy())
    this.turnOrderCards = []
    this.createTurnOrderCards()
  }

  selectPartyMember(partyMember: PlayerPartyMember) {
    this.actionPointDisplay.showAvailableActionPoints(partyMember)
    this.statBars.selectCurrPartyMember(partyMember)
    this.profileImage.displayProfileImage(partyMember)
    this.actionMenu.displayActionsForPartyMember(partyMember)
  }

  dehighlightPartyMemberCard(partyMemberToActId: string) {
    const turnOrderCardToDehighlight = this.turnOrderCards.find(
      (toc) => toc.partyMemberId === partyMemberToActId
    )
    if (turnOrderCardToDehighlight) {
      turnOrderCardToDehighlight.dehighlight()
    }
  }

  highlightPartyMemberCard(partyMemberToActId: string) {
    const turnOrderCardToHighlight = this.turnOrderCards.find(
      (toc) => toc.partyMemberId === partyMemberToActId
    )
    if (turnOrderCardToHighlight) {
      turnOrderCardToHighlight.highlight()
    }
  }

  displayPartyMemberFloatingStatBar(partyMember: PartyMember) {
    this.floatingStatBars.setVisible(true)
    this.floatingStatBars.selectCurrPartyMember(partyMember)
  }

  hideFloatingStatBars() {
    this.floatingStatBars.setVisible(false)
  }
}

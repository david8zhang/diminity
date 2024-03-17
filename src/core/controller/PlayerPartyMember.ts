import { PartyMember, PartyMemberConfig } from './PartyMember'
import { Player } from './Player'
import { Constants } from '../Constants'
import Game from '../../scenes/Game'
import { UI } from '../../scenes/UI'
import { Node } from '../map/Pathfinding'

export enum ActionState {
  IDLE = 'IDLE',
  SELECTING_MOVE_DEST = 'SELECTING_MOVE_DEST',
  MOVING = 'MOVING',
  ATTACKING = 'ATTACKING',
}

export class PlayerPartyMember extends PartyMember {
  private player: Player
  public actionState: ActionState = ActionState.IDLE

  constructor(game: Game, player: Player, config: PartyMemberConfig) {
    super(game, config)
    this.player = player
    this.sprite.setInteractive({ useHandCursor: 'true' }).on(Phaser.Input.Events.POINTER_UP, () => {
      this.player.handlePartyMemberClick(this.id)
    })
  }

  startTurn() {
    super.startTurn(Constants.OUTLINE_COLOR)
    if (UI.instance) {
      UI.instance.selectPartyMember(this)
    }
  }

  unselect() {
    Game.instance.postFxPlugin.remove(this.sprite)
    this.goBackToIdle()
  }

  beginMoveOrder() {
    if (this.actionState === ActionState.IDLE) {
      this.actionState = ActionState.SELECTING_MOVE_DEST
      this.highlightMoveableSquares()
    }
  }

  subtractActionPoints(apCost: number) {
    super.subtractActionPoints(apCost)
    UI.instance.actionPointDisplay.showAvailableActionPoints(this)
  }

  moveToPosition(worldX: number, worldY: number) {
    this.actionState = ActionState.MOVING
    super.moveToPosition(worldX, worldY, () => {
      this.goBackToIdle()
    })
  }

  goBackToIdle() {
    this.actionState = ActionState.IDLE
    this.game.map.clearTint(this.sprite.x, this.sprite.y)
    this.game.map.clearAllTint(this.getMoveableSquares())
    this.game.map.dehighlightTiles()
    UI.instance.actionPointDisplay.showAvailableActionPoints(this)
  }

  showActionPointCostForMove(worldX: number, worldY: number) {
    this.game.map.clearAllTint(this.getMoveableSquares())
    const tileDistance = this.game.map.getTileDistance(this.sprite.x, this.sprite.y, worldX, worldY)
    const costForMove = Math.round(this.apCostPerSquareMoved * tileDistance)

    if (tileDistance <= this.moveRange && costForMove <= this.currActionPoints) {
      UI.instance.actionPointDisplay.displayActionPotentialPointCost(this, costForMove)
      this.game.map.tintTile(worldX, worldY, 0x00ff00)
    }
  }

  highlightMoveableSquares() {
    const moveableSquarePositions = this.getMoveableSquares()
    this.game.map.highlightTiles(moveableSquarePositions)
  }
}

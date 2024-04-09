import Game from '../../scenes/Game'
import { Constants, RenderLayer, Side } from '../Constants'
import { Action } from '../actions/Action'
import { ActionCreator } from '../actions/ActionCreator'
import { ActionNames } from '../actions/ActionNames'
import { Node } from '../map/Pathfinding'

export interface PartyMemberConfig {
  id: string
  rowColPos: {
    row: number
    col: number
  }
  texture: string
  side: Side
  actionNames?: ActionNames[]
  animOverrides?: {
    [key in ActionNames]?: any
  }

  // Stats
  maxHealth: number
  maxPhysicalArmor: number
  maxMagicArmor: number
  actionPointPerTurn: number
  apCostPerSquareMoved: number
  initiative: number
  strength: number
  dexterity: number
  wisdom: number
}

export class PartyMember {
  protected game: Game
  public sprite: Phaser.GameObjects.Sprite
  public id: string

  // Stat bar attributes
  public currHealth: number = 0
  public maxHealth: number = 0
  public currPhysicalArmor: number = 0
  public maxPhysicalArmor: number = 0
  public currMagicArmor: number = 0
  public maxMagicArmor: number = 0

  public actionPointPerTurn: number = 0
  public currActionPoints: number = 0
  public apCostPerSquareMoved: number = 0
  public initiative: number = 0
  public strength: number = 0
  public dexterity: number = 0
  public wisdom: number = 0
  public side: Side
  public actions: { [key in ActionNames]?: Action }
  public animOverrides: { [key in ActionNames]?: any } = {}

  constructor(game: Game, config: PartyMemberConfig) {
    this.game = game
    this.id = config.id
    this.currHealth = config.maxHealth
    this.maxHealth = config.maxHealth
    this.currPhysicalArmor = config.maxPhysicalArmor
    this.maxPhysicalArmor = config.maxPhysicalArmor
    this.currMagicArmor = config.maxMagicArmor
    this.maxMagicArmor = config.maxMagicArmor
    this.actionPointPerTurn = config.actionPointPerTurn
    this.apCostPerSquareMoved = config.apCostPerSquareMoved
    this.initiative = config.initiative
    this.side = config.side
    this.currActionPoints = this.actionPointPerTurn

    const position = this.game.map.getWorldPositionForRowCol(
      config.rowColPos.row,
      config.rowColPos.col
    )
    this.sprite = this.game.add
      .sprite(position.x, position.y, config.texture)
      .setInteractive({ useHandCursor: 'true' })
      .setDepth(Constants.LAYERS[RenderLayer.PLAYER])
    this.strength = config.strength
    this.dexterity = config.dexterity
    this.wisdom = config.wisdom
    let allActions = [ActionNames.BASIC_ATTACK]
    if (config.actionNames) {
      allActions = allActions.concat(config.actionNames)
    }
    this.actions = ActionCreator.createActionMap(allActions, this)
    if (config.animOverrides) {
      this.animOverrides = config.animOverrides
    }
  }

  startTurn(outlineColor?: number) {
    if (Game.instance) {
      Game.instance.postFxPlugin.add(this.sprite, {
        thickness: 2,
        outlineColor: outlineColor ? outlineColor : Constants.CPU_OUTLINE_COLOR,
      })
    }
    this.currActionPoints = this.actionPointPerTurn
  }

  dehighlight() {
    if (Game.instance) {
      Game.instance.postFxPlugin.remove(this.sprite)
    }
  }

  handleDeath(cb: Function) {
    this.game.tweens.add({
      targets: [this.sprite],
      alpha: {
        from: 1,
        to: 0,
      },
      duration: 500,
      ease: Phaser.Math.Easing.Sine.Out,
      onComplete: () => {
        cb()
      },
    })
  }

  get moveRange() {
    return Math.ceil(this.currActionPoints / this.apCostPerSquareMoved) - 0.5
  }

  takePhysicalDamage(damage: number) {
    if (damage > this.currPhysicalArmor) {
      this.currHealth = Math.max(0, this.currHealth - (damage - this.currPhysicalArmor))
    }
    this.currPhysicalArmor = Math.max(0, this.currPhysicalArmor - damage)
  }

  takeMagicDamage(damage: number) {
    if (damage > this.currMagicArmor) {
      this.currHealth = Math.max(0, this.currHealth - (damage - this.currMagicArmor))
    }
    this.currMagicArmor = Math.max(0, this.currMagicArmor - damage)
  }

  getMoveableSquares(): { row: number; col: number }[] {
    const { row, col } = this.game.map.getRowColForWorldPosition(this.sprite.x, this.sprite.y)
    const moveableSquares = this.game.map.getAllTilesWithinCircleRadius(row, col, this.moveRange)
    return moveableSquares.filter((ms) => {
      const { x, y } = this.game.map.getWorldPositionForRowCol(ms.row, ms.col)
      return this.canMoveToPosition(x, y)
    })
  }

  canMoveToPosition(x: number, y: number) {
    const isWithinBounds = this.game.map.isWorldXYWithinBounds(x, y)
    if (!isWithinBounds) {
      return false
    }

    const currPosition = this.game.map.getCenteredWorldPosition(this.sprite.x, this.sprite.y)
    const tileDistance = this.game.map.getTileDistance(currPosition.x, currPosition.y, x, y)
    const isAlreadyAtPosition = currPosition.x == x && currPosition.y == y
    return (
      !isAlreadyAtPosition && tileDistance <= this.moveRange && !this.game.isSpaceOccupied(x, y)
    )
  }

  subtractActionPoints(apCostForMove: number) {
    this.currActionPoints -= apCostForMove
  }

  moveAlongPath(pathIndex: number, path: Node[], onComplete: Function) {
    if (pathIndex === path.length) {
      onComplete()
      return
    }
    const node = path[pathIndex]
    const position = this.game.map.getWorldPositionForRowCol(node.position.row, node.position.col)
    const distance = this.game.map.getTileDistance(
      this.sprite.x,
      this.sprite.y,
      position.x,
      position.y
    )
    this.game.tweens.add({
      targets: [this.sprite],
      x: {
        from: this.sprite.x,
        to: position.x,
      },
      y: {
        from: this.sprite.y,
        to: position.y,
      },
      duration: (distance / 5) * 500,
      onComplete: () => {
        this.moveAlongPath(pathIndex + 1, path, onComplete)
      },
    })
  }

  moveToPosition(worldX: number, worldY: number, onMoveComplete: Function) {
    const path: Node[] = this.game.map.getShortestPathBetweenTwoPoints(
      this.sprite.x,
      this.sprite.y,
      worldX,
      worldY
    )

    // Subtract action points
    const tileDistance = this.game.map.getTileDistance(this.sprite.x, this.sprite.y, worldX, worldY)
    const apCostForMove = Math.round(this.apCostPerSquareMoved * tileDistance)
    this.subtractActionPoints(apCostForMove)

    // Start moving along path
    this.moveAlongPath(0, path, onMoveComplete)
  }
}

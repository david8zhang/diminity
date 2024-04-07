import Phaser from 'phaser'
import { CPU } from '../core/controller/CPU'
import { CameraManager } from '../core/CameraManager'
import { Constants, Side } from '../core/Constants'
import { Map } from '../core/map/Map'
import { PartyMember, PartyMemberConfig } from '../core/controller/PartyMember'
import { Player } from '../core/controller/Player'
import { UI } from './UI'
import { createAnims } from '../core/anims/createAnims'

export default class Game extends Phaser.Scene {
  private static _instance: Game
  public map!: Map
  public player!: Player
  public cpu!: CPU
  public postFxPlugin: any
  public turnOrder: string[] = []
  public partyMemberToActIndex: number = 0

  constructor() {
    super('game')
    Game._instance = this
  }

  public static get instance() {
    return Game._instance
  }

  generateTurnOrder() {
    this.turnOrder = this.cpu.allPartyMembers
      .concat(this.player.allPartyMembers)
      .sort((a, b) => b.initiative - a.initiative)
      .map((pm) => pm.id)
  }

  isSpaceOccupied(x: number, y: number) {
    return this.cpu.isSpaceOccupied(x, y) || this.player.isSpaceOccupied(x, y)
  }

  loadPlayerPartyConfigs(): PartyMemberConfig[] {
    return Constants.DEFAULT_PLAYER_CONFIG.map((config) => {
      return {
        id: Phaser.Utils.String.UUID(),
        ...config,
        side: Side.PLAYER,
      }
    })
  }

  loadCPUEnemyConfigs(): PartyMemberConfig[] {
    const enemyTilemapLayer = this.map.enemyLayer
    const enemyConfigs: PartyMemberConfig[] = []
    enemyTilemapLayer.forEachTile((tile) => {
      if (tile.index !== -1) {
        const randEnemyConfig = Phaser.Utils.Array.GetRandom(Constants.ENEMY_TYPES)
        enemyConfigs.push({
          rowColPos: { row: tile.y, col: tile.x },
          id: Phaser.Utils.String.UUID(),
          ...randEnemyConfig,
          side: Side.CPU,
        })
      }
    })
    return enemyConfigs
  }

  create() {
    // Create animations
    createAnims(this.anims)

    // Shader plugin to outline sprites
    this.postFxPlugin = this.plugins.get('rexOutlinePipeline')
    this.cameras.main.setZoom(1.5)

    new CameraManager(this)
    this.map = new Map(this)
    this.player = new Player(this, {
      partyConfig: this.loadPlayerPartyConfigs(),
    })
    this.cpu = new CPU(this, {
      partyConfig: this.loadCPUEnemyConfigs(),
    })
    this.generateTurnOrder()

    // center on first party member to act
    this.partyMemberToActIndex = 0
    const partyMemberToAct = this.getPartyMember(this.turnOrder[this.partyMemberToActIndex])
    this.cameras.main.centerOn(partyMemberToAct.sprite.x, partyMemberToAct.sprite.y)

    const sprite = this.add.sprite(100, 100, '')
    sprite.play('swipe')
  }

  public get partyMemberToActId() {
    return this.turnOrder[this.partyMemberToActIndex]
  }

  getPartyMember(partyMemberToActId: string) {
    const partyMemberToAct =
      this.cpu.partyMembers[partyMemberToActId] || this.player.partyMembers[partyMemberToActId]
    return partyMemberToAct
  }

  onUIReady() {
    const partyMemberToActId = this.turnOrder[this.partyMemberToActIndex]
    const partyMemberToAct =
      this.cpu.partyMembers[partyMemberToActId] || this.player.partyMembers[partyMemberToActId]
    this.startPartyMemberTurn(partyMemberToAct)
    UI.instance.createTurnOrderCards()
    UI.instance.highlightPartyMemberCard(this.partyMemberToActId)
  }

  startPartyMemberTurn(partyMemberToAct: PartyMember) {
    this.cameras.main.pan(
      partyMemberToAct.sprite.x,
      partyMemberToAct.sprite.y,
      500,
      Phaser.Math.Easing.Sine.InOut
    )
    this.time.delayedCall(500, () => {
      partyMemberToAct.startTurn()
      if (partyMemberToAct.side === Side.CPU) {
        this.cpu.movePartyMember(partyMemberToAct.id)
      } else {
        UI.instance.endTurnButton.setVisible(true)
      }
    })
  }

  updateTurnOrder() {
    const partyMemberToActId = this.partyMemberToActId
    this.turnOrder = this.turnOrder.filter((partyMemberId) => {
      const partyMember = this.getPartyMember(partyMemberId)
      return partyMember.currHealth > 0
    })
    UI.instance.updateTurnOrderCards()

    // Update turn index, as the number of entites that can act has now changed

    // e.g., if the party member to act index was 4, and there were 5 living entities, if one dies then
    // the new party member to act index should be 3 to prevent index out of bounds
    this.partyMemberToActIndex = this.turnOrder.indexOf(partyMemberToActId)
    UI.instance.highlightPartyMemberCard(this.partyMemberToActId)
  }

  handleDeath(partyMember: PartyMember) {
    partyMember.handleDeath(() => {
      // Check if game over conditions are met
      if (this.isGameOver()) {
        this.handleGameOver()
      } else {
        this.updateTurnOrder()
      }
    })
  }

  isGameOver() {
    return this.cpu.areAllPartyMembersDead() || this.player.areAllPartyMembersDead()
  }

  handleGameOver() {
    const isPlayerVictory = this.cpu.areAllPartyMembersDead()
    this.scene.stop('ui')
    this.scene.start('gameover', {
      isVictory: isPlayerVictory,
    })
  }

  endCurrPartyMemberTurn() {
    const prevPartyMember = this.getPartyMember(this.partyMemberToActId)
    if (prevPartyMember) {
      prevPartyMember.dehighlight()
      UI.instance.dehighlightPartyMemberCard(this.partyMemberToActId)
      this.partyMemberToActIndex = (this.partyMemberToActIndex + 1) % this.turnOrder.length
      UI.instance.highlightPartyMemberCard(this.turnOrder[this.partyMemberToActIndex])
      const partyMemberToActId = this.turnOrder[this.partyMemberToActIndex]
      const partyMemberToAct =
        this.cpu.partyMembers[partyMemberToActId] || this.player.partyMembers[partyMemberToActId]
      this.startPartyMemberTurn(partyMemberToAct)
      if (partyMemberToAct.side === Side.CPU) {
        UI.instance.endTurnButton.setVisible(false)
      }
    }
  }

  getPartyMemberAtPosition(worldX: number, worldY: number) {
    const cpuPmAtPosition = this.cpu.getPartyMemberAtPosition(worldX, worldY)
    const playerPmAtPosition = this.player.getPartyMemberAtPosition(worldX, worldY)
    return cpuPmAtPosition || playerPmAtPosition
  }
}

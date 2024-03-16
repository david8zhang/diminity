import Phaser from 'phaser'
import { CPU } from '../core/controller/CPU'
import { CameraManager } from '../core/CameraManager'
import { Constants, Side } from '../core/Constants'
import { Map } from '../core/map/Map'
import { PartyMemberConfig } from '../core/controller/PartyMember'
import { Player } from '../core/controller/Player'
import { UI } from './UI'

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
        position: this.map.getWorldPositionForRowCol(config.rowColPos.row, config.rowColPos.col),
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
          position: this.map.getWorldPositionForRowCol(tile.y, tile.x),
          id: Phaser.Utils.String.UUID(),
          ...randEnemyConfig,
          side: Side.CPU,
        })
      }
    })
    return enemyConfigs
  }

  create() {
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
    this.startPartyMemberTurn()
  }

  startPartyMemberTurn() {
    const partyMemberToActId = this.turnOrder[this.partyMemberToActIndex]
    const partyMemberToAct =
      this.cpu.partyMembers[partyMemberToActId] || this.player.partyMembers[partyMemberToActId]
    partyMemberToAct.startTurn()
    if (partyMemberToAct.side === Side.CPU) {
      this.cpu.movePartyMember(partyMemberToActId)
    }
  }

  endCurrPartyMemberTurn() {
    const prevPartyMember = this.getPartyMember(this.partyMemberToActId)
    prevPartyMember.dehighlight()
    UI.instance.dehighlightPartyMemberCard(this.partyMemberToActId)

    this.partyMemberToActIndex = (this.partyMemberToActIndex + 1) % this.turnOrder.length
    UI.instance.highlightPartyMemberCard(this.turnOrder[this.partyMemberToActIndex])
    this.startPartyMemberTurn()
  }
}

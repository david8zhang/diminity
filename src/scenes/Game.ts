import Phaser from 'phaser'
import { CPU } from '../core/controller/CPU'
import { CameraManager } from '../core/CameraManager'
import { Constants, Side } from '../core/Constants'
import { Map } from '../core/map/Map'
import { PartyMemberConfig } from '../core/controller/PartyMember'
import { Player } from '../core/controller/Player'

export default class Game extends Phaser.Scene {
  private static _instance: Game
  public map!: Map
  public player!: Player
  public cpu!: CPU
  public currTurn: Side = Side.PLAYER
  public postFxPlugin: any

  constructor() {
    super('game')
    Game._instance = this
  }

  public static get instance() {
    return Game._instance
  }

  isSpaceOccupied(x: number, y: number) {
    return this.cpu.isSpaceOccupied(x, y) || this.player.isSpaceOccupied(x, y)
  }

  loadPlayerPartyConfigs(): PartyMemberConfig[] {
    return Constants.DEFAULT_PLAYER_CONFIG.map((config) => {
      return {
        position: this.map.getWorldPositionForRowCol(config.rowColPos.row, config.rowColPos.col),
        moveRange: config.moveRange,
        maxHealth: config.maxHealth,
        actionPointPerTurn: config.actionPointPerTurn,
        texture: config.texture,
        id: Phaser.Utils.String.UUID(),
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
          texture: randEnemyConfig.texture,
          moveRange: randEnemyConfig.moveRange,
          maxHealth: randEnemyConfig.maxHealth,
          actionPointPerTurn: randEnemyConfig.actionPointPerTurn,
        })
      }
    })
    return enemyConfigs
  }

  create() {
    // Shader plugin to outline sprites
    this.postFxPlugin = this.plugins.get('rexOutlinePipeline')

    new CameraManager(this)
    this.map = new Map(this)
    this.player = new Player(this, {
      partyConfig: this.loadPlayerPartyConfigs(),
    })
    this.cpu = new CPU(this, {
      partyConfig: this.loadCPUEnemyConfigs(),
    })
    this.player.startTurn()
  }
}

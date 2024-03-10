import Phaser from 'phaser'
import { CPU } from '../core/cpu/CPU'
import { CameraManager } from '../core/CameraManager'
import { Constants, Side } from '../core/Constants'
import { Map } from '../core/Map'
import { PartyMemberConfig } from '../core/PartyMember'
import { Player } from '../core/player/Player'

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

  loadPlayerPartyConfigs(): PartyMemberConfig[] {
    return Constants.DEFAULT_PLAYER_CONFIG.map((config) => {
      return {
        position: this.map.getWorldPositionForRowCol(config.rowColPos.row, config.rowColPos.col),
        moveRange: config.moveRange,
        maxHealth: config.maxHealth,
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
    const partyConfig = this.loadPlayerPartyConfigs()
    const cpuConfig = this.loadCPUEnemyConfigs()
    this.player = new Player(this, {
      party: partyConfig,
    })
    this.cpu = new CPU(this)
    this.cpu.initializeEnemies(cpuConfig)
    this.player.startTurn()
  }
}

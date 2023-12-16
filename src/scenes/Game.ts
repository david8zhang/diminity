import Phaser from 'phaser'
import { CPU } from '~/core/CPU'
import { Constants, Side } from '~/core/Constants'
import { Map } from '~/core/Map'
import { Player } from '~/core/Player'

export default class Game extends Phaser.Scene {
  private map!: Map
  private player!: Player
  private cpu!: CPU

  // Denotes who's turn it is to move
  private currTurn!: Side

  constructor() {
    super('game')
  }

  loadPlayerPartyConfigs() {
    return Constants.DEFAULT_PLAYER_CONFIG.map((config) => {
      return {
        position: this.map.getWorldPositionForRowCol(config.rowColPos.row, config.rowColPos.col),
        texture: config.texture,
        id: Phaser.Utils.String.UUID(),
      }
    })
  }

  create() {
    this.map = new Map(this)
    const partyConfig = this.loadPlayerPartyConfigs()
    this.player = new Player(this, {
      party: partyConfig,
    })
    this.cpu = new CPU(this)
  }
}

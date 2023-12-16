import Phaser from 'phaser'
import { Map } from '~/core/Map'

export default class Game extends Phaser.Scene {
  private map!: Map
  constructor() {
    super('game')
  }

  create() {
    this.map = new Map(this)
  }
}

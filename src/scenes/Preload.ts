export class Preload extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.tilemapTiledJSON('map-1', 'map-1.json')
    this.load.image('dungeon-tiles', 'tilemap_packed.png')
  }

  create() {
    this.scene.start('game')
  }
}

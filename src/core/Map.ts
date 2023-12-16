export class Map {
  private scene: Phaser.Scene
  private tilemap!: Phaser.Tilemaps.Tilemap

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.initTilemap()
  }

  initTilemap() {
    this.tilemap = this.scene.make.tilemap({
      key: 'map-1',
    })
    const tileset = this.tilemap.addTilesetImage('dungeon-tiles', 'dungeon-tiles')
    this.createLayer('Ground', tileset)
    this.createLayer('Walls', tileset)
    this.createLayer('Elevated', tileset)
    this.createLayer('Ladder', tileset)
  }

  createLayer(layerName: string, tileset: Phaser.Tilemaps.Tileset) {
    const layer = this.tilemap.createLayer(layerName, tileset)
    layer.setOrigin(0)
    layer.setCollisionByExclusion([-1])
    return layer
  }
}

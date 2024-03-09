import { Constants } from './Constants'
import { Grid } from './Grid'

export class Map {
  private scene: Phaser.Scene
  private tilemap!: Phaser.Tilemaps.Tilemap
  private grid!: Grid
  public enemyLayer!: Phaser.Tilemaps.TilemapLayer

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.initTilemap()
    this.grid = new Grid(this.scene, {
      width: Constants.GAME_WIDTH,
      height: Constants.GAME_HEIGHT,
      cellSize: Constants.CELL_SIZE,
    })
  }

  getRowColForWorldPosition(x: number, y: number) {
    const cell = this.grid.getCellAtWorldPosition(x, y)
    return { row: cell.gridRow, col: cell.gridCol }
  }

  getWorldPositionForRowCol(row: number, col: number) {
    const cell = this.grid.getCellAtRowCol(row, col)
    return { x: cell.centerX, y: cell.centerY }
  }

  initTilemap() {
    this.tilemap = this.scene.make.tilemap({
      key: 'map-1',
    })
    const tileset = this.tilemap.addTilesetImage('dungeon-tiles', 'dungeon-tiles')!
    this.createLayer('Ground', tileset)
    this.createLayer('Walls', tileset)
    this.createLayer('Elevated', tileset)
    this.createLayer('Ladder', tileset)
    this.enemyLayer = this.createLayer('Enemies', tileset)!
    this.enemyLayer.setVisible(false)
  }

  createLayer(layerName: string, tileset: Phaser.Tilemaps.Tileset) {
    const layer = this.tilemap.createLayer(layerName, tileset)!
    layer.setOrigin(0)
    layer.setCollisionByExclusion([-1])
    return layer
  }
}

import { Constants } from '../Constants'
import { Grid } from './Grid'
import { Pathfinding } from './Pathfinding'

export class Map {
  private scene: Phaser.Scene
  private tilemap!: Phaser.Tilemaps.Tilemap
  private grid!: Grid
  private pathfinding: Pathfinding
  public enemyLayer!: Phaser.Tilemaps.TilemapLayer

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.initTilemap()
    this.grid = new Grid(this.scene, {
      width: Constants.GAME_WIDTH,
      height: Constants.GAME_HEIGHT,
      cellSize: Constants.CELL_SIZE,
    })
    this.pathfinding = new Pathfinding({
      tilemap: this.tilemap,
      groundLayerName: 'Ground',
      unwalkableTiles: [-1],
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

  getCenteredWorldPosition(worldX: number, worldY: number) {
    const cell = this.grid.getCellAtWorldPosition(worldX, worldY)
    return {
      x: cell.centerX,
      y: cell.centerY,
    }
  }

  getShortestPathBetweenTwoPoints(x1: number, y1: number, x2: number, y2: number) {
    const startRowCol = this.getRowColForWorldPosition(x1, y1)
    const endRowCol = this.getRowColForWorldPosition(x2, y2)
    return this.pathfinding.getPath(startRowCol, endRowCol)
  }

  getTileDistance(x1: number, y1: number, x2: number, y2: number) {
    const point1 = this.getRowColForWorldPosition(x1, y1)
    const point2 = this.getRowColForWorldPosition(x2, y2)
    return Phaser.Math.Distance.Snake(point1.col, point1.row, point2.col, point2.row)
  }

  highlightTiles(tilePositions: { row: number; col: number }[]) {
    tilePositions.forEach((position) => {
      const tile = this.tilemap.getTileAt(position.col, position.row, false, 'Ground')
      if (tile) {
        tile.setAlpha(0.8)
      }
    })
  }

  tintTile(worldX: number, worldY: number, tint: number) {
    const tile = this.tilemap.getTileAtWorldXY(
      worldX,
      worldY,
      false,
      this.scene.cameras.main,
      'Ground'
    )
    if (tile) {
      tile.setAlpha(1)
      tile.tint = tint
    }
  }

  tintTileRowCol(row: number, col: number, tint: number) {
    const tile = this.tilemap.getTileAt(col, row, false, 'Ground')
    if (tile) {
      tile.setAlpha(1)
      tile.tint = tint
    }
  }

  clearAllTint(tilePositions: { row: number; col: number }[]) {
    tilePositions.forEach((pos) => {
      const tile = this.tilemap.getTileAt(pos.col, pos.row, false, 'Ground')
      if (tile) {
        tile.tint = 0xffffff
        tile.setAlpha(0.8)
      }
    })
  }

  clearTint(worldX: number, worldY: number) {
    const tile = this.tilemap.getTileAtWorldXY(
      worldX,
      worldY,
      false,
      this.scene.cameras.main,
      'Ground'
    )
    if (tile) {
      tile.tint = 0xffffff
    }
  }

  dehighlightTiles() {
    for (let i = 0; i < this.grid.numRows; i++) {
      for (let j = 0; j < this.grid.numCols; j++) {
        const tile = this.tilemap.getTileAt(j, i, false, 'Ground')
        if (tile) {
          tile.setAlpha(1)
        }
      }
    }
  }

  isRowColWithinBounds(row: number, col: number) {
    return this.grid.withinBounds(row, col)
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

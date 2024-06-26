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
    return Phaser.Math.Distance.Between(point1.col, point1.row, point2.col, point2.row)
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

  tintTiles(tiles: { row: number; col: number }[], tint: number) {
    tiles.forEach((tile) => {
      this.tintTileRowCol(tile.row, tile.col, tint)
    })
  }

  clearAllTint() {
    for (let i = 0; i < this.grid.numRows; i++) {
      for (let j = 0; j < this.grid.numCols; j++) {
        const worldXY = this.getWorldPositionForRowCol(i, j)
        this.clearTint(worldXY.x, worldXY.y)
      }
    }
  }

  clearTintForTiles(tiles: { row: number; col: number }[]) {
    tiles.forEach((tile) => {
      const worldXY = this.getWorldPositionForRowCol(tile.row, tile.col)
      this.clearTint(worldXY.x, worldXY.y)
    })
  }

  clearTint(worldX: number, worldY: number, alpha: number = 1) {
    const tile = this.tilemap.getTileAtWorldXY(
      worldX,
      worldY,
      false,
      this.scene.cameras.main,
      'Ground'
    )
    if (tile) {
      tile.tint = 0xffffff
      tile.setAlpha(alpha)
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

  // Check that a tile is a ground tile (update when adding elevated surfaces)
  isValidGroundTile(row: number, col: number) {
    const tile = this.tilemap.getTileAt(col, row, false, 'Ground')
    return tile !== null
  }

  isWorldXYWithinBounds(worldX: number, worldY: number) {
    return (
      worldX >= 0 && worldX < Constants.GAME_WIDTH && worldY >= 0 && worldY < Constants.GAME_HEIGHT
    )
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

  private isRowColWithinCircle(
    center: { row: number; col: number },
    point: { row: number; col: number },
    radius: number
  ) {
    const dx = center.col - point.col
    const dy = center.row - point.row
    const squaredDistance = dx * dx + dy * dy
    return squaredDistance <= radius * radius && this.isRowColWithinBounds(point.row, point.col)
  }

  getAllTilesWithinCircleRadius(centerRow: number, centerCol: number, radius: number) {
    const top = Math.ceil(centerRow - radius)
    const bottom = Math.floor(centerRow + radius)
    const left = Math.ceil(centerCol - radius)
    const right = Math.floor(centerCol + radius)

    const tiles: { row: number; col: number }[] = []

    for (let y = top; y <= bottom; y++) {
      for (let x = left; x <= right; x++) {
        if (
          this.isRowColWithinCircle({ row: centerRow, col: centerCol }, { row: y, col: x }, radius)
        ) {
          tiles.push({
            row: y,
            col: x,
          })
        }
      }
    }
    return tiles
  }

  getAllValidSquaresWithinRange(
    startingPos: { row: number; col: number },
    range: number
  ): { row: number; col: number }[] {
    const { row, col } = startingPos
    const queue = [{ row, col }]
    const seen = new Set<string>()
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]
    const squares: { row: number; col: number }[] = []
    let distance = 0
    while (queue.length > 0 && distance <= range) {
      const queueSize = queue.length
      for (let i = 0; i < queueSize; i++) {
        const cell = queue.shift()
        if (cell) {
          squares.push(cell)
          directions.forEach((dir) => {
            const newRow = dir[0] + cell.row
            const newCol = dir[1] + cell.col
            if (
              !seen.has(`${newRow},${newCol}`) &&
              this.isRowColWithinBounds(newRow, newCol) &&
              this.isValidGroundTile(newRow, newCol)
            ) {
              seen.add(`${newRow},${newCol}`)
              queue.push({ row: newRow, col: newCol })
            }
          })
        }
      }
      distance++
    }
    return squares
  }
}

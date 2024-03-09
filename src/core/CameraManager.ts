import { Constants } from './Constants'

export class CameraManager {
  private scene: Phaser.Scene
  private fixedZoomCenter: { x: number; y: number } | null = null

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    const mainCamera = this.scene.cameras.main
    mainCamera.setBounds(
      0,
      0,
      Constants.GAME_WIDTH,
      Constants.GAME_HEIGHT + (Constants.WINDOW_HEIGHT - Constants.GAME_HEIGHT) / mainCamera.zoom
    )
    this.setupZoomListener()
    this.scene.input.on(Phaser.Input.Events.POINTER_MOVE, (p: Phaser.Input.Pointer) => {
      if (!p.isDown) return
      mainCamera.scrollX -= (p.x - p.prevPosition.x) / mainCamera.zoom
      mainCamera.scrollY -= (p.y - p.prevPosition.y) / mainCamera.zoom
      this.fixedZoomCenter = {
        x: mainCamera.centerX + mainCamera.scrollX,
        y: mainCamera.centerY + mainCamera.scrollY,
      }
    })
  }

  setupZoomListener() {
    this.scene.input.on(Phaser.Input.Events.POINTER_WHEEL, (p: Phaser.Input.Pointer) => {
      if (p.deltaY > 0) {
        this.scene.cameras.main.setZoom(this.scene.cameras.main.zoom + 0.25)
        if (!this.fixedZoomCenter) {
          this.fixedZoomCenter = { x: p.x, y: p.y }
        }
        this.scene.cameras.main.centerOn(this.fixedZoomCenter.x, this.fixedZoomCenter.y)
      } else if (p.deltaY < 0) {
        this.scene.cameras.main.setZoom(Math.max(1, this.scene.cameras.main.zoom - 0.25))
        if (this.scene.cameras.main.zoom == 1) {
          this.fixedZoomCenter = null
        }
      }
      this.scene.cameras.main.setBounds(
        0,
        0,
        Constants.GAME_WIDTH,
        Constants.GAME_HEIGHT +
          (Constants.WINDOW_HEIGHT - Constants.GAME_HEIGHT) / this.scene.cameras.main.zoom
      )
    })
  }
}

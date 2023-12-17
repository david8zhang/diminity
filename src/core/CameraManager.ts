import { Constants } from './Constants'

export class CameraManager {
  private scene: Phaser.Scene
  private fixedZoomCenter: { x: number; y: number } | null = null

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.scene.cameras.main.setBounds(0, 0, Constants.WINDOW_WIDTH, Constants.WINDOW_HEIGHT)
    this.setupZoomListener()
  }

  setupZoomListener() {
    this.scene.input.on(
      Phaser.Input.Events.POINTER_WHEEL,
      (p: Phaser.Input.Pointer, gameObjects, deltaX: number, deltaY: number) => {
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
      }
    )
  }
}

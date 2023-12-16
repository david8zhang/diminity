export interface PartyMemberConfig {
  id: string
  position: {
    x: number
    y: number
  }
  texture: string
}

export class PartyMember {
  private scene: Phaser.Scene
  public sprite: Phaser.GameObjects.Sprite

  constructor(scene: Phaser.Scene, config: PartyMemberConfig) {
    this.scene = scene
    this.sprite = this.scene.add.sprite(config.position.x, config.position.y, config.texture)
  }
}

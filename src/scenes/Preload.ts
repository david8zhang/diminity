export class Preload extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    // Maps
    this.load.tilemapTiledJSON('map-1', 'maps/map-1.json')
    this.load.image('dungeon-tiles', 'maps/tilemap_packed.png')

    // Characters
    this.load.image('wizard', 'characters/wizard.png')
    this.load.image('fighter', 'characters/fighter.png')
    this.load.image('rogue', 'characters/rogue.png')

    // Enemies
    this.load.image('spider', 'enemies/spider.png')
    this.load.image('rat', 'enemies/rat.png')

    // Icons
    this.load.image('sword-icon', 'icons/sword.png')
  }

  create() {
    this.scene.start('game')
    this.scene.start('ui')
  }
}

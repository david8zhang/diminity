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
    this.load.image('fireball-icon', 'icons/fireball.png')
    this.load.image('piercing-shot', 'icons/piercing-shot.png')
    this.load.image('tremor-strike-icon', 'icons/tremor-strike.png')

    // Objects
    this.load.image('arrow', 'objects/arrow.png')
    this.load.image('fireball', 'objects/fireball.png')

    // Animations
    this.load.atlas('slash', 'animations/slash.png', 'animations/slash.json')
    this.load.atlas('bonk', 'animations/bonk.png', 'animations/bonk.json')
    this.load.atlas('stab', 'animations/stab.png', 'animations/stab.json')
    this.load.atlas('swipe', 'animations/swipe.png', 'animations/swipe.json')
    this.load.atlas(
      'fireball-explosion',
      'animations/fireball-explosion.png',
      'animations/fireball-explosion.json'
    )
    this.load.atlas('burning', 'animations/burning.png', 'animations/burning.json')
    this.load.atlas('bleed', 'animations/bleed.png', 'animations/bleed.json')
    this.load.atlas(
      'tremor-shockwave',
      'animations/tremor-shockwave.png',
      'animations/tremor-shockwave.json'
    )
    this.load.atlas(
      'tremor-strike',
      'animations/tremor-strike.png',
      'animations/tremor-strike.json'
    )
  }

  create() {
    this.scene.start('game')
    this.scene.start('ui')
  }
}

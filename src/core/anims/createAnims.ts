export const createAnims = (anims: Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'slash',
    frames: anims.generateFrameNames('slash', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 10,
  })

  anims.create({
    key: 'bonk',
    frames: anims.generateFrameNames('bonk', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 10,
  })

  anims.create({
    key: 'stab',
    frames: anims.generateFrameNames('stab', {
      start: 0,
      end: 6,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 10,
  })

  anims.create({
    key: 'swipe',
    frames: anims.generateFrameNames('swipe', {
      start: 0,
      end: 4,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 10,
  })

  anims.create({
    key: 'fireball-explosion',
    frames: anims.generateFrameNames('fireball-explosion', {
      start: 0,
      end: 7,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 15,
  })
}

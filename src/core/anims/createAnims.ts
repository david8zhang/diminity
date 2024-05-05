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

  anims.create({
    key: 'burning',
    frames: anims.generateFrameNames('burning', {
      start: 0,
      end: 7,
      suffix: '.png',
    }),
    repeat: -1,
    frameRate: 15,
  })

  anims.create({
    key: 'bleed',
    frames: anims.generateFrameNames('bleed', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 10,
  })

  anims.create({
    key: 'tremor-shockwave',
    frames: anims.generateFrameNames('tremor-shockwave', {
      start: 0,
      end: 5,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 8,
  })

  anims.create({
    key: 'tremor-strike',
    frames: anims.generateFrameNames('tremor-strike', {
      start: 0,
      end: 6,
      suffix: '.png',
    }),
    repeat: 0,
    frameRate: 12,
  })
}

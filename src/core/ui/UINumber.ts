export class UINumber {
  static createNumber(
    str: string,
    scene: Phaser.Scene,
    x: number,
    y: number,
    color?: string,
    onCompleteCb?: Function
  ) {
    const text = scene.add
      .text(x, y, str, {
        fontSize: '15px',
        color: color || 'red',
      })
      .setOrigin(0.5)
      .setDepth(5000)
    scene.add.tween({
      targets: text,
      duration: 1000,
      ease: 'Exponential.In',
      alpha: {
        getStart: () => 1,
        getEnd: () => 0,
      },
      y: y - 50,
      onComplete: () => {
        if (onCompleteCb) {
          onCompleteCb()
        }
        text.destroy()
      },
    })
  }
}

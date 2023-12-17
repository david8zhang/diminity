import Phaser from 'phaser'

import OutlinePipelinePlugin from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin'

import Game from './scenes/Game'
import { Constants } from './core/Constants'
import { Preload } from './scenes/Preload'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: Constants.WINDOW_WIDTH,
  height: Constants.WINDOW_HEIGHT,
  parent: 'phaser',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      // debug: true,
    },
  },
  dom: {
    createContainer: true,
  },
  plugins: {
    global: [
      {
        key: 'rexOutlinePipeline',
        plugin: OutlinePipelinePlugin,
        start: true,
      },
    ],
  },
  pixelArt: true,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Preload, Game],
}

export default new Phaser.Game(config)

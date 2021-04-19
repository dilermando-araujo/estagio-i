import Phaser from 'phaser';

import StartScene from './scenes/StartScene';
import MapScene from './scenes/MapScene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [StartScene, MapScene]
};

const game = new Phaser.Game(config);
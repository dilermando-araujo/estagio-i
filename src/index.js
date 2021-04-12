import Phaser from 'phaser';
import StartScene from './scenes/StartScene';

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
    scene: [StartScene]
}

const game = new Phaser.Game(config);
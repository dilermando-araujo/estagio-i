import Phaser from 'phaser';

import StartScene from './scenes/StartScene';
import MapScene from './scenes/MapScene';
import GameOverScene from './scenes/GameOver';
import LetterScene from './scenes/LetterScene';
import MenuScene from './scenes/MenuScrene';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        MenuScene, StartScene, 
        MapScene, GameOverScene, 
        LetterScene
    ]
};

const game = new Phaser.Game(config);
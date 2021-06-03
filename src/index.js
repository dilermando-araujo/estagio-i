import style from './assets/css/style.css';

import Phaser from 'phaser';

import MenuScene from './scenes/MenuScrene';
import GameScene from './scenes/GameScene';
import MapScene from './scenes/MapScene';
import GameOverScene from './scenes/GameOverScene';
import LetterScene from './scenes/LetterScene';
import VictoryScene from './scenes/VictoryScene';

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
        MenuScene, 
        GameScene, 
        MapScene, 
        LetterScene,
        GameOverScene, 
        VictoryScene
    ]
};

const game = new Phaser.Game(config);
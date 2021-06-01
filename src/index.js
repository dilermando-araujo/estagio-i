import style from './assets/css/style.css';

import Phaser from 'phaser';

import MenuScene from './scenes/MenuScrene';
import StartScene from './scenes/StartScene';
import MapScene from './scenes/MapScene';
import GameOverScene from './scenes/GameOver';
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
        // MenuScene, 
        StartScene, 
        MapScene, 
        LetterScene,
        GameOverScene, 
        VictoryScene
    ]
};

const game = new Phaser.Game(config);
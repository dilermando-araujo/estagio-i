import moment from 'moment';

import map from './../assets/map-menu.png';
import redCircle from './../assets/red-circle.png';
import mapMenuConfig from './../assets/map-menu.json'; 

import LetterService from '../services/LetterService';
import TimeUtil from '../utils/TimeUtil';
import TweenUtil from '../utils/TweenUtil';

export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super('victory-scene');

        this.state = {
            gameStartAt: null,
            letters: []
        }
    }

    init(data) {
        this.state.letters = data.letters;
        this.state.gameStartAt = data.gameStartAt;
    }

    preload(){
        this.load.image('map', map);
        this.load.image('red-circle', redCircle);

        this.load.tilemapTiledJSON('tilemap-map-menu', mapMenuConfig);
    }

    getRealLetterPositionX(x) {
        return x + 160;
    }

    getRealLetterPositionY(y) {
        return y + 90;
    }

    create(){
        this.physics.add.sprite(400, 300, 'map').setScale(1.01);

        this.map = this.make.tilemap({key: 'tilemap-map-menu'});

        const letterPositions = LetterService.orderLetterPhaserObjectsByName(
            this.map.getObjectLayer('letter-positions').objects
        );
        
        for (let i in this.state.letters) {
            const position = Number(this.state.letters[i].replace('letter-position-', ''));
            
            this.physics.add.sprite(
                this.getRealLetterPositionX(letterPositions[position - 1].x), 
                this.getRealLetterPositionY(letterPositions[position - 1].y), 
            'red-circle').setScale(0.15);

            this.add.text(
                this.getRealLetterPositionX(letterPositions[position - 1].x + 25),
                this.getRealLetterPositionY(letterPositions[position - 1].y + 25),
                `Página ${Number(i) + 1}`,
                {fontSize: '15px', fill: '#F94434', fontFamily: 'Courgette-Regular'}
            ).setAngle(-25).setOrigin(0.5).setScrollFactor(0, 0);

        }

        const timeInGameObj = TimeUtil.fromUnixToObjTime(moment().diff(this.state.gameStartAt) / 1000);
        const timeInGame = (timeInGameObj.hours < 10 ? "0" : "") + timeInGameObj.hours + "." +
                           (timeInGameObj.minutes < 10 ? "0" : "") + timeInGameObj.minutes + "." +
                           (timeInGameObj.seconds < 10 ? "0" : "") + timeInGameObj.seconds;
        this.add.text(
            10,
            550,
            `Objetivo: Coletar evidências no hotel e fugir\nTempo: ${timeInGame}`,
            {fontSize: '15px', fill: '#F94434', fontFamily: 'Courgette-Regular'}
        ).setScrollFactor(0, 0);


        const pressEnter = this.add.text(
            535,
            570,
            `Pressione enter para jogar novamente`,
            {fontSize: '15px', fill: '#F94434', fontFamily: 'Courgette-Regular'}
        ).setScrollFactor(0, 0);

        TweenUtil.flashElement(this, pressEnter);

        this.enterButton = this.input.keyboard.addKey(13);
    }

    update(){

        if (this.enterButton.isDown) {
            this.scene.start('game-scene');
        }

    }
}
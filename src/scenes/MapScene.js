import map from './../assets/map-menu.png';
import redCircle from './../assets/red-circle.png';
import mapMenuConfig from './../assets/map-menu.json'; 

import LetterService from '../services/LetterService';

export default class MapScene extends Phaser.Scene {
    constructor() {
        super('map-scene');

        this.state = {
            letters: [],
            playerPosition: {initialX: 0, initialY: 0, x: 0, y: 0}
        }
    }

    init(data) {
        this.state.letters = data.letters;
        this.state.playerPosition = data.playerPosition;
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

    getRealPlayerPositionX(x) {
        return 390 + ((this.state.playerPosition.x - this.state.playerPosition.initialX) / 6.5);
    }

    getRealPlayerPositionY(y) {
        return 498 + ((this.state.playerPosition.y - this.state.playerPosition.initialY) / 5.8);
    }

    create(){
        this.physics.add.sprite(400, 300, 'map').setScale(1.01);
        this.mapButton = this.input.keyboard.addKey('m');

        this.map = this.make.tilemap({key: 'tilemap-map-menu'});
        
        console.log(this.state.playerPosition.x - this.state.playerPosition.initialX);
        console.log(this.state.playerPosition.y - this.state.playerPosition.initialY);

        this.add.text(
            this.getRealPlayerPositionX(this.state.playerPosition.x),
            this.getRealPlayerPositionY(this.state.playerPosition.y),
            `Eu`,
            {fontSize: '15px', fill: '#F94434', fontFamily: 'Courgette-Regular'}
        ).setOrigin(0.5).setScrollFactor(0, 0);

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

    }

    update(){

        if (this.mapButton.isDown) {
            this.scene.stop('map-scene');
            this.scene.wake('game-scene');
        }

    }
}
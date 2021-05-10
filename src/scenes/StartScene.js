import Phaser from 'phaser';

import playerMoveSprite from './../assets/player/anims/move/sprites.json';
import playerMoveSpritesheet from './../assets/player/anims/move/spritesheet.png';

import playerIdleSprite from './../assets/player/anims/idle/sprites.json';
import playerIdleSpritesheet from './../assets/player/anims/idle/spritesheet.png';

import playerFootStep from './../assets/sounds/footstep.mp3';
import pageColledctedSong from './../assets/sounds/page-collected.mp3'

import bookItem from './../assets/items/book.png';

import asset1 from './../assets/map/fLdKId9.jpg';
import asset2 from './../assets/map/KMh1SLq.png';
import asset3 from './../assets/map/black.jpg';
import mapConfig from './../assets/map/map.json';

import camera from './../assets/camera.png';

import RandomUtil from './../utils/RandomUtil';
import LetterService from '../services/LetterService';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('game-scene');

        this.player = null;
        this.showMessage = false;
    }

    preload() {

        this.load.image('asset-1', asset1);
        this.load.image('asset-2', asset2);
        this.load.image('asset-3', asset3);
        this.load.tilemapTiledJSON('tilemap', mapConfig);

        this.load.audio('player.sound.footstep', [playerFootStep]);
        this.load.audio('player.sound.pageCollected', [pageColledctedSong]);

        this.load.image('items.book', bookItem);
        this.load.image('camera', camera);

        this.load.atlas('player.anim.idle', playerIdleSpritesheet, playerIdleSprite);
        this.load.atlas('player.anim.move', playerMoveSpritesheet, playerMoveSprite);
    }

    create() {
        this.footstep = this.sound.add('player.sound.footstep', {loop: true});
        this.pageCollected = this.sound.add('player.sound.pageCollected', {loop: false});

        this.map = this.make.tilemap({key: 'tilemap'});
        const tileset1 = this.map.addTilesetImage('fLdKId9', 'asset-1');
        const tileset2 = this.map.addTilesetImage('KMh1SLq', 'asset-2');
        const tileset3 = this.map.addTilesetImage('black', 'asset-3');

        this.layer1 = this.map.createLayer('floor', tileset2);

        this.layer2 = this.map.createLayer('wall', tileset1);
        this.layer2.setCollisionByExclusion(-1, true);

        this.layer3 = this.map.createLayer('black', tileset3);

        this.layer1.setScale(1);
        this.layer2.setScale(1);
        this.layer3.setScale(1);

        const playerPositionStart = this.map.getObjectLayer('player-start-point').objects;

        this.player = this.physics.add.sprite(playerPositionStart[0].x + 90, playerPositionStart[0].y + 50, 'player.anim.idle');
        this.player.setBounce(0.2);
        this.player.setScale(0.5);
        this.player.body.setGravityY(0);
        // this.player.setCollideWorldBounds(true);
        
        this.anims.create({
            key: 'player.anim.idle',
            frames: this.anims.generateFrameNames('player.anim.idle'),
            frameRate: 24,
            repeat: -1
        });
        
        this.anims.create({
            key: 'player.anim.move',
            frames: this.anims.generateFrameNames('player.anim.move'),
            frameRate: 24,
            repeat: -1
        });
        
        this.message = this.add.text(this.cameras.main.centerX, 16, 'Pressione F', { fontSize: '32px', fill: '#000' }).setOrigin(0.5);
        this.message.setScrollFactor(0, 0);

        this.collectButton = this.input.keyboard.addKey('f');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.mapButton = this.input.keyboard.addKey('m');

        this.cameras.main.startFollow(this.player);

        this.physics.add.collider(this.player, this.layer2);


        // ----
        // const positionsEnemyDecision = this.physics.add.staticGroup();

        // const positionsEnemyDecisionLayer = this.map.getObjectLayer('enemy-wall-decision').objects;
        // positionsEnemyDecisionLayer.forEach(obj => {
        //     const item = positionsEnemyDecision.create(obj.x + 10, obj.y, '', '', false);
            
        //     item.enemyPoint = obj.name;
        // });
        
        // this.enemy = this.physics.add.
        //                 sprite(
        //                     positionsEnemyDecisionLayer[0].x, 
        //                     positionsEnemyDecisionLayer[0].y, 
        //                     'items.book'
        //                 );
        
        // this.enemyVelocity = -100;
        // this.enemyCurrentPoint = null;

        // this.physics.add.overlap(this.enemy, positionsEnemyDecision, (enemy, obj) => {
        //     if (this.enemyCurrentPoint === null || this.enemyCurrentPoint !== obj.enemyPoint) {
        //         this.enemyCurrentPoint = obj.enemyPoint; 
        //         this.enemyVelocity = this.enemyVelocity * -1;
        //     }
        // });

        // this.physics.add.collider(this.player, this.enemy, () => {
        //     this.scene.start('game-over-scene');
        // });

        // this.physics.add.sprite(400, 350, 'camera').setScrollFactor(0, 0);

        let countLetterCollected = 0;

        // ----------------------------------------------------------------------
        // Letter algorithm
        let mapLetterToTip = [];
        const lettersRandomSelected = [];

        for (let i = 0; i < 7; i++) {
            const letterId = 0;
            while (letterId === 0) {
                letterId = RandomUtil.random(1, 16);
                if (lettersRandomSelected.includes(letterId)) 
                    letterId = 0;
                else
                    lettersRandomSelected.push(letterId);
            }
        }

        let sequenceValid = false;
        while (!sequenceValid) {

            mapLetterToTip = [];
            const lettersMapSelected = [];
            for (let i = 0; i < 7; i++) {
    
                let find = false;
                while (!find) {
                    const position = RandomUtil.random(0, 6);
                    if (position == i) continue;
                    if (lettersMapSelected.includes(lettersRandomSelected[position])) continue;
    
                    const map = [lettersRandomSelected[i], lettersRandomSelected[position]];
    
                    let valid = true;
                    for (let j in mapLetterToTip) {
                        if (mapLetterToTip[j][0] === map[0] && mapLetterToTip[j][1] === map[1])
                            valid = false;
                        if (mapLetterToTip[j][0] === map[0] && mapLetterToTip[j][1] === map[1])
                            valid = false;
                        
                        if (mapLetterToTip[j][0] === map[1] && mapLetterToTip[j][1] === map[0])
                            valid = false;
                        if (mapLetterToTip[j][0] === map[1] && mapLetterToTip[j][1] === map[0])
                            valid = false;  
                    }
    
                    if (valid) {
                        find = true;
                        mapLetterToTip.push(map);
                        lettersMapSelected.push(lettersRandomSelected[position]);
                    }
                }

            }

            const getMapPositionByKey = function (key, map) {
                for (let i = 0; i < map.length; i++) {
                    console.log(map[i][0], ' === ', key);

                    if (map[i][0] === key)
                        return i;
                }

                return null;
            }
            this.getMapPositionByKey = getMapPositionByKey;

            const lettersFound = [];
            let currentPosition = 0;
            while (lettersFound.length < 7) 
            {
                const key = mapLetterToTip[currentPosition][0];
                const value = mapLetterToTip[currentPosition][1];
                if (lettersFound.includes(key))
                    break;
                
                lettersFound.push(key);
                currentPosition = getMapPositionByKey(value, mapLetterToTip);
            }

            if (lettersFound.length === 7) sequenceValid = true;
        }

        window.cheats = {};
        window.cheats.lettersPositions = lettersRandomSelected;

        this.books = this.physics.add.staticGroup();
        const letterPositions = LetterService.orderLetterPhaserObjectsByName(
            this.map.getObjectLayer('letter-positions').objects
        );

        console.log(letterPositions);

        for (let i in lettersRandomSelected) {
            
            console.log(lettersRandomSelected[i]);
            console.log(letterPositions[lettersRandomSelected[i] - 1]);

            const x = letterPositions[lettersRandomSelected[i] - 1].x;
            const y = letterPositions[lettersRandomSelected[i] - 1].y;
            const height = letterPositions[lettersRandomSelected[i] - 1].height;
            const width = letterPositions[lettersRandomSelected[i] - 1].width;

            const book = this.books.create(
                x + (width / 2), y + (height / 2), 
            'items.book').setScale(1).refreshBody();

            book.letterPosition = Number(letterPositions[lettersRandomSelected[i] - 1].name.replace('letter-position-', ''));
        }

        this.physics.add.overlap(this.player, this.books, (player, book) => {
            // book.disableBody(true, true);

            if (this.collectButton.isDown) {

                console.log(mapLetterToTip);
                console.log(this.getMapPositionByKey(book.letterPosition, mapLetterToTip));
                console.log(mapLetterToTip[this.getMapPositionByKey(book.letterPosition, mapLetterToTip)]);
                
                console.log(
                    LetterService.getLetterTipByLetterId(mapLetterToTip[this.getMapPositionByKey(book.letterPosition, mapLetterToTip)][1])
                );
                
                countLetterCollected++;
                book.destroy();
                this.pageCollected.play();

                this.scene.sleep('game-scene');
                this.scene.run('letter-scene', {
                    countLetterCollected: countLetterCollected, 
                    letterMessage: LetterService.getLetterTipByLetterId(mapLetterToTip[this.getMapPositionByKey(book.letterPosition, mapLetterToTip)][1])
                });
                
            }
        });

    }
    update() {

        // this.enemy.setVelocityY(this.enemyVelocity);

        if (this.mapButton.isDown) {
            console.log("iiirii");
            this.scene.switch("map-scene");
        }

        if (this.cursors.left.isDown)
            {
                if (!this.footstep.isPlaying)
                    this.footstep.play();

                this.player.setVelocityX(-160);

                this.player.setAngle(-180);
                this.player.setOrigin(0.5, 0.5);

                this.player.anims.play('player.anim.move', true);
            }
            else if (this.cursors.right.isDown)
            {
                if (!this.footstep.isPlaying)
                    this.footstep.play();

                this.player.setVelocityX(160);

                this.player.setAngle(0);
                this.player.setOrigin(0.5, 0.5);

                this.player.anims.play('player.anim.move', true);
            }
            else if (this.cursors.up.isDown) {
                if (!this.footstep.isPlaying)
                    this.footstep.play();

                this.player.setVelocityY(-160);

                this.player.setAngle(-90);
                this.player.setOrigin(0.5, 0.5);

                this.player.anims.play('player.anim.move', true);
            }
            else if (this.cursors.down.isDown) {
                if (!this.footstep.isPlaying)
                    this.footstep.play();

                this.player.setVelocityY(160);

                this.player.setAngle(90);
                this.player.setOrigin(0.5, 0.5);

                this.player.anims.play('player.anim.move', true);
            }
            else
            {
                if (this.footstep.isPlaying)
                    this.footstep.stop();

                this.player.setVelocityX(0);
                this.player.setVelocityY(0);

                this.player.anims.play('player.anim.idle', true);
            }
    }
}
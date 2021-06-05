import Phaser from 'phaser';
import moment from 'moment';

import playerMoveSprite from '../assets/player/anims/move/sprites.json';
import playerMoveSpritesheet from './../assets/player/anims/move/spritesheet.png';

import playerIdleSprite from '../assets/player/anims/idle/sprites.json';
import playerIdleSpritesheet from './../assets/player/anims/idle/spritesheet.png';

import enemyMoveSprite from '../assets/enemy/anims/move/spritesheet.json';
import enemyMoveSpritesheet from './../assets/enemy/anims/move/spritesheet.png';

import playerFootStep from './../assets/sounds/footstep.mp3';
import playerBreathingSound from './../assets/sounds/breathing.mp3';
import pageColledctedSong from './../assets/sounds/page-collected.mp3';

import bookItem from './../assets/items/book.png';
import batteryItem from './../assets/items/flashlight-battery.png';

import asset1 from './../assets/map/fLdKId9.jpg';
import asset2 from './../assets/map/KMh1SLq.png';
import asset3 from './../assets/map/black.jpg';
import mapConfig from '../assets/map/map.json';

import flashlight from './../assets/flashlight.png'
import black from './../assets/black.png'

import TimeUtil from '../utils/TimeUtil';
import RandomUtil from '../utils/RandomUtil';
import LetterService from '../services/LetterService';

import heartBeatingSound from '../assets/sounds/heart-beating.mp3';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('game-scene');

        this.player = null;
        this.showMessage = false;
        this.state = {};
    }

    preload() {
        this.state = {
            lettersInventory: [],

            realGameStartAt: moment(),
            gameStartAt: moment(),
            gameOver: false,

            playerStopAt: null,
            randomStartBreathingAfter: null,

            currentEnemySoundStage: -1,
            enemyDistanceSound: [
                [false, 450 + (3 * (925 - 450) / 3), 0.25],
                [false, 450 + (2 * (925 - 450) / 3), 0.50],
                [false, 450 + (1 * (925 - 450) / 3), 0.75],
                [false, 450 + (0 * (925 - 450) / 3), 1]
            ],

            flashlightStages: [
                [false, TimeUtil.minutesToMill(0), () => {
                    if (this.heartBeating.isPlaying)
                        this.heartBeating.pause();
                }],
                [false, TimeUtil.minutesToMill(1), () => {
                    if (this.heartBeating.isPlaying)
                        this.heartBeating.pause();
                }],
                [false, TimeUtil.minutesToMill(2), () => {
                    if (this.heartBeating.isPaused)
                        this.heartBeating.resume();
                    else
                        this.heartBeating.play({
                            loop: true
                        });
                }],
                [false, TimeUtil.minutesToMill(3), () => {
                    this.state.gameOver = true;

                    if (this.footstep.isPlaying) {
                        this.footstep.stop();
                    }

                    if (this.enemyFootstep.isPlaying) {
                        this.enemyFootstep.stop();
                    }

                    if (this.heartBeating.isPlaying) {
                        this.heartBeating.stop();
                    }

                    this.scene.stop('game-scene');
                    this.scene.start('game-over-scene')
                }]
            ]
        };
        
        this.load.image('asset-1', asset1);
        this.load.image('asset-2', asset2);
        this.load.image('asset-3', asset3);
        this.load.tilemapTiledJSON('tilemap', mapConfig);

        this.load.audio('player.sound.footstep', [playerFootStep]);
        this.load.audio('player.sound.breathing', [playerBreathingSound]);
        this.load.audio('player.sound.pageCollected', [pageColledctedSong]);
        this.load.audio('player.sound.heartBeatingSound', [heartBeatingSound]);

        this.load.image('items.book', bookItem);
        this.load.image('items.battery', batteryItem);

        this.load.image('flashlight', flashlight);
        this.load.image('black', black);

        this.load.atlas('player.anim.idle', playerIdleSpritesheet, playerIdleSprite);
        this.load.atlas('player.anim.move', playerMoveSpritesheet, playerMoveSprite);
        this.load.atlas('enemy.anim.move', enemyMoveSpritesheet, enemyMoveSprite);
    }

    create() {
        this.playerBreathingSound = this.sound.add('player.sound.breathing');
        this.footstep = this.sound.add('player.sound.footstep', {loop: true});
        this.enemyFootstep = this.sound.add('player.sound.footstep', {loop: true});
        this.pageCollected = this.sound.add('player.sound.pageCollected', {loop: false});
        this.heartBeating = this.sound.add('player.sound.heartBeatingSound');

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
        this.playerPositionStart = playerPositionStart;

        this.player = this.physics.add.sprite(playerPositionStart[0].x + 90, playerPositionStart[0].y + 50, 'player.anim.idle');
        this.player.setBounce(0.2);
        this.player.setScale(0.5);
        this.player.body.setGravityY(0);
        
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

        this.anims.create({
            key: 'enemy.anim.move',
            frames: this.anims.generateFrameNames('enemy.anim.move'),
            frameRate: 8,
            repeat: -1
        });

        this.collectButton = this.input.keyboard.addKey('f');

        this.cursors = this.input.keyboard.createCursorKeys();
        this.mapButton = this.input.keyboard.addKey('m');

        this.physics.add.collider(this.player, this.layer2);


        // ----
        const positionsEnemyDecision = this.physics.add.staticGroup();

        const positionsEnemyDecisionLayer = this.map.getObjectLayer('enemy-wall-decision').objects;
        positionsEnemyDecisionLayer.forEach(obj => {
            const item = positionsEnemyDecision.create(obj.x + 10, obj.y, '', '', false);
            
            item.enemyPoint = obj.name;
            item.enemyDecisionType = obj.type;
        });
        
        this.enemy = this.physics.add.
                        sprite(
                            positionsEnemyDecisionLayer[0].x + 10, 
                            positionsEnemyDecisionLayer[0].y, 
                            'enemy.anim.move'
                        );
        this.enemy.anims.play('enemy.anim.move');

        this.enemyVelocityX = 0;
        this.enemyVelocityY = 0;
        this.enemyCurrentPoint = null;
        this.enemyLastChoiche = null;

        this.physics.add.overlap(this.enemy, positionsEnemyDecision, (enemy, obj) => {

            if (
                (this.enemyCurrentPoint === null || this.enemyCurrentPoint !== obj.enemyPoint) &&
                (
                    obj.getCenter().x > enemy.getCenter().x - 4.2 && obj.getCenter().x < enemy.getCenter().x + 4.2 &&
                    obj.getCenter().y > enemy.getCenter().y - 4.2 && obj.getCenter().y < enemy.getCenter().y + 4.2
                )
            ) {
                this.enemyCurrentPoint = obj.enemyPoint; 

                const options = obj.enemyDecisionType.split('-');
                let optionSelected = null;

                while (true) {
                    optionSelected = options[RandomUtil.random(0, options.length - 1)];

                    if (this.enemyLastChoiche === null || options.length === 1) break;

                    if (!(this.enemyLastChoiche === 'l' && optionSelected === 'r')) break;
                    if (!(this.enemyLastChoiche === 'u' && optionSelected === 'd')) break;
                    if (!(this.enemyLastChoiche === 'r' && optionSelected === 'l')) break;
                    if (!(this.enemyLastChoiche === 'd' && optionSelected === 'u')) break;
                }

                if (optionSelected === 'd') {
                    this.enemyVelocityY = 250;
                    this.enemyVelocityX = 0;
                }

                if (optionSelected === 'u') {
                    this.enemyVelocityY = -250;
                    this.enemyVelocityX = 0;
                }

                if (optionSelected === 'r') {
                    this.enemyVelocityY = 0;
                    this.enemyVelocityX = 250;
                }

                if (optionSelected === 'l') {
                    this.enemyVelocityY = 0;
                    this.enemyVelocityX = -250;
                }

                this.enemyLastChoiche = optionSelected;
            }
        });

        this.physics.add.collider(this.player, this.enemy, () => {
            this.state.gameOver = true;

            if (this.footstep.isPlaying) {
                this.footstep.stop();
            }

            if (this.enemyFootstep.isPlaying) {
                this.enemyFootstep.stop();
            }

            if (this.heartBeating.isPlaying) {
                this.heartBeating.stop();
            }

            this.scene.stop('game-scene');
            this.scene.start('game-over-scene');
        });

        this.flashlight = this.physics.add.sprite(0, 0, 'flashlight').setScrollFactor(0, 0);

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
    
                let counterAttempt = 0;
                let find = false;
                while (!find) {
                    counterAttempt++;
                    if (counterAttempt > 30) break;

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
            if(lettersMapSelected.length < 7) continue;

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

        this.batteries = this.physics.add.staticGroup();
        const batteriesPositions = this.map.getObjectLayer('battery-positions').objects;

        const batteriesPositionsSelected = []; 
        for (let i = 0; i < 5; i++) {
            
            while (true) {
                const position = RandomUtil.random(0, batteriesPositions.length - 1);
                if (!batteriesPositionsSelected.includes(position)) {
                    batteriesPositionsSelected.push(position);

                    this.batteries.create(
                        batteriesPositions[position].x,
                        batteriesPositions[position].y,
                        'items.battery'
                    ).setAngle(
                        RandomUtil.random(0, 360)
                    ).setOrigin(0.5, 0.5).setScale(0.1).refreshBody();
                    
                    break;
                }
            }

        }
        window.cheats.batteryPositions = batteriesPositionsSelected;
        window.cheats.gameState = this.state;

        this.physics.add.overlap(this.player, this.batteries, (player, battery) => {

            if (this.collectButton.isDown) {
                battery.destroy();

                this.state.gameStartAt.add(45, 'seconds');
    
                for (let i in this.state.flashlightStages) {
                        this.state.flashlightStages[i][0] = false;
                }
            }

        });

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

                // console.log(mapLetterToTip);
                // console.log(this.getMapPositionByKey(book.letterPosition, mapLetterToTip));
                // console.log(mapLetterToTip[this.getMapPositionByKey(book.letterPosition, mapLetterToTip)]);
                
                // console.log(
                //     LetterService.getLetterTipByLetterId(mapLetterToTip[this.getMapPositionByKey(book.letterPosition, mapLetterToTip)][1])
                // );
                
                countLetterCollected++;
                this.state.lettersInventory.push(String(book.letterPosition));
                book.destroy();
                this.pageCollected.play();

                this.scene.sleep('game-scene');
                this.scene.run('letter-scene', {
                    countLetterCollected: countLetterCollected, 
                    letterMessage: LetterService.getLetterTipByLetterId(mapLetterToTip[this.getMapPositionByKey(book.letterPosition, mapLetterToTip)][1])
                });
                
            }
        });

        // victory game logic
        const victoryPointLayer = this.map.getObjectLayer('player-finish-point').objects;
        const victoryPoint = this.physics.add.staticGroup();

        const victoryPointObj = victoryPoint.create(
            victoryPointLayer[0].x + victoryPointLayer[0].width / 2, 
            victoryPointLayer[0].y + victoryPointLayer[0].height / 2, 
            '', '', false
        );
        victoryPointObj.setSize(victoryPointLayer[0].width, victoryPointLayer[0].height);

        this.physics.add.collider(this.player, victoryPoint, () => {

            if (countLetterCollected === 7) {
                this.state.gameOver = true;

                if (this.footstep.isPlaying) {
                    this.footstep.stop();
                }

                if (this.enemyFootstep.isPlaying) {
                    this.enemyFootstep.stop();
                }

                if (this.heartBeating.isPlaying) {
                    this.heartBeating.stop();
                }

                this.scene.stop('game-scene');
                this.scene.run('victory-scene', {
                    letters: this.state.lettersInventory,
                    gameStartAt: this.state.realGameStartAt
                });
            }

        });

        this.cameras.main.startFollow(this.player);

        // logic letter inventory
        this.letterInventoryKeys = this.input.keyboard.addKeys("ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN");
        let count = 0;
        for (let i in this.letterInventoryKeys) {
            const keyPosition = count;
            count++;

            this.letterInventoryKeys[i].on('down', () => {
                if (this.state.lettersInventory[keyPosition]) {
                    this.pageCollected.play();

                    this.scene.sleep('game-scene');
                    this.scene.run('letter-scene', {
                        countLetterCollected: Number(keyPosition) + 1, 
                        letterMessage: LetterService.getLetterTipByLetterId(mapLetterToTip[this.getMapPositionByKey(Number(this.state.lettersInventory[keyPosition]), mapLetterToTip)][1]),
                        keyUsed: i
                    });
                }
            });
        }

        // add area collider enemy sound.
        const enemyCenter = this.enemy.getCenter();
        const enemySoundArea = this.physics.add.sprite(enemyCenter.x, enemyCenter.y, '', '');

        this.enemySoundArea = enemySoundArea;

        enemySoundArea.setSize(2000, 2000);
        enemySoundArea.setVisible(false);

        this.physics.add.overlap(this.player, enemySoundArea, () => {
            const enemyDistance = Phaser.Math.Distance.BetweenPoints(this.player, this.enemy);

            if (enemyDistance > this.state.enemyDistanceSound[0][1]) {
                if (this.enemyFootstep.isPlaying) this.enemyFootstep.stop();

                this.state.currentEnemySoundStage = -1;
                // for (let i in this.state.enemyDistanceSound) this.state.enemyDistanceSound[i][0] = false;
            } else {

                for (let i in this.state.enemyDistanceSound) {
                    if (enemyDistance < this.state.enemyDistanceSound[i][1] && 
                        !this.state.enemyDistanceSound[i][0] &&
                        !this.nextIsLess( 
                            (this.state.enemyDistanceSound[Number(i) + 1] || [0, -1])[1],
                            enemyDistance
                        )
                    ) {
                        if (this.enemyFootstep.isPlaying) this.enemyFootstep.stop();

                        this.state.currentEnemySoundStage = i;
                        console.log(this.state.enemyDistanceSound[i][2]);

                        this.enemyFootstep.play({
                            volume: this.state.enemyDistanceSound[i][2]
                        });

                        this.state.enemyDistanceSound[i][0] = true;
                    } else if (this.state.currentEnemySoundStage != i) {
                        this.state.enemyDistanceSound[i][0] = false;
                    }

                }

            }

        });

    }

    setFlashlightStage(stage) {
        if (stage === 1) {
            this.flashlight.setScale(0.9);
            this.flashlight.setX(378);
            this.flashlight.setY(230);
        }

        if (stage === 2) {
            this.flashlight.setScale(0.75);
            this.flashlight.setX(378);
            this.flashlight.setY(215);
        }

        if (stage === 3) {
            this.flashlight.setScale(0.45);
            this.flashlight.setX(378);
            this.flashlight.setY(240);
        }

        if (stage === 4) {
            this.flashlight.destroy();
            this.flashlight = this.physics.add.sprite(300, 160, 'black').setScrollFactor(0, 0);
        }
        
    }

    nextIsLess(current, next) {
        if (next < current) return true;

        return false;
    }

    update() {

        // flashlight logic
        for (let i in this.state.flashlightStages) {

            if (this.state.flashlightStages[i][1] < moment().diff(this.state.gameStartAt)
                && !this.state.flashlightStages[i][0]) {

                this.setFlashlightStage(Number(i) + 1);
                this.state.flashlightStages[i][0] = true;

                if (typeof this.state.flashlightStages[i][2] === 'function')
                    this.state.flashlightStages[i][2]();

                break;
            }
            
        }

        // enemy move logic
        this.enemy.setVelocityY(this.enemyVelocityY);
        this.enemy.setVelocityX(this.enemyVelocityX);
        
        this.enemySoundArea.setVelocityY(this.enemyVelocityY);
        this.enemySoundArea.setVelocityX(this.enemyVelocityX);

        if (this.enemyVelocityY < 0) {
            this.enemy.setAngle(0);
            this.enemy.setOrigin(0.5, 0.5);
        }

        if (this.enemyVelocityY > 0) {
            this.enemy.setAngle(180);
            this.enemy.setOrigin(0.5, 0.5);
        }

        if (this.enemyVelocityX > 0) {
            this.enemy.setAngle(90);
            this.enemy.setOrigin(0.5, 0.5);
        }
        
        if (this.enemyVelocityX < 0) {
            this.enemy.setAngle(-90);
            this.enemy.setOrigin(0.5, 0.5);
        }

        // collect items logic
        if (this.mapButton.isDown) {
            this.pageCollected.play();

            this.scene.sleep('game-scene');
            this.scene.run('map-scene', {
                letters: this.state.lettersInventory,
                playerPosition: {
                    initialX: this.playerPositionStart[0].x + 90,
                    initialY: this.playerPositionStart[0].y + 50,
                    x: this.player.x,
                    y: this.player.y
                }
            });
        }

        // player move logic
        if (this.cursors.left.isDown)
            {
                if (!this.footstep.isPlaying && !this.state.gameOver)
                    this.footstep.play();

                this.player.setVelocityX(-160);

                this.player.setAngle(-180);
                this.player.setOrigin(0.5, 0.5);

                this.player.anims.play('player.anim.move', true);

                this.state.playerStopAt = null;
            }
            else if (this.cursors.right.isDown)
            {
                if (!this.footstep.isPlaying && !this.state.gameOver)
                    this.footstep.play();

                this.player.setVelocityX(160);

                this.player.setAngle(0);
                this.player.setOrigin(0.5, 0.5);

                this.player.anims.play('player.anim.move', true);

                this.state.playerStopAt = null;
            }
            else if (this.cursors.up.isDown) {
                if (!this.footstep.isPlaying && !this.state.gameOver)
                    this.footstep.play();

                this.player.setVelocityY(-160);

                this.player.setAngle(-90);
                this.player.setOrigin(0.5, 0.5);

                this.player.anims.play('player.anim.move', true);

                this.state.playerStopAt = null;
            }
            else if (this.cursors.down.isDown) {
                if (!this.footstep.isPlaying && !this.state.gameOver)
                    this.footstep.play();

                this.player.setVelocityY(160);

                this.player.setAngle(90);
                this.player.setOrigin(0.5, 0.5);

                this.player.anims.play('player.anim.move', true);

                this.state.playerStopAt = null;
            }
            else
            {
                if (this.footstep.isPlaying)
                    this.footstep.stop();

                if (this.state.playerStopAt === null) {

                    this.state.playerStopAt = moment();
                    this.state.randomStartBreathingAfter = RandomUtil.random(8, 25);

                } else {
                    if (
                        moment().unix() - this.state.playerStopAt.unix() >= 
                        this.state.randomStartBreathingAfter
                    ) {
                        this.playerBreathingSound.play();    
                        this.state.playerStopAt = null;
                    }
                }

                this.player.setVelocityX(0);
                this.player.setVelocityY(0);

                this.player.anims.play('player.anim.idle', true);
            }
    }
}
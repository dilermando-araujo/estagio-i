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

import MapScene from './MapScene';

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

        this.player = this.physics.add.sprite(200, 300, 'player.anim.idle');
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
        
        this.books = this.physics.add.staticGroup();
        this.books.create(450, 250, 'items.book').setScale(1).refreshBody();
        
        this.message = this.add.text(this.cameras.main.centerX, 16, 'Pressione F', { fontSize: '32px', fill: '#000' }).setOrigin(0.5);
        this.message.setScrollFactor(0, 0);

        this.collectButton = this.input.keyboard.addKey('f');

        this.physics.add.overlap(this.player, this.books, (player, book) => {
            // book.disableBody(true, true);

            if (this.collectButton.isDown) {
                book.destroy();
                this.pageCollected.play();
            }
        });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.mapButton = this.input.keyboard.addKey('m');

        this.cameras.main.startFollow(this.player);

        this.physics.add.collider(this.player, this.layer2);
    }
    update() {

        if (this.mapButton.isDown) {
            this.scene.stop(StartScene);
            this.scene.start(MapScene);
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
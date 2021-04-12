import Phaser from 'phaser';

import playerMoveSprite from './../assets/player/anims/move/sprites.json';
import playerMoveSpritesheet from './../assets/player/anims/move/spritesheet.png';

import playerIdleSprite from './../assets/player/anims/idle/sprites.json';
import playerIdleSpritesheet from './../assets/player/anims/idle/spritesheet.png';

import bookItem from './../assets/items/book.png';

import assetsMap from './../assets/assets.png';
import assetConfig from './../assets/map.json';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super('game-scene');

        this.player = null;
        this.showMessage = false;
    }

    preload() {
        this.load.image('tiles', assetsMap);
        this.load.tilemapTiledJSON('map', assetConfig);

        this.load.image('items.book', bookItem);

        this.load.atlas('player.anim.idle', playerIdleSpritesheet, playerIdleSprite);
        this.load.atlas('player.anim.move', playerMoveSpritesheet, playerMoveSprite);
    }

    create() {

        this.map = this.make.tilemap({key: 'map'});
        const tileset = this.map.addTilesetImage('assets', 'tiles');

        this.map.createLayer('Camada de Tiles 1', tileset, 0, 0);

        this.player = this.physics.add.sprite(200, 300, 'player.anim.idle');
        this.player.setBounce(0.2);
        this.player.setScale(0.5);
        this.player.body.setGravityY(0);
        this.player.setCollideWorldBounds(true);
        
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
        
        // console.log(this.books.getChildren()[0]);

        this.message = this.add.text(this.cameras.main.centerX, 16, 'Pressione F', { fontSize: '32px', fill: '#000' }).setOrigin(0.5);

        this.physics.add.overlap(this.player, this.books);

        this.cursors = this.input.keyboard.createCursorKeys();
    }
    update() {

        if (this.cursors.left.isDown)
            {
                this.player.setVelocityX(-160);

                this.player.setAngle(-180);
                this.player.setOrigin(0.5, 0.5);

                this.player.anims.play('player.anim.move', true);
            }
            else if (this.cursors.right.isDown)
            {
                this.player.setVelocityX(160);

                this.player.setAngle(0);
                this.player.setOrigin(0.5, 0.5);

                this.player.anims.play('player.anim.move', true);
            }
            else if (this.cursors.up.isDown) {
                this.player.setVelocityY(-160);

                this.player.setAngle(-90);
                this.player.setOrigin(0.5, 0.5);

                this.player.anims.play('player.anim.move', true);
            }
            else if (this.cursors.down.isDown) {
                this.player.setVelocityY(160);

                this.player.setAngle(90);
                this.player.setOrigin(0.5, 0.5);

                this.player.anims.play('player.anim.move', true);
            }
            else
            {
                this.player.setVelocityX(0);
                this.player.setVelocityY(0);

                this.player.anims.play('player.anim.idle', true);
            }
    }
}
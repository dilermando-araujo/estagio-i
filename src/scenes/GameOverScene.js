import TweenUtil from '../utils/TweenUtil';
import gameOverSound from './../assets/sounds/game-over.mp3';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('game-over-scene');
    }

    preload() {
        this.load.audio('game-over', [gameOverSound]);
    }
    
    create() {
        this.gameOverSound = this.sound.add('game-over', {loop: false});
        this.gameOverSound.play();

        this.message = this.add.text(this.cameras.main.centerX, 50, 'FIM DE JOGO', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);
        this.message.setScrollFactor(0, 0);

        this.pressEnter = this.add.text(
            this.cameras.main.centerX, 
            550,
            'Pressione enter para tentar novamente', 
            { fontSize: '32px', fill: '#fff' }
        ).setOrigin(0.5).setScrollFactor(0, 0);

        TweenUtil.flashElement(this, this.pressEnter);

        this.enterButton = this.input.keyboard.addKey(13);
    }

    update() {
        if (this.enterButton.isDown) {
            this.scene.start('game-scene');
        }
    }
    
}
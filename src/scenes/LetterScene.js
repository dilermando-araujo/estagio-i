
export default class LetterScene extends Phaser.Scene {
    constructor() {
        super('letter-scene');
    }

    preload(){}
    
    create(){
        this.message = this.add.text(this.cameras.main.centerX, 50, 'PÁGINA 1/20', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);
        this.message.setScrollFactor(0, 0);

        this.message = this.add.text(this.cameras.main.centerX, 100, 'PASSO GRANDE PARTE DO', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);
        this.message = this.add.text(this.cameras.main.centerX, 135, 'MEU TEMPO NO QUARTO 05', { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);
        this.message.setScrollFactor(0, 0);

        this.backCursor = this.input.keyboard.addKey('f');
    }

    update(){

        if (this.backCursor.isDown) {
            this.scene.switch('game-scene');
        }

    }
}
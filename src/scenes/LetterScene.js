
export default class LetterScene extends Phaser.Scene {
    constructor() {
        super('letter-scene');
    }

    init(props) {
        this.props = props;
    }

    preload(){}
    
    create() {
        this.message = this.add.text(this.cameras.main.centerX, 50, `PÁGINA ${this.props.countLetterCollected}/7`, { fontSize: '32px', fill: '#FFF' }).setOrigin(0.5);
        this.message.setScrollFactor(0, 0);

        const words = this.props.letterMessage.split(' ');
        const sentences = [];

        let sentence = '';
        for (let i in words) {
            if (sentence.length + words[i].length < 25) {
                sentence += ' ' + words[i];
            } else {
                sentences.push(sentence);
                sentence = words[i];
            }
        }

        if (sentence != '') sentences.push(sentence);

        let positionAccum = 0;
        for (let i in sentences) {
            this.add.text(this.cameras.main.centerX, 100 + positionAccum, sentences[i], 
                { fontSize: '32px', fill: '#FFF' })
            .setOrigin(0.5).setScrollFactor(0, 0);
        
            positionAccum += 35;
        }

        const keys = ['f', 'esc'];
        if (typeof this.props.keyUsed === 'string') keys.push(this.props.keyUsed);

        this.backCursor = this.input.keyboard.addKeys(keys.join(','));

        for (let i in this.backCursor) {
            this.backCursor[i].on('down', () => {
                this.scene.stop('letter-scene');
                this.scene.wake('game-scene');
            });
        }
    }

    update(){}
}
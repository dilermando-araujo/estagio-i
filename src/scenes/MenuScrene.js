import Phaser from 'phaser';

import TextUtil from './../utils/TextUtil';
import TweenUtil from '../utils/TweenUtil';

import menuSong from './../assets/sounds/menu-song.mp3';
import heartBeating from './../assets/sounds/heart-beating.mp3';
import soundTypewriter from './../assets/sounds/sound-typewriter.mp3';
import soundTypewriterNewLine from './../assets/sounds/sound-typewriter-new-line.mp3';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('main-scene');

        this.state = {
            startStory: false
        };
    }

    preload() {
        this.load.audio('menuSong', [menuSong]);
        this.load.audio('heartBeating', [heartBeating]);
        this.load.audio('soundTypewriter', [soundTypewriter]);
        this.load.audio('soundTypewriterNewLine', [soundTypewriterNewLine]);
    }

    create() {
        this.enterButton = this.input.keyboard.addKey(13);

        this.menuSound = this.sound.add('menuSong', {loop: true, volume: 2});
        this.menuSound.play();

        this.soundTypewriter = this.sound.add('soundTypewriter', {loop: false});
        this.soundTypewriterNewLine = this.sound.add('soundTypewriterNewLine', {loop: false});

        this.messages = [
            'Projeto de Reportagem',
            'Anos atrás, um hotel isolado da cidade foi palco de desaparecimentos e alguns assassinatos. Recentemente um novo caso',
            '...'
        ];

        this.message = this.add.text(0, 16, '', { fontSize: '32px', fill: '#fff' });
        this.message.setOrigin(0, 0);

        this.time.addEvent({
            delay: 0,
            callback: () => this.show(),
            loop: false
        });
    }

    show() {
        this.wordCount = 0;
        this.currentWord = '';
        this.word = TextUtil.getTextWithBreakLines(this.messages.join(' |'), 30);
        this.message = this.add.text(10, 16, this.currentWord, { fontSize: '32px', fill: '#fff' });

        this.wordsShow = this.time.addEvent({
            delay: 200,
            callback: () => this.write(),
            repeat: this.word.length
        });
    }

    write() {

        if (this.word.charAt(this.wordCount) !== '|' && this.word.length !== this.wordCount) {
            if (this.state.startStory) this.wordsShow.delay = 50;
            if (this.pressEnter) this.pressEnter.destroy();

            if (this.word.charAt(this.wordCount) === '\n')
                this.soundTypewriterNewLine.play();
            else
                this.soundTypewriter.play();

            this.currentWord += this.word.charAt(this.wordCount);
            this.wordCount++;

            this.message.destroy();

            this.message = this.add.text(10, 16, this.currentWord, { fontSize: '32px', fill: '#fff' });
            this.message.setOrigin(0, 0);
            this.message.setScrollFactor(0, 0);

        } else {
            if (this.word.length !== this.wordCount) this.wordCount++;
            this.wordsShow.paused = true;
            this.wordsShow.delay = 200;

            this.soundTypewriterNewLine.play();
            this.time.addEvent({
                delay: 600,
                callback: () => this.showPressEnter(),
                loop: false
            });

        }

    }

    showPressEnter() {
        this.pressEnter = this.add.text(
            this.cameras.main.centerX, 
            550,
            'Pressione enter para continuar', 
            { fontSize: '32px', fill: '#fff' }
        ).setOrigin(0.5).setScrollFactor(0, 0);

        TweenUtil.flashElement(this, this.pressEnter);
    }

    update() {

        if (this.enterButton.isDown) {
            if (this.word.length === this.wordCount) {
                this.menuSound.stop();

                this.scene.stop('main-scene');
                this.scene.run('game-scene');
            } else {
                this.currentWord = '';
    
                this.message.destroy();
                this.message = this.add.text(10, 16, this.currentWord, { fontSize: '32px', fill: '#fff' });
    
                this.wordsShow.paused = false;
                this.state.startStory = true;
            }
        }
        
    }

}

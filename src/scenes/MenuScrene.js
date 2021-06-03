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
            showSkipInto: true,
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
        this.skipButton = this.input.keyboard.addKey('P');

        this.menuSound = this.sound.add('menuSong', {loop: true, volume: 2});
        this.menuSound.play();

        this.soundTypewriter = this.sound.add('soundTypewriter', {loop: false});
        this.soundTypewriterNewLine = this.sound.add('soundTypewriterNewLine', {loop: false});

        this.messages = [
            'Projeto de Reportagem',
            'Desde o começo do mês, um hotel localizado a caminho da zona rural tem sido palco de misteriosos desaparecimentos, os quais até agora não tiveram solução. Porém, hoje uma nova peça nesse mistério foi encontrada, viajantes que estavam indo em direção a um sítio afirmaram ter encontrado um diário junto a dois corpos em um rio, próximo ao hotel.',
            'É notável que o diário possui páginas faltando, e que talvez essas páginas expliquem melhor o que aconteceu dias antes dos desaparecimentos, e até mesmo, quem são os corpos que estavam no rio.',
            'A fim de ser a primeira emissora a noticiar os principais acontecimentos sobre esse caso, um reportér resolve ir sozinho documentar o local antes da chegada da polícia.',
            'Sobre o jogo: \n - Utilize F para coletar os itens e sair de alguma tela. \n - É noite, não deixe sua lanterna ficar sem pilhas! \n - Encontre as sete páginas que estão faltando no diário e saia do local. Leia com atenção cada uma delas, pois elas dão dicas para as próximas, para ler novamente uma página, utilize a tecla correspondente ao seu número. \n - Utilize M para acessar o mapa.',
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
        this.word = TextUtil.getTextWithBreakLines(this.messages.join(' |'), 40);
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
            if (this.showSkipInto) this.showSkipInto.destroy();

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
        if (this.state.showSkipInto) {

            this.showSkipInto = this.add.text(
                this.cameras.main.centerX, 
                550,
                'Pressione P para pular a abertura', 
                { fontSize: '32px', fill: '#fff' }
            ).setOrigin(0.5).setScrollFactor(0, 0);

        }

        this.pressEnter = this.add.text(
            this.cameras.main.centerX, 
            this.state.showSkipInto ? 500 : 550,
            'Pressione enter para continuar', 
            { fontSize: '32px', fill: '#fff' }
        ).setOrigin(0.5).setScrollFactor(0, 0);

        TweenUtil.flashElement(this, this.pressEnter);
        if (this.state.showSkipInto) TweenUtil.flashElement(this, this.showSkipInto);
    }

    update() {

        if (this.skipButton.isDown && this.state.showSkipInto) {
            this.menuSound.stop();

            this.scene.stop('main-scene');
            this.scene.run('game-scene');
        }

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
                this.state.showSkipInto = false;
            }
        }
        
    }

}

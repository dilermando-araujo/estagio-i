import StartScene from "./StartScene";

export default class MapScene extends Phaser.Scene {
    constructor() {
        super('map-scene');
    }

    init(data) {
        console.log(data);
    }

    preload(){}

    create(){
        this.mapButton = this.input.keyboard.addKey('m');
    }

    update(){

        if (this.mapButton.isDown) {
            this.scene.switch('game-scene');
        }

    }
}
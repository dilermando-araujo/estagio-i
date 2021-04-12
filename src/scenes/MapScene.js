import StartScene from "./StartScene";

export default class MapScene extends Phaser.Scene {
    constructor() {
        super('map-scene');
    }

    preload(){}

    create(){
        this.mapButton = this.input.keyboard.addKey('m');
    }

    update(){

        if (this.mapButton.isDown) {
            this.scene.remove(MapScene);
            this.scene.resume(StartScene);
        }

    }
}
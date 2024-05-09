class Introduction extends Phaser.Scene {
    constructor() {
        super('intro');
    }

    init() {
        this.part = 0;
        this.activeText = []
        this.timer = 0
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("player", "player.png");
    }

    create() {
        this.player = this.add.sprite(400, 500, "player");
        this.player.scale = 4

        this.activeText.push(this.add.text(400, 200, 'Precise Care', { fontSize: '48px'}).setOrigin(0.5));
        this.activeText.push(this.add.text(400, 250, 'Press Space to Play', { fontSize: '16px'}).setOrigin(0.5));
        
        this.input.keyboard.on('keydown-SPACE', (event) => {
            this.part++;
            switch (this.part) {
                case 1: 
                    this.credits();
                    break;
                case 2:
                    this.instructions();
                    break;
                case 3:
                    this.scene.start("shootingGallery")
                    break;
            }
        });
    }

    credits() {
        this.activeText.forEach(element => {
            element.destroy();
        });

        this.activeText.push(this.add.text(400, 200, 'Credits', { fontSize: '48px'}).setOrigin(0.5));
        this.activeText.push(this.add.text(400, 300, 'Assets by Kenny Assets\nGame by Damon', { fontSize: '32px'}).setOrigin(0.5));
        this.activeText.push(this.add.text(400, 250, 'Press Space to Continue', { fontSize: '16px'}).setOrigin(0.5));
    }

    instructions() {
        this.activeText.forEach(element => {
            element.destroy();
        });

        this.activeText.push(this.add.text(400, 200, 'Controls', { fontSize: '48px'}).setOrigin(0.5));
        this.activeText.push(this.add.text(400, 300, '- A/D to Move\n- Space to Shoot', { fontSize: '32px'}).setOrigin(0.5));
        this.activeText.push(this.add.text(400, 250, 'Press Space to Start', { fontSize: '16px'}).setOrigin(0.5));
    }

    update(time) {
        this.activeText.forEach(element => {
            element.scale = 0.1 * Math.sin(time / 1000) + 1;
            element.rotation = 0.1 * Math.sin(time / 500)
        });
        this.player.scale = 0.1 * Math.sin(time / 1000) + 4;
        this.player.rotation = 0.1 * Math.sin(time / 500)
    }
}
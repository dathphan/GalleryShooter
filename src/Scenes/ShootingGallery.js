class ShootingGallery extends Phaser.Scene {
    


    constructor(){
        super("shootingGallery");

        // Player Parameters
        this.playerSpeed = 10

        // Heart Parameters
        this.heartSpeed = 20
        this.heartCooldown = 5

        // Enemy Parameters

        this.playerX = 350;
        this.playerY = 550;
        this.hearts = [];
        this.heartTimer = 0

        // Enemies
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("player", "player.png");
        this.load.image("heart", "heart.png");
        this.load.image("block", "block.png");
    }

    create() {
        // CREATE

        this.player = this.add.sprite(this.playerX, this.playerY, "player");
        this.player.scale = 2
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.enemySpawn();
    }

    update() {
        // UPDATE
        this.playerUpdate();
        this.heartUpdate();
    }

    playerUpdate(){
        if (this.aKey.isDown) {
            this.player.x -= this.playerSpeed;
        }
        if (this.dKey.isDown) {
            this.player.x += this.playerSpeed;
        }
        this.player.x = Math.min(Math.max(0, this.player.x), 1000)
    }

    heartUpdate() {

        this.hearts.forEach(element => {
            element.y -= this.heartSpeed;
        });

        if (this.heartTimer > 0) {
            this.heartTimer -= 1
            return
        }

        if (this.spaceKey.isDown) {
            let hearts = this.add.sprite(this.player.x, this.playerY, "heart")
            hearts.scale = 2;
            this.hearts.push(hearts);
            this.heartTimer = this.heartCooldown

            if (hearts.length > 15) {
                hearts.pop();
            }
        }
    }

    enemySpawn() {
        this.blockSpawn();
    }

    blockSpawn() {
        let blockX = Math.floor(Math.random() * 700) + 50;
        this.curve = new Phaser.Curves.Spline([blockX, this.playerY, blockX, 50]);
        this.block = this.add.follower(this.curve, blockX, this.playerY, "block");
        this.block.scale = 2;

        let parameters = {
            from: 0,
            to: 1,
            delay: 100,
            duration: 1000,
            ease: 'Cubic.easeOut',
            repeat: -1,
            yoyo: true,
            rotateToPath: false,
            rotationOffset: -90
        }

        this.block.startFollow(parameters);
    }

}
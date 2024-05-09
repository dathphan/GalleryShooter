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
        this.heartTimer = 0

        this.initial();
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("player", "player.png");
        this.load.image("heart", "heart.png");
        this.load.image("block", "cheese_mad.png");
        this.load.image("drill", "drill.png");
        this.load.image("boss", "drill_face.png");
    }

    create() {
        // CREATE
        this.initial();

        this.player = this.add.sprite(this.playerX, this.playerY, "player");
        this.player.scale = 2
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.enemySpawn();
        // this.drillBoss();

        // Text
        this.scoreText = this.add.text(20, 50, 'Score: ' + this.score, {
            fontSize: '18px',
            fill: '#ffffff',
            fontFamily: 'Gore'
        });
        this.levelText = this.add.text(20, 20, 'Level ' + this.level, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Gore'
        });
        this.heartText = this.add.text(780, 20, 'Hearts: ' + this.heart_count, {
            fontSize: '24px',
            fill: '#ffaaaa',
            fontFamily: 'Gore'
        });
        this.scoreText.setOrigin(0, 0);
        this.heartText.setOrigin(1, 0);
    }

    update() {
        // UPDATE
        this.playerUpdate();
        // this.playerMovement();
        this.heartUpdate();
        this.scoreText.setText('Score: ' + this.score);
        this.heartText.setText('Hearts: ' + this.heart_count);

        if (this.active && this.blocks.length < 1 && this.drills.length < 1){
            this.nextLevel();
            this.active = false;
        }
    }

    playerMovement(){
        this.player.x = mouseX;
    }

    playerUpdate(){
        if (this.aKey.isDown) {
            this.player.x -= this.playerSpeed;
        }
        if (this.dKey.isDown) {
            this.player.x += this.playerSpeed;
        }
        this.player.x = Math.min(Math.max(50, this.player.x), 750)
    }

    heartUpdate() {

        this.hearts.forEach((heart, index) => {
            heart.y -= this.heartSpeed;

            this.blocks.forEach((block, blockIndex) => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(heart.getBounds(), block.getBounds())){
                    block.destroy();
                    this.blocks.splice(blockIndex, 1);
                    this.score += 50
                    this.heart_count += 1
                }
            });

            this.drills.forEach((drill, drillIndex) => {
                if (Phaser.Geom.Intersects.RectangleToRectangle(heart.getBounds(), drill.getBounds())){
                    drill.destroy();
                    this.drills.splice(drillIndex, 1);
                    this.score += 50
                    this.heart_count += 1
                }
            });

            if (heart.y < -16) {
                heart.destroy();
                this.hearts.splice(index, 1);
                if (this.hearts.length <= 0 && this.heart_count <= 0){
                    this.gameOver(this.level, this.score);
                }
            }
        });

        if (this.heartTimer > 0) {
            this.heartTimer -= 1
            return
        }

        if (this.spaceKey.isDown) {
            if (this.heart_count <= 0){
                return;
            }


            let hearts = this.add.sprite(this.player.x, this.playerY, "heart")
            hearts.scale = 2;
            this.hearts.push(hearts);
            this.heartTimer = this.heartCooldown
            this.heart_count -= 1
        }
    }

    enemySpawn() {
        let duration = 5000 * Math.pow(1.1, -this.level);
        let amount = Math.floor(3 * Math.log(this.level + 2));
        this.blockSpawn(amount, duration);
        this.drillSpawn(amount / 2, duration);
        this.active = true
    }

    blockSpawn(count, duration) {
        for (let i = 0; i < count; i++){
            let blockY = Math.floor(Math.random() * 400) + 100;
            let curve = new Phaser.Curves.Spline([50, blockY, 750, blockY]);
            let block = this.add.follower(curve, 50, blockY, "block");
            block.scale = 2;
            this.blocks.push(block);

            let parameters = {
                startAt: Math.random(),
                from: 0,
                to: 1,
                delay: 0,
                duration: duration,
                ease: 'Sine.easeInOut',
                repeat: -1,
                yoyo: true,
                rotateToPath: false,
                rotationOffset: -90
            }

            block.startFollow(parameters);
        }
    }

    drillSpawn(count, duration) {
        for (let i = 0; i < count; i++){
            let circle = new Phaser.Curves.Ellipse(400, 300, 300, 150);
            let drill = this.add.follower(circle, 700, 200, "drill");
            drill.scale = 2;
            this.drills.push(drill);

            let parameters = {
                startAt: Math.random(),
                duration: duration,
                ease: 'Linear.easeInOut',
                repeat: -1,
                yoyo: false,
                rotateToPath: true,
                rotationOffset: 90
            }

            drill.startFollow(parameters);
        }
    }

    nextLevel(){
        this.score += 1000 * this.level
        this.scoreText.setText('Score: ' + this.score);
        this.time.delayedCall(1000, function() {
            this.level += 1;
            this.levelText.setText('Level ' + this.level);
            this.enemySpawn();
        }, [], this);
    }

    gameOver(){
        this.scene.start('gameOver', [this.level, this.score]);
    }

    initial() {
        this.playerX = 350;
        this.playerY = 550;
        this.heartTimer = 0

        // Containers
        this.hearts = [];
        this.blocks = [];
        this.drills = [];

        this.score = 0
        this.heart_count = 5
        this.level = 1
        this.active = true
    }
}
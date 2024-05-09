class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOver');
    }

    init(data) {
        this.level = data[0]
        this.score = data[1]
        this.hs = false
        this.menuText = []
    }

    create() {
        this.menuText.push(this.add.text(400, 200, 'Game Over', { fontSize: '48px'}).setOrigin(0.5));
        this.menuText.push(this.add.text(400, 300, 'Score: ' + this.score, { fontSize: '24px'}).setOrigin(0.5));
        this.menuText.push(this.add.text(400, 350, 'Level: ' + this.level, { fontSize: '24px'}).setOrigin(0.5));
        this.menuText.push(this.add.text(400, 450, 'Press Space to Continue', { fontSize: '16px'}).setOrigin(0.5));
        
        this.input.keyboard.on('keydown-SPACE', (event) => {
            if (!this.hs) this.highScore()
            else this.scene.start("shootingGallery")
        });
    }

    highScore() {
        this.hs = true;
        console.log(this.menuText)
        this.menuText.forEach(element => {
            element.destroy();
        });
        let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        highScores.push(this.score);
        highScores.sort((a, b) => b - a);
        localStorage.setItem('highScores', JSON.stringify(highScores));
        
        this.add.text(400, 200, 'High Scores', { fontSize: '48px'}).setOrigin(0.5);
        
        let highScoreText = "";
        highScores.forEach(hs => {
            highScoreText += hs + "\n"
        });
        this.add.text(400, 300, highScoreText, { fontSize: '32px'}).setOrigin(0.5, 0);
        this.add.text(400, 250, 'Press Space to Continue', { fontSize: '16px'}).setOrigin(0.5)
    }

    update() {

    }
}
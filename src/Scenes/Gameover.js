class Gameover extends Phaser.Scene{
    constructor(){
        super("gameoverScene");
    }

    preload(){
        this.load.image('ryb_logo', './assets/RYB_logo_linear.png');
    }
    create(){
        let menuConfig = {
            fontFamily: 'Quicksand',
            fontSize: '28px',
            //backgroundColor: '#AEB6BF',
            color: '#000',
            align: 'right',
            padding: {
                top: 0,
                bottom: 0,
            },
            fixedWidth: 0
        }
        this.ryb = this.add.image(325, 250, 'ryb_logo'); 
        this.gameover = this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', menuConfig).setOrigin(0.5);
        this.scoreUI = this.add.text(game.config.width/2.1, game.config.height * 0.57, 'SCORE: ', menuConfig).setOrigin(0.5)
        this.score = this.add.text(game.config.width/1.715, game.config.height * 0.57, scoreCount, menuConfig).setOrigin(0.5)

        //add score variable
        this.restartButton = this.add.text(game.config.width/2, game.config.height/1.2, 'RESTART', menuConfig).setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => {
            this.tweens.add({
                targets: [this.ryb, this.restartButton, this.gameover, this.score, this.scoreUI],
                x: -250,
                duration: 2000,
                ease: 'Cubic',
                onComplete: ()=> location.reload(),
            });
            //this.scene.stop('playScene')
            //this.scene.start('playScene')
            //this.scene.create('playScene')
            //this.scene.run('playScene')
            //var otherScene = this.scene.get('playScene')
            //otherScene.scene.restart();
        });

        //needs score variable
    }
    update(){

    }
    
}
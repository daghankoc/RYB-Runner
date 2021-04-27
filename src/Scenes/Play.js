class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        //loading the assets   
        this.load.image('lane1', './assets/lane.png');
        this.load.image('UI_circle','./assets/UI_circle.png');
        //loading the different player colors as spritesheets
        //frame 1 = red, 2 = blue,3 = yellow 
        this.load.spritesheet('player', "./assets/player_ss.png",{
            frameWidth: 32,
            frameHeight: 63,
            });
    
    }
    create() {
        

        spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //setting the background color white
        this.cameras.main.setBackgroundColor('#FFFFFF');

        // placing the assets
        //playerShip = new Player(this, screenCenterX - 17, screenCenterY +  (screenCenterY / 2), 'player', 0 )
        playerShip  = this.add.sprite(screenCenterX - 17, screenCenterY +  (screenCenterY / 2), 'player').setOrigin(0,0); 
        playerShip.setFrame(0);
        this.lane1 = this.add.tileSprite(screenCenterX - 60, 0, 120, 960, 'lane1').setOrigin(0, 0);

        //rendering the ship above the lane
        playerShip.setDepth('1');    

        
        //creating a bottom UI bar for the color indicator

        this.add.rectangle(0, screenCenterY * 1.9,screenCenterX * 2 , screenCenterY / 3, "0xffffff").setOrigin(0, 0);
        this.redUI = this.add.sprite(270, 935, 'UI_circle').setOrigin(0.5);
        this.redUI.setTint("0xCF1313");
        this.redUI.setDepth('1');
        
        this.redUI1 = this.add.sprite(330, 935, 'UI_circle').setOrigin(0.5);
        this.redUI1.setTint("0x1181D9");
        this.redUI1.setDepth('1');

        this.redUI2 = this.add.sprite(390, 935, 'UI_circle').setOrigin(0.5);
        this.redUI2.setTint("0xeed456");
        this.redUI2.setDepth('1');
        
 
    }
    update(){
        if(Phaser.Input.Keyboard.JustDown(spaceBar)){
          
        }
        //scrolling tile sprite
        this.lane1.tilePositionY -= 4;
    
    }


}
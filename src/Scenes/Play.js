class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        //loading the assets   

        //this.load.image('lane1', './assets/lane.png');
        this.load.image('tiles', './assets/rybSpriteSheet.png');
        this.load.tilemapTiledJSON('map', './assets/testmap_2.json');

        this.load.image('UI_circle','./assets/UI_circle.png');
        this.load.image('UI_circle_outline','./assets/UI_circle_outline.png');
    
        //loading the different player colors as spritesheets
        //frame 1 = red, 2 = blue,3 = yellow 
        this.load.spritesheet('player', "./assets/arrowRYB.png",{
            frameWidth: 112,
            frameHeight: 167,
            });
    
    }
    create() {
        
        //Adding inputes to use
        spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //setting the background color white
        this.cameras.main.setBackgroundColor('#FFFFFF');
        
        //background testing
        const map = this.make.tilemap({key: 'map'});
        const tileset = map.addTilesetImage('base', 'tiles');
        const belowlayer = map.createLayer('Tile Layer 1', tileset, 0, 100);
        const abovelayer = map.createLayer('Tile Layer 2', tileset, 0, 100);
        //this.aboveLayer.scale.setTo(game.width/(200 * 3), game.height/(200 * 40));
        //this.belowLayer.scale.setTo(game.width/(200 * 3), game.height/(200 * 40));

        // placing the assets
        playerShip  = this.add.sprite(screenCenterX - 17, screenCenterY +  (screenCenterY / 2), 'player').setOrigin(0,0);
        playerShip.scale = 0.5;


        //setting the player to color red for the start
        playerShip.setFrame(0);
        playerShip.currentFrame = 0 

       

        //rendering the ship above the lane
        playerShip.setDepth('1');    

        
        //creating a bottom UI bar for the color indicator
        this.circleOutline = this.add.sprite(270, 935, 'UI_circle_outline').setOrigin(0.5);
        this.circleOutline.setDepth('2');

        this.add.rectangle(0, screenCenterY * 1.9,screenCenterX * 2 , screenCenterY / 3, "0xffffff").setOrigin(0, 0);
        this.redCircle = this.add.sprite(270, 935, 'UI_circle').setOrigin(0.5);
        this.redCircle.setTint("0xCF1313");
        this.redCircle.setDepth('1');
        
        this.blueCircle = this.add.sprite(390, 935, 'UI_circle').setOrigin(0.5);
        this.blueCircle.setTint("0x1181D9");
        this.blueCircle.setDepth('1');

        this.yellowCircle = this.add.sprite(330, 935, 'UI_circle').setOrigin(0.5);
        this.yellowCircle.setTint("0xeed456");
        this.yellowCircle.setDepth('1');
        
 
    }
    update(){



        //Color changing with the spacebar key
        if(Phaser.Input.Keyboard.JustDown(spaceBar)){
            
           
            if (playerShip.currentFrame == 0)
            {
                console.log("Color switched to yellow");
                //changes the frame of the spritesheet to blue
                playerShip.setFrame(1);
                playerShip.currentFrame = 1;
                this.circleOutline.setPosition(330, 935);
            } else if (playerShip.currentFrame == 1)
            {
                console.log("Color switched to blue");
                //changes the frame of the spritesheet to blue
                playerShip.setFrame(2);
                playerShip.currentFrame = 2;
                this.circleOutline.setPosition(390, 935);
            } else if(playerShip.currentFrame == 2)
            {
                console.log("Color switched to red");
                //changes the frame of the spritesheet to blue
                playerShip.setFrame(0);
                playerShip.currentFrame = 0;
                this.circleOutline.setPosition(270, 935);
            }
            
        }

        //Tween movement to right lane with right arrow key 
        if(Phaser.Input.Keyboard.JustDown(keyRight) && currentLane < 2){
            this.add.tween({
                targets: playerShip,
                x : '+=120',
                duration: 250,
                ease: 'Cubic'
            })
            currentLane ++;
        }
        //Tween movement to left lane with left arrow key
        if(Phaser.Input.Keyboard.JustDown(keyLeft) && currentLane > 0){
            this.add.tween({
                targets: playerShip,
                x : '-= 120',
                duration: 250,
                ease: 'Cubic'
            })
            currentLane --;
        }
        //scrolling tile sprite
        //this.lane1.tilePositionY -= 4;
    }
}
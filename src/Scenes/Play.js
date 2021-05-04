class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        
        //loading the assets   

        //this.load.image('lane1', './assets/lane.png');
        this.load.image('tiles', './assets/rybSpriteSheet.png');
        this.load.tilemapTiledJSON('map', './maps/testmap_2.json');

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
        
        this.transitioning = false;
        this.actionQueue = [];

        //Adding inputes to use
        spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //setting the background color to dark grey
        this.cameras.main.setBackgroundColor('#fbfbe3');
        

        //background testing 2
        let map = this.add.tilemap('map');
        let visuals = map.addTilesetImage('base', 'tiles');
        botLayer = map.createLayer('Tile Layer 1', [visuals], mapX, 0);
        topLayer = map.createLayer('Tile Layer 2', [visuals], mapX, 0);
       
        botLayer2 = map.createLayer('Tile Layer 1', [visuals], mapX, 0);
        topLayer2 = map.createLayer('Tile Layer 2', [visuals], mapX, 0);
        botLayer.scale = tilemapScale;
        topLayer.scale = tilemapScale;
        botLayer2.scale = tilemapScale;
        topLayer2.scale = tilemapScale;
    
        // placing the assets
        playerShip = this.add.sprite(screenCenterX, arrowY, 'player').setOrigin(0.5,0.5);
        playerShip.scale = arrowScale;


        //setting the player to color red for the start
        playerShip.setFrame(0);
        playerShip.currentFrame = 0 

       

        //rendering the ship above the lane
        playerShip.setDepth('1');    

        //creating a bottom UI bar for the color indicator
        this.circleOutline = this.add.sprite(screenCenterX - (arrowDist/2), 936, 'UI_circle_outline').setOrigin(0.5, 0.5);
        this.circleOutline.setDepth('2');

        //this.add.rectangle(0, screenCenterY * 1.9,screenCenterX * 2 , screenCenterY / 3, "0xffffff").setOrigin(0.5, 0.5);
        this.redCircle = this.add.sprite(screenCenterX - (arrowDist/2), 935, 'UI_circle').setOrigin(0.5, 0.5);
        this.redCircle.setTint("0xCF1313");
        this.redCircle.setDepth('1');
        
        this.yellowCircle = this.add.sprite(screenCenterX, 935, 'UI_circle').setOrigin(0.5, 0.5);
        this.yellowCircle.setTint("0xeed456");
        this.yellowCircle.setDepth('1');

        this.blueCircle = this.add.sprite(screenCenterX + (arrowDist/2), 935, 'UI_circle').setOrigin(0.5, 0.5);
        this.blueCircle.setTint("0x1181D9");
        this.blueCircle.setDepth('1');

 
    }
    update(){

        //Tween movement to right lane with right arrow key 
        if (Phaser.Input.Keyboard.JustDown(keyRight)) {
            this.actionQueue.push("right");
        }

        if (Phaser.Input.Keyboard.JustDown(keyLeft)) {
            this.actionQueue.push("left");
        }

        if (Phaser.Input.Keyboard.JustDown(spaceBar)) {
            this.actionQueue.push("space");
        }

        var tileToCheckTop = topLayer.getTileAtWorldXY(playerShip.x, playerShip.y, true);
        var tileToCheckBot = botLayer.getTileAtWorldXY(playerShip.x, playerShip.y, true);
        
        
        
        // getting the tile under the player every frame
        if(tileToCheckTop != null) {
            console.log(tileToCheckTop.index);
        }  else if (tileToCheckBot != null) {
            console.log(tileToCheckBot.index);
        }  
         
        
        
        if (!this.transitioning && this.actionQueue.length > 0) {
            let action = this.actionQueue.shift();
            if (action == "space") {
                        
                if (playerShip.currentFrame == 0)
                {
                    console.log("Color switched to yellow");
                    //changes the frame of the spritesheet to blue
                    playerShip.setFrame(1);
                    playerShip.currentFrame = 1;
                    this.circleOutline.setPosition(screenCenterX, 936);
                } else if (playerShip.currentFrame == 1)
                {
                    console.log("Color switched to blue");
                    //changes the frame of the spritesheet to blue
                    playerShip.setFrame(2);
                    playerShip.currentFrame = 2;
                    this.circleOutline.setPosition(screenCenterX + (arrowDist/2), 935);
                } else if(playerShip.currentFrame == 2)
                {
                    console.log("Color switched to red");
                    //changes the frame of the spritesheet to blue
                    playerShip.setFrame(0);
                    playerShip.currentFrame = 0;
                    this.circleOutline.setPosition(screenCenterX - (arrowDist/2), 935);
                }
            }

            if(action == "right" && currentLane < 2){
                this.transitioning = true;

                this.add.tween({
                    targets: playerShip,
                    x : arrowMovementR,
                    duration: 200,
                    ease: 'Cubic',
                    onComplete: ()=> this.transitioning = false,
                })
                currentLane ++;
            }


            //Tween movement to left lane with left arrow key
            if(action == "left" && currentLane > 0){
                this.transitioning = true;

                this.add.tween({
                    targets: playerShip,
                    x : arrowMovementL,
                    duration: 200,
                    ease: 'Cubic',
                    onComplete: ()=> this.transitioning = false,
                })
                currentLane --;
            }
        }
        updateMap(travelDist, scrollSpeed);

        function updateMap(dist, speed) {
            let yPos =((8000 * tilemapScale) * -1) + dist;
            botLayer.setPosition(mapX, yPos);
            topLayer.setPosition(mapX, yPos);
            travelDist += speed;
            

            if (travelDist > 9400 * tilemapScale) {
                travelDist = 200;
                scrollSpeed += 1; //scrollSpeed values must be integers or else you get ghosting.
            }
            //console.log(travelDist);
        }
        //function mapSpawner(curMap,mapToLoad){
        //    if(curMap.y > 970){
                //console.log("spawned new map");
        //    }
    
        //}
        
    }
    

}
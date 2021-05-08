class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        
        //loading the assets   

        //this.load.image('lane1', './assets/lane.png');
        this.load.image('tiles', './assets/rybSpriteSheet.png');
        this.load.tilemapTiledJSON('map', './maps/testmap_2.json');
        this.load.tilemapTiledJSON('map1', './maps/map1.json');

        //switch this audio file to sound effect that plays when you move
        this.load.audio('move_sfx', './assets/testSound.wav')
        //switch this audio file to sound effect that plays when you cycle colors
        this.load.audio('cycle_sfx', './assets/testSound.wav')
        //switch this audio file to change background music
        this.load.audio('music_sfx', './assets/testMusic.mp3')

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
        this.sound.play('music_sfx');

        //declaring local variables
        this.transitioning = false;
        this.actionQueue = [];


        //Adding inputes to use
        spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //setting the background color to eggshell
        this.cameras.main.setBackgroundColor('#fbfbe3');
        

        //background testing 2
        map = this.add.tilemap('map');
        visuals = map.addTilesetImage('base', 'tiles'); //change "base" to "spritesheet" when we add the loading stuff update
        botLayer = map.createLayer('Tile Layer 1', [visuals], mapX, 0);
        topLayer = map.createLayer('Tile Layer 2', [visuals], mapX, 0);
        mapToRemove = map;

        //botLayer2 = map.createLayer('Tile Layer 1', [visuals], mapX, 0);
       // topLayer2 = map.createLayer('Tile Layer 2', [visuals], mapX, 0);
        botLayer.scale = tilemapScale;
        topLayer.scale = tilemapScale;
        //botLayer2.scale = tilemapScale;
        //topLayer2.scale = tilemapScale;
    
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
            this.sound.play('move_sfx');
        }

        if (Phaser.Input.Keyboard.JustDown(keyLeft)) {
            this.actionQueue.push("left");
            this.sound.play('move_sfx')
        }

        if (Phaser.Input.Keyboard.JustDown(spaceBar)) {
            mapSpawner(mapToRemove);
            this.actionQueue.push("space");
            this.sound.play('cycle_sfx')
        }

        var tileToCheckTop = topLayer.getTileAtWorldXY(playerShip.x, playerShip.y, true);
        var tileToCheckBot = botLayer.getTileAtWorldXY(playerShip.x, playerShip.y, true);

        
        function checkCollisions(topIndex, botIndex) {
            //decide relative x y of tile on sprite map based on index
            let tileOriginX = (Math.floor(topIndex % 5)) * 200; //finds the top left corner of the tile in question
            let tileOriginy = (Math.floor(topIndex / 5)) * 200;

            //determine ship location over tile
            if (inOrder == true) {
                let shipY = (Math.abs(map1Pos * (1 + tilemapScale))) % 200;
            } else {
                let shipY = (Math.abs(map2Pos * (1 + tilemapScale))) % 200;
            }
            console.log(shipY);

            let shipX = ((playerShip.x - mapX) * (1 + tilemapScale)) % 200;
            console.log(shipX);


            //get pixel color at location on spritesheet
            //compare do stuff with pixel color
                //if topLayer is null (0, 0, 0) check bottom layer
                    //if eggshell do nothing
                    //if barrier crash
                    //if red yellow or blue
                        //compare color to current color 
                        //if transition is fresh and color is same, do noting
                        //if transition is fresh and color is different, crash (after certin ammount of time)
                //set "has crashed" to true if crashed
        }


        // getting the tile under the player every frame
        if(tileToCheckTop != null) {
            //console.log(tileToCheckTop.index);


        }  else if (tileToCheckBot != null) {
            //console.log(tileToCheckBot.index);


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

        //getting the tile that the player is on every frame
        //var tileToCheckTop = topLayer.getTileAtWorldXY(playerShip.x, playerShip.y, true);
        //var tileToCheckTop = botLayer.getTileAtWorldXY(playerShip.x, playerShip.y, true);
        
        //console.log(tileToCheckTop.index);
        
        //var color1 = tileToCheck.texture.getPixel(10,10);
        //console.log(color1);


        // //obsolite recenter code
        // function recenter(lane) {
        //     switch(lane) {
        //         case 0:
        //             playerShip.setPosition(screenCenterX - arrowDist, arrowY);
        //             break;
        //         case 1:
        //             playerShip.setPosition(screenCenterX, arrowY);
        //             break;
        //         case 2:
        //             playerShip.setPosition(screenCenterX + arrowDist, arrowY);
        //     }
        // }
    
        
        updateMap(travelDist, scrollSpeed); //old updateMap function, here for testing mostly...

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
<<<<<<< HEAD
        //function mapSpawner(curMap,mapToLoad){
        //    if(curMap.y > 970){
                //console.log("spawned new map");
        //    }
    
        //}
        
        //Transition to gameover scene
        // if collision detected
        // this.scene.start('gameoverScene');
    }
    
=======
>>>>>>> 27ad56a8848e9f3b258518afcc06aec08b1fc2fb


        //new move map function, needs two maps to work (4 layers)
        //NOT TESTED YET
        //moveMap();

        function moveMap() {
            let map1current;
            let map2current;
            
            if (inOrder) {
                map1current = map1relative;// "relative" a constant used for spacing
                map2current = map2relative;
            } else {
                map1current = map2relative; //switches who's on top
                map2current = map1relative;
            }

            map1Pos = map1current + map1dist;
            map2Pos = map2current + map1dist;

            //detects if map needs resetting
            if (Math.abs(map1Pos) >= 0 && Math.abs(map1Pos) <= 50) {
                map2dist = 0 + map1Pos;
                inOrder = !inOrder;
                //CALL FUNCTION THAT SWAPS MAPS HERE
            }

            if (Math.abs(map2Pos) >= 0 && Math.abs(map2Pos) <= 50) {
                map1dist = 0 + map2Pos;
                inOrder = !inOrder;
                //CALL FUNCTION THAT SWAPS MAPS HERE
            }


            botLayer1.setPosition(mapX, map1Pos);
            topLayer1.setPosition(mapX, map1Pos);
            botLayer2.setPosition(mapX, map2Pos);
            topLayer2.setPosition(mapX, map2Pos);

            //step maps forward
            //if has crashed is false
            map1dist += scrollSpeed;
            map2dist += scrollSpeed;
        }

        function mapSpawner(currentMap){
            //map to change 
            console.log(mapToRemove);
            //creating a new map
            newMap = mapToRemove.scene.make.tilemap("map")
            console.log(newMap);
            //reomving map and adding the new map to the current map variable
            //currentMap.remove();
            mapToRemove = newMap;
            visualsNew = newMap.addTilesetImage('base', 'tiles'); 
            topLayerNew = newMap.createLayer(('Tile Layer 1', [visualsNew], mapX, 0));
            console.log(topLayerNew);
            botLayerNew = newMap.createLayer(('Tile Layer 2', [visualsNew], mapX, 1));
            //botLayerNew.scale = tilemapScale;
            //topLayerNew.scale = tilemapScale;
            console.log(mapToRemove);
            console.log(newMap);
            //currentMap.removeAllLayers();
        }
    }
   
}
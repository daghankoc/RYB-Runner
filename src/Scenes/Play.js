class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        
        //loading the assets   

        //loading tilemap assets
        this.load.image('tiles', './assets/rybSpriteSheet.png');

        //this.load.tilemapTiledJSON('map', './maps/testmap_2.json');
        //this.load.tilemapTiledJSON('map1', './maps/map1.json');

        //preload final maps.

            this.load.tilemapTiledJSON('easy1', './maps/maps_skill/easy1.json');
            this.load.tilemapTiledJSON('easy2', './maps/maps_skill/easy2.json');
            this.load.tilemapTiledJSON('easy3', './maps/maps_skill/easy3.json');

            this.load.tilemapTiledJSON('mid1', './maps/maps_skill/mid1.json');
            this.load.tilemapTiledJSON('mid2', './maps/maps_skill/mid2.json');
            this.load.tilemapTiledJSON('mid3', './maps/maps_skill/mid3.json');
            this.load.tilemapTiledJSON('mid4', './maps/maps_skill/mid4b.json');

            this.load.tilemapTiledJSON('hard1', './maps/maps_skill/hard1.json');
            this.load.tilemapTiledJSON('hard2', './maps/maps_skill/hard2.json');
            this.load.tilemapTiledJSON('hard3', './maps/maps_skill/hard3.json');
            this.load.tilemapTiledJSON('hard4', './maps/maps_skill/hard4.json');
            this.load.tilemapTiledJSON('hard5', './maps/maps_skill/hard5.json');
            this.load.tilemapTiledJSON('hard6', './maps/maps_skill/hard6.json');
            this.load.tilemapTiledJSON('hard7', './maps/maps_skill/hard7.json');


        //sound effect that plays when you move
        this.load.audio('move_sfx', './assets/testSound.wav')

        //sound effect that plays when you cycle colors
        this.load.audio('cycle_sfx', './assets/testSound.wav')

        //sound effect that plays when you cross into a new color zone (successfully)
        this.load.audio('transition_sfx', './assets/testSound.wav')

        //sound effect that plays when you pause or use a menu button
        this.load.audio('menu_sfx', './assets/testSound.wav')

        //sound effect that plays when you crash :(
        this.load.audio('menu_sfx', './assets/testSound.wav')

        //background music
        this.load.audio('music_sfx', './assets/testMusic.mp3')


        //load image assets
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
        //setting the background color to eggshell
        //this.cameras.main.setBackgroundColor('#fbfbe3');

        this.sound.play('music_sfx');

        //declaring local variables
        this.transitioning = false;
        this.actionQueue = [];
        this.pause = false;
        this.crash = false;


        //Adding inputes to use
        spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyPause = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        this.cameras.main.setAlpha(0);
        this.add.tween({
            targets: this.cameras.main,
            alpha: 1,
            duration: 1000,
        });

        //mapData array initialization, based on mapNames order
        for (let i = 0; i < mapNames.length; i++) {
            mapData.push(this.add.tilemap(mapNames[i]))
        }
        //console.log(mapData);
        
        //map1 intialization
        //map1 = this.add.tilemap('hard2');
        map1 = mapData[0];
        visuals1 = map1.addTilesetImage('spritesheet', 'tiles'); //change "base" to "spritesheet" when we add the loading stuff update
        botLayer1 = map1.createLayer('Tile Layer 1', [visuals1], mapX, map1relative);
        topLayer1 = map1.createLayer('Tile Layer 2', [visuals1], mapX, map1relative);
        botLayer1.scale = tilemapScale;
        topLayer1.scale = tilemapScale;

        // nextMap++; //incraments the map counter
        // if (nextMap >= mapNames.length) {
        //     nextMap = 8;
        // }

        //map2 initialization
        //map2 = this.add.tilemap('hard3');
        map2 = mapData[1];
        visuals2 = map2.addTilesetImage('spritesheet', 'tiles'); //change "base" to "spritesheet" when we add the loading stuff update
        botLayer2 = map2.createLayer('Tile Layer 1', [visuals2], mapX, map2relative);
        topLayer2 = map2.createLayer('Tile Layer 2', [visuals2], mapX, map2relative);
        botLayer2.scale = tilemapScale;
        topLayer2.scale = tilemapScale;

        



        //old map spawning code
        // map = this.add.tilemap('map');
        // visuals = map.addTilesetImage('base', 'tiles'); //change "base" to "spritesheet" when we add the loading stuff update
        // botLayer = map.createLayer('Tile Layer 1', [visuals], mapX, 0);
        // topLayer = map.createLayer('Tile Layer 2', [visuals], mapX, 0);
        mapToRemove = map1;

        // botLayer.scale = tilemapScale;
        // topLayer.scale = tilemapScale;
    
        // placing arrow asset
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

        // let shipX = ((playerShip.x - mapX) / tilemapScale);
        // console.log(shipX);

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
            //mapSpawner(mapToRemove);
            this.actionQueue.push("space");
            this.sound.play('cycle_sfx')
        }

        if (Phaser.Input.Keyboard.JustDown(keyPause)) { //pause button, needs menu?
            this.pause = !this.pause;
            this.sound.play('move_sfx');
        }
        
        
        if (!this.transitioning && this.actionQueue.length > 0) {
            let action = this.actionQueue.shift();
            if (action == "space") {
                if (playerShip.currentFrame == 0)
                {
                    //console.log("Color switched to yellow");
                    //changes the frame of the spritesheet to blue
                    playerShip.setFrame(1);
                    playerShip.currentFrame = 1;
                    this.circleOutline.setPosition(screenCenterX, 936);
                } else if (playerShip.currentFrame == 1)
                {
                    //console.log("Color switched to blue");
                    //changes the frame of the spritesheet to blue
                    playerShip.setFrame(2);
                    playerShip.currentFrame = 2;
                    this.circleOutline.setPosition(screenCenterX + (arrowDist/2), 935);
                } else if(playerShip.currentFrame == 2)
                {
                    //console.log("Color switched to red");
                    //changes the frame of the spritesheet to blue
                    playerShip.setFrame(0);
                    playerShip.currentFrame = 0;
                    this.circleOutline.setPosition(screenCenterX - (arrowDist/2), 935);
                }
            }

            //Tween movement to right lane with left arrow key
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
        
        function getTilemapRGB() {
            let tileY = 0;
            let tileX = 0;
            let selectedIndex = -1;
            let tileToCheckTop
            let tileToCheckBot
            let spriteSheetXY
            
            //determine ship location (y) over tileMap and then converts to tileY
            //also gather tile data

            if (Math.abs(map1Pos) <= (Math.abs(map1relative + arrowY)) && map1Pos < arrowY) {
                tileY = ((map1Pos / tilemapScale) + arrowHeight)% 200;
                tileY = Math.abs(Math.floor(tileY));

                tileToCheckTop = topLayer1.getTileAtWorldXY(playerShip.x, playerShip.y, true);
                tileToCheckBot = botLayer1.getTileAtWorldXY(playerShip.x, playerShip.y, true);
                //console.log('map1');
            }
            if (Math.abs(map2Pos) <= (Math.abs(map1relative + arrowY)) && map2Pos < arrowY) {
                tileY = ((map2Pos / tilemapScale) + arrowHeight)% 200;
                tileY = Math.abs(Math.floor(tileY));

                tileToCheckTop = topLayer2.getTileAtWorldXY(playerShip.x, playerShip.y, true);
                tileToCheckBot = botLayer2.getTileAtWorldXY(playerShip.x, playerShip.y, true);
                //console.log('map2');
            }
            
            //determines ship X value and then converts to tileX
            tileX = Math.floor(((playerShip.x - mapX) / tilemapScale)) % 200;

            // determine which layer to cook at (-1 is the index for no tile)

            //console.log(tileToCheckTop);
            //console.log(tileToCheckBot);

            if (tileToCheckTop != null) {
                    if (tileToCheckTop.index != -1) {
                    selectedIndex = tileToCheckTop.index;
                } else {
                    selectedIndex = tileToCheckBot.index;
                }
            } else {
                selectedIndex = -1;
            }
            console.log(selectedIndex);
            
            // if (selectedIndex != -1) {
            //     spriteSheetXY = indexToTileOrigin(selectedIndex)
            // }

            //console.log(spriteSheetXY);

            //get pixel color at determined location on spritesheet
            // if (spriteSheetXY == -1) {
            //     console.log("no tilesheet yet!");
            // } else {
            //     let color = game.scene.getScenes()[0].textures.getPixel((tileX + spriteSheetXY[0]), (tileY + spriteSheetXY[1]), 'tiles');
            //     console.log([color.r, color.g, color.b, color.a]);
            //     //return [color.r, color.g, color.b, color.a];
            // }
            
            
        }

        function indexToTileOrigin(index) {
            let originX = (Math.floor(index % 5)) * 200; //finds the top left corner of the tile in question (on the spritesheet)
            let originY = (Math.floor(index / 5)) * 200;
            return([originX, originY]);
        }

        function checkCollisions(rgba, playerColor) { // rgba[]
            //figure out what color just got passed with pixel color
                
                //if eggshell do nothing
                //if barrier crash
                //if red yellow or blue
                    //compare color to current color 
                    //if transition is fresh and color is same, do noting
                    //if transition is fresh and color is different, crash (after certin ammount of time)
                //set "crash" to true if crashed
        }
         
        
        //updateMap(travelDist, scrollSpeed); //old updateMap function, here for testing mostly...



        function moveMap() {
            map1Pos = map1dist;
            map2Pos = map2dist;

            if (map1Pos > game.config.height + 50) {
                map1dist = (map2dist + map1relative);
                //scrollSpeed++
                if (nextMap >= mapNames.length) {
                    nextMap = 8;
                }
                swapMap1(nextMap);
                nextMap++;
                //console.log(nextMap)
            }

            if (map2Pos > game.config.height + 50) {
                map2dist = (map1dist + map1relative);
                //scrollSpeed++
                if (nextMap >= mapNames.length) {
                    nextMap = 8;
                }
                swapMap2(nextMap)
                nextMap++
                //console.log(nextMap)
            }
        
            botLayer1.setPosition(mapX, map1Pos);
            topLayer1.setPosition(mapX, map1Pos);
            botLayer2.setPosition(mapX, map2Pos);
            topLayer2.setPosition(mapX, map2Pos);

            //step maps forward
            //if has crashed is false
            map1dist += scrollSpeed;
            map2dist += scrollSpeed;
            rawDist++;
        }


        //swap map functions, uses mapData array which is constructed in the create method.
        function swapMap1(index) {
            map1 = mapData[index];
            visuals1 = map1.addTilesetImage('spritesheet', 'tiles');
            botLayer1 = map1.createLayer('Tile Layer 1', [visuals1], mapX, map1relative);
            topLayer1 = map1.createLayer('Tile Layer 2', [visuals1], mapX, map1relative);
            botLayer1.scale = tilemapScale;
            topLayer1.scale = tilemapScale;
        }

        function swapMap2(index) {
            map2 = mapData[index];
            visuals2 = map2.addTilesetImage('spritesheet', 'tiles');
            botLayer2 = map2.createLayer('Tile Layer 1', [visuals2], mapX, map2relative);
            topLayer2 = map2.createLayer('Tile Layer 2', [visuals2], mapX, map2relative);
            botLayer2.scale = tilemapScale;
            topLayer2.scale = tilemapScale;
        }

        //run functions

        if (!this.pause) { //if the game is not paused...
            moveMap() //run moveMap fuction
        }

        //run tilemap RGB function
        getTilemapRGB();
    }
}
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

        //preload final maps. (CONVERT TO LOOP LATER)

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

        this.load.tilemapTiledJSON('indexTest', './maps/indexTesting.json');


        //sound effect that plays when you move
        this.load.audio('move_sfx', './assets/audio/testSound.wav')

        //sound effect that plays when you cycle colors
        this.load.audio('cycle_sfx', './assets/audio/testSound.wav')

        //sound effect that plays when you cross into a new color zone (successfully)
        this.load.audio('transition_sfx', './assets/audio/testSound.wav')

        //sound effect that plays when you pause or use a menu button
        this.load.audio('menu_sfx', './assets/audio/testSound.wav')

        //sound effect that plays when you crash :(
        this.load.audio('menu_sfx', './assets/audio/testSound.wav')

        //background music
        this.load.audio('music_sfx', './assets/audio/testMusic.mp3')


        //load image assets
        this.load.image('UI_circle','./assets/UI_circle.png');
        this.load.image('UI_circle_outline','./assets/UI_circle_outline.png');

        //load tutorial assets
        this.load.image('tutorial_move', "./assets/TutorialMove.png")
        this.load.image('tutorial_cycle', "./assets/TutorialCycle.png")
        this.load.image('tutorial_prepare', "./assets/TutorialPrepare.png")
        this.load.image('tutorial_prepare_text', "./assets/TutorialPrepareJustText.png")
        this.load.image('tutorial_barrier', "./assets/TutorialBarrier.png")

    
        //loading the different player colors as spritesheets
        //frame 1 = red, 2 = blue, 3 = yellow 
        this.load.spritesheet('player', "./assets/arrowRYB.png",{
            frameWidth: 112,
            frameHeight: 167,
        });

        this.load.spritesheet('redUI', "./assets/ui/dotsred.png",{
            frameWidth: 100,
            frameHeight: 100,
        });

        this.load.spritesheet('yellowUI', "./assets/ui/dotsyellow.png",{
            frameWidth: 100,
            frameHeight: 100,
        });

        this.load.spritesheet('blueUI', "./assets/ui/dotsblue.png",{
            frameWidth: 100,
            frameHeight: 100,
        });

        this.load.spritesheet('scoreUI', "./assets/ui/dotsscorealt.png",{
            frameWidth: 100,
            frameHeight: 100,
        });
    }
    
    
    create() {
        //setting the background color to eggshell
        //this.cameras.main.setBackgroundColor('#fbfbe3');

        //sets music to loop and plays it
        var music = this.sound.add('music_sfx');
        music.setLoop(true);
        music.play();

        //declaring local variables
        this.transitioning = false;
        this.actionQueue = [];
        this.pause = false;
        this.crashing = false;
        this.colorTransition = false;
        this.endofgame = false;
        this.curRed = 0;
        this.curColor = '';
        this.hitboxRGB;
        this.scores = [];
        this.currentScore;


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
        map2 = mapData[1];
        visuals2 = map2.addTilesetImage('spritesheet', 'tiles'); //change "base" to "spritesheet" when we add the loading stuff update
        botLayer2 = map2.createLayer('Tile Layer 1', [visuals2], mapX, map2relative);
        topLayer2 = map2.createLayer('Tile Layer 2', [visuals2], mapX, map2relative);
        botLayer2.scale = tilemapScale;
        topLayer2.scale = tilemapScale;

        // placing arrow asset
        playerShip = this.add.sprite(screenCenterX, arrowY, 'player').setOrigin(0.5,0.5);
        playerShip.scale = arrowScale;


        //setting the player to color red for the start
        playerShip.setFrame(0);
        playerShip.currentFrame = 0 


        //rendering the ship above the lane
        playerShip.setDepth('1');    

        //creating a bottom UI bar for the color indicator
        // this.circleOutline = this.add.sprite(screenCenterX - (arrowDist/2), 936, 'UI_circle_outline').setOrigin(0.5, 0.5);
        // this.circleOutline.setDepth('2');

        //color UI
        this.redCircle = this.add.sprite(screenCenterX - (arrowDist/2), 935, 'redUI').setOrigin(0.5, 0.5);
        //this.redCircle.setTint("0xCF1313");
        this.redCircle.setDepth('1');
        this.redCircle.scale = 0.3;
        this.redCircle.setFrame(1)
        
        this.yellowCircle = this.add.sprite(screenCenterX, 935, 'yellowUI').setOrigin(0.5, 0.5);
        //this.yellowCircle.setTint("0xeed456");
        this.yellowCircle.setDepth('1');
        this.yellowCircle.scale = 0.3;

        this.blueCircle = this.add.sprite(screenCenterX + (arrowDist/2), 935, 'blueUI').setOrigin(0.5, 0.5);
        //this.blueCircle.setTint("0x1181D9");
        this.blueCircle.setDepth('1');
        this.blueCircle.scale = 0.3;

        //score UI
        this.createScoreUI();

        
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
                    playerColor = 'yellow';
                    playerShip.setFrame(1);
                    playerShip.currentFrame = 1;
                    this.redCircle.setFrame(0);
                    this.yellowCircle.setFrame(1);
                } else if (playerShip.currentFrame == 1)
                {
                    //console.log("Color switched to blue");
                    //changes the frame of the spritesheet to blue
                    playerColor = 'blue';
                    playerShip.setFrame(2);
                    playerShip.currentFrame = 2;
                    this.yellowCircle.setFrame(0);
                    this.blueCircle.setFrame(1);
                } else if(playerShip.currentFrame == 2)
                {
                    //console.log("Color switched to red");
                    //changes the frame of the spritesheet to blue
                    playerColor = 'red';
                    playerShip.setFrame(0);
                    playerShip.currentFrame = 0;
                    this.blueCircle.setFrame(0);
                    this.redCircle.setFrame(1);
                }
            }
            if(laneNumber == 2){
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
                if(action == "left" && currentLane > 1){
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
            if(laneNumber == 3){
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
        }

        //run collision functions
        if (!this.pause) { //if the game is not paused...

            //update the score (if the score needs updating)
            if (scoreCount != this.currentScore) {
                this.updateScore(scoreCount);
                this.currentScore = scoreCount;
                //console.log("i am firing");
            }
            
            this.moveMap()
            // RGB of pixel under player (both layers) -1 mean no layer (#topLayer problems)
            this.hitboxRGB = this.getTilemapRGB();

            //determine the correct layer to test
            if (this.hitboxRGB[1][0] > 0) { //if red has no value in the top layer
                this.curRed = (this.hitboxRGB[1][0]); //top layer is selected
            } else {
                this.curRed = (this.hitboxRGB[0][0]); //otherwise, bottom layer is selected
            }

            //check collisions after converting Red value to a color string.
            this.checkCollisions(this.whatColor(this.curRed), playerColor);
        }
    }  //end of update method


    //-------------------------


    // function to figure out what color an RGB value is, This version only uses the R value.
    whatColor(redValue) {
        let color;
        switch (redValue) {
            case 206:
                color = "red";
                break;
              case 238:
                color = "yellow";
                break;
              case 50:
                color = "blue";
                break;
              case 251:
                color = "eggshell";
                break;
              case 20:
                color = "barrier";
                break;
              default:
                color = "n/a"
        }
        return color;
    }

    //getting the tile that the player is on every frame
    getTilemapRGB() {
        let tileY = 0;
        let tileX = 0;
        let selectedIndex = [-1, -1];
        let tileToCheckTop;
        let tileToCheckBot;
        let topLayerXY;
        let botLayerXY;
        let topRGB;
        let botRGB;
    
        //determine ship location (y) over tileMap and then converts to tileY
        //also gather tile data

        if (Math.abs(map1Pos) <= (Math.abs(map1relative + arrowY)) && map1Pos < arrowY) {
            tileY = ((map1Pos + map2relative - arrowHeight) / tilemapScale) % 200;
            tileY = Math.abs(Math.floor(tileY)); // weird shit with the positioning since map1 pos can be pos and neg.
            //console.log(tileY);

            tileToCheckTop = topLayer1.getTileAtWorldXY(playerShip.x, playerShip.y, true);
            tileToCheckBot = botLayer1.getTileAtWorldXY(playerShip.x, playerShip.y, true);

        }
        if (Math.abs(map2Pos) <= (Math.abs(map1relative + arrowY)) && map2Pos < arrowY) {
            tileY = ((map2Pos + map2relative - arrowHeight) / tilemapScale) % 200;
            tileY = Math.abs(Math.floor(tileY));

            tileToCheckTop = topLayer2.getTileAtWorldXY(playerShip.x, playerShip.y, true);
            tileToCheckBot = botLayer2.getTileAtWorldXY(playerShip.x, playerShip.y, true);
            //console.log(tileY);
        }
    
        //determines ship X value and then converts to tileX
        tileX = Math.floor(((playerShip.x - mapX) / tilemapScale)) % 200;

        //console.log(tileToCheckTop);
        //console.log(tileToCheckBot);

        //if a tilemap is loaded, pull the correct indexes.
        //otherwise just exit
        if (tileToCheckTop != null) {
                selectedIndex[0] = tileToCheckBot.index;
                selectedIndex[1] = tileToCheckTop.index;
            } else {
            selectedIndex[0, 1] = -1;
            return selectedIndex;
        }
        //console.log(selectedIndex[0]);
    
        //if top layer isn't empty, get the RGB at player location
        if (selectedIndex[1] != -1) {
            topLayerXY = this.indexToTileOrigin(selectedIndex[1], tileX, tileY);
            //console.log(topLayerXY);
            topRGB = this.getPixelRGB(topLayerXY);
        } else {
            topRGB = [-1, -1, -1, -1];
        }

        //if bottom layer isn't empty, get the RGB at player location
        if (selectedIndex[0] != -1) {
            botLayerXY = this.indexToTileOrigin(selectedIndex[0], tileX, tileY);
            botRGB = this.getPixelRGB(botLayerXY);
        } else {
            botRGB = [-1, -1, -1, -1];
        }

        //return RGB data (or lack thereof)
        return [botRGB, topRGB];
    }
    
    //function that converts a tilemap index to the origin point (in pixels) of that tile on the spritesheet.
    indexToTileOrigin(index, arrowX, arrowY) {
        let indexMinus1 = index - 1;
        if (index == -1) {
            return -1
        } else {
            let originX = (Math.floor((indexMinus1) % 5)) * 200; //finds the top left corner of the tile in question (on the spritesheet)
            let originY = ((indexMinus1 - (indexMinus1 % 5)) / 5) * 200;
            //console.log(index, originX, originY);
            return([originX + arrowX, originY + arrowY]);
        }
    }

    //function that gets the RGB value at a particular XY location on the spritesheet 'tiles'
    getPixelRGB(xy) {
        let color = game.scene.getScenes()[0].textures.getPixel(xy[0], xy[1], 'tiles');
            //console.log([color.r, color.g, color.b, color.a]);
            //console.log('RGB sum = ' + color.r + color.g + color.b);
        if (color != null) {
            return [color.r, color.g, color.b, color.a]; //actual RGB
            //return (color.r + color.g + color.b); //sum of RGB
        } else {
            return [-1, -1, -1, -1];
        }
            
    }
    
    checkCollisions(newTile, player) { 
        let oldTile = tileColor;
        if (oldTile != newTile) {
            this.colorTransition = true;
        } else {
            this.colorTransition = false;
        }

        if (this.colorTransition) {
            switch (newTile) {
                case 'red':
                    if (player != 'red') {
                        this.crashing = true;
                    } else {
                        console.log('safe red');
                    }
                    break;
                case 'yellow':
                    if (player != 'yellow') {
                        this.crashing = true;
                    } else {
                        console.log('safe yellow');
                    }
                    break;
                case 'blue':
                    if (player != 'blue') {
                        this.crashing = true;
                    } else {
                        console.log('safe blue');
                    }
                    break;
                case 'barrier':
                    this.crashing = true;
                    break;
                case 'eggshell':
                    console.log('safe eggshell');
                    break;
                default:
                    // nothing needs to be done
            }
        }
        if (this.crashing) { //if a crash has been detected
            console.log('crashed!');
            this.sound.play('move_sfx');
            this.pause = true;
            this.crashing = false;
        }
        tileColor = newTile;
    }
    
    moveMap() {
        map1Pos = map1dist;
        map2Pos = map2dist;
        
        
        if (map1Pos > game.config.height + 50) {
            map1dist = (map2dist + map1relative);
            //scrollSpeed++
            if (nextMap >= mapNames.length -1) {
                nextMap = mapNames.length -1;
            }
            this.swapMap1(nextMap);
            this.laneAddition(nextMap)
            nextMap++;
            //console.log(nextMap)
        }
    
        if (map2Pos > game.config.height + 50) {
            map2dist = (map1dist + map1relative);
            //scrollSpeed++
            if (nextMap >= mapNames.length -1) {
                nextMap = mapNames.length -1;
            }
            this.swapMap2(nextMap)
            this.laneAddition(nextMap)
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
        rawDist += scrollSpeed; //use this for the tutorial spacing

        scoreCount = Math.floor((rawDist / tilemapScale) / 200)

        //tutorial 
        //this.tutorialcycle = this.add.image(315, 600, 'tutorial_cycle')
        //this.tutorialcycle = this.add.image(800, 500, 'tutorial_cycle')
        if(rawDist == -300){
            let tutorialcycle = this.add.image(570, 550, 'tutorial_cycle')
            tutorialcycle.scale = 0.43
            this.tweens.add({
                targets: tutorialcycle,
                alpha: 0,
                duration: 7000,
                ease: 'cubic'
              }, this);
        }
        if(rawDist == 1650){
            let tutorialprepare = this.add.image(570, 550, 'tutorial_prepare')
            tutorialprepare.scale = 0.43
            this.tweens.add({
                targets: tutorialprepare,
                alpha: 0,
                duration: 7000,
                ease: 'cubic'
              }, this);
        }
        if(rawDist == 5600){
            let tutorialprepare = this.add.image(570, 550, 'tutorial_prepare')
            tutorialprepare.scale = 0.43
            this.tweens.add({
                targets: tutorialprepare,
                alpha: 0,
                duration: 7000,
                ease: 'cubic'
              }, this);
        }
        if(rawDist == 9400){
            let tutorialmove = this.add.image(570, 550, 'tutorial_move')
            tutorialmove.scale = 0.43
            this.tweens.add({
                targets: tutorialmove,
                alpha: 0,
                duration: 7000,
                ease: 'cubic'
              }, this);
        }
        if(rawDist == 28800){
            let tutorialbarrier = this.add.image(570, 550, 'tutorial_barrier')
            tutorialbarrier.scale = 0.43
            this.tweens.add({
                targets: tutorialbarrier,
                alpha: 0,
                duration: 7000,
                ease: 'cubic'
              }, this);
        }
        //console.log(rawDist)

        //console.log(scoreCount);
    }
    
    
    //swap map functions, uses mapData array which is constructed in the create method.
    swapMap1(index) {
        map1 = mapData[index];
        //visuals1 = map1.addTilesetImage('spritesheet', 'tiles');
        
        botLayer1.destroy();
        topLayer1.destroy();

        botLayer1 = map1.createLayer('Tile Layer 1', [visuals1], mapX, map1relative);
        topLayer1 = map1.createLayer('Tile Layer 2', [visuals1], mapX, map1relative);
        botLayer1.scale = tilemapScale;
        topLayer1.scale = tilemapScale;
    }
    
    swapMap2(index) {
        map2 = mapData[index];
        //visuals2 = map2.addTilesetImage('spritesheet', 'tiles');

        botLayer2.destroy();
        topLayer2.destroy();

        botLayer2 = map2.createLayer('Tile Layer 1', [visuals2], mapX, map2relative);
        topLayer2 = map2.createLayer('Tile Layer 2', [visuals2], mapX, map2relative);
        botLayer2.scale = tilemapScale;
        topLayer2.scale = tilemapScale;
    }

    //returns the (unsigned) binary data of a passed integer in 16 bits.
    scoreBinary(score) {
        if (score < 0) {
            return 0;
        }
        let outputArr = [];
        let num = score;
        while(outputArr.length < 16) {
            outputArr.push(num % 2);
            num = Math.floor(num/2);
        }
        //console.log(outputArr)
        return outputArr;
    }

    createScoreUI() {
        let i = 0;
        let posX = dotPaddingRight;
        let posY = dotPaddingTop;

        for (i = 1; i <= 16; i++) {
            if (i == 9) {
                posX -= dotHorizSpacing;
                posY = dotPaddingTop;
            }
            let score = this.add.sprite(posX, posY, 'scoreUI').setOrigin(0.5, 0.5);
            score.setDepth('1');
            score.scale = 0.3;
            score.setFrame(0);

            this.scores.push(score);

            posY += dotVertSpacing;
        }
    }

    updateScore(score) {
        let i = 0;
        let binaryData = this.scoreBinary(score);
        for (i = 0; i < 16; i++) {
            this.scores[i].setFrame(binaryData[i]);
        }
    }

    laneAddition(index){
        if(index >= secondLane && index < thirdLane - 1){
            laneNumber = 2;
        }  else if(index >= thirdLane){
            laneNumber = 3;
        }
    }
}
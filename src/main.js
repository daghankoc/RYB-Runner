var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    margin: 0,
    
    scene : Play,
    parent: 'phaser_canvas',
    //autoCenter: true,
};


let game = new Phaser.Game(config);

// reserving conrols
let spaceBar, keyLeft, keyRight;

// set Global variables
let playerShip = null;
let screenCenterY = game.config.height/2;
let screenCenterX = game.config.width/2;
let laneCount;
let isMoving = false;
let tilemapScale = 0.6;
let arrowScale = 0.5;
let arrowY = screenCenterY + (screenCenterY / 2);

let arrowDist = 200 * tilemapScale;
let arrowMovementR = '+=' + (200 * tilemapScale);
let arrowMovementL = '-=' + (200 * tilemapScale);

//current lane of the player to restrict its movement
let currentLane = 1;

let difficulty;
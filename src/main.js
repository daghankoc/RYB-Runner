var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    margin: 0,
    transparent: true,
    scene : [Menu, Play, Gameover],
    parent: 'phaser_canvas',
    //autoCenter: true,
};


let game = new Phaser.Game(config);

// reserving conrols
let spaceBar, keyLeft, keyRight, keyPause;

// set Global variables
let playerShip = null;
let newMap = null;
let visualsNew = null;
let botLayerNew = null;
let topLayerNew = null;
var mapToRemove = null;

let map1 = null;
let map2 = null;
let visuals1 = null;
let visuals2 = null;
let botLayer1 = null;
let topLayer1 = null;
let botLayer2 = null;
let topLayer2 = null;


// Screen Centers
const screenCenterY = game.config.height/2;
const screenCenterX = game.config.width/2;

//Size and Scale
const tilemapScale = 0.6;
const arrowScale = 0.5;

const mapX = screenCenterX - (tilemapScale * 300);


//Arrow Y pos
const arrowY = screenCenterY + (screenCenterY / 2); //720
const arrowHeight = game.config.height - arrowY; //240

//Arrow left right travel distance
const arrowDist = 200 * tilemapScale;
const arrowMovementR = '+=' + (200 * tilemapScale);
const arrowMovementL = '-=' + (200 * tilemapScale);

//map movement variables
let map1Pos = 0;
let map2Pos = 0;
const map1relative = ((8000 * tilemapScale) * -1);  //  -4800
const map2relative = ((8000 * tilemapScale) * -2);  //  -9600
let map1dist = map1relative;
let map2dist = map2relative;
let inOrder = true;


//total distance traveled
let travelDist = 0;
let rawDist = 0;
//scrolling rate (start)
let scrollSpeed = 4;

//current lane of the player to restrict its movement
let currentLane = 1;

let difficulty;
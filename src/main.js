var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    margin: 0,
    
    scene : [Menu, Play],
    parent: 'phaser_canvas',
    //autoCenter: true,
};


let game = new Phaser.Game(config);

// reserving conrols
let spaceBar, keyLeft, keyRight;

// set Global variables
let playerShip = null;
let map = null;
let newMap = null;
let visuals = null;
let visualsNew = null;
let botLayer = null;
let topLayer = null;
let botLayerNew = null;
let topLayerNew = null;
var mapToRemove = null;
// Screen Centers
const screenCenterY = game.config.height/2;
const screenCenterX = game.config.width/2;
//Size and Scale
const tilemapScale = 0.6;
const arrowScale = 0.5;
const mapX = screenCenterX - (tilemapScale * 300);

//map movement variables
let map1pos;
let map2pos;
const map1relative = ((8000 * tilemapScale) * -1);  //  -4800
const map2relative = ((8000 * tilemapScale) * -2);  //  -9600
let map1dist = 0;
let map2dist = 0;
let inOrder = true;


//total distance traveled
let travelDist = 0;
let totalDist = 0;
//scrolling rate (start)
let scrollSpeed = 4;



//Arrow Y pos
const arrowY = screenCenterY + (screenCenterY / 2);

//Arrow left right travel distance
const arrowDist = 200 * tilemapScale;
const arrowMovementR = '+=' + (200 * tilemapScale);
const arrowMovementL = '-=' + (200 * tilemapScale);

//current lane of the player to restrict its movement
let currentLane = 1;

let difficulty;
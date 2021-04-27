var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    
    scene : Play
    
};


let game = new Phaser.Game(config);

// reserving conrols
let spaceBar, keyLeft, keyRight;

// set Global variables
let playerShip = null;
let screenCenterY = game.config.height/2;
let screenCenterX = game.config.width/2;
let laneCount;
let difficulty;

//Block Prefab
class Block extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, texture, frame, type)
    {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.type = type;

        
    }
    update()
    {
        this.y += 0.25;
        if(this.y > game.config.y){
            Destroy();
        }
    }
    reset()
    {
        
    }
}
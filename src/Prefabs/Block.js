
//Block Prefab
class Block extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture, frame)
    {
        super(scene, x, y, texture, frame);
        scene.add.existing(this)
        scene.physics.world.enable(this);
        //this.type = type;
        
    }
    update()
    {
        this.y += 0.5;
    }
    reset()
    {
        
    }
}
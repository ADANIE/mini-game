
var Arrow = cc.Class({
    extends: cc.Component,

    properties: {
        attack: 10,
        speed: 100,
        position: cc.v2(0,0),
    },

    playattack () {
        this.anim.play('arrow-attack');
    },


    onLoad () {
        this.manager = cc.director.getCollisionManager();
        this.manager.enabled = true;
        this.anim = this.node.getComponent(cc.Animation);
    },


    onCollisionEnter (other, self) {
        this.anim.play("arrow-disappear");
        this.node.x += 100;
        this.arrowMove.stop();
        this.node.group="default";
        
    },
    onCollisionStay: function (other, self) {
        
    },
    onCollisionExit: function (other, self) {
        this.schedule(()=>{
            this.node.active = false;
        },0,0,2)
        
    },

    start () {
        this.playattack();
        this.schedule(()=>{
            this.node.x += 80;
            this.arrowMove = cc.tween(this.node)
            .by(1,{
                position: cc.v2(this.speed, 0),
            })
            .repeatForever()
            .start();
        }, 0, 0, 1.1);
    },

    update (dt) {

    },
});

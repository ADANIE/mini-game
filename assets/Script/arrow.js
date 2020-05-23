var Arrow = cc.Class({
    extends: cc.Component,

    properties: {
        attack: 10,
        speed: 100,
        roadLabel: 1,
        position: cc.v2(0,0),
    },

    init () {
        this.roadLabel = 1;
        this.node.setPosition(cc.v2(90, 95));
        this.node.opacity = 255;
        this.node.group = "arrow";
        this.playAttack();

    },
    playAttack () {
        this.anim.play('arrow-attack');
    },

    arrowMove () {
        this.move
        .by(1,{
            position: cc.v2(this.speed, 0),
        })
        .repeatForever()
        .start();
    },

    onAttacking () {
        this.anim.play("arrow-disappear");
        this.move.stop();
        this.node.group="default";
        
    },

    sendMessage(){
        let dieEvent = new cc.Event.EventCustom("arrow-recovery", true);
        this.node.dispatchEvent(dieEvent);
    },

    onLoad () {
        this.manager = cc.director.getCollisionManager();
        this.manager.enabled = true;
        this.anim = this.node.getComponent(cc.Animation);
        this.roadLabel = 1;
        this.move = cc.tween(this.node);
    },


    onCollisionEnter (other, self) {
        this.onAttacking();
    },
    onCollisionStay: function (other, self) {
        
    },
    onCollisionExit: function (other, self) {
        
    },

    start () {
        this.playAttack();
    },

    increaseattack (num) {
        this.attack+=num;
    },

    update (dt) {
        if (this.node.x == 1280) {
            this.sendMessage();
        }
    },
});



var Zombie = cc.Class({
    extends: cc.Component,

    properties: {
        hp: 30,
        defense: 1,
        attack: 3,
        speed: 10,
        dodge: 10,
        position: cc.v2(0,0),
    },


    init(){
        this.hp = 30;
        this.stopSignal = false;
    },

    propertiesGrow(times){
        this.hp += times * 20;
        this.defense += times * 2;
        this.attack += times * 2;
        this.dodge += times * 0.5;
    },

    zombieMove(){
        this.anim = this.node.getComponent(cc.Animation);
        this.anim.play("zombie-walk");

        this.move = cc.tween(this.node)
        .by(1, {
            position: cc.v2(-this.speed, 0),
        },{
            easing: 'sineOutIn'
        })
        .repeatForever()
        .start();

        

    },

    onAttacked(){
        this.anim.pause("zombie-walk");
        this.move.stop();

        let arrow = cc.find("Canvas/bow").getComponent("arrow");
        this.hp -= arrow.attack;
        this.node.x += 5*this.speed;
        

        if (this.hp <= 0) {
            this.onKilled();
        }
    },

    onKilled () {
        this.anim.stop("zombie-walk");
        this.move.stop();
        this.anim.play("zombie-die");
        this.hp = 0;
        let dieEvent = new cc.Event.EventCustom("zombie-die", true);
        this.node.dispatchEvent(dieEvent);
    },
    
    onLoad () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.init();
    },

    start () {
        this.zombieMove();
    },

    onCollisionEnter (other, self) {
        this.onAttacked();
    },
    onCollisionStay: function (other, self) {

    },

    onCollisionExit: function (other, self) {
        if(this.hp > 0){
            this.anim.resume("zombie-walk");
            this.move.start();
        }
        
    },

    update (dt) {
        if(!this.stopSignal){
            if(this.node.x <= -100){
                this.move.stop();
                this.anim.stop("zombie-walk");
                this.stopSignal = true;
            }
        }
    },
})

var Zombie = cc.Class({
    extends: cc.Component,

    properties: {
        hp: 30,
        defense: 1,
        attack: 3,
        speed: 50,
        dodge: 10,
        glod: 15,
        points: 30,
        roadLabel: 1,
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
        this.points += 20;
        this.glod += 10;
    },

    zombieMove(){
        this.anim.play("zombie-walk");

        this.move = cc.tween(this.node)
        .by(1, {
            position: cc.v2(-this.speed, 0),
        })
        .repeatForever()
        .start();

        

    },

    onAttacked(){
        this.anim.pause("zombie-walk");
        this.move.stop();
        let arrow = cc.find("Canvas/arrow").getComponent("arrow");
        this.hp -= arrow.attack;
        this.node.x += 100;
        
    },

    onKilled () {
        this.anim.stop("zombie-walk");
        this.move.stop();
        this.anim.play("zombie-die");
        this.hp = 0;
        let dieEvent = new cc.Event.EventCustom("zombie-die", true);
        this.node.dispatchEvent(dieEvent);
        let pointsNum = cc.find("Canvas/header/points/num").getComponent(cc.Label);
        let goldNum = cc.find("Canvas/header/gold/goldCount").getComponent(cc.Label);
        pointsNum.string = parseInt(pointsNum.string) +  this.points;
        goldNum.string = parseInt(goldNum.string)+ this.glod
    },
    
    onLoad () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.anim = this.node.getComponent(cc.Animation);
        this.init();
    },

    start () {
        this.zombieMove();
    },

    onCollisionEnter (other, self) {
        this.onAttacked();
    },
    onCollisionStay (other, self) {
        console.log("zombie stay");
    },

    onCollisionExit (other, self) {
        if(this.hp > 0){
            this.anim.resume("zombie-walk");
            this.zombieMove();
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
        if (this.hp <= 0) {
            this.onKilled();
        }
    },
})
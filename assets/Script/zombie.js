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
        this.node.width = 100;
        this.node.height = 150;
        this.roadLabel =  1;
        this.stopSignal = false;
        this.node.setPosition(cc.v2(1280, 50));
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

        this.move
        .by(1, {
            position: cc.v2(-this.speed, 0),
        })
        .repeatForever()
        .start();
    },

    onAttacked(){
        this.anim.pause("zombie-walk");
        this.move.stop();
        let arrow = cc.find("Canvas/road_"+ this.roadLabel + "/arrow").getComponent("arrow");
        if (arrow != null) {
            this.hp -= arrow.attack;
            this.move = cc.tween(this.node)
            .by(1,{
                position: cc.v2(100, 0),
            })
            .start();
            this.node.x += 100;
            if (this.hp <= 0) {
                this.onKilled();
            } else {
                this.anim.resume("zombie-walk");
                this.zombieMove();
            }
        }
        
    },

    onKilled () {
        this.anim.stop("zombie-walk");
        this.move.stop();
        this.anim.play("zombie-die");
        this.hp = 0;
        let pointsNum = cc.find("Canvas/header/points/num").getComponent(cc.Label);
        let goldNum = cc.find("Canvas/header/gold/goldCount").getComponent(cc.Label);
        pointsNum.string = parseInt(pointsNum.string) +  this.points;
        goldNum.string = parseInt(goldNum.string)+ this.glod;
    },

    sendRecoveryMessage () {
        let dieEvent = new cc.Event.EventCustom("zombie-die", true);
        this.node.dispatchEvent(dieEvent);
    },
    
    onLoad () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.anim = this.node.getComponent(cc.Animation);
        this.move = cc.tween(this.node);
        
    },

    start () {
        this.zombieMove();
    },

    onCollisionEnter (other, self) {
        this.onAttacked();
    },
    onCollisionStay (other, self) {
        
    },

    onCollisionExit (other, self) {
        
        
    },

    update (dt) {
        
    },
})

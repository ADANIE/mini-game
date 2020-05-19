

cc.Class({
    extends: cc.Component,

    properties: {
        hp: 100,
        defense: 1,
        attack: 3,
        speed: 10,
    },

    zombieMove(){
        this.move = cc.tween(this.node)
        .by(1, {
            position: cc.v2(-this.speed, 0),
        },{
            easing: 'sineOutIn'
        })
        .repeatForever()
        .start()
    },

    onLoad () {
        
    },

    start () {
        this.zombieMove();
    },
    update (dt) {
        console.log(this.node.x);
        if(this.node.x <= 100){
            this.move.stop();
        }
    },
})
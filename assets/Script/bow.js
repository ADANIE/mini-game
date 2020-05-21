
var Arrow = cc.Class({
    extends: cc.Component,

    properties: {

    },


    onLoad () {
        this.anim = this.node.getComponent(cc.Animation);
    },

    playattack () {
        this.anim.play('bow_attack');
    },


    start () {
        this.playattack();
    },

    update (dt) {},
});

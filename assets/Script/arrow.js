
var Arrow = cc.Class({
    extends: cc.Component,

    properties: {
        attack: 10,
        position: cc.v2(0,0),
    },


    onLoad () {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
    },


    onCollisionEnter (other, self) {

    },
    onCollisionStay: function (other, self) {
        
    },
    onCollisionExit: function (other, self) {
        
    },

    start () {

    },

    update (dt) {},
});

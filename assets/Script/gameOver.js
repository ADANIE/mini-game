

cc.Class({
    extends: cc.Component,

    properties: {

    },

    gameRestart(){
        cc.director.loadScene("game");
    },

    start () {
        cc.director.preloadScene("game");
    },

    update (dt) {},
});

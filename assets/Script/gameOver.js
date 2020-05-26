

cc.Class({
    extends: cc.Component,

    properties: {

    },

    gameRestart(){
        cc.director.loadScene("game");
    },

    start () {
        let score = cc.find("storeScore").getComponent("storeScore").score;
        cc.log(score);
        cc.director.preloadScene("game");
    },

    update (dt) {},
});

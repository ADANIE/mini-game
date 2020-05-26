

cc.Class({
    extends: cc.Component,

    properties: {

    },

    startGame () {
        cc.director.loadScene("game");
    },

    // onLoad () {},

    start () {
        cc.director.preloadScene('game')
    },

    // update (dt) {},
});

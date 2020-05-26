
cc.Class({
    extends: cc.Component,

    properties: {
       score : 0,
    },


    setScore (num) {
       this.score = num;
    },
     onLoad () {
        cc.game.addPersistRootNode(this.node);
     },
});


const ROADCOUNT = 3;
const MAXINTERVAL = 21;  // 45
const MININTERVAL = 20;   // 20

cc.Class({
    
    extends: cc.Component,

    properties: {
        zombiePrefab: cc.Prefab,
        gameOverNode: {
            default: null,
            type: cc.Node
        },
    },

    initPosition(){
        this.position = [];
        let x = (cc.winSize.width + 75)/2;
        let y = (cc.winSize.height - 100) / 2 - 275;
        for (let i = 0; i < ROADCOUNT ; ++i){
            this.position[i] = cc.v2(x,y); 
            y -= 160;
        }
    },

    init(){
        this.zombiePool = new cc.NodePool();
        let initCount = 50;
        for(let i = 0; i < initCount; ++i){
            let zombie = cc.instantiate(this.zombiePrefab);
            this.zombiePool.put(zombie);
        }
        this.initPosition();
        this.pause = false;
    },

    createZombie(parentNode, count){
        let apperRoad = [];
        for (let i = 0; i < ROADCOUNT; ++i) {
            apperRoad[i] = i;
        }
        for (let i = 0; i < ROADCOUNT/2; ++i) {
            var random = Math.floor(Math.random()*ROADCOUNT);
            let tmp = apperRoad[i];
            apperRoad[i] = apperRoad[random];
            apperRoad[random] = tmp;
        }
        let i = 0;
        this.schedule(()=>{
            let zombie = this.zombiePool.get();
            if (zombie == null){
                zombie = cc.instantiate(this.zombiePrefab);
            }
            zombie.parent = parentNode;
            zombie.getComponent("zombie").propertiesGrow(count);
            zombie.setPosition(this.position[apperRoad[i]]);
            i++;
        }, 1, ROADCOUNT-1, 0);
    },



    // create zombie by random interval
    CreateZomByRandInt () {
        let count = 0;
        let appearInterval = Math.floor(Math.random()*(MAXINTERVAL-MININTERVAL) + MININTERVAL);
        this.schedule(()=>{
            if (this.pause == true) {
                this.unscheduleAllCallbacks();
            }
            this.createZombie(this.node, count);
            appearInterval = Math.floor(Math.random()*(MAXINTERVAL-MININTERVAL) + MININTERVAL);
            count++;
        }, appearInterval, 1e+8, 1);
    },
    
    onLoad () {
        this.init();
        this.node.on("zombie-die", (event)=>{
            let anim = event.target.getComponent(cc.Animation);
            this.schedule(()=>{
                anim.stop("zombie-die");
                this.zombiePool.put(event.target);
            },0, 0, 2.5);
            event.stopPropagation();
        });
    },

    start () {
        this.CreateZomByRandInt();
    },

    update (dt) {

    },

    onDisabled(){
        this.node.off("zombie-die");
    },

    gameOver: function () {
        //show gameover label
        this.gameOverNode.active = true;
        //destroy all zombies and arrows
    },
});

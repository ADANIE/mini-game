

cc.Class({
    
    extends: cc.Component,

    properties: {
        zombiePrefab: cc.Prefab,
    },

    initPosition(){
        this.position = [];
        let x = (cc.winSize.width + 75)/2;
        let y = (cc.winSize.height - 100) / 2 - 200;
        let roadCount = 3;
        for (let i = 0; i < roadCount ; ++i){
            this.position[i] = cc.v2(x,y); 
            y -= 160;
        }
    },

    createZombie(parentNode){
        let roadCount = 3;
        let apperRoad = [];
        for (let i = 0; i < roadCount; ++i) {
            apperRoad[i] = i;
        }
        for (let i = 0; i < roadCount/2; ++i) {
            var random = Math.floor(Math.random()*roadCount);
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
            zombie.setPosition(this.position[apperRoad[i]]);
            i++;
        }, 1, roadCount-1, 1);
    },

    onZombieKilled(zombie){

    },

    onLoad () {
        this.zombiePool = new cc.NodePool();
        let initCount = 50;
        for(let i = 0; i < initCount; ++i){
            let zombie = cc.instantiate(this.zombiePrefab);
            this.zombiePool.put(zombie);
        }
        this.initPosition();
        this.pause = false;
        
    },
    start () {
        this.schedule(()=>{
            if (this.pause == true) {
                this.unscheduleAllCallbacks();
            }
            this.createZombie(this.node);
        }, 10, 1e+8, 1);
        
    },

    update (dt) {
        
    },
});

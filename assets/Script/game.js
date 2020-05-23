const ROADCOUNT = 3;
const MAXINTERVAL = 491;  // 45
const MININTERVAL = 400;   // 20

cc.Class({
    
    extends: cc.Component,

    properties: {
        zombiePrefab: cc.Prefab,
        gameOverNode: {
            default: null,
            type: cc.Node
        },
        bow1: cc.Node,
        bow2: cc.Node,
        bow3: cc.Node,
        arrowPrefab: cc.Prefab,
        attackspeed: 5,//用于控制射速
        //之后可以给每一个弓单独设置一个攻击速度，这样可以对每一个弓进行单独的升级射速的操作。
    },



    init(){
        this.zombiePool = new cc.NodePool();
        let initCount = 50;
        for(let i = 0; i < initCount; ++i){
            let zombie = cc.instantiate(this.zombiePrefab);
            this.zombiePool.put(zombie);
        }
        this.arrowPool = new cc.NodePool();
        for(let i = 0; i<initCount; ++i)
        {
            let arrow = cc.instantiate(this.arrowPrefab);
            this.arrowPool.put(arrow);
        }
        this.pause = false;
    },

    createZombie(count){
        let apperRoad = [];
        for (let i = 0; i < ROADCOUNT; ++i) {
            apperRoad[i] = i;
        }
        for (let i = 0; i < ROADCOUNT/2; ++i) {
            var random = Math.floor(Math.random()*ROADCOUNT);//0 or 1 or 2
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
            let roadNum = apperRoad[i] + 1;
            zombie.parent = cc.find("Canvas/road_"+roadNum);
            zombie.roadLabel = roadNum;
            zombie.getComponent("zombie").propertiesGrow(count);
            zombie.getComponent("zombie").init();
            i++;
        }, 1, ROADCOUNT-1, 0);
        this.roadHasZombie = true;
        this.startFindZombie = true;
    },


    createArrow()
    {
        for(let i = 0; i < ROADCOUNT; i++){
            let arrow = this.arrowPool.get();
            if (arrow == null){
                arrow = cc.instantiate(this.arrowPrefab);
            }
            let roadNum = i + 1;
            arrow.parent = cc.find("Canvas/road_" + roadNum);
            arrow.roadLabel = roadNum;
            arrow.getComponent("arrow").init();
            this.playBowAttack(roadNum); 
        } 
    },

    playBowAttack(roadNum){
        if (roadNum == 1) {
            this.bow1.getComponent("bow").playattack();
        } 
        else if (roadNum == 2) {
            this.bow2.getComponent("bow").playattack();
        }
        else if (roadNum == 3) {
            this.bow3.getComponent("bow").playattack();
        }
    },


    IncreaseAttackSpeed(num){
        //appearInterval变量控制射击间隔，它的倒数即为射速。
        //建议每次升级射速的幅度为1以下。
        let atkspd=1/this.attackspeed;
        atkspd+=num;
        this.attackspeed=1/atkspd; 
        //alert(atkspd);
        //alert(this.attackspeed);
        this.schedule(()=>{
            this.createArrow();
        }, this.attackspeed,1e8,0);
    },//提升攻击速度。传入参数num的单位为次/s，如0.5次/秒

    // create zombie by random interval
    createZomByRandInt () {
        let count = 0;
        let appearInterval = Math.floor(Math.random()*(MAXINTERVAL-MININTERVAL) + MININTERVAL);
        console.log("zombie appear");
        this.schedule(()=>{
            if (this.pause == true) {
                this.unscheduleAllCallbacks();
            }
            this.createZombie(count);
            appearInterval = Math.floor(Math.random()*(MAXINTERVAL-MININTERVAL) + MININTERVAL);
            count++;
        }, appearInterval, 1e+8, 1);
    },

    // 怪物死亡后，停止释放弓箭  
    // 有bug：unschedule并没有结束schedule的运行
    createArrowByTime() {
        console.log("arrow begin attacking")
        let arrowSchedule = this.schedule(()=> {
            if (!this.roadHasZombie) {
                this.unschedule(arrowSchedule);
                console.log("arrow stop attacking");
            }
            this.createArrow();
        }, this.attackspeed, 1e+8, 0);
    },

    // 检测所有路上有没有僵尸，有则射箭
    hasZombie () {
        if (this.roadHasZombie) {
            this.createArrowByTime();
        }
    },
    
    onLoad () {
        this.init();
        this.roadHasZombie = false;
        this.startFindZombie = false;           // 控制hasZombie方法开始
        this.node.on("zombie-die", (event)=>{
            //event.active = false;
            this.roadHasZombie = false;
            console.log("zombie has died");
            this.zombiePool.put(event.target);
            event.stopPropagation();
        });
        this.node.on("arrow-recovery", (event)=>{
            //console.log("arrow attacking zombie");
            this.arrowPool.put(event.target);
            event.stopPropagation();
        })
    },


    start () {
        this.createZomByRandInt();
        //this.createArrowByTime();
        //this.IncreaseAttackSpeed(0.1);
    },

    update (dt) {
        if (this.startFindZombie) {
            this.hasZombie();
            this.startFindZombie = false;
        }
        
    },

    onDisabled(){
        this.node.off("zombie-die");
        this.ndoe.off("arrow-recovery");
    },

    gameOver: function () {
        //show gameover label
        this.gameOverNode.active = true;
        //destroy all zombies and arrows
    },
});


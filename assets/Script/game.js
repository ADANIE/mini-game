
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
        bowPrefab: cc.Prefab,
        arrowPrefab: cc.Prefab,
        attackspeed: 5,//用于控制射速
        //之后可以给每一个弓单独设置一个攻击速度，这样可以对每一个弓进行单独的升级射速的操作。
        childNodes:[],
    },
    //三路僵尸的初始生成位置，横坐标和弓的初始位置相同
    initPosition(){
        this.position = [];
        let x = (cc.winSize.width + 75)/2;
        let y = (cc.winSize.height - 100) / 2 - 275;
        for (let i = 0; i < ROADCOUNT ; ++i){
            this.position[i] = cc.v2(x,y); 
            y -= 160;
        }
    },

    //箭的初始生成位置
    initarrowPosition(){
        this.arrowposition=[];
        let x=(cc.winSize.width - 375)/2;
        let y=(cc.winSize.height ) / 2 -250;
        for (let i = 0; i < ROADCOUNT ; ++i){
            this.arrowposition[i] = cc.v2(x,y); 
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
        this.initarrowPosition();
        this.arrowPool = new cc.NodePool();
        for(let i = 0; i<initCount; ++i)
        {
            let arrow = cc.instantiate(this.arrowPrefab);
            this.arrowPool.put(arrow);
        }
        this.pause = false;
    },

    createZombie(parentNode, count){
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

    CreateArrow(parentNode)
    {

        let apperRoad = [];
        for (let i = 0; i < ROADCOUNT; ++i) {
            apperRoad[i] = i;
            let arrow = this.arrowPool.get();
            if (arrow == null){
                arrow = cc.instantiate(this.arrowPrefab);
            }
            //alert(arrow);
            arrow.parent = parentNode;
            arrow.setPosition(this.arrowposition[apperRoad[i]]);
        }
    },//同时生成三条路的箭。

    DecoratorOfArrow()
    {
        this.CreateArrow(this.node);
    },//用于回调函数的参数传递。没有装饰器，回调参数无法将parentNode这一参数传入。

    IncreaseAttackSpeed(recallfuc,num){
        //appearInterval变量控制射击间隔，它的倒数即为射速。
        //建议每次升级射速的幅度为1以下。
        let atkspd=1/this.attackspeed;
        atkspd+=num;
        this.attackspeed=1/atkspd; 
        //alert(atkspd);
        //alert(this.attackspeed);
        //alert(recallfuc);
        this.schedule(recallfuc,this.attackspeed,1e8,0);
    },//提升攻击速度。传入参数num的单位为次/s，如0.5次/秒

    start () {
        //alert(this.childNodes);
        this.CreateZomByRandInt();
        let CreateArrowByTime=this.DecoratorOfArrow;
        this.schedule(CreateArrowByTime,this.attackspeed,1e8,0);
        this.IncreaseAttackSpeed(CreateArrowByTime,0.1);
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
        alert(this.node);
    },

});

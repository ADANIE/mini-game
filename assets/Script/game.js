const ROADCOUNT = 3
const MAXINTERVAL = 2 // 45
const MININTERVAL = 1 // 20

cc.Class({
  extends: cc.Component,

  properties: {
    zombiePrefab: cc.Prefab,
    gameOverNode: {
      default: null,
      type: cc.Node,
    },
    bow1: cc.Node,
    bow2: cc.Node,
    bow3: cc.Node,
    arrowPrefab: cc.Prefab,
  },

  onClickPauseGame() {
    cc.director.pause()
    cc.find('Canvas/gamePause').active = true
  },

  onClickResumeGame() {
    cc.director.resume()
    cc.find('Canvas/gamePause').active = false
  },

  init() {
    this.arrowCreateTimer = []
    this.arrowAttack = [10, 10, 10] // 每条路上箭矢的攻击力
    this.attackSpeed = [5, 5, 5] // 每条路上弓箭的攻击速度
    this.hitRate = [90, 90, 90] // 每条路上箭矢的命中率
    this.roadHasZombie = [false, false, false]
    this.startFindZombie = false // 控制hasZombie方法开始
    this.zombiePool = new cc.NodePool()
    let initCount = 50
    for (let i = 0; i < initCount; ++i) {
      let zombie = cc.instantiate(this.zombiePrefab)
      this.zombiePool.put(zombie)
    }
    this.arrowPool = new cc.NodePool()
    for (let i = 0; i < initCount; ++i) {
      let arrow = cc.instantiate(this.arrowPrefab)
      this.arrowPool.put(arrow)
    }
  },

  createZombie(count) {
    let apperRoad = []
    for (let i = 0; i < ROADCOUNT; ++i) {
      apperRoad[i] = i
    }
    for (let i = 0; i < ROADCOUNT / 2; ++i) {
      var random = Math.floor(Math.random() * ROADCOUNT) //0 or 1 or 2
      let tmp = apperRoad[i]
      apperRoad[i] = apperRoad[random]
      apperRoad[random] = tmp
    }
    let i = 0
    this.schedule(
      () => {
        let zombie = this.zombiePool.get()
        if (zombie == null) {
          zombie = cc.instantiate(this.zombiePrefab)
        }
        let roadNum = apperRoad[i] + 1
        let zombieJS = zombie.getComponent('zombie')
        zombieJS.init()
        this.roadHasZombie[roadNum - 1] = true
        zombie.parent = cc.find('Canvas/road_' + roadNum)
        zombieJS.roadLabel = roadNum
        zombieJS.propertiesGrow(count)

        i++
      },
      1,
      ROADCOUNT - 1,
      0
    )
  },

  // create zombie by random interval
  createZomByRandInt() {
    let count = 0
    let appearInterval = Math.floor(
      Math.random() * (MAXINTERVAL - MININTERVAL) + MININTERVAL
    )
    console.log('zombie appear')
    let tmp_count = 0;
    for (let i = 0; i < ROADCOUNT; i++) {
      if(this.roadHasZombie[i]){
        tmp_count ++;
      }
    }
    if (tmp_count == 0) {
      this.startFindZombie = true;
    }
    this.schedule(
      () => {
        if (this.pause == true) {
          this.unscheduleAllCallbacks()
        }
        this.createZombie(count)
        appearInterval = Math.floor(
          Math.random() * (MAXINTERVAL - MININTERVAL) + MININTERVAL
        )
        count++
      },
      appearInterval,
      1e8,
      1
    )
  },

  createArrow(roadNum) {
    let arrow = this.arrowPool.get()
    if (arrow == null) {
      arrow = cc.instantiate(this.arrowPrefab)
    }
    arrow.parent = cc.find('Canvas/road_' + roadNum)
    let arrowJS = arrow.getComponent('arrow')
    arrowJS.init()
    arrowJS.roadLabel = roadNum
    arrowJS.attack = this.arrowAttack[roadNum - 1]
    arrowJS.hitRate = this.hitRate[roadNum - 1]
    this.playBowAttack(roadNum)
  },

  playBowAttack(roadNum) {
    if (roadNum == 1) {
      this.bow1.getComponent('bow').playattack()
    } else if (roadNum == 2) {
      this.bow2.getComponent('bow').playattack()
    } else if (roadNum == 3) {
      this.bow3.getComponent('bow').playattack()
    }
  },

  // 怪物死亡后，停止释放弓箭
  createArrowByTime() {
    console.log('arrow begin attacking')
    for (let i = 0; i < 3; i++) {
      this.arrowCreateTimer[i] = setInterval(()=>{
        if (this.roadHasZombie[i]) {
          this.createArrow(i + 1)
        }
      }, this.attackSpeed[i]*1000);
    }
  },


  awakeLevelUpBtn (event, customEventData) {
    let levelUpBtn = cc.find("Canvas/road_" + customEventData + "/bow/levelup");
    let children = levelUpBtn.children;
    for (let i = 0; i < 3; i++) {
      children[i].active = true
      this.scheduleOnce(()=>{
        children[i].active = false;
      }, 5);
    }
  },

  attackcallback: function (event, customEventData) {
    //console.log(customEventData);
    this.IncreaseAttack(customEventData);
  },

  hitratecallback: function (event, customEventData) {
    //console.log(customEventData);
    this.Increasehitrate(customEventData);
  },

  Attackspeedcallback: function (event, customEventData) {
    //console.log(customEventData);
    this.IncreaseAttackSpeed(customEventData);
  },

  IncreaseAttack(roadLabel) {
    let goldNum = cc.find('Canvas/header/gold/goldCount').getComponent(cc.Label)
    let nowgold = parseInt(goldNum.string) - 100
    if (nowgold < 0) {
      return
    } //补充了一条限制，防止金钱不足的时候也进行升级
    goldNum.string = parseInt(goldNum.string) - 100
    this.arrowAttack[roadLabel - 1] += 10
  },

  Increasehitrate(roadLabel) {
    let goldNum = cc.find('Canvas/header/gold/goldCount').getComponent(cc.Label)
    let nowgold = parseInt(goldNum.string) - 100 //spend 100 gold to increase 2% hit_rate
    if (nowgold < 0) {
      return
    } //补充了一条限制，防止金钱不足的时候也进行升级
    this.hitRate[roadLabel - 1] += 2
    if (this.hitRate[roadLabel - 1] >= 150) {
      this.hitRate[roadLabel - 1] = 150
      return 
    }
    goldNum.string = parseInt(goldNum.string) - 100
  },

  IncreaseAttackSpeed(roadLabel) {
    //appearInterval变量控制射击间隔，它的倒数即为射速。
    //建议每次升级射速的幅度为1以下。
    let goldNum = cc.find('Canvas/header/gold/goldCount').getComponent(cc.Label)
    let nowgold = parseInt(goldNum.string) - 400 // spend 400 gold to decrease 0.5 appearInterval
    if (nowgold < 0) {
      return
    } //补充了一条限制，防止金钱不足的时候也进行升级
    this.attackSpeed[roadLabel - 1] -= 0.5
    if (this.attackSpeed[roadLabel - 1] <= 2) {
      this.attackSpeed[roadLabel - 1] = 2
      return
    }
    goldNum.string = parseInt(goldNum.string) - 400

    clearInterval(this.arrowCreateTimer[roadLabel - 1]);
    this.arrowCreateTimer[roadLabel - 1] = setInterval(()=>{
      if (this.roadHasZombie[roadLabel - 1]) {
        this.createArrow(roadLabel)
      }
    }, this.attackSpeed[roadLabel - 1]*1000);
  }, //提升攻击速度。传入参数num的单位为次/s，如0.5次/秒



  

  hasZombie (parent, num) {
    let zombie = parent.getChildByName("zombie");
    if (zombie == null) {
      this.roadHasZombie[num - 1] = fasle;
    }
  },
  onLoad() {
    this.init()
    this.node.on('zombie-die', (event) => {
      //event.active = false;
      let name = event.target.parent.name.toString()
      let num = name[name.length - 1]
      this.hasZombie(event.target.parent, num)
      this.zombiePool.put(event.target)
      event.stopPropagation()
    })
    this.node.on('arrow-recovery', (event) => {
      //console.log("arrow attacking zombie");
      this.arrowPool.put(event.target)
      event.stopPropagation()
    })
    this.node.on('game-over', (event) => {
      //console.log("arrow attacking zombie");
      this.gameOver();
    })
  },

  start() {
    cc.find('Canvas/road_1').getComponent(cc.Animation).play('road-appear')
    cc.find('Canvas/road_2').getComponent(cc.Animation).play('road-appear')
    cc.find('Canvas/road_3').getComponent(cc.Animation).play('road-appear')
    cc.find('Canvas/header').getComponent(cc.Animation).play('header-appear')
    this.createZomByRandInt()
  },

  update(dt) {
    if (this.startFindZombie) {
      this.createArrowByTime()
      this.startFindZombie = false;
    }

  },

  onDisabled() {
    this.node.off('zombie-die')
    this.ndoe.off('arrow-recovery')
    this.node.off('game-over');
  },

  gameOver() {
    cc.director.loadScene('gameOver')
  },
})
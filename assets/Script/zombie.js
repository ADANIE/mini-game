var Zombie = cc.Class({
  extends: cc.Component,

  properties: {
    hp: 30,
    defense: 1,
    attack: 3,
    speed: 50,
    dodge: 10, // 怪物自身闪避率
    gold: 15,
    points: 30,
    roadLabel: 1,
    position: cc.v2(0, 0),
  },

  init() {
    this.hp = 30
    this.node.width = 100
    this.node.height = 150
    this.roadLabel = 1
    this.stopSignal = false
    this.node.setPosition(cc.v2(1280, 50))
  },

  propertiesGrow(times) {
    this.hp += times * 4
    this.defense += times * 0.4
    this.attack += times * 0.4
    this.dodge += times * 0.1
    this.points += 4
    this.gold += 2
  },

  zombieMove() {
    this.anim.play('zombie-walk')

    this.move
      .by(1, {
        position: cc.v2(-this.speed, 0),
      })
      .repeatForever()
      .start()
  },

  isHit() {
    let arrow = cc
      .find('Canvas/road_' + this.roadLabel + '/arrow')
      .getComponent('arrow')
    let hitRate = arrow.hitRate
    let num = Math.floor(Math.random() * 100 + 1) // 1 to 100
    if (num <= hitRate - this.dodge) {
      this.onAttacked(arrow)
    }
  },
  onAttacked(arrow) {
    this.anim.pause('zombie-walk')
    this.move.stop()
    if (arrow != null) {
      this.hp -= arrow.attack
      this.move = cc
        .tween(this.node)
        .by(1, {
          position: cc.v2(100, 0),
        })
        .start()
      if ((this.node.x + 100) >= 1080) {
        this.node.x = 1080
      } else {
        this.node.x += 100
      }
      if (this.hp <= 0) {
        this.onKilled()
      } else {
        this.anim.resume('zombie-walk')
        this.zombieMove()
      }
    }
  },

  onKilled() {
    this.anim.stop('zombie-walk')
    this.move.stop()
    this.anim.play('zombie-die')
    this.hp = 0
    let pointsNum = cc.find('Canvas/header/points/num').getComponent(cc.Label)
    let goldNum = cc.find('Canvas/header/gold/goldCount').getComponent(cc.Label)
    let storeScore = cc.find('storeScore').getComponent('storeScore')
    pointsNum.string = parseInt(pointsNum.string) + this.points
    goldNum.string = parseInt(goldNum.string) + this.gold
    storeScore.setScore(parseInt(pointsNum.string))
  },

  sendRecoveryMessage() {
    let dieEvent = new cc.Event.EventCustom('zombie-die', true)
    this.node.dispatchEvent(dieEvent)
  },

  sendGameOverMsg () {
    let dieEvent = new cc.Event.EventCustom('game-over', true)
    this.node.dispatchEvent(dieEvent)
  },

  onLoad() {
    var manager = cc.director.getCollisionManager()
    manager.enabled = true
    this.anim = this.node.getComponent(cc.Animation)
    this.move = cc.tween(this.node)
  },

  start() {
    this.zombieMove()
  },

  onCollisionEnter(other, self) {
    this.isHit()
  },
  onCollisionStay(other, self) {},

  onCollisionExit(other, self) {},

  update(dt) {
    if (this.node.x <= -120) {
      this.sendGameOverMsg()
    }
  },
})
/* global $, baike */
/* global LStageScaleMode, LSystem, LStage, LSprite, LLoadManage, LTweenLite, LEasing, LMouseEvent, LTextFieldType, LTextField */
/* global init, base, addChild */
import LGlobal from 'src/libs/lufylegend-1.10.1.min.js'

export default {
  data () {
    return {
      mapName: `${decodeURIComponent(baike.query('name'))}`,
      mapDesc: '知识图谱可以让你以任意一个熟悉/关注点出发，查看到相关的专业内容。',
      mapChildren: {
        name: '钼靶',
        desc: '钼靶是乳腺筛查的方法之一，检查时间尽量在经期后一周，检查会有假阴性，检查时需要乳房平摊，会有不同程度的疼痛。'
      },
      showMother: false,
      showChild: false,
      showOld: false,
      showCurrent: false,
      hideCurrent: false,
      showNew: false,
      restoreNew: false,
      restoreCurrent: false,
      aniCurrent: false,
      aniNew: false,
      fetchingData: false,
      showMask: false
    }
  },
  components: {
  },
  watch: {
    mapChildren: function (val, oldVal) {
      this.mapChildren.oldName = oldVal.name
      this.mapChildren.oldDesc = oldVal.desc
    }
  },
  activated () {
    // 单页缓存分享数据重置
    this.setShare(this.shareCache)
  },
  created: function () {
    this.setShare({
      title: '企鹅医典医学团队'
    })
  },
  mounted: function () {
    this.initCanvas()
    this.bind()
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    /**
     * 打乱周围小圆的位置，并确保两个权重较大的不会相邻
     * @param  Array array 需要打乱的小圆数组列表
     * @param String except1  需要排除的疾病名称1
     * @param String except2  需要排除的疾病名称2
     */
    shuffleArray: function (array, except1, except2) {
      var len = array.length
      var randomIndex
      var newArr = []
      var temp = []
      for (var i = 0; i < len; i++) {
        randomIndex = Math.floor(Math.random() * array.length)
        var item = array.splice(randomIndex, 1)[0]

        if ((except1 && item.name === except1) || (except2 && item.name === except2)) {
          // continue;
        } else {
          if (i < len - 1 && newArr.length && newArr[newArr.length - 1].weight > 50 && item.weight > 50) {
            temp.push(item)
          } else {
            if (temp.length) {
              newArr.push(item, temp.splice(0, 1)[0])
            } else {
              newArr.push(item)
            }
          }
        }
      }
      return newArr
    },
    initCanvas: function () {
      var that = this
      var backLayer
      // var loadingLayer
      var startLayer

      var globalCenterX = LGlobal.width / 2
      var globalCenterY = 0
      var currentChildren = []
      var currentCenter = null
      // var currentPrevious = null
      var maxSize = 1
      var cH = document.body.clientHeight || document.documentElement.clientHeight
      var cW = document.documentElement.clientWidth || document.body.clientWidth
      /**
        初始化canvas画布，将其狂傲设置为和手机宽高一致，调用main函数进行初始化设置
       */
      init(window.requestAnimationFrame, 'mylegend', 750, 750 * cH / cW, main)

      function main () {
        LGlobal.preventDefault = false
        LGlobal.stageScale = LStageScaleMode.SHOW_ALL // 自动适配屏幕展示所有内容
        LSystem.screen(LStage.FULL_SCREEN)
        backLayer = new LSprite() // new LSprite()相当于新建一个图层，这里是背景图层
        backLayer.graphics.drawRect(1, '#FFF', [0, 0, LGlobal.width,
          LGlobal.height
        ], true, '#fff') // 画一个出白色背景
        addChild(backLayer)

        // 这里是设置loading界面的函数，因为没有设计所以留空
        LLoadManage.load([], function (progress) {
          // loadingLayer.setProgress(progress);

        }, gameInit)
      }

      function gameInit (result) {
        // var gingerObj
        // var cloudObj
        startLayer = new LSprite()
        // var imglist = result
        // backLayer.removeChild(loadingLayer);
        // loadingLayer = null
        // bitmap.scaleY = LGlobal.height / bitmap.getHeight();
        // startLayer.addChild(bitmap);
        globalCenterX = LGlobal.width / 2
        globalCenterY = LGlobal.height / 2 - 120
        startLayer.rotatex = globalCenterX
        startLayer.rotatey = globalCenterY // 这里设置了中间大圆的圆心位置

        that.getDiseaseKnowGraphInfo({
          name: decodeURIComponent(baike.query('name')),
          tag: decodeURIComponent(baike.query('name'))
        }, function (o) {
          initPanel(buildTrees({
            name: decodeURIComponent(baike.query('name')),
            tips: /* o.trunks[0].desc || */ null
          }, that.shuffleArray([].concat(o.trunks))))
        }) // 调用家口获取子节点疾病信息，将其信息作为首次进入的面板数据

        backLayer.addChild(startLayer) // 添加初始化后的面板图层到背景图层中
      }

      function buildTrees (mother, children) {
        mother.children = children || []
        return mother
      }

      function initPanel (mother, previousCircle) {
        /* eslint-disable new-cap */
        var centerC = new cirlcleItem(globalCenterX, globalCenterY, 140, '#00be8b', null, 0, mother) // 140是大圆半径
        var avAngle = 360 / mother.children.length
        // var ax = centerC.x + Math.cos(avAngle * Math.PI / 180) * 55 * 4,
        //  ay = centerC.y + Math.sin(avAngle * Math.PI / 180) * 55 * 4;
        // var len = mother.children.length
        var startAng = 0
        var avGap = 0
        var i = 0
        var radius = 0
        currentChildren = []
        maxSize = 50
        // 如果不是首次进入的面板（存在上一层级），则初始位置特殊处理
        if (previousCircle) {
          avAngle = 360 / (mother.children.length + 1)
          startAng = 240 + avAngle
        }
        // 求出子节点权重最大值
        if (mother.children && mother.children.length) {
          for (i = 0; i < mother.children.length; i++) {
            if (maxSize < mother.children[i].weight) {
              maxSize = mother.children[i].weight
            }
          }
        }
        // 不同权重的圆半径不同，然后根据所有圆的切线角相加求出让他们不会相交的最优间隔
        for (i = 0; i < mother.children.length; i++) {
          radius = 64 * Number('1.' + mother.children[i].weight.toString())
          // 两种权重的小圆半径分别是64和95,85目前已经取消没用
          if (mother.children[i].weight <= 50) {
            radius = 64
          } else if (mother.children[i].weight === 2) {
            radius = 85
          } else if (mother.children[i].weight === 100) {
            radius = 95
          }
          avGap += Math.asin(radius / (140 + 43 + radius)) * (180 / Math.PI) * 2 // 43是周围小圆的边到中心大圆的边的距离，140是大圆半径
        }

        if (mother.children.length > 0) {
          avGap = (360 - avGap) / mother.children.length
          if (previousCircle) {
            avGap = (360 - avGap) / (mother.children.length + 1)

            startAng = (mother.children.length > 1 ? 240 : 0) + avGap
          }
        }
        // 将各个小圆平均分配到对应的位置去，默认以大圆水平右侧作为起点顺时针旋转
        for (i = 0; i < mother.children.length; i++) {
          radius = 64 * Number('1.' + mother.children[i].weight.toString())
          var radiusNext = 0
          var thisGap = 0
          var nextGap = 0
          if (mother.children[i].weight <= 50) {
            radius = 64
          } else if (mother.children[i].weight === 2) {
            radius = 85
          } else if (mother.children[i].weight === 100) {
            radius = 95
          }
          thisGap = Math.asin(radius / (140 + 43 + radius)) * (180 / Math.PI)
          if (i < mother.children.length - 1) {
            if (mother.children[i + 1].weight <= 50) {
              radiusNext = 64
            } else if (mother.children[i + 1].weight === 2) {
              radiusNext = 85
            } else if (mother.children[i + 1].weight === 100) {
              radiusNext = 95
            }
            nextGap = Math.asin(radiusNext / (140 + 43 + radiusNext)) * (180 / Math.PI)
          }

          var ax = centerC.x + Math.cos((startAng) * Math.PI / 180) * (140 + 43 + radius)
          var ay = centerC.y + Math.sin((startAng) * Math.PI / 180) * (140 + 43 + radius)
          var angle = startAng - 50

          if (previousCircle) {
            startAng = startAng + avAngle
          } else {
            startAng = startAng + thisGap + nextGap + avGap
          }

          var c = new cirlcleItem(ax, ay, radius, mother.children[i].weight > 50 ? '#fbb2ac' : '#63d6b7', centerC, i + 1, mother.children[i], angle)
          startLayer.addChild(c)
          currentChildren.push(c)
        }
        centerC.data.children = currentChildren // 将子节点数据赋值给中心大圆

        currentCenter = centerC
        if (previousCircle) {
          currentCenter.previousCircle = previousCircle
        }
        startLayer.addChild(centerC)
      }
      /**
       * 新建一个圆的实例
       * @param  Number x 圆的圆心坐标x
       * @param Number y  圆的圆心坐标y
       * @param Number r  圆的半径
       * @param String color  圆的颜色
       * @param Object oc  圆的母节点，即他的大圆，只有小圆才有这个参数
       * @param Number id  圆的id，小圆才有
       * @param Object data  圆的节点数据
       * @param Number angle  圆相对于大圆的初始角度
       */
      function cirlcleItem (x, y, r, color, oc, id, data, angle) {
        base(this, LSprite, [])
        var self = this
        // var i = 0
        self.id = id
        self.x = x || 0
        self.y = y || 0
        self.r = r || 100
        self.scaleX = self.scaleY = 0.8
        self.data = data
        self.isPrevious = false
        self.maxSize = 1
        self.multiLine = false
        self.angle = angle

        self.progress = 0
        if (oc) {
          self.y = oc.y
          self.x = oc.x
          // self.rotatex = 0
          // self.rotatey = 0
          self.currentMother = false
        } else {
          self.currentMother = true
        }
        self.color = color || '#fff'

        if (!oc) { // 如果没有oc参数说明是大圆，大圆会直接渲染出来，小圆会从中间慢慢伸展出来
          // setTimeout(function(){
          self.graphics.drawArc(1, self.color, [0, 0, self.r, 0, 2 * Math.PI], true, self.color)
          // },200)
        }

        // 每个圆放大的动画
        self.scale = function (s) {
          self.tween = LTweenLite.to(self, 0.3, {
            ease: LEasing.Circ.easeOut,

            scaleX: s || 1,
            scaleY: s || 1,
            delay: 0,
            loop: false,
            onStart: function (e) {
              if (e.currentMother) {
                that.hideCurrent = false

                if (self.previousCircle) {
                  that.showMother = false
                  that.showChild = true
                  // that.aniCurrent = true;
                  // that.aniNew = true;
                } else {
                  that.showMother = true
                  that.showChild = false
                }
              }
            },
            onUpdate: function (e) {
            },
            onComplete: function (e) {

            }
          })
        }
        // 每个圆从中间向外移动的动画
        self.move = function () {
          self.tween = LTweenLite.to(self, 0.3, {
            ease: LEasing.Cubic.easeOut,
            progress: 1000,
            // x: x,
            // y: y,
            delay: 0,
            loop: false,
            onStart: function (e) {
              self.scale(1)
            },
            onUpdate: function (e) {
              // 应设计要求，小圆伸展出来后还有缓慢移动的效果，每次移动0.01度
              var nx = globalCenterX + Math.cos((e.angle += 0.4) * Math.PI / 180) * (e.progress / 1000 * (140 + 43 + self.r))
              var ny = globalCenterY + Math.sin((e.angle += 0.4) * Math.PI / 180) * (e.progress / 1000 * (140 + 43 + self.r))
              e.x = nx
              e.y = ny
              // 每次渲染完动画吧上次的图案清除掉，避免卡顿和性能问题
              self.graphics.clear()
              // if (oc.previousCircle) {
              self.graphics.drawLine(0.5, '#3fc8c9', [0, 0, oc.x - self.x, oc.y - self.y])
              // }
              // console.log(self.data.name, 140 + 43 + self.r, Math.sqrt(Math.pow(oc.x - self.x, 2) + Math.pow(oc.y - self.y, 2)))
              self.graphics.drawArc(1, self.color, [0, 0, self.r, 0, 2 * Math.PI], true, self.color)
            },
            onComplete: function (e) {
            }
          }).to(self, 20, {
            ease: LEasing.Circ.easeOut,
            // x: x,
            // y: y,
            scaleX: 1,
            scaleY: 1,
            delay: 0,
            loop: false,
            onStart: function (e) {

            },
            onUpdate: function (e) {
              // 应设计要求，小圆伸展出来后还有缓慢移动的效果，每次移动0.01度
              var nx = globalCenterX + Math.cos((self.angle += 0.01) * Math.PI / 180) * (140 + 43 + self.r)
              var ny = globalCenterY + Math.sin((self.angle += 0.01) * Math.PI / 180) * (140 + 43 + self.r)
              self.x = nx
              self.y = ny
              // 每次渲染完动画吧上次的图案清除掉，避免卡顿和性能问题
              self.graphics.clear()
              // if (oc.previousCircle) {
              self.graphics.drawLine(0.5, '#3fc8c9', [0, 0, oc.x - self.x, oc.y - self.y])
              // }

              self.graphics.drawArc(1, self.color, [0, 0, self.r, 0, 2 * Math.PI], true, self.color)
            },
            onComplete: function (e) {

            }
          })
        }
        //  每个圆的点击事件处理
        self.addEventListener(LMouseEvent.MOUSE_DOWN, function () {
          var i = 0
          if (self.inerval) {
            clearInterval(self.inerval)
          }
          if (oc) {
            self.previousCircle = oc
            for (i = oc.childList.length - 1; i >= 0; i--) {
              if (oc.childList[i].inerval) {
                clearInterval(oc.childList[i].inerval)
              }
            }
          }
          if (self.currentMother && !self.isPrevious && self.previousCircle) { // 点击中间大圆
            $('.more-articles').click()
          }
          if (!self.isPrevious && !self.currentMother && !that.fetchingData) { // 点击小圆
            that.fetchingData = true
            that.showMother = false
            that.showChild = false
            // that.hideCurrent = true;
            // that.showNew = true;
            // that.restoreNew = true;

            if (currentCenter && currentCenter.previousCircle) {
              LTweenLite.to(currentCenter.previousCircle, 0.4, {

                ease: LEasing.Circ.easeOut,
                x: currentCenter.previousCircle.x - 500,
                y: currentCenter.previousCircle.y - 500,
                scaleX: 1,
                scaleY: 1,
                loop: false,
                onUpdate: function (e) {
                },
                onComplete: function (e) {
                }
              }

              )
            }

            LTweenLite.to(oc, 0.3, {
              ease: LEasing.Circ.easeOut,
              x: 0,
              y: 0,
              scaleX: 1,
              scaleY: 1,
              loop: false,
              onUpdate: function (e) {
              },
              onComplete: function (e) {
                // 调整文字自动换行及超出省略号，因为不支持css的样式设置所以只能通过js循环递归实现
                function fittingString (str, maxWidth, multiY, oc, isdesc) {
                  var theTextField = new LTextField()
                  // var descTextField = new LTextField()
                  theTextField.setType(LTextFieldType.DYNAMIC, e)
                  theTextField.textAlign = 'left'
                  theTextField.text = str
                  var size = 28
                  // if (oc) {
                  //  size = 28;
                  // } else {
                  //  size = 42;
                  // }
                  theTextField.size = size
                  theTextField.color = 'white'
                  theTextField.width = e.r * 0.8
                  theTextField.x = 20
                  theTextField.y = multiY + 20 || 20
                  var width = theTextField.getWidth()
                  e.addChild(theTextField)

                  if (multiY) {
                    if (e.descTextField) {
                      e.descTextField.remove()
                    }
                    var ellipsis = new LTextField()
                    ellipsis.setType(LTextFieldType.DYNAMIC, self)
                    ellipsis.text = '…'
                    ellipsis.size = size
                    var ellipsisWidth = ellipsis.getWidth()
                    if (width <= maxWidth || width <= ellipsisWidth) {
                      // return theTextField.text;
                      // self.addChild(descTextField);
                    } else {
                      var len = str.length
                      while (width >= maxWidth - ellipsisWidth && len-- > 0) {
                        var substr1 = str.substring(0, len)
                        var substr2 = str.substring(len)
                        theTextField.text = substr1 + ellipsis.text
                        width = theTextField.getWidth()
                      }
                    }
                    e.multiLine = true
                    //
                    // return theTextField.text;
                  } else {
                    if (width <= maxWidth) {
                      // self.addChild(descTextField);
                      // return theTextField.text;

                    } else {
                      len = str.length
                      while (width >= maxWidth && len-- > 0) {
                        substr1 = str.substring(0, len)
                        substr2 = str.substring(len)
                        theTextField.text = substr1
                        width = theTextField.getWidth()
                      }

                      if (!multiY) {
                        // 乘以1.7表示比直径稍短一点，为了给两边留间距，因为直径是乘以2
                        if (oc) {
                          fittingString(substr2, r * 1.7, 0 + theTextField.getHeight(), oc)
                        } else {
                          fittingString(substr2, r * 1.7, 0 + theTextField.getHeight())
                        }
                      }
                    }
                  }
                }
                oc.graphics.clear()
                oc.graphics.drawLine(0.5, '#3fc8c9', [0, 0, globalCenterX, globalCenterY])
                oc.graphics.drawArc(1, oc.color, [0, 0, oc.r * 1.2, 0, 2 * Math.PI], true, oc.color)

                for (var i = oc.childList.length - 1; i >= 0; i--) {
                  oc.childList[i].remove()
                }
                fittingString(oc.data.name, oc.r * 0.8)

                oc.isPrevious = true
              }
            }

            )
            // self.previousCircle = oc;
            self.tween = LTweenLite.to(self, 0.3, {
              ease: LEasing.Circ.easeOut,
              x: oc.x,
              y: oc.y,
              loop: false,
              onUpdate: function (e) {
                self.graphics.clear()
                self.graphics.drawLine(0.5, '#3fc8c9', [0, 0, oc.x - self.x, oc.y - self.y])
                self.graphics.drawArc(1, self.color, [0, 0, self.r, 0, 2 * Math.PI], true, self.color)
              },
              onStart: function (e) {
                that.getDiseaseKnowGraphInfo({
                  name: decodeURIComponent(baike.query('name')),
                  tag: self.data.name
                }, function (o) {
                  baike.setCookie('map_mask', true, 1)

                  initPanel(buildTrees({

                    name: self.data.name,
                    tips: o.count + '篇文章' || null
                    // weight:o.trunks[0].weight||null,
                  }, that.shuffleArray([].concat(o.trunks), self.data.name, that.mapChildren.name)), self.previousCircle)
                  e.clearShape()
                  e.remove()
                  self.scale()
                  that.mapChildren.name = self.data.name
                  that.mapChildren.desc = o.desc
                  that.mapChildren.count = o.count
                  that.mapChildren.category = o.category
                  that.mapChildren.list = o.trunks
                  that.fetchingData = false
                  // initPanel(buildTrees(self.data, datas2), self.previousCircle)
                })
              },
              onComplete: function (e) {

              }
            })
            // var i = 0
            // 清空上次的小圆
            for (i = 0; i < currentChildren.length; i++) {
              if (currentChildren[i] !== self) {
                currentChildren[i].clearShape()
                currentChildren[i].remove()
              }
            }
          } else if (self.isPrevious === true && !that.fetchingData) { // 点击上一个圆
            that.fetchingData = true
            that.showMother = false
            that.showChild = false
            // that.hideCurrent = true;
            // that.showNew = true;
            if (self.previousCircle) {
              LTweenLite.to(self.previousCircle, 0.4, {
                ease: LEasing.Circ.easeOut,
                x: self.previousCircle.x + 500,
                y: self.previousCircle.y + 500,
                scaleX: 1,
                scaleY: 1,
                loop: false,
                onUpdate: function (e) {
                  self.previousCircle.graphics.clear()
                  self.previousCircle.graphics.drawLine(0.5, '#3fc8c9', [0, 0, self.x, self.y])
                  self.previousCircle.graphics.drawArc(1, self.previousCircle.color, [0, 0, self.previousCircle.r * 1.2, 0, 2 * Math.PI], true, self.previousCircle.color)
                },
                onComplete: function (e) {
                  self.previousCircle.graphics.clear()
                  self.previousCircle.graphics.drawLine(0.5, '#3fc8c9', [0, 0, self.x, self.y])
                  self.previousCircle.graphics.drawArc(1, self.previousCircle.color, [0, 0, self.previousCircle.r * 1.2, 0, 2 * Math.PI], true, self.previousCircle.color)
                }
              }

              )
            }

            self.tween = LTweenLite.to(self, 0.3, {
              ease: LEasing.Circ.easeOut,
              x: globalCenterX,
              y: globalCenterY,
              scaleY: 0,
              scaleX: 0,
              loop: false,
              onStart: function (e) {
                that.getDiseaseKnowGraphInfo({
                  name: decodeURIComponent(baike.query('name')),
                  tag: self.data.name
                }, function (o) {
                  if (self.previousCircle) {
                    initPanel(buildTrees({
                      name: self.data.name,
                      tips: o.count + '篇文章' || null
                      // weight:o.trunks[0].weight||null,
                    }, that.shuffleArray([].concat(o.trunks), self.data.name, self.previousCircle.data.name)), self.previousCircle)
                  } else {
                    initPanel(buildTrees({
                      name: self.data.name,
                      tips: o.count + '篇文章' || null
                      // weight:o.trunks[0].weight||null,
                    }, that.shuffleArray([].concat(o.trunks), self.data.name)))
                  }
                  that.mapChildren.name = self.data.name
                  that.mapChildren.desc = o.desc
                  that.mapChildren.count = o.count
                  that.mapChildren.category = o.category
                  that.mapChildren.list = o.trunks
                  that.fetchingData = false
                })
              },
              onUpdate: function (e) {
                self.graphics.clear()
                self.graphics.drawLine(0.5, '#3fc8c9', [0, 0, globalCenterX - self.x, globalCenterY - self.y])
                self.graphics.drawArc(1, self.color, [0, 0, self.r, 0, 2 * Math.PI], true, self.color)
              },
              onComplete: function (e) {
                e.clearShape()
                e.remove()
              }
            })

            currentCenter.clearShape()
            currentCenter.remove()
            for (i = 0; i < self.data.children.length; i++) {
              if (self.data.children[i] !== self) {
                self.data.children[i].clearShape()
                self.data.children[i].remove()
              }
            }
            for (i = 0; i < currentChildren.length; i++) {
              if (currentChildren[i] !== self) {
                currentChildren[i].clearShape()
                currentChildren[i].remove()
              }
            }
          }
        })
        // 大圆和小圆的文字字体大小不一样
        // 乘以1.7/1.3表示比直径稍短一点，为了给两边留间距，因为直径是乘以2
        if (oc) {
          fittingString(data.name, r * (data.name.length === 4 ? 1.3 : 1.7), null, oc)
        } else {
          fittingString(data.name, r * (data.name.length === 4 ? 1.3 : 1.7), null)
        }
        // 调整文字自动换行及超出省略号，因为不支持css的样式设置所以只能通过js循环递归实现
        function fittingString (str, maxWidth, multiY, oc, isdesc) {
          var theTextField = new LTextField() // 这个是疾病名称，字体较大
          var descTextField = new LTextField() // 这个是描述文字，字体较小
          theTextField.setType(LTextFieldType.DYNAMIC, self) // 表示非可编辑文本
          theTextField.textAlign = 'center'
          theTextField.text = str
          var size = 28
          if (oc) {
            size = 28
          } else {
            size = 42
          }
          theTextField.size = size
          theTextField.color = 'white'
          theTextField.width = r * 2
          theTextField.x = 0
          theTextField.y = multiY || 0 - theTextField.getHeight() / 2
          var width = theTextField.getWidth()
          // console.log(r,width)
          if (data.tips) {
            theTextField.y -= 10
            descTextField.setType(LTextFieldType.DYNAMIC, self)
            descTextField.textAlign = 'center'
            descTextField.text = data.tips
            size = 22
            descTextField.size = size
            descTextField.color = self.data.weight > 50 ? '#d8756d' : '#00996d' // 不同权重的文字颜色不一样
            descTextField.width = r * 1.3
            descTextField.x = 0
            var width2 = descTextField.width
            if (!oc) {
              // descTextField.size = 42
              descTextField.color = 'white'
              descTextField.y = multiY > 0 ? multiY + (theTextField.getHeight() * 1.5) - 16 : 0 + theTextField.getHeight() - 16
              if (multiY) {
                // descTextField.y = 280
              } else {
                // descTextField.y = 0 + theTextField.getHeight() - 16
              }
            } else {
              descTextField.y = multiY ? multiY + theTextField.getHeight() - 16 : 0 + theTextField.getHeight() - 16
            }
            if (multiY) {
              var ellipsis = new LTextField()
              ellipsis.setType(LTextFieldType.DYNAMIC, self)
              ellipsis.text = '…'
              ellipsis.size = size
              var ellipsisWidth = ellipsis.getWidth()
              var len = 0
              var substr1 = ''
              var substr2 = ''
              if (width2 <= maxWidth || width2 <= ellipsisWidth) {
                if (!oc) {
                  self.addChild(descTextField)
                } else {

                }
              } else {
                len = descTextField.text.length
                while (width2 >= maxWidth - ellipsisWidth && len-- > 0) {
                  substr1 = str.substring(0, len)
                  substr2 = str.substring(len)
                  descTextField.text = substr1 + ellipsis.text
                  width2 = descTextField.getWidth()
                }
              }
              //
            } else {
              if (width2 <= maxWidth) {
                self.descTextField = self.addChild(descTextField)
              } else {
                len = descTextField.text.length
                while (width2 >= maxWidth && len-- > 0) {
                  substr1 = descTextField.text.substring(0, len)
                  substr2 = descTextField.text.substring(len)
                  descTextField.text = substr1
                  width2 = descTextField.getWidth()
                }

                if (!multiY) {
                  if (oc) {
                    fittingString(substr2, r * 1, 0 + descTextField.getHeight() - 10, oc)
                  } else {
                    fittingString(substr2, r * 1, 0 + descTextField.getHeight() - 10)
                  }

                  // fittingString(substr2, r * 1.7, 0 + theTextField.getHeight() - 10)
                }

                // return theTextField.text;
              }
            }
          }
          self.addChild(theTextField)

          if (multiY) {
            if (self.descTextField) {
              self.descTextField.remove()
            }
            ellipsis = new LTextField()
            ellipsis.setType(LTextFieldType.DYNAMIC, self)
            ellipsis.text = '…'
            ellipsis.size = size
            ellipsisWidth = ellipsis.getWidth()
            if (width <= maxWidth || width <= ellipsisWidth) {
              // return theTextField.text;
              // self.addChild(descTextField);
            } else {
              len = str.length
              while (width >= maxWidth - ellipsisWidth && len-- > 0) {
                substr1 = str.substring(0, len)
                substr2 = str.substring(len)
                theTextField.text = substr1 + ellipsis.text
                width = theTextField.getWidth()
              }
            }
            self.multiLine = true
            // return theTextField.text;
            for (var i = self.childList.length - 1; i >= 0; i--) {
              self.childList[i].y -= 13
            }
          } else {
            if (width <= maxWidth) {

            } else {
              len = str.length
              while (width >= maxWidth && len-- > 0) {
                substr1 = str.substring(0, len)
                substr2 = str.substring(len)
                theTextField.text = substr1
                width = theTextField.getWidth()
              }

              if (!multiY) {
                if (oc) {
                  fittingString(substr2, r * 1.8, 0 + theTextField.getHeight() - 10, oc)
                } else {
                  fittingString(substr2, r * 1.8, 0 + theTextField.getHeight() - 10)
                }
              }
            }
          }
        }

        if (oc) {
          self.move() // 小圆向外移动
        } else {
          self.scale() // 大圆直接放大
        }
      }
    },
    tabClick: function (name, tag = '', cate = '', tab = '') {
      baike.goToUrl(`/mobile/tag_article.html?src=relation_map&name=${name}&cate=${cate}|${tab}&tag=${tag}`)
    },
    clearMask: function () {
      this.showMask = false
      baike.setCookie('map_mask', '', -1)
      baike.setCookie('no_map_mask', true, 100000000)
    },
    bind: function () {
      var that = this
      // $('.map_bottom_tab').on('animationend webkitTransitionEnd', function (e) {
      // // console.log($(this).hasClass('new'))
      //   if ($(this).hasClass('new')) {
      //     if ($(this).css('display') !== 'none') {
      //       that.restoreNew = true
      //     }

      //     that.showNew = false
      //   } else if ($(this).hasClass('current')) {

      //   // if ($(this).css('display') !== 'none') {
      //   //  that.restoreCurrent = true
      //   // }

      //   // that.showCurrent = false
      //   // console.log($(this).css('display'))

      //   }
      // })
      // 底部tab展开效果控制
      $('.map_bottom_tab').on('animationend webkitAnimationEnd', function (e) {
        if ($(this).hasClass('show')) {
          $(this).removeClass('show').addClass('current')

          if (baike.getCookie('map_mask') && !baike.getCookie('no_map_mask')) {
            // $('.mask-guide').show()
            that.showMask = true

            that.$nextTick(function () {
              setTimeout(function () {
                $('.bottom-line > .line-main').css('height', '1.5rem')
                $('.bottom-line > .line-main').on('webkitTransitionEnd', function (e) {
                  $('.bottom-line > .line-text').css('opacity', '1')
                  $('.bottom-line > .line-text').css('height', '1.7rem')
                  $('.bottom-line > .line-cap').css('opacity', '1')
                  $('.bottom-line > .line-cap').css('bottom', '1.5rem')

                  $('.top-line > .line-main').css('height', '1.5rem')
                  $('.top-line > .line-main').on('webkitTransitionEnd', function (e) {
                    $('.top-line > .line-text').css('opacity', '1')
                    $('.top-line > .line-text').css('height', '1.7rem')
                    $('.top-line > .line-cap').css('opacity', '1')
                    $('.top-line > .line-cap').css('top', '1.4rem')
                  })
                  $('.top-line').css('top', '0.5erm')
                })
                $('.bottom-line').css('bottom', ($('.map_bottom_tab').eq(1).height() + $('.line-main').height() - 10) + 'px')
                baike.setCookie('map_mask', '', -1)
                baike.setCookie('no_map_mask', true, 100000000)
              }, 0)
            })
          }
        } else if ($(this).hasClass('hide')) {
          $(this).removeClass('hide').addClass('new')
        }
      })
    },
    getDiseaseKnowGraphInfo: function (params, success) {
      // var that = this
      var url = '/mobile/getDiseaseKnowGraphInfo'
      baike.post(url, params, function (o) {
        if (o.retcode === 0) {
          success && success(o)
        }
      })
    }
  }
}

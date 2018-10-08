/* global $, baike */
export default {
  props: [],
  data: function () {
    return {
      show: false,
      showKnowledge: false,
      hotList: [],
      cateList: [],
      pullUpStyle: ''
    }
  },
  created: function () {
    var that = this
    that.name = that.resolveName(baike.query('name'))
  },
  watch: {
  },
  mounted: function () {
    var that = this
    setTimeout(function () {
      that.bind()
    }, 0)
    setTimeout(function () {
      var $tmenu = $('.tmenu')
      var $bmenu = $('.bmenu')
      if ($tmenu.length && $bmenu.length) {
        $('.allarticle').css('min-height', ($(window).height() - $tmenu.height() - $bmenu.height()) + 'px')
      }
    }, 500)
  },
  activated () {
    // 返回时更新热度数据
    this.init()
  },
  methods: {
    init: function () {
      var that = this
      that.getPageInfo(true)
      // var name = that.name
      // baike.post('/mobile/getDiseaseAllDocsBaseInfo', {
      //   name: name
      // }, function (o) {
      //   if (o.retcode === 0) {
      //     that.hotList = o.attention || []
      //     that.cateList = o.alldocs || []
      //     that.show = true
      //   }
      // })
    },
    getPageInfo: function (isFirst, dropLoadPlugin) {
      var that = this
      var name = that.name
      baike.post('/mobile/getDiseaseAllDocsBaseInfo', {
        name: name
      }, function (o) {
        if (o.retcode === 0) {
          if (isFirst) {
            that.hotList = o.attention || []
            that.cateList = o.alldocs || []
            that.show = true
          } else if (dropLoadPlugin) {
            that.hotList = o.attention || []
            that.cateList = o.alldocs || []
            setTimeout(function () {
              dropLoadPlugin.resetload()
            }, 500)
          }
        }
      })
    },
    resolveName: function (name) {
      var start = name.indexOf('(')
      return name.substr(0, start) || name
    },
    toTag: function (cate, tag, index) {
      var that = this
      var name = baike.query('name')
      var param = name + (index + 1)
      var ptag = tag ? 'allarticle_tagX:' + param : 'allarticle_recommendtagX:' + param
      baike.goToUrl(`/mobile/tag_article.html?ptag=${ptag}&name=` + that.name + '&cate=' + cate + (tag ? '&tag=' + tag : ''))
    },
    toMedicalrefer: function () {
      baike.mtaReport('allarticle_guide_clk|' + baike.query('name'))
      window.location.hash = '#refer'
      // this.$router.replace({path: `${location.pathname}${location.search}#refer`})
    },
    toKnowledgeChart: function () {
      var that = this
      // 目前暂时只有乳腺癌知识图谱
      if (that.name === '乳腺癌') {
        baike.goToUrl('/mobile/relation_map.html?name=' + that.name)
      }
    },
    dropLoadFunc: function (dropLoadPlugin) {
      var that = this
      that.getPageInfo(false, dropLoadPlugin)
    },
    bind: function () {
      var that = this
      var $container = $('.allarticle')
      if (!$container.length) return
      // window.addEventListener('scroll', function () {
      //     pullUp('scroll');
      // });
      // $container.on('touchmove', function () {
      //     pullUp('touch');
      // });
      // function pullUp(action) {
      //     var scrollTop = document.body.scrollTop;
      //     var scrollHeight = document.body.scrollHeight;
      //     var windowHeight = window.screen.height;
      //     if (scrollTop < scrollHeight - windowHeight) return;
      //     if (action === 'scroll' && !that.showKnowledge) {
      //         that.showKnowledge = true;
      //     } else if (action === 'touch' && that.showKnowledge) {
      //         that.toKnowledgeChart();
      //     }
      // }

      $container.on('touchstart', pullUpStart)
      $container.on('touchmove', pullUpMove)
      $container.on('touchend', pullUpEnd)
      var startY = 0
      var preY = 0
      var moveTop = 0
      var pulling = false
      function pullUpStart (e) {
        var scrollTop = $(window).scrollTop()
        var scrollHeight = $('body').height()
        var windowHeight = $(window).height()
        if (scrollTop < scrollHeight - windowHeight) return
        var touch = getPosition(e)
        startY = touch.y
        preY = touch.y
        moveTop = 0
      }
      function pullUpMove (e) {
        var $knowledge = $('.allarticle-knowledge')
        var scrollTop = $(window).scrollTop()
        var scrollHeight = $('body').height()
        var windowHeight = $(window).height()
        var touch = getPosition(e)
        moveTop = 0
        if (scrollTop < scrollHeight - windowHeight || !$knowledge.length) {
          preY = touch.y
          return
        }
        var maxStepY = $knowledge.height() / 2
        var stepY = touch.y - startY
        pulling = touch.y - preY < 0
        if (!pulling) return
        if (stepY < 0) {
          moveTop = Math.max(stepY, -maxStepY)
        } else {
          moveTop = -Math.min(stepY, maxStepY)
        }
        that.pullUpStyle = 'transition: all ease 500ms; transform: translate3d(0px, ' + moveTop + 'px, 0px);'
        preY = touch.y
      }
      function pullUpEnd (e) {
        var scrollTop = $(window).scrollTop()
        var scrollHeight = $('body').height()
        var windowHeight = $(window).height()
        that.pullUpStyle = 'transition: all ease 100ms; transform: translate3d(0px, 0px, 0px);'
        if (scrollTop < scrollHeight - windowHeight || !pulling) return
        if (Math.abs(moveTop) > 0) {
          that.toKnowledgeChart()
        }
      }
      function getPosition (e) {
        var touch = e.changedTouches ? e.changedTouches[0] : e
        return {
          x: touch.pageX,
          y: touch.pageY
        }
      }
    }
  }
}

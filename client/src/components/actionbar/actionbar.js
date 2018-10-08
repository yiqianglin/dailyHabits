/* global baike, $, MtaH5 */
import {lockedReq} from 'src/js/specialReq.js'
import lottie from 'lottie-web'
import helpAnimation from './help-animation.json'
var util = {
  fbTags: {
    common: [
      ['内容晦涩难懂', '专业术语太多', '内容不够详细', '内容不够简练', '内容不专业', '内容不实用', '内容老旧', '缺少图片', '文字排版混乱', '缺少注释', '不够权威'],
      ['内容浅显易懂', '内容详尽全面', '内容实用', '排版合理', '图文并茂', '内容权威']
    ],
    card: [
      ['知识点太多', '内容不够详细', '文章过长', '内容过于专业', '口吻说教', '标题内容不符', '图片没有帮助', '缺少图片', '有不懂的名词', '颜色太浅', '内容沉重负面', '字体太小', '不能评论', '图片不能放大', '没找到想要的'],
      ['知识点全面', '对我有帮助', '文章简洁', '内容浅显易懂', '口语化接地气', '图文并茂', '内容积极正面']
    ],
    positive: ['详尽全面', '实用', '浅显易懂', '专业权威', '表达接地气', '内容更新及时'],
    negative: ['标题内容不符', '内容不够详细', '内容不实用', '晦涩难懂', '内容有误', '内容不够精炼']
  },
  starText: ['很不满意，迫待改进', '不满意，需要提升', '一般，有待提升', '还可以，需要加强', '满意，继续加油']
}

export default {
  props: {
    options: {
      type: Object,
      default: function () {
        return {
          container: '',
          docid: '',
          name: '',
          tab: '',
          fStatus: 0,
          hStatus: 0,
          hCount: 0,
          fbStatus: 0,
          topnav: '',
          showHelp: true,
          showFavor: true,
          showFdbk: true,
          showDoubt: true,
          showAnimation: false, // 文章翻底，显示
          page: '',
          tid: ''
        }
      }
    },
    pass: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      fClickable: 1,
      hClickable: 1,
      fbClickable: 1,
      showActionbar: true,
      showFeedback: false,
      showPlus: false,
      starText: util.starText,
      selected: [],
      other: '',
      scrollTop: 0,
      stopScroll: false,
      fixed: true,
      star: -1,
      doubt: {
        follow: {},
        question: {}
      },
      showDoubtArea: false,
      showFollow: true,
      follow: false,
      doubtInput: '',
      showHelpText: false,
      showAnimationNum: 0 // 动画出现次数  3次以后不在出现
    }
  },
  computed: {
    predefined: function () {
      // var card = this.name === '哮喘' || this.name === '乳腺癌' || this.name === '腰椎间盘突出症'
      // var fbTags = card ? util.fbTags.card : util.fbTags.common
      // var res = this.star < 0 ? [] : this.star < 4 ? fbTags[0] : fbTags[1]
      var positive = util.fbTags.positive.sort(function () {
        return Math.random() < 0.5
      })
      var negative = util.fbTags.negative.sort(function () {
        return Math.random() < 0.5
      })
      var star = this.star
      return ((star > -1 && star < 3) ? negative.concat(positive) : positive.concat(negative))
    },
    page: function () {
      var tid = this.options.tid
      return tid === 24 ? '急救页' : tid === 17 ? '视频页' : tid === 4 ? '综述页' : ''
    },
    tab: function () {
      return this.options.tab
    },
    docid: function () {
      return this.options.docid
    },
    name: function () {
      return this.options.name
    },
    postKey: function () {
      if (this.docid && this.tid !== 4) {
        return this.docid
      }
      return this.name + '+' + (this.tab || '')
    },
    fStatus: {
      get: function () {
        return this.options.fStatus
      },
      set: function (val) {
        this.options.fStatus = val
      }
    },
    hStatus: {
      get: function () {
        return this.options.hStatus
      },
      set: function (val) {
        this.options.hStatus = val
      }
    },
    hCount: {
      get: function () {
        return this.options.hCount
      },
      set: function (val) {
        this.options.hCount = val
      }
    },
    fbStatus: {
      get: function () {
        return this.options.fbStatus
      },
      set: function (val) {
        this.options.fbStatus = val
      }
    },
    showMask: function () {
      if (this.showDoubtArea) {
        this.getDiseaseUserData()
      }
      return (this.showFeedback) || this.showDoubtArea
    }
  },
  watch: {
    showMask: 'disableScroll',
    name: {
      handler (val, oval) {
        this.$nextTick(() => {
          if (!this.pass && this.name && this.options.showDoubt) {
            this.getDiseaseUserData()
          }
        })
      },
      immediate: true
    },
    tab: {
      handler (val, oval) {
        this.$nextTick(() => {
          if (!this.pass && this.tab && this.options.showDoubt) {
            this.getQuestion()
          }
        })
      },
      immediate: true
    },
    docid: {
      handler (val, oval) {
        this.$nextTick(() => {
          if (!this.pass && this.docid && this.options.showDoubt) {
            this.getQuestion()
          }
        })
      },
      immediate: true
    },
    'options.showAnimation': function (val) {
      if (val) {
        this.helpAnimation()
      }
    }
  },
  // created: function () { },
  mounted: function () {
    this.bind()
    // this.helpAnimation()
  },
  // activated () {
  //   console.log('activated in actionbar')
  //   console.log(JSON.stringify(this.options))
  //   this.bind()
  // },
  deactivated () {
    this.unbind()
  },
  methods: {
    // 收藏点击
    fClick: function () {
      var that = this
      if (that.pass) {
        that.$emit('callback', 'favorite', 'click')
        return
      }
      if (!that.postKey) return
      var addFUrl = '/mobile/add_favorite'
      var delFUrl = '/mobile/del_favorite'

      if (baike.query('adtag') === 'tx.qq.qqyd.yety') {
        MtaH5.clickStat('YDD_Hongbao_articleFavor_clk')
      }
      if (that.fClickable === 1) {
        that.fClickable = 0
        if (that.fStatus === 0) {
          baike.post(addFUrl, {
            docid: that.postKey
          }, function (o) {
            if (o.retcode === 0) {
              that.fStatus = 1
              that.fClickable = 1
              that.$emit('callback', 'favorite', 'add', o)
            }
          })
        } else {
          baike.post(delFUrl, {
            docid: that.postKey
          }, function (o) {
            if (o.retcode === 0) {
              that.fStatus = 0
              that.fClickable = 1
              that.$emit('callback', 'favorite', 'del', o)
            }
          })
        }
      }
    },
    // 帮助点击
    hClick: function () {
      var that = this
      if (that.pass) {
        that.$emit('callback', 'help', 'click')
        return
      }
      if (!that.postKey) return
      var addHUrl = '/mobile/add_help'
      var delHUrl = '/mobile/del_help'
      if (baike.query('adtag') === 'tx.qq.qqyd.yety') {
        MtaH5.clickStat('YDD_Hongbao_articleHelpful_clk')
      }
      if (that.hClickable === 1) {
        that.hClickable = 0
        if (that.hStatus === 0) {
          baike.post(addHUrl, {
            docid: that.postKey
          }, function (o) {
            if (o.retcode === 0) {
              that.hCount = o.helpfulCount
              that.hStatus = 1
              that.hClickable = 1
              that.showPlus = true
              setTimeout(function () {
                that.showPlus = false
              }, 1000)
              that.$emit('callback', 'help', 'add', o)
            }
          })
        } else {
          baike.post(delHUrl, {
            docid: that.postKey
          }, function (o) {
            if (o.retcode === 0) {
              that.hCount = o.helpfulCount
              that.hStatus = 0
              that.hClickable = 1
              that.showPlus = false
              that.$emit('callback', 'help', 'del', o)
            }
          })
        }
      }
    },
    // 问题点击
    fbClick: function () {
      if (this.pass) {
        this.$emit('callback', 'feedback', 'click')
        return
      }

      if (this.showFeedback) {
        this.showFeedback = false
        return
      }

      if (!this.postKey) return
      this.showFeedback = true
      this.selected = []
      this.other = ''
      this.star = -1
      baike.mtaReport('commernt_show|' + this.options.page)
    },
    clickStar: function (index) {
      var that = this
      that.star = index
      that.selected = []
      // that.other = ''
      // 校验是否登录
      // if (!baike.getCookie('is_login')) {
      //   return baike.toLogin()
      // } else {
      //   that.star = index
      //   this.selected = []
      //   this.other = ''
      // }
    },
    // 问题反馈
    feedback: function () {
      var that = this
      if (baike.query('adtag') === 'tx.qq.qqyd.yety') {
        baike.mtaReport('YDD_Hongbao_articleFeedback_clk')
      }
      if (!that.postKey) return
      if (that.star < 0) { // 需要给提示
        this.$msg.toast('请对文章评星后提交')
        baike.mtaReport('Comment_norating_show')
        return
      }
      that.fbClickable = 0
      var addHUrl = '/mobile/addFeedback'
      var data = {
        pageId: window.location.href,
        pageName: that.name,
        docid: that.postKey,
        feedbacks: that.selected,
        content: that.other,
        star: that.star
      }
      baike.post(addHUrl, data, function (o) {
        if (o.retcode === 0) {
          that.feedbackSuccess(o)
          baike.mtaReport('commernt_submit|' + that.page)
        }
      })
    },
    feedbackSuccess: function (o) {
      var that = this
      that.fbStatus = 1
      that.fbClickable = 1
      that.showFeedback = false
      // 自动关闭
      setTimeout(function () {
        that.$emit('callback', 'feedback', 'add', o)
        that.showActionbar = true
      }, 100)
    },
    clickMask: function () {
      this.closeFeedback()
      this.closeDoubt()
    },
    closeFeedback: function () {
      var that = this
      that.showFeedback = false
    },
    disableScroll: function (newVal, oldVal) {
      var that = this
      that.stopScroll = false
      if (newVal) {
        that.scrollTop = $(window).scrollTop()
        document.body.classList.add('disscroll')
        document.body.style.top = -that.scrollTop + 'px'
      } else {
        document.body.classList.remove('disscroll')
        $(window).scrollTop(that.scrollTop)
        document.body.style.top = ''
        that.stopScroll = true
      }
    },
    touchAction: function (area, e) {
      var that = this
      if (that.showFeedback && !that.showMask && area !== 'mask') {
        e.preventDefault()
      }
    },
    unbind () {
      $('body').off('touchstart')
      $('body').off('touchmove')
      $('body').off('touchend')
      $(window).off('resize')
    },
    helpAnimation () {
      var showAnimationNum = +(baike.lstore.getItem('help-animation') || '')
      if (showAnimationNum > 0) {
        this.showAnimationNum = showAnimationNum
      }
      if (showAnimationNum < 3 && !this.hStatus) {
        showAnimationNum++
        this.showHelpText = true
        setTimeout(() => {
          this.showHelpText = false
        }, 5000)
      }
      baike.lstore.setItem('help-animation', showAnimationNum, 60 * 24 * 14)
      $('#help-animation').html('')
      lottie.loadAnimation({
        container: document.getElementById('help-animation'), // the dom element that will contain the animation
        renderer: 'svg',
        loop: 2,
        autoplay: true,
        animationData: helpAnimation
        // path: '/dist/static/libs/help-animation.json' // the path to the animation json
      })
    },
    bind: function () {
      var that = this
      if (that.pass) {
        that.fixed = false
        return
      }

      var direction = ''

      scroll(handleScroll)
      handleScroll('down')
      $('body').off('touchstart').on('touchstart', () => { handleScroll(direction) })
      $('body').off('touchmove').on('touchmove', () => { handleScroll(direction) })
      $('body').off('touchend').on('touchend', () => { handleScroll(direction) })
      $(window).off('resize').on('resize', () => { // 在评论之后，由于调起了键盘，视窗高度变化。会导致状态变成fixed，在键盘消失后，再次调用判断。
        setTimeout(() => {
          handleScroll(direction)
        }, 100)
      })

      function handleScroll (dir) {
        direction = dir
        var scrollTop = $(window).scrollTop()
        // var scrollHeight = $('body').height()
        var windowHeight = $(window).height()
        var staticElem = $(that.options.container ? `${that.options.container} .actionbar-static` : '.actionbar-static')
        if (staticElem.length && scrollTop + windowHeight >= staticElem.offset().top) {
          that.fixed = false
          that.showActionbar = true
          return
        }

        that.fixed = true
        that.showActionbar = dir !== 'up' || (that.showFeedback && !that.showMask)

        // if (scrollTop < scrollHeight - windowHeight) {
        //   that.showActionbar = dir !== 'down' || (that.showFeedback && !that.showMask)
        //   if (that.showFeedback && !$('body').hasClass('disscroll')) {
        //     that.showFeedback = false
        //   }
        // } else {
        //   if (!that.showFeedback && dir === 'down' && !that.fbStatus) {
        //     if (that.stopScroll) {
        //       that.stopScroll = false
        //     } else {
        //       that.fbClick()
        //     }
        //   }
        //   that.showActionbar = true
        // }
      }

      function scroll (handler) {
        var beforeScrollTop = $(window).scrollTop()
        handler = handler || function () { }

        window.addEventListener('scroll', function (event) {
          event = event || window.event
          var topnav = document.querySelector(that.options.topnav)
          var afterScrollTop = $(window).scrollTop()
          var topnavHeight = topnav ? topnav.offsetHeight : 0
          var delta = afterScrollTop - beforeScrollTop
          beforeScrollTop = afterScrollTop

          var scrollTop = $(window).scrollTop()
          var scrollHeight = $('body').height()
          var windowHeight = $(window).height()

          if (scrollTop <= topnavHeight) {
            handler('up')
            return
          }

          if (scrollTop + windowHeight > scrollHeight - 10) { // 滚动到底部执行事件
            handler('down')
            return
          }

          if (afterScrollTop < 10 || afterScrollTop > document.body.offsetHeight - 10) {
            handler('up')
          } else {
            if (Math.abs(delta) < 10) {
              return false
            }
            handler(delta > 0 ? 'down' : 'up')
          }
        })
      }
    },
    // doubt
    dClick: function () {
      if (this.pass) {
        this.$emit('callback', 'doubt', 'click')
        return
      }
      this.showDoubtArea = true
      // if (baike.isLogin()) {
      //   this.showDoubtArea = true
      // } else {
      //   baike.toLogin()
      // }
    },
    closeDoubt: function (e) {
      var that = this
      this.doubt.question[that.postKey] = that.doubtInput
      that.showDoubtArea = false
    },
    submitDoubt: function () {
      var that = this
      if (!that.doubtInput) return
      lockedReq({
        url: '/mobile/submitQuestion',
        method: 'post',
        callback: function (o) {
          if (o.retcode === 0) {
            that.showDoubtArea = false
            if (that.showFollow && !that.follow) return
            that.$nextTick(function () {
              that.$msg.toast('提交成功', 'success')
            })
          }
        }
      }, {
        id: that.postKey,
        question: that.doubtInput
      })
      if (that.showFollow && !that.follow) {
        lockedReq({
          method: 'post',
          url: '/mobile/add_follow',
          callback: function (o) {
            if (o.retcode === 0) {
              that.$msg.toastAdd('focus')
              that.showFollow = false
              that.doubt.follow[that.name] = !that.showFollow
            }
          }
        }, {
          disease: that.name
        })
      }
    },
    getDiseaseUserData: function () {
      var that = this
      // if (typeof util.doubt.follow[that.name] === 'boolean') {
      //   that.showFollow = !util.doubt.follow[that.name]
      //   return
      // }
      baike.post('/mobile/getDiseaseUserData', {
        disease: that.name
      }, function (o) {
        if (o.retcode === 0) {
          that.showFollow = o.follow !== 1
          that.doubt.follow[that.name] = !that.showFollow
        }
      })
    },
    getQuestion: function () {
      var that = this
      var key = that.postKey
      if (that.doubt.question[key] !== undefined) {
        that.doubtInput = that.doubt.question[key]
        return
      }
      baike.post('/mobile/getQuestion', {
        id: key
      }, function (o) {
        if (o.retcode === 0) {
          that.doubtInput = o.question
          that.doubt.question[key] = o.question
        }
      })
    },
    feedbackHeight: function () { // 根据字数，自动变大
      var $area = $('#feedbackArea')
      if ($area.length === 1) {
        $area.css('height', '1rem')
        var areaH = $area.height()
        var dom = $area.get(0)
        if (dom) {
          var scrollH = dom.scrollHeight
          $area.css('height', scrollH > areaH ? (scrollH > 250 ? 250 : scrollH) : areaH)
        }
      }
    }
  }
}

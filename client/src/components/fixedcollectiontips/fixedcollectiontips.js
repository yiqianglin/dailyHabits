/* global baike */
export default {
  props: {
    showType: { // 1:添加到书签，快速访问医疗健康资讯  2:觉得我们内容不错，可以收藏到书签
      type: [Number, String],
      required: true
    },
    reachEndofAritle: {
      type: Boolean
    }
  },
  data: function () {
    return {
      canShow: false,
      showTime: 30000,
      closeTipsActionList: null
      // {enterPage: [], articlePage: ''}  // 记录关闭日期
    }
  },
  computed: {
    enterPageTipsHasClosedInDay: function () { // 首页判断24小时以内是否点过关闭
      var closeTime = new Date().getTime()
      if (this.closeTipsActionList === null || !this.closeTipsActionList.enterPage) { return false }
      return Boolean(this.closeTipsActionList.enterPage.filter(function (val) {
        return Math.abs(closeTime - val) < 86400000
      }).length)
    },
    articlePageHasClosedInDay: function () { // 文章页判断24小时以内是否点过关闭
      var closeTime = new Date().getTime()
      if (this.closeTipsActionList === null) { return false }
      return Boolean(Math.abs(this.closeTipsActionList.articlePage - closeTime) < 86400000)
    },
    isShow: function () {
      if (!this.isQQBrowser()) {
        return false
      }
      if (this.showType === 1) {
        if (this.canShow) {
          this.$emit('update', true)
        } else {
          this.$emit('update', false)
        }
        return this.canShow
      } else if (this.showType === 2) {
        if (this.reachEndofAritle) {
          this.toRecord()
        }
        return this.canShow && this.reachEndofAritle
      }
    }
  },
  created: function () {
  },
  mounted: function () {
    console.log('fixedColletionTips mounted')
    if (!this.isQQBrowser()) {
      this.$emit('update', false)
      return
    }
    this.closeTipsActionList = JSON.parse(localStorage.getItem('closeTipsActionList')) || {}
    if (!Array.isArray(this.closeTipsActionList.enterPage)) {
      this.closeTipsActionList.enterPage = []
    }
    // 初始化显示
    var localHasNoDate = !this.closeTipsActionList.enterPage
    var timeCountBoolean = this.closeTipsActionList.enterPage.length < 3
    if (this.showType === 1 && (localHasNoDate || timeCountBoolean) && !this.enterPageTipsHasClosedInDay) {
      this.canShow = true
      this.toRecord()
      setTimeout(function (that) {
        that.closeTips(true)
      }, this.showTime, this)
    }
    if (this.showType === 2 && !this.articlePageHasClosedInDay) {
      this.canShow = true
    }
  },
  methods: {
    isQQBrowser: function () {
      // var ua = navigator.userAgent
      // var app = navigator.appVersion
      var temp = ((baike.isQQBrowser() || baike.isMobileQQ()) && !baike.isWeixin())
      return temp
    },
    closeTips: function (autoClose) {
      this.canShow = false
      if (autoClose) {
        return
      }
      this.toRecord()
    },
    toRecord: function () {
      var closeTime = new Date().getTime()
      if (+this.showType === 1) {
        var len = this.closeTipsActionList.enterPage.filter(function (val) {
          return Math.abs(closeTime - val) < 86400000
        }).length
        if (!len) {
          if (this.closeTipsActionList.enterPage.length >= 3) { this.closeTipsActionList.shift() }
          this.closeTipsActionList.enterPage.push(closeTime)
        }
      } else if (+this.showType === 2) {
        this.closeTipsActionList.articlePage = closeTime
      }
      localStorage.setItem('closeTipsActionList', JSON.stringify(this.closeTipsActionList))
    }
  }
}

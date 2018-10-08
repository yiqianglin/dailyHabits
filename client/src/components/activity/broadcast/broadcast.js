/* global $, baike */

export default {
  props: {
    options: {
      type: Object,
      default: function () {
        return {
          list: [],
          maxCnt: 5,
          dom: '',
          area: '',
          customStyle: false
        }
      }
    }
  },
  data () {
    return {
      eventBound: false,
      broadcastStyle: '',
      broadcastIdx: 0
    }
  },
  created: function () {
  },
  computed: {
    list () {
      this.$nextTick(() => {
        this.stopBroadcast()
        this.startBroadcast()
      })
      return ((this.options && this.options.list) || []).slice(0, this.options.maxCnt || 5)
    }
  },
  watch: {
  },
  mounted: function () {
    setTimeout(() => {
      if (this.eventBound) return
      this.startBroadcast()
    }, 500)
  },
  methods: {
    // common
    report: function (action, index) {
      var area = this.options.area || ''
      var type = 'broadcast'
      var key = area + (type === 'banner' ? 'bn' : 'bc') + '_' + action
      if (type === 'consultant') {
        key = 'main_consult_' + action
      } else if (area === 'main' && type === 'banner') {
        key = 'main_bn_' + action
        key = 'main_consult_' + action
      } else if (area === 'health_recommend') {
        key = action === 'clk' ? 'health_recommend_bannerX' : ''
      } else if (area === 'home_cancer') {
        key = action === 'clk' ? 'onco_hotzone' : ''
      }
      if (key) {
        baike.mtaReport(key + ':' + (index + 1))
      }
    },
    // broadcast
    initBroadcast: function (list) {
      if (list && list.length) {
        this.startBroadcast()
      }
    },
    startBroadcast: function (index) {
      var that = this
      var $container = $((this.options.dom ? this.options.dom + ' ' : '') + '.broadcast-container')
      if ($container.length) {
        this.eventBound = true
      } else {
        this.eventBound = false
        return
      }
      index = index || 0
      if (!this.list || this.list.length < 2 || index >= this.list.length) return
      this.broadcastIdx = index - 1
      var start = true
      var carousel = function () {
        var count = that.list.length
        var next = (that.broadcastIdx + 1) % (count + 1)
        var moveTop = next * $container.height() || 0
        if (start) {
          // that.report('show', next % count)
          that.bannerStyle = 'transition: all ease 0s; transform: translate3d(-' + moveTop + 'px, 0px, 0px);'
          that.timer = setTimeout(carousel, 5000)
          start = false
        } else if (next === 0) {
          that.broadcastStyle = 'transition: all ease 0s; transform: translate3d(0px, 0px, 0px);'
          that.timer = setTimeout(carousel, 0)
        } else {
          // that.report('show', next % count)
          that.broadcastStyle = 'transition: all ease 500ms; transform: translate3d(0px, -' + moveTop + 'px, 0px);'
          that.timer = setTimeout(carousel, 5000)
        }
        that.broadcastIdx = next
      }
      this.timer = setTimeout(carousel, 0)
    },
    stopBroadcast: function () {
      if (!this.timer) return
      clearTimeout(this.timer)
      this.timer = null
      this.eventBound = false
    },
    toBroadcast ({h5url}, index) {
      this.report('clk', index)
      if (h5url) {
        baike.goToUrl(h5url)
      }
    }
  }
}

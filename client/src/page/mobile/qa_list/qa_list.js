/* global $, baike */
import tmenu from 'components/tmenu/tmenu.vue'
import paper from 'components/paper/paper.vue'
import { pageLoad } from 'src/js/specialReq.js'

export default {
  data () {
    return {
      title: '企鹅医典',
      qaList: [],
      loaded: false,
      name: '',
      isXcx: baike.isXcx() || false
    }
  },
  components: {
    tmenu,
    paper
  },
  destroyed () {
    $(window).off('scroll', this.handleScrollFn)
  },
  deactivated () {
    $(window).off('scroll', this.handleScrollFn)
  },
  activated () {
    this.bindEvent()
  },
  created: function () {
    this.name = decodeURIComponent(baike.query('name'))
    this.init()
  },
  mounted: function () {
    this.bindEvent()
  },
  methods: {
    init: function () {
      this.getDiseaseQADocs(true)
      this.title = '企鹅医典·' + this.name + '-热门问答'
    },
    getDiseaseQADocs: function (isInit) {
      var that = this
      pageLoad({
        key: 'getDiseaseQADocs',
        url: '/mobile/getDiseaseQADocs',
        retKey: 'asks',
        pageSize: 15,
        cb: function (pageData) {
          var list = pageData.list
          if (list && list.length > 0) {
            that.qaList = list
          }
          that.loaded = pageData.loaded
          if (isInit) {
            window.medTimer && window.medTimer.reportTime({
              action: 'qa_list_page',
              ispage: 1
            })
          }
        }
      }, { name: that.name })
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.name })
      }
    },
    handleScrollFn () {
      baike.throttle(this.scrollCb, '', 200)
    },
    scrollCb () {
      var that = this
      var $window = $(window)
      var winHeight = $window.height()
      var scroll = $window.scrollTop() // 滚动条距离
      var conHeight = $('#qa-main').height()
      if (scroll + winHeight > conHeight - 100) {
        that.getDiseaseQADocs()
      }
    },
    bindEvent () {
      $(window).on('scroll', this.handleScrollFn)
    }
  }
}

/* global MtaH5, baike,  $ */
import tmenu from 'components/tmenu/tmenu.vue'
import { ActiveBanner } from 'components/activity/activity'
import filters from 'src/js/filters'

export default {
  data () {
    return {
      cates: [],
      history: [],
      searchRes: [],
      emergDocs: [],
      // 高亮关键词
      keywords: [],
      activeOps: null,
      searchInput: '',
      show: false,
      showEmpty: false,
      // 急救搜索
      showAidSearch: false,
      block: 'home',
      isXcx: baike.isXcx() || false
    }
  },
  components: {
    tmenu,
    ActiveBanner
  },
  filters: {
    highLight: filters.highLight
  },
  created: function () {
    var that = this
    var isWeixin = baike.isWeixin()
    if (baike.query('adtag') === 'tx.wx.hr' && !isWeixin) {
      that.show = false
    } else {
      that.show = true
      that.getEmergencyData()
      that.getSearchHistory()
      that.getHomeDocsData()
      that.getActiveData()
    }
  },
  watch: {
    searchInput: 'getSearchRes'
  },
  destroyed () {
    $('html, body').removeClass('show-searcher')
  },
  methods: {
    getEmergencyData: function () {
      var that = this
      var url = '/mobile/getEmergencyData'
      baike.post(url, {}, function (o) {
        if (o.retcode === 0 && o.tid23) {
          that.init(o.tid23)
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'emergency_page',
          ispage: 1
        })
      })
    },
    getSearchHistory: function () {
      var that = this
      var url = '/mobile/getSearchHistory'
      baike.post(
        url,
        {
          count: 10,
          type: 3
        },
        function (o) {
          if (o.retcode === 0) {
            that.history = o.list || []
          }
        }
      )
    },
    // 运营位
    getActiveData () {
      baike.post('/mobile/getActiveData', {
        activetype: 2,
        name: ''
      }, o => {
        if (o.retcode === 0) {
          this.activeOps = { list: o.activelist, area: 'emergency_top', maxCnt: 5 }
        }
      })
    },
    init: function (tid23) {
      var that = this
      var modeOne = tid23['mode_one'] || []
      var modeTwo = tid23['mode_two'] || []
      var modeTop = tid23['mode_top'] || []
      for (var i = 0; i < modeOne.length; i++) {
        modeOne[i].bg = true
      }
      var cates = [].concat(modeTwo)
      that.cates = cates
      that.emergDocs = modeTop
    },
    setAidSearch: function () {
      var that = this
      if (that.showAidSearch) {
        return
      }
      MtaH5.clickStat('ydd_emergency_home_rearch')
      that.showAidSearch = true
      document.body.scrollTop = 0
      var h = window.innerHeight
      $('html, body').addClass('show-searcher')
      var tmenu = document.querySelector('.tmenu')
      var h1 = tmenu ? tmenu.offsetHeight : 0
      var topSearch = document.querySelector('.top-search')
      var h2 = topSearch ? topSearch.offsetHeight : 0
      document.querySelector('.search-content.s1').style.height =
        h - h1 - h2 + 'px'
      document.querySelector('.search-content.s2').style.height =
        h - h1 - h2 + 'px'
    },
    closeSearch: function () {
      var that = this
      that.clearInput()
      that.hideSearch()
    },
    clearInput: function () {
      this.searchInput = ''
      this.searchRes = []
    },
    hideSearch: function () {
      this.showAidSearch = false
      $('html, body').removeClass('show-searcher')
    },
    getSearchRes: function (newVal, oldVal) {
      if (newVal.trim() === oldVal.trim()) return
      var that = this
      var searchInput = that.searchInput.trim()
      if (!searchInput) {
        that.searchRes = []
        return
      }
      baike.post(
        '/mobile/sugSmartBox',
        {
          query: searchInput,
          type: 3,
          histype: ''
        },
        function (o) {
          if (o.retcode !== 0) {
            that.searchRes = []
            that.showEmpty = true
            return
          }
          var keywords = o.keywords || []
          that.keywords = keywords
          var docs = o.items || []
          if (docs.length) {
            that.searchRes = docs
            that.showEmpty = false
          } else {
            that.searchRes = []
            that.showEmpty = true
          }
        }
      )
    },
    getHomeDocsData: function () {
      // if (that.loaded || that.loading) {
      //     return;
      // }
      // if (enterGlobalVar.timeout) {
      //     clearTimeout(enterGlobalVar.timeout);
      // }
      // enterGlobalVar.timeout = setTimeout(function() {
      //     that.loading = false;
      // }, 500);
      // that.loading = true;
      // var page = enterGlobalVar.page,
      //     pageSize = enterGlobalVar.pageSize;
      baike.post(
        '/mobile/getQQRewardDocs',
        {
          offset: 0,
          count: 10
        },
        function (ret) {
          console.log(ret)
          if (ret.retcode === 0) {
            //   that.emergDocs = ret.docs;
          }
        }
      )
    },
    clearHistory: function () {
      var that = this
      var url = '/mobile/clearEmerHistory'
      baike.post(url, {}, function (o) {
        if (o.retcode === 0) {
          that.history = []
        }
      })
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch')
      }
    },
    toSearch: function (name, docid, index) {
      var that = this
      var url = '/mobile/setSearchHistory'
      baike.post(
        url,
        {
          name: name,
          type: 3
        },
        function (o) {
          if (o.retcode === 0) {
            that.toArticle('search', name, docid, index)
          }
        }
      )
    },
    toArticle: function (cate, name, docid, index) {
      var reportKeys = {
        急救精选: 'ydd_emergency_topx',
        家庭生活: 'ydd_emergency_classifya_artix',
        突发急症: 'ydd_emergency_classifyb_artix',
        运动损伤: 'ydd_emergency_classifyc_artix',
        急救技能: 'ydd_emergency_classifyd_artix',
        图片: 'YDD_Emergency_PictureX'
      }
      var reportKey = reportKeys[cate]
      if (baike.query('adtag') === 'tx.wx.hr') {
        baike.mtaReport('ydd_hr_emergencyx:' + name)
      }
      if (docid) {
        this.closeSearch()
        baike.goToUrl(
          '/mobile/article.html?docid=' +
          docid +
          (reportKey ? '&ptag=' + reportKey + ':' + index : '')
        )
      }
    }
  }
}

/* global baike */
export default {
  props: ['type'],
  data: function () {
    return {
      isShow: true,
      tabIndex: 0,
      tabs: []
    }
  },
  created: function () {
    var that = this
    var type = parseInt(that.type)
    if (type === 0) {
      that.tabs = [{ name: '首页', id: 'health', loading: false, active: require('../../assets/images/mobile/common/health_active.png'), inactive: require('../../assets/images/mobile/common/health_inactive.png'), click: function () { baike.goToUrl('/mobile/health.html') } },
        { name: '知识库', id: 'disease_list', loading: false, active: require('../../assets/images/mobile/common/search_active.png'), inactive: require('../../assets/images/mobile/common/search_inactive.png'), click: function () { baike.goToUrl('/mobile/disease_list.html') } },
        { name: '我的', id: 'my', loading: false, active: require('../../assets/images/mobile/common/my_active.png'), inactive: require('../../assets/images/mobile/common/my_inactive.png'), click: function () { baike.goToUrl('/mobile/my.html') } }
      ]
    }
    that.initTab()
  },
  mounted: function () {
    this.bindEvent()
  },
  methods: {
    initTab: function () {
      var that = this
      var page = baike.getPageName(window.location.href)
      that.tabs.forEach(function (tab, index) {
        if (tab.id === page) {
          that.tabIndex = index
        }
      })
    },
    clickTab: function (index) {
      var that = this
      if (!(index in that.tabs)) return
      var tab = that.tabs[index]
      if (tab.loading) return
      this.$emit('navclick', index)
      if (that.tabIndex === index) return
      // that.tabIndex = index 等页面loading完之后再切换active状态，防止小程序里面active切换了页面也变
      var cb = tab.click
      if (cb) {
        cb()
      }
    },
    loadTab: function (index, loading) {
      var that = this
      if (index < 0 || index >= that.tabs.length) return
      that.tabs[index].loading = !!loading
    },
    bindEvent: function () {
      var that = this
      window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
          that.initTab()
        }
      })
    }
  }
}

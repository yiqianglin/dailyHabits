/* global baike */
import tmenu from 'components/tmenu/tmenu.vue'

export default {
  data () {
    return {
      headerData: {},
      list: [],
      isXcx: baike.isXcx() || false
    }
  },
  components: {
    tmenu
  },
  activated () {
    // 单页缓存分享数据重置
    this.setShare(this.shareCache)
  },
  created: function () {
    this.setShare({
      title: 'Healthwise',
      desc: '美国42年历史的权威医疗健康信息提供机构'
    })
    var that = this
    that.getAuthInfo()
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: 'Healthwise' })
      }
    },
    toExclusive: function () {
      baike.goToUrl('/mobile/disease_list.html?lib=Healthwise')
    },
    getAuthInfo: function () { }
  }
}

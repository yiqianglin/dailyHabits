/* global baike */
import tmenu from 'components/tmenu/tmenu.vue'

export default {
  data () {
    return {
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
    this.setShare({ title: '企鹅医典医学团队' })
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch')
      }
    }
  }
}

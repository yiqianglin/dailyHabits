/* global baike */
import tmenu from 'components/tmenu/tmenu.vue'
import loading from 'components/loading/loading.vue'

export default {
  data () {
    return {
      tlist: [],
      loaded: false,
      isXcx: baike.isXcx() || false
    }
  },
  components: {
    tmenu,
    loading
  },
  activated () {
  },
  created: function () {
    this.getFavoriteList()
  },
  mounted: function () {
  },
  methods: {
    // 或去我的收藏列表
    getFavoriteList: function () {
      var that = this
      var url = '/mobile/init_favorite'
      baike.get(
        url,
        {
          offset: 0,
          // 最多可拉取200
          count: 200
        },
        function (o) {
          that.loaded = true
          that.tlist = o.tlist
          window.medTimer && window.medTimer.reportTime({
            action: 'favorite_page',
            ispage: 1
          })
        }
      )
    },
    toArticle: function (docid, index) {
      baike.goToUrl(
        'article.html?docid=' + docid + '&ptag=ydd_my_favorarticalx|' + index
      )
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch')
      }
    }
  }
}

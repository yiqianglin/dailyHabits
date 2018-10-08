/* global baike */
import tmenu from 'components/tmenu/tmenu.vue'

export default {
  data () {
    return {
      isShow: true,
      followList: [],
      page: 0,
      count: 120,
      isXcx: baike.isXcx() || false
    }
  },
  components: {
    tmenu
  },
  activated () {
  },
  created: function () {
    this.getFollowList()
  },
  mounted: function () {
  },
  methods: {
    // 获取关注列表
    getFollowList: function () {
      var that = this
      var url = '/mobile/init_focus'
      baike.get(url, {
        offset: 0,
        count: 200
      }, function (o) {
        that.followList = o.list
        if (that.followList.length === 0) {
          that.isShow = false
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'focus_page',
          ispage: 1
        })
      })
    },
    // 列表点击url
    followClick: function (disease, released, type, index, docid) {
      var url = '/mobile/update_disease_visit_time'
      baike.get(url, {
        disease: disease
      }, function (o) {
        console.log(o)
      })
      var ptag = docid ? 'ydd_my_follow_article_clk' : 'ydd_my_followdiseasex|' + index
      if (docid) {
        baike.goToUrl('/mobile/article.html?docid=' + docid + '&name=' + disease + '&ptag=' + ptag)
      } else {
        if (baike.query('adtag') === 'tx.wx.hr') {
          baike.mtaReport('ydd_hr_diseasex|' + disease)
        }
        baike.goToUrl((released ? baike.getOverview({ name: disease, type: type }) : '/mobile/building.html?name=' + disease) + '&ptag=' + ptag)
      }
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch')
      }
    }
  }
}

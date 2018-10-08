/* global baike */
import tmenu from 'components/tmenu/tmenu.vue'

export default {
  data () {
    return {
      name: '',
      follow: 0,
      fClickable: 1,
      // ui
      isShow: false,
      isShowMenu: !document.referrer,
      isXcx: baike.isXcx() || false
    }
  },
  components: {
    tmenu
  },
  activated () {
  },
  created: function () {
    var that = this
    that.init()
  },
  mounted: function () {
  },
  methods: {
    init: function () {
      var that = this
      var url = '/mobile/init_building'
      var hisUrl = '/mobile/getOverviewBaseinfo'
      that.name = that.resolveName(baike.query('name'))
      baike.get(hisUrl, { name: that.name, type: 0 }, function () { }) // 为了形成记录
      baike.get(url, {
        name: that.name
      }, function (o) {
        that.follow = o.flag
        that.fClickable = 1
        that.isShow = true
        window.medTimer && window.medTimer.reportTime({
          action: 'building_page',
          ispage: 1
        })
      }, true)
    },
    resolveName: function (name) {
      var start = name.indexOf('(')
      return name.substr(0, start) || name
    },
    fClick: function () {
      var that = this
      var disease = that.name
      var addFollowUrl = '/mobile/add_follow'
      var delFollowUrl = '/mobile/del_follow'
      if (that.fClickable === 1) {
        that.fClickable = 0
        if (that.follow === 0) {
          baike.post(addFollowUrl, {
            disease: disease
          }, function (o) {
            if (o.retcode === 0) {
              that.$msg.toastAdd('focus')
              that.follow = 1
              that.fClickable = 1
            }
          })
        } else {
          baike.post(delFollowUrl, {
            disease: disease
          }, function (o) {
            if (o.retcode === 0) {
              that.follow = 0
              that.fClickable = 1
            }
          })
        }
      }
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch')
      }
    }
  }
}

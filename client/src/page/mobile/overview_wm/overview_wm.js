/* global baike */
import tmenu from 'components/tmenu/tmenu.vue'
import topicdocs from 'components/topicdocs/topicdocs.vue'

export default {
  data () {
    return {
      name: baike.query('name') || '',
      topic: [],
      configflag: 1
    }
  },
  components: {
    tmenu,
    topicdocs
  },
  mounted: function () {
  },
  activated () {
    // 单页缓存分享数据重置
    this.setShare(this.shareCache)
  },
  created: function () {
    var that = this
    that.getOverviewTopic()
    that.setShare({ title: that.name + '-WebMD独家授权文章-企鹅医典', desc: 'WebMD是美国专业的医疗健康信息服务商' })
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    getOverview: function () {
      var type = baike.query('type') || ''
      var released = baike.query('released') || ''
      var name = this.name
      if (released === '0') return '/mobile/building.html?name=' + name
      return baike.getOverview({ name: name, type: type })
    },
    getOverviewTopic: function () {
      var that = this
      baike.get('/mobile/getOverviewTopic', { name: that.name, type: 0, tag: 'WebMD' }, function (o) {
        if (o.retcode === 0) {
          var topic = o.topic
          topic.forEach((item) => {
            item.name = item.title
          })
          if (topic && topic.length > 0) {
            that.topic = topic
          }
          that.configflag = o.configflag
        }
      })
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: 'WebMD' })
      }
    }
  }
}

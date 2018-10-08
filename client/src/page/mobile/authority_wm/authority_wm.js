/* global $, baike */
import tmenu from 'components/tmenu/tmenu.vue'
import { pageLoad } from 'src/js/specialReq.js'

export default {
  data () {
    return {
      introExpanded: false,
      diseaseNum: 0,
      docNum: 0,
      diseases: [],
      name: baike.query('name') || ''
      // docsList: [],
      // loaded: false
    }
  },
  components: {
    tmenu
  },
  mounted: function () {
  },
  activated () {
    // 单页缓存分享信息重写
    this.setShare(this.shareCache)
  },
  created: function () {
    var that = this
    that.getHospitalRelated()
    that.setShare({ title: 'WebMD主页-企鹅医典', desc: 'WebMD是美国专业的医疗健康信息服务商' })
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    // getOverview: function (name, type, released) {
    //   if (released === 0) return '/mobile/building.html?name=' + name
    //   return baike.getOverview({name: name, type: type})
    // },
    getHospitalRelated: function () {
      var that = this
      baike.post('/mobile/getHospitalRelated', { hospital_id: 1000, doctag: '', disease: that.name, offset: '', count: '' }, function (json) {
        if (json.retcode === 0) {
          that.diseaseNum = json.diseasenum
          that.docNum = json.docnum
          var list = json.disease
          if (list && list.length) that.diseases = list
        }
      })
    },
    getWebmdDocs: function () {
      var that = this
      var url = '/mobile/getDocsDataByTags'
      var isSwitch = false
      var name = "'WebMD"
      pageLoad({
        key: 'getDocsDataByTags_' + name, // 唯一键值
        url: url,
        isSwitch: isSwitch,
        retKey: 'docs',
        pageSize: 10,
        cb: function (pageData) {
          var docs = pageData.list
          if (docs && docs.length > 0) {
            that.docsList = that.resolveDocs(docs)
          }
          that.loaded = pageData.loaded
        }
      }, {
        name: name
      })
    },
    resolveDocs: function (doclist) {
      var tmplist = []
      doclist.forEach(function (item) {
        if (item && item['tid' + item.tid]) {
          tmplist.push(item['tid' + item.tid])
        } else {
          tmplist.push(item)
        }
      })
      return tmplist
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: 'WebMD' })
      }
    },
    bind: function () {
      $(window).on('scroll', this.handleScrollFn)
    },
    handleScrollFn () {
      var that = this
      var $window = $(window)
      var windowHeight = $window.height()
      var scrollTop, scrollHeight
      scrollTop = $window.scrollTop()
      scrollHeight = $('body').height()
      if (windowHeight + scrollTop >= scrollHeight - 100) {
        that.getWebmdDocs()
      }
    }
  }
}

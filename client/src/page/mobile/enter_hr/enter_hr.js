/* global $, baike */

var enterGlobalVar = {
  page: 1,
  pageSize: 10,
  timeout: 0,
  timeoutScroll: 0
}

export default {
  data () {
    return {
      show: false,
      loaded: false,
      loading: false,
      paperList: [],
      commonImages: [],
      commonList: []
    }
  },
  components: {
  },
  activated () {
    this.initEvent()
  },
  destroyed () {
    window.removeEventListener('scroll', this.load)
  },
  deactivated () {
    window.removeEventListener('scroll', this.load)
  },
  created: function () {
    var that = this
    var isWeixin = baike.isWeixin()
    var isDev = window.location.host === 'local.baike.qq.com'
    if (isWeixin || isDev) {
      that.show = true
      that.getCommonDiseaseData()
      that.getHomeDocsData()
      that.initEvent()
    } else {
      that.show = false
    }
  },
  methods: {
    getCommonDiseaseData: function () {
      var that = this
      // var startTime = new Date().getTime(),
      //   finTime = 0
      baike.post(
        '/mobile/getCommonDiseaseData', {
          data: '鹅厂常见疾病'
        },
        function (o) {
          // finTime = new Date().getTime()
          for (var i = 0; i < o.diseases.length; i++) {
            if (o.diseases[i].image !== '') {
              that.commonImages.push(o.diseases[i])
            } else {
              that.commonList.push(o.diseases[i])
            }
          }
          window.medTimer && window.medTimer.reportTime({
            action: 'enter_hr_page',
            ispage: 1
          })
          // baike.sendReport(window.location.href,finTime - startTime,'getCommonDiseaseData',o.retcode)
        }
      )
    },
    getHomeDocsData: function () {
      var that = this
      that.loading = true
      var page = enterGlobalVar.page
      var pageSize = enterGlobalVar.pageSize
      baike.post(
        '/mobile/getHomeDocsData', {
          offset: (page - 1) * pageSize,
          count: pageSize,
          data: 'hr_hot_docs'
        },
        function (o) {
          that.loading = false
          if (o.retcode === 0) {
            enterGlobalVar.page++
            var docs = o.docs || []
            if (docs.length > 0) {
              that.paperList = that.paperList.concat(
                docs.map(function (doc) {
                  if (doc && doc['tid' + doc.tid]) {
                    return doc['tid' + doc.tid]
                  }
                })
              )
            }
            that.loaded = docs.length < pageSize
          }
        }
      )
    },
    load (event) {
      var that = this
      if (that.loaded) {
        window.removeEventListener('scroll', that.load)
        return
      }
      if (that.loading) return

      var scrollTop = document.body.scrollTop
      var scrollHeight = document.body.scrollHeight
      var windowHeight = window.screen.height
      if (scrollTop >= scrollHeight - windowHeight) {
        that.getHomeDocsData()
      }
    },
    initEvent: function () {
      window.addEventListener('scroll', this.load)
    },
    goMy: function () {
      baike.goToUrl('/mobile/my.html?ptag=ydd_main_my')
    },
    toAuthority: function () {
      baike.goToUrl('/mobile/authority.html?ptag=ydd_main_yddlogo')
    },
    goNewSearch: function () {
      baike.mtaReport('ydd_main_searchnew')
      this.$store.dispatch('showMiniSearch')
    },
    toBaike: function () {
      baike.goToUrl('/mobile/home.html?ptag=ydd_main_dlist')
    },
    toArticle: function (index) {
      var that = this
      var article = that.paperList[index]
      if (article) {
        baike.goToUrl(
          '/mobile/article.html?type=hot&docid=' +
          article.docid +
          '&ptag=YDD_Main_ArticleX|' +
          (index + 1) +
          '&name=' +
          ((article.diseases &&
            article.diseases[0] &&
            article.diseases[0].name) ||
            '')
        )
      }
    },
    toOverview: function (e) {
      var target = e.target
      var name = target.getAttribute('data-name')
      var type = $(target).data('type') || 0
      var ptag = ''
      if (baike.query('adtag') === 'tx.wx.hr') {
        ptag = 'ydd_hr_diseasex|' + name
      }
      baike.goToUrl(
        baike.getOverview({
          name: name,
          type: type
        }) + '&ptag=' + ptag
      )
    }
  }
}

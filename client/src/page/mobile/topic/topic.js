/* global baike */
import sourceDisclaimer from 'components/source_disclaimer/source_disclaimer.vue'
import actionbar from 'components/actionbar/actionbar.vue'
import tmenu from 'components/tmenu/tmenu.vue'

export default {
  data () {
    return {
      name: '',
      topic: '',
      // block
      block: '',
      tlist: [],
      isShow: false,
      isHot: false,
      // actionbar
      hStatus: '',
      hCount: 0,
      fbStatus: '',
      actionOps: null
    }
  },
  components: {
    sourceDisclaimer,
    actionbar,
    tmenu
  },
  activated () {
    // 单页缓存分享数据重置
    this.setShare(this.shareCache)
  },
  created: function () {
    var that = this
    that.name = baike.query('name')
    that.topic = baike.query('topic')
    that.isHot = that.topic === '热门文章'
    that.init()
    // baike.setTitle('企鹅医典·' + that.name)
  },
  mounted: function () { },
  watch: {
    currentBranch: 'init'
  },
  methods: {
    // initiate
    init: function () {
      var that = this
      var url = '/mobile/getDiseaseDocsData'
      var params = {
        name: that.name
      }
      if (!that.isHot) {
        url = '/mobile/getTopicData'
        params.topic = that.topic
      }
      baike.post(url, params, function (o) {
        if (o.retcode === 0) {
          that.initPageInfo(o)
          that.isShow = true
          that.setShare({
            title: that.name + '-企鹅医典',
            desc: '传递健康与信赖'
          })
          that.actionOps = {
            tid: 4,
            name: that.name,
            tab: that.topic,
            hStatus: that.hStatus,
            hCount: that.hCount,
            fbStatus: that.fbStatus,
            topnav: '#searcher',
            showHelp: true,
            showFdbk: true
          }
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'topic_page',
          ispage: 1
        })
      }, true)
    },
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    initPageInfo: function (o) {
      var that = this
      if (that.isHot) {
        that.type = o.type
        that.jinpin = o.jinpin
        that.tlist = o.tlist || []
      } else {
        that.block = o
        that.topic = o.baseinfo ? o.baseinfo.title : that.topic
        that.type = o.type
        that.jinpin = o.jinpin
        that.docid = o.docid
        that.hStatus = o.helpful
        that.hCount = o.helpfulCount
        that.fbStatus = o.feedback
      }
    },
    // interactions
    goBack: function () {
      var that = this
      baike.goToUrl(baike.getOverview({ name: that.name, type: that.jinpin }) + '&ptag=ydd_reviewnavbar_card')
    },
    toArticle: function (type, docid, index) {
      var ptag = ''
      // var index = ''
      if (docid) {
        switch (type) {
          case 'hot':
            // MtaH5.clickStat('ydd_dochome_articalx', {
            //   'value': index
            // })
            ptag = 'YDD_Dochome_ArticalX|' + index
            break
          case 'related':
            // MtaH5.clickStat('YDD_Topic_RelatedX', {
            //   'value': docid
            // })
            ptag = 'YDD_Topic_RelatedX|' + docid
            break
          case 'topic':
            // MtaH5.clickStat('YDD_Topic_ArticleX', {
            //   'id': docid
            // })
            ptag = 'YDD_Topic_ArticleX|' + docid
            break
          case 'research':
            // MtaH5.clickStat('YDD_Topic_ResearchX', {
            //   'val': docid
            // })
            ptag = 'YDD_Topic_ResearchX|' + docid
            break
          default:
            break
        }
        baike.goToUrl('/mobile/article.html?docid=' + docid + '&name=' + this.name + '&ptag=' + ptag)
      }
    },
    actionCb: function (action, type, res) {
      if (action === 'feedback') {
        this.fbStatus = !this.fbStatus
        this.$msg.toast('我们会努力做得更好', 'success')
      }
    },
    showActionbar: function () {
      this.$refs.actionbar.showActionbar = true
    },
    bind: function () { },
    toCollectMp: function () { // 关注公众号上报
      baike.mtaReport('ydd_articledetail_followwechart')
      window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIzMzg4Mzc5Nw==&scene=124#wechat_redirect'
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch')
      }
    }
  }
}

/* global $, baike */
import { ActiveBroadcast } from 'components/activity/activity'
import tmenu from 'components/tmenu/tmenu.vue'
import { lockedReq } from 'src/js/specialReq.js'

export default {
  data () {
    return {
      isShow: false,
      name: baike.query('name') || '',
      activeOps: null,
      opReview: {},
      related: [],
      topicList: [],
      followed: false,
      topicDesease: {},
      lineCapNum: 9,
      maxHeight: '6.7rem',
      mdContent: '',
      isMore: false,
      isXcx: baike.isXcx() || false
    }
  },
  components: {
    ActiveBroadcast,
    tmenu
  },
  watch: {
    // related: function (val, oldVal) {
    //   var that = this
    // }
  },
  updated: function () {
    var that = this
    that.$nextTick(function () {
      if ($('.inner-md').height() > $('.img').height()) {
        that.isMore = true
      }
      // Code that will run only after the
      // entire view has been re-rendered
    })
  },
  activated () {
    // 单页缓存分享数据重置
    this.setShare(this.shareCache)
  },
  created: function () {
    var that = this
    that.getOverviewBaseinfo()
    that.getActiveData()
    // baike.setTitle('企鹅医典·' + that.name)
  },
  mounted: function () {
    // this.imgLoad();
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    // 获取dom节点
    $: function (selector) {
      return document.querySelector(selector)
    },
    getOverviewBaseinfo: function () {
      var that = this
      // 获取种类
      var url = '/mobile/getOverviewBaseinfo'
      baike.get(url, {
        name: that.name,
        type: 2
      }, function (o) {
        if (o.retcode === 0) {
          var baseinfo = o.baseinfo
          if (baseinfo && baseinfo.length > 0) {
            that.baseinfo = baseinfo[0]
            var tid22 = baseinfo[0]['tid22']
            if (tid22) {
              that.name = tid22.name || that.name
              that.mdContent = tid22.v_md_definition
              that.topicDesease = tid22
              if (tid22.op_review) that.opReview = tid22.op_review
            }
          }

          that.related = o.related || []
          that.followed = o.follow
          that.isShow = true
          // baike.setTitle('企鹅医典·' + that.name)
          // 微信JSSDK开发
          that.setShare({
            title: '企鹅医典·' + that.name,
            desc: that.baseinfo['tid22'].definition || '传递健康与信赖'
          })
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'overview_m_page',
          ispage: 1
        })
      }, true)
    },
    // 运营位
    getActiveData () {
      baike.post('/mobile/getActiveData', {
        activetype: 3,
        name: this.name
      }, o => {
        if (o.retcode === 0) {
          this.activeOps = { list: o.activelist, area: 'cardm_top', maxCnt: 5 }
        }
      })
    },
    relatedToOverview: function (name, type, index) {
      var ptag = 'YDD_MTopic_SubTopic_Clk|' + index
      if (baike.query('adtag') === 'tx.wx.hr') {
        ptag += ',ydd_hr_diseasex'
      }
      baike.goToUrl(baike.getOverview({ name: name, type: type }) + '&ptag=' + ptag)
    },
    followClick: function () {
      var that = this
      lockedReq({
        method: 'post',
        url: that.followed ? '/mobile/del_follow' : '/mobile/add_follow',
        callback: function (o) {
          if (o.retcode === 0) {
            if (!that.followed) {
              // MtaH5.clickStat('ydd_content_follow')
              that.$msg.toastAdd('focus')
            } else {
              // MtaH5.clickStat('ydd_content_unfollow')
            }
            that.followed = !that.followed
          }
        }
      }, { disease: that.name })
    },
    toDoctor: function (doctorId) {
      // MtaH5.clickStat('ydd_content_docinform')
      baike.goToUrl('/mobile/doctor.html?ptag=ydd_content_docinform&doctor_id=' + doctorId)
    },
    toDDetail: function (pinyin, name) {
      var ptag = ''
      if (pinyin) { // 有拼音的上报
        // MtaH5.clickStat('YDD_Content_DiseaseX', {
        //   'value': name
        // })
        ptag = 'YDD_Content_DiseaseX' + name
      } else {
        // MtaH5.clickStat('ydd_content_overview')
        ptag = 'ydd_content_overview'
      }
      baike.goToUrl(`/mobile/ddetail.html?ptag=${ptag}&name=` + this.name + (pinyin ? '#' + pinyin : ''))
    },
    showAllText: function () {
      if (isFinite(this.lineCapNum)) {
        this.lineCapNum = 'unset'
        this.maxHeight = ''
        // MtaH5.clickStat('YDD_MTopic_Desp_Unfold')
      } else {
        this.lineCapNum = this.opReview.text ? 8 : 9
        this.maxHeight = '6.7rem'
      }
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.name })
      }
    }
  }
}

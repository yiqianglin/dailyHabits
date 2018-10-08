/* global $, baike */
import paper from 'components/paper/paper.vue'
import topicdocs from 'components/topicdocs/topicdocs.vue'
import { ActiveBroadcast } from 'components/activity/activity'
import depressiontest from 'components/depressiontest/depressiontest.vue'
import tmenu from 'components/tmenu/tmenu.vue'
import loading from 'components/loading/loading.vue'
import {lockedReq} from 'src/js/specialReq.js'

export default {
  data () {
    return {
      name: '',
      isShow: false,
      activeOps: null,
      baseinfo: '',
      related: [],
      topic: [],
      followed: 0,
      isShowMenu: !document.referrer,
      isXcx: baike.isXcx() || false,
      search_lib: ''
    }
  },
  components: {
    paper,
    topicdocs,
    ActiveBroadcast,
    depressiontest,
    tmenu,
    loading
  },
  activated () {
    this.setShare(this.shareCache)
  },
  created: function () {
    var that = this
    var name = baike.query('name') || ''
    that.name = name
    that.getOverviewBaseinfo()
    that.getOverviewTopic()
    that.getActiveData()
    that.search_lib = baike.sstore.getItem('search_lib')
    // baike.setTitle('企鹅医典·' + name)
    var hid = ({ '腰椎间盘突出症': '5a2e7f185f24e', '哮喘': '5a2e7f063820c', '乳腺癌': '5a2e7eed601c7' })[name]
    if (hid) {
      var el = document.createElement('script')
      el.src = '//pingjs.qq.com/h5/hotclick.js?v2.0'
      el.setAttribute('name', 'mtah5hotclick')
      el.setAttribute('sid', '500487122')
      el.setAttribute('hid', hid)
      $('body').append(el)
    }
  },
  watch: {
    currentBranch: 'getOverviewBaseinfo'
  },
  computed: {
    alias: function () {
      var alias = ''
      if (this.baseinfo[0].op_alias) {
        alias = this.baseinfo[0].op_alias.join('，')
      }
      return alias.replace(/(.*)[，]$/, '$1')
    },
    doc_id: function () {
      return ((this.baseinfo[0] && this.baseinfo[0].op_quickoverview) || '')
    }
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    getOverviewBaseinfo: function () {
      var that = this
      baike.get('/mobile/getOverviewBaseinfo', { name: that.name, type: 1 }, function (o) {
        if (o.retcode === 0) {
          var baseinfo = o.baseinfo
          if (baseinfo && baseinfo.length > 0) {
            var list = []
            baseinfo.forEach(function (item) {
              list.push(item['tid' + item.tid] || item)
            })
            that.name = list[0].name || that.name
            that.baseinfo = list
          }
          that.related = o.related || []
          that.followed = o.follow
          that.isShow = true
          // baike.setTitle('企鹅医典·' + that.name)
          // 微信JSSDK开发
          that.setShare({
            title: '企鹅医典·' + that.name,
            desc: that.baseinfo[0].definition || '传递健康与信赖'
          })
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'overview_page',
          ispage: 1
        })
      }, true)
    },
    getOverviewTopic: function () {
      var that = this
      baike.get('/mobile/getOverviewTopic', { name: that.name, type: 1 }, function (o) {
        if (o.retcode === 0) {
          var topic = o.topic
          topic.forEach((item) => {
            item.name = item.title
          })
          if (topic && topic.length > 0) {
            that.topic = topic
          }
        }
      })
    },
    // 运营位
    getActiveData () {
      baike.post('/mobile/getActiveData', {
        activetype: 3,
        name: this.name
      }, o => {
        if (o.retcode === 0) {
          this.activeOps = { list: o.activelist, area: 'cardwitha_top', maxCnt: 5 }
        }
      })
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
    relatedToOverview: function (name, type, index) {
      var ptag = 'YDD_Content_Related_DiseasesX|' + index
      baike.goToUrl(baike.getOverview({ name: name, type: type }) + '&ptag=' + ptag)
    },
    toDoctor: function (doctorId) {
      baike.goToUrl('/mobile/doctor.html?doctor_id=' + doctorId + '&ptag=ydd_content_docinform')
    },
    navToDDetail: function (name, pinyin) {
      var ptag = 'YDD_Content_DiseaseX:' + name
      var that = this
      var docId = that.doc_id
      baike.goToUrl(`/mobile/ddetail.html?ptag=${ptag}&name=` + that.name + (docId ? ('&doc_id=' + docId) : '') + '#' + pinyin)
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.name })
      }
    }
  }
}

/* global $, baike */
import { ActiveBroadcast } from 'components/activity/activity'
import paper from 'components/paper/paper.vue'
import actionbar from 'components/actionbar/actionbar.vue'
import topicdocs from 'components/topicdocs/topicdocs.vue'
import tmenu from 'components/tmenu/tmenu.vue'
import loading from 'components/loading/loading.vue'
import {lockedReq} from 'src/js/specialReq.js'

export default {
  data () {
    return {
      isShow: false,
      name: baike.query('name') || '',
      activeOps: null,
      opReview: {},
      topicList: [],
      topic: [],
      followed: false,
      topicDesease: {},
      isXcx: baike.isXcx() || false,
      search_lib: ''
    }
  },
  components: {
    ActiveBroadcast,
    paper,
    actionbar,
    topicdocs,
    tmenu,
    loading
  },
  activated () {
    // 单页缓存分享数据重置
    this.setShare(this.shareCache)
  },
  created: function () {
    // 避免单页缓存路由未更新时全局函数已被执行
    try {
      var name = baike.query('name')
      if (name === '乳腺癌' || name === '哮喘' || name === '腰椎间盘突出症') {
        var url = baike.getOverview({ name: name })
        var ptag = baike.query('ptag')
        if (url) {
          if (ptag) url += '&ptag=' + ptag
          if (baike.isXcx()) url += '&from=miniprogram'
          location.replace(url)
          return
        }
      }
    } catch (e) { }
    var that = this
    that.getOverviewBaseinfo()
    that.getOverviewTopic()
    that.getActiveData()
    that.search_lib = baike.sstore && baike.sstore.getItem('search_lib')
    // baike.setTitle('企鹅医典·' + that.name)
    if (that.name === '乳腺癌') {
      $('body').append('<script type="text/javascript" src="//pingjs.qq.com/h5/hotclick.js?v2.0" name="mtah5hotclick" sid="500487122" hid="5a2e7eed601c7"></script>')
    }
  },
  mounted: function () {
    // this.imgLoad();
  },
  methods: {
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
        type: 0
      }, function (o) {
        if (o.retcode === 0) {
          that.isShow = true
          that.followed = (o.follow === 1)

          var baseinfo = o.baseinfo
          if (baseinfo && baseinfo.length > 0) {
            var list = []
            baseinfo.forEach(function (item) {
              list.push(item['tid' + item.tid] || item)
            })
            baseinfo = list
            if (baseinfo[1] && baseinfo[1].list) that.topicList = baseinfo[1].list
            if (baseinfo[0]) {
              that.name = baseinfo[0].name || that.name
              // baike.setTitle('企鹅医典·' + that.name)
              that.topicDesease = baseinfo[0]
            }
            if (that.topicDesease.op_review) that.opReview = that.topicDesease.op_review
            that.setShare({
              title: '企鹅医典·' + that.name,
              desc: baseinfo[0].definition || '传递健康与信赖'
            })
          }
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'overview_pt_page',
          ispage: 1
        })
      }, true)
    },
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    getOverviewTopic: function () {
      var that = this
      baike.get('/mobile/getOverviewTopic', { name: that.name, type: 0 }, function (o) {
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
          this.activeOps = { list: o.activelist, area: 'cardnoa_top', maxCnt: 5 }
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
              that.$msg.toastAdd('focus')
            }
            that.followed = !that.followed
          }
        }
      }, {
        disease: that.name
      })
    },
    toDoctor: function (doctorId) {
      baike.goToUrl('/mobile/doctor.html?ptag=ydd_content_docinform&doctor_id=' + doctorId)
    },
    toDDetail: function (pinyin, name) {
      var ptag = ''
      if (pinyin) { // 有拼音的上报
        ptag = 'YDD_Content_DiseaseX:' + name
      } else {
        ptag = 'ydd_content_overview'
      }
      baike.goToUrl(`/mobile/ddetail.html?ptag=${ptag}&name=` + this.name + (pinyin ? '#' + pinyin : '#gaishu'))
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.name })
      }
    }
  }
}

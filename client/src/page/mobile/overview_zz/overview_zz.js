/* global baike */
import tmenu from 'components/tmenu/tmenu.vue'
import { ActiveBroadcast } from 'components/activity/activity'
import { lockedReq } from 'src/js/specialReq.js'

export default {
  data () {
    return {
      isShow: false,
      name: baike.query('name') || '',
      activeOps: null,
      baseinfo: '',
      opReview: {},
      topicList: [],
      topicItems: [],
      topic: [],
      currentIndex: 0,
      currentIndexBtm: 4,
      followed: false,
      topicDesease: {},
      isXcx: baike.isXcx() || false,
      search_lib: ''
    }
  },
  components: {
    ActiveBroadcast,
    tmenu
  },
  activated () {
  },
  created: function () {
    var that = this
    that.getOverviewBaseinfo()
    that.getOverviewTopic()
    that.getActiveData()
    that.search_lib = baike.sstore.getItem('search_lib')
    // baike.setTitle('企鹅医典·' + that.name)
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
        type: 3
      }, function (o) {
        if (o.retcode === 0) {
          var baseinfo = o.baseinfo
          if (baseinfo && baseinfo.length > 0) {
            var list = []
            baseinfo.forEach(function (item) {
              list.push(item['tid' + item.tid] || item)
            })
            baseinfo = list
            if (baseinfo[1] && baseinfo[1].list) that.topicItems = baseinfo[1].list
            if (that.topicItems.length > 3) {
              that.topicItems.length = 3
            }

            if (baseinfo[0]) {
              that.name = baseinfo[0].name
              // baike.setTitle('企鹅医典·' + that.name)
              that.topicDesease = baseinfo[0]
            }
            if (that.topicDesease.op_review) that.opReview = that.topicDesease.op_review
            that.name = baseinfo[0].name || that.name
            that.baseinfo = baseinfo
          }
          that.related = o.related || []
          that.followed = o.follow
          that.isShow = true
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'overview_zz_page',
          ispage: 1
        })
      }, true)
    },
    getOverviewTopic: function () {
      var that = this
      baike.get('/mobile/getOverviewTopic', { name: that.name, type: 3 }, function (o) {
        if (o.retcode === 0) {
          var topic = o.topic
          if (topic && topic.length > 0) {
            that.topic = topic
            if (topic[0].list) that.topicList = topic[0].list
            if (topic[4] && topic[4].list) that.topicListBtm = topic[4].list
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
          this.activeOps = { list: o.activelist, area: 'cardsym_top', maxCnt: 5 }
        }
      })
    },
    topicToDDetail: function (btm) {
      var index = btm === 'btm' ? this.currentIndexBtm : this.currentIndex
      var ptag = ''
      if (index > 0) {
        ptag = 'ydd_content_topicmorex'
        baike.goToUrl('/mobile/topic.html?name=' + this.name + '&topic=' + this.topic[index].topic + '&ptag=' + ptag)
      } else {
        ptag = 'ydd_content_recoartimore'
        baike.goToUrl('/mobile/topic.html?name=' + this.name + '&topic=' + this.topic[index].topic + '&ptag=' + ptag)
      }
    },
    topicTabClick: function (index) {
      baike.mtaReport('pv')
      var that = this
      if (index < 4) {
        that.currentIndex = index
        that.topicList = that.topic[index].list
      } else {
        that.currentIndexBtm = index
        that.topicListBtm = that.topic[index].list
      }

      // if (index > 0) {
      //   MtaH5.clickStat('YDD_Content_TopicTabX', {'value': index})
      // } else {
      //   MtaH5.clickStat('ydd_content_recoartitab')
      // }

      var isRead = that.topic[index].readflag
      var list = that.topic[index].list
      if (isRead) {
        for (var k in list) {
          list[k].readflag = isRead
        }
        that.topic[index].list = list
      }
      that.topic[index].readflag = 1
      that.updateTopicVT(that.topic[index].topic)
    },
    updateTopicVT: function (topic) {
      var that = this
      baike.post('/mobile/update_topic_vt', { name: that.name, topic: topic }, function (o) { })
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
      baike.goToUrl('/mobile/doctor.html?doctor_id=' + doctorId + '&ptag=ydd_content_docinform')
    },
    toDDetail: function (pinyin, name) {
      var ptag = ''
      if (pinyin) { // 有拼音的上报
        // MtaH5.clickStat('YDD_Content_DiseaseX', {'value': name})
        ptag = 'YDD_Content_DiseaseX|' + name
      } else {
        // MtaH5.clickStat('ydd_content_overview')
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

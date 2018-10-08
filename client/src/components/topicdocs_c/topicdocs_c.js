/* global $, baike */
import 'src/libs/dropload/dropload.min.css'
import 'src/libs/dropload/dropload'
import paper from 'components/paper/paper.vue'
import papertagTwoLine from 'components/tagTabCommon/twoLine.vue'
import { pageLoad } from 'src/js/specialReq.js'
// import papertagTwoLineOutter from 'components/tagTabCommon/twoLineOutter.vue'

window.pullLock = false
var globalVar = {
  isInit: true
}

export default {
  name: 'topicdocs_c',
  props: ['topic', 'name', 'paperlistdis', 'activelist', 'toplistdis', 'disloaded', 'rkey', 'noempty', 'threeImgWidth', 'showMode', 'ishotqa'],
  data: function () {
    return {
      paperList: [],
      tabFixed: false,
      loaded: false,
      currentIndex: null,
      currentTabName: baike.query('topicdocs_tab_name') || '',
      reportkey: {},
      toplist: [],
      toplisttemp: [],
      mode: baike.query('mode') || 2,
      isShow: false,
      currentTitle: '' // 只在更新数据后，再做更新，不然热门问答样式会错乱
    }
  },
  components: {
    paper,
    papertagTwoline: papertagTwoLine
    // papertagTwolineOutter: papertagTwoLineOutter
  },
  created () {
    this.paperList = this.paperlistdis
    this.toplist = this.toplistdis
    this.toplisttemp = this.toplistdis
    var tempIndexFromUrl = 0
    this.topic.filter((item, index) => {
      if (item.title === this.currentTabName) {
        tempIndexFromUrl = index
      }
      return item.title === this.currentTabName
    })
    globalVar.isInit = false
    this.bindEvent()
    this.topicTabClick(tempIndexFromUrl)
  },
  destroyed () {
    $(window).off('scroll', this.handleScrollFn)
  },
  deactivated () {
    $(window).off('scroll', this.handleScrollFn)
  },
  activated () {
    this.bindEvent()
  },
  watch: {
    rkey: function () {
      this.reportkey = this.rkey
    },
    disloaded: function () {
      this.loaded = this.disloaded
    },
    paperlistdis: function (val) {
      this.paperList = this.paperlistdis
    },
    toplistdis: function () {
      var that = this
      that.toplisttemp = that.toplistdis
      that.toplist = that.toplisttemp
      that.topicTabClick(that.currentIndex)
    },
    currentIndex: function (val) {
      var that = this
      if (val === 0) {
        that.toplisttemp = that.toplistdis
        that.toplist = that.toplisttemp
      }
      that.topicTabClick(that.currentIndex)
    }
  },
  methods: {
    getOverviewTopicDocs: function (topic, isSwitch, cb) {
      console.log('------', topic)
      if (!topic) return
      var that = this
      pageLoad({
        key: topic,
        url: '/mobile/getOverviewTopicDocs',
        isSwitch: isSwitch,
        cb: function (pageData) {
          console.log('回调')
          var list = pageData.list
          if (list && list.length > 0) {
            var tmplist = []
            list.forEach(function (item) {
              if (item && item['tid' + item.tid]) {
                tmplist.push(item['tid' + item.tid])
              } else {
                tmplist.push(item)
              }
            })
            that.currentTitle = topic
            that.paperList = tmplist
          }
          that.loaded = pageData.loaded
          cb && cb()
        }
      }, { topic: topic, name: that.name })
    },
    topicTabClickAndReport: function (index) {
      baike.mtaReport('pv')
      baike.mtaReport(index === 0 ? `ydd_content_recoartitab:${this.topic[index].name}` : `YDD_Content_TopicTabX:${this.topic[index].name}`)
      this.topicTabClick(index)
    },
    topicTabClick: function (index) {
      var that = this
      if (that.currentIndex === index) {
        return
      }
      that.currentIndex = index
      console.log('--------------------------------in here')
      that.$emit('topicclick', index)
      if (index === 0) {
        that.paperList = that.paperlistdis
        that.loaded = that.disloaded
        that.toplist = that.toplisttemp
        window.dropload && window.dropload.unlock()
        that.isShow = true
        return
      } else {
        that.toplist = []
        window.dropload && window.dropload.lock()
      }
      var curTopic = that.topic[index]
      // var isRead = curTopic.readflag
      curTopic.readflag = 1
      console.log('拉取新的')
      that.getOverviewTopicDocs(curTopic.topic, true, function () {
        that.isShow = true
        // if (isRead) {
        //   that.paperList.forEach(function (item) {
        //     item.readflag = isRead
        //   })
        // }
      })
      if (that.tabFixed) {
        $(window).scrollTop($('#topicWrap').offset().top - $('.tmenu').height() + $('.papertag .tabs-row').height())
        if (index > 2) {
          $('#tabWrap').scrollLeft((index - 2) * 80)
        }
      }
      that.updateTopicVT(curTopic.topic)
      setTimeout(function () { // 锁定有问题，再次锁定一次
        if (that.currentIndex === 0) {
          window.dropload && window.dropload.unlock()
        } else {
          window.dropload && window.dropload.lock()
        }
      }, 500)
    },
    updateTopicVT: function (topic) {
      var that = this
      baike.post('/mobile/update_topic_vt', { name: that.name, topic: topic }, function (o) { })
    },
    handleScrollFn () {
      var that = this
      var pageHeight = $(window).height()
      var topic = that.topic
      if (topic && topic.length > 0) {
        var st = $(window).scrollTop()
        var $topic = $('#topicWrap')
        if ($topic.length === 0) return
        var topicTop = $topic.offset().top
        if (st > topicTop + $topic.height() - pageHeight - 100) {
          if (that.currentIndex === 0) {
            that.loaded = that.disloaded
          } else {
            that.getOverviewTopicDocs(topic[that.currentIndex]['topic'])
          }
        }
        that.tabFixed = (topic.length > 1 && (st > topicTop - $('.tmenu').height()) && (st < topicTop + $topic.height() - 50))
        if (that.tabFixed) {
          if (that.currentIndex > 2 && $('#tabWrap').scrollLeft() !== (that.currentIndex - 2) * 80) {
            $('#tabWrap').scrollLeft((that.currentIndex - 2) * 80)
          } else if (that.currentIndex <= 2 && $('#tabWrap').scrollLeft() !== 0) {
            $('#tabWrap').scrollLeft(0)
          }
        }
      }
    },
    bindEvent: function () {
      $(window).on('scroll', this.handleScrollFn)
    }
  }
}

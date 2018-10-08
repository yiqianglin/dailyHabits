/* global $, baike */
import paper from 'components/paper/paper.vue'
import papertagTwoLine from 'components/tagTabCommon/twoLine.vue'
import { pageLoad } from 'src/js/specialReq.js'

export default {
  props: ['topic', 'name', 'tag', 'rkey'],
  data: function () {
    return {
      paperList: [],
      tabFixed: false,
      loaded: false,
      currentIndex: 0,
      currentTitle: '' // 只在更新数据后，再做更新，不然热门问答样式会错乱
    }
  },
  created () {
    this.globalVar = {
      isInit: true
    }
  },
  components: {
    paper,
    papertagTwoline: papertagTwoLine
  },
  watch: {
    topic: function (val) {
      var that = this
      if (that.globalVar.isInit && val && val.length > 0) {
        that.globalVar.isInit = false
        that.bindEvent()
        that.getOverviewTopicDocs(val[0]['topic'])
      }
    }
  },
  activated () {
    $(window).on('scroll', this.handleScrollFn)
  },
  deactivated () {
    $(window).off('scroll', this.handleScrollFn)
  },
  destroyed () {
    $(window).off('scroll', this.handleScrollFn)
  },
  methods: {
    getOverviewTopicDocs: function (topic, isSwitch, cb) {
      if (!topic) return
      var that = this
      pageLoad({
        key: topic,
        url: '/mobile/getOverviewTopicDocs',
        isSwitch: isSwitch,
        cb: function (pageData) {
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
      }, {topic: topic, name: that.name, tag: that.tag || ''})
    },
    topicTabClick: function (index) {
      baike.mtaReport('pv')
      var that = this
      if (that.currentIndex === index) return
      that.currentIndex = index
      var curTopic = that.topic[index]
      curTopic.readflag = 1
      that.getOverviewTopicDocs(curTopic.topic, true)
      if (that.tabFixed) {
        $(window).scrollTop($('#topicWrap').offset().top - $('.tmenu').height() + 20)
      }
      that.updateTopicVT(curTopic.topic)
      baike.mtaReport('YDD_Content_TopicTabX:' + this.topic[index].name)
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
          that.getOverviewTopicDocs(topic[that.currentIndex]['topic'])
        }
        that.tabFixed = (topic.length > 1 && (st > topicTop - $('.tmenu').height()) && (st < topicTop + $topic.height() - 50))
      }
    },
    bindEvent: function () {
      $(window).on('scroll', this.handleScrollFn)
    }
  }
}

/* global $, baike */
import tmenu from 'components/tmenu/tmenu.vue'
import { pageLoad } from 'src/js/specialReq.js'

export default {
  data () {
    return {
      name: '',
      show: false,
      loaded: false,
      allTagList: [],
      filterTags: [],
      recruitsByTag: {},
      recruits: [],
      isXcx: baike.isXcx() || false
    }
  },
  components: {
    tmenu
  },
  activated () {
    // 单页缓存分享数据重置
    this.setShare(this.shareCache)
    window.addEventListener('scroll', this.load)
  },
  destroyed () {
    window.removeEventListener('scroll', this.load)
  },
  deactivated () {
    window.removeEventListener('scroll', this.load)
  },
  created: function () {
    var that = this
    that.name = baike.query('name')
    that.init()
    // that.setTitle('企鹅医典·' + that.name + '-' + '临床招募')
  },
  mounted: function () {
    var that = this
    // setTimeout(function () {
    //     that.bind();
    //     that.scrollToTag(that.tagIndex);
    // }, 0);
    that.$nextTick(function () {
      that.bind()
    })
  },
  computed: {},
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    init: function () {
      var that = this
      baike.post('/mobile/getDiseaseRecruitInfo', {
        name: that.name
      }, function (o) {
        if (o.retcode === 0) {
          var allTagList = o.tagslist
          var filterTags = []
          for (var i = 0; i < allTagList.length; i++) {
            filterTags[i] = '全部'
          }
          that.allTagList = allTagList
          that.filterTags = filterTags.length ? filterTags : ['全部', '全部']
          that.getRecruitData()
          that.show = true
          that.setShare({
            title: '企鹅医典·' + that.name + '-' + '临床招募'
          })
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'recruit_page',
          ispage: 1
        })
      })
    },
    setTitle: function (title) {
      document.title = title
      var iframe = $('<iframe style=\'display:none;\' src=\'/favicon.ico\'></iframe>')
      iframe.on('load', function () {
        setTimeout(function () {
          iframe.off('load').remove()
        }, 0)
      }).appendTo($('body'))
    },
    getRecruitData: function () {
      var that = this
      var key = that.filterTags.join('|')
      if (!key) {
        that.loaded = true
        that.recruits = []
        return
      }
      if (!that.recruitsByTag[key]) {
        that.recruitsByTag[key] = {
          loaded: false,
          loading: false,
          list: []
        }
      }
      var currentItem = that.recruitsByTag[key]
      that.loaded = currentItem.loaded
      if (currentItem.loaded || currentItem.loading) return
      currentItem.loading = true

      var keyWithoutAll = (key + '|').replace(/全部\|/g, '')
      var name = keyWithoutAll ? that.name + '|临床招募|' + keyWithoutAll.substr(0, keyWithoutAll.length - 1) : that.name + '|临床招募'
      var pageSize = that.recruits.length ? 15 : 6

      pageLoad({
        key: 'getDocsDataByTags_' + that.name + '|临床招募|' + key,
        url: 'getDocsDataByTags',
        pageSize: pageSize,
        retKey: 'docs',
        cb: function (pageData) {
          currentItem.loading = false
          currentItem.loaded = pageData.loaded
          that.loaded = currentItem.loaded
          var docs = pageData.list
          if (docs && docs.length > 0) {
            var list = resolveDocs(docs)
            currentItem.list = list
            that.recruits = currentItem.list
          }
        }
      }, {
        name: name,
        type: 101,
        tagtopflag: 1
      })

      function resolveDocs (doclist) {
        var tmplist = []
        doclist.forEach(function (item) {
          if (item && item['tid' + item.tid]) {
            tmplist.push(item['tid' + item.tid])
          } else {
            tmplist.push(item)
          }
        })
        return tmplist
      }
    },
    // interactions
    clickTag: function (listIdx, tag) {
      var that = this
      if (listIdx in that.filterTags) {
        that.filterTags[listIdx] = tag
        that.$forceUpdate()
      }
      var key = that.filterTags.join('|')
      var currentItem = that.recruitsByTag[key]
      if (!currentItem || !currentItem.list.length) {
        that.recruits = []
        that.getRecruitData()
      } else {
        that.recruits = currentItem.list
      }
    },
    toRecruit: function (item) {
      var that = this
      if (item.docid) {
        baike.goToUrl('/mobile/article.html?src=recruit&name=' + that.name + '&docid=' + item.docid)
      }
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch')
      }
    },
    load (event) {
      var that = this
      var scrollTop = $(window).scrollTop()
      var scrollHeight = $('body').height()
      var windowHeight = $(window).height()
      if (scrollTop >= scrollHeight - windowHeight) {
        that.getRecruitData()
      }
    },
    bind: function () {
      window.addEventListener('scroll', this.load)

      // function load (event) {
      //   var scrollTop = $(window).scrollTop()
      //   var scrollHeight = $('body').height()
      //   var windowHeight = $(window).height()
      //   if (scrollTop >= scrollHeight - windowHeight) {
      //     that.getRecruitData()
      //   }
      // }
    }
  }
}

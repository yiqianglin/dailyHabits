/* global $, baike */
import 'src/libs/dropload/dropload.min.css'
import 'src/libs/dropload/dropload'
import { ActiveBanner, ActiveConsultant } from 'components/activity/activity'
import paper from 'components/paper/paper.vue'
import papertagMultiLine from 'components/tagTabCommon/multiLine.vue'
import papertagMultiLineOutter from 'components/tagTabCommon/multiLineOutter.vue'
import { pageLoad } from 'src/js/specialReq.js'

export default {
  data () {
    return {
      show: true,
      // 顶部tab
      tabs: [],
      // tabs: [{
      //   title: '推荐',
      //   id: 0,
      //   ptag: 'health_recommend_clk',
      //   data: [],
      //   tags: [],
      //   loaded: false,
      //   tagIndex: -1,
      //   tagExpand: false,
      //   readflag: 1
      // }, {
      //   title: '问答',
      //   id: 1,
      //   ptag: 'health_qa',
      //   data: [],
      //   tags: [],
      //   loaded: false,
      //   tagIndex: -1,
      //   tagExpand: false,
      //   readflag: 1
      // }],
      tabIndex: 0,
      // swiperOps: {},
      activeOps: null,
      // 选择感兴趣
      showInterest: false,
      predefined: [],
      interested: [],
      reportKey: {
        ad: 'health_recommend_bannerx',
        disease: 'health_recommend_hotillx',
        ignoreDisease: 'health_recommend_cancelhotillx',
        tag: 'health_recommend_tagx',
        ignoreTag: 'healthre_commend_tagx',
        qa: 'health_recommend_qax',
        doctor: 'health_recommend_doctorx',
        article: 'hp_feeds_articlex'
      },
      showFixPaperTag: false,
      fixTab: false
    }
  },
  created: function () {
    // var that = this
    // that.swiperOps = {
    //   direction: 'horizontal',
    //   autoplay: 0,
    //   initialSlide: that.tabIndex,
    //   autoHeight: true,
    //   onInit: function (swiper) {
    //     that.swiper = swiper
    //   },
    //   onTransitionEnd: function (swiper) {
    //     if (swiper.activeIndex !== that.tabIndex) {
    //       that.clickTab(swiper.activeIndex)
    //     }
    //   }
    // }
    // 获取感兴趣分类选项
    // that.getInterestList()
    // 获取非固定tab
    // that.getOtherTab()
    // 获取推荐feed
    // that.getHealthRecommend(true)
    // 获取问答标签
    // that.getQATag()
    // 获取内容展示区tab
    this.getActiveData(14)
  },
  activated () {
    window.addEventListener('scroll', this.load)
  },
  destroyed () {
    window.removeEventListener('scroll', this.load)
  },
  deactivated () {
    window.removeEventListener('scroll', this.load)
  },
  computed: {
    interestInAll: function () {
      return this.interested.length === this.predefined.length
    },
    currentTab: function () {
      return this.tabs[this.tabIndex]
    }
  },
  components: {
    ActiveBanner,
    ActiveConsultant,
    paper,
    // pagenav,
    papertagMultiline: papertagMultiLine,
    papertagMultilineOutter: papertagMultiLineOutter
  },
  mounted: function () {
    var that = this
    that.bind()
    this.updateTabByTitle(baike.query('tab'))
    // that.getHomeActiveData()
  },
  methods: {
    getActiveData (type = 14) {
      baike.post('/mobile/getActiveData', {
        activetype: type,
        name: ''
      }, o => {
        if (o.retcode !== 0) return
        var tabList = o.activelist.reduce((result, {
          hometags = []
        }) => {
          var tabs = hometags.map(tab => {
            return {
              // 展示名称
              title: tab.name,
              // 检索名称
              tag: tab.tag,
              id: tab.name,
              type: tab.type,
              ptag: '',
              data: [],
              // tags: tab.tags.map(item => {
              //   return {
              //     name: item
              //   }
              // }),
              loaded: false,
              page: 1,
              tagIndex: -1,
              tagExpand: false,
              readflag: 1
            }
          })
          return result.concat(tabs)
        }, [])
        this.tabs.splice(0, 0, ...tabList)
        this.tabs.forEach((tab, index) => {
          this.getPageData(index)
        })
      })
    },
    getHomeActiveData: function () {
      var that = this
      var url = '/mobile/getHomeActiveData'
      baike.post(url, {}, function (o) {
        if (o.retcode === 0) {
          var activelist = o.activelist || []
          if (o.type === 1) {
            var experts = o.home_doctors || []
            that.activeOps = {
              activeType: 'consultant',
              area: 'health_recommend',
              maxCnt: 5,
              list: experts.slice(0, 5)
            }
          } else if (o.type === 2) {
            that.activeOps = {
              activeType: 'banner',
              area: 'health_recommend',
              maxCnt: 5,
              list: activelist.slice(0, 5)
            }
          }
        }
      })
    },
    toSearch: function () {
      baike.mtaReport('health_search_clk')
      this.$store.dispatch('showMiniSearch')
    },
    clickTab: function (index) {
      var that = this
      if (baike.query('tab')) {
        window.history.replaceState({}, document.title, window.location.href.replace(/tab=([^&#]*)/, 'tab='))
      }
      that.tabIndex = index
      var tab = that.tabs[that.tabIndex]
      tab.readflag = 1
      baike.mtaReport('pv')
      // tab切换重定位至顶部
      // that.scrollToTop()
      that.scrollToTab(index)
      // if (that.swiper && that.swiper.activeIndex !== index) {
      //   that.swiper && that.swiper.slideTo(index)
      // }
      that.getPageData(index)
      // 非推荐tab不允许上拉
      // if (!that.droploadPlugin) return
      // if (that.tabIndex !== 0) {
      //   that.droploadPlugin.lock()
      // } else {
      //   that.droploadPlugin.unlock()
      // }
    },
    closeInterest: function () {
      this.showInterest = false
      window.localStorage.setItem('interest', true)
    },
    interestIn: function (type) {
      var that = this
      if (type === 0) {
        that.interested = that.interestInAll ? [] : that.predefined.slice(0)
      } else if (type === 1 && that.interested.length) {
        $.each(that.interested, (index, item) => {
          baike.mtaReport(`health_recommendthemex:${item}`)
        })
        baike.post('/mobile/addToFavoriteTagsList', {
          tags: that.interested
        }, function (o) {
          if (o.retcode === 0) {
            that.closeInterest()
            that.$msg.toast('您的健康已关注', 'success')
          }
        })
      }
    },
    clickArrow: function () {
      this.tabs[this.tabIndex].tagExpand = !this.tabs[this.tabIndex].tagExpand
    },
    clickTag: function (tagIndex) {
      var that = this
      var tab = that.tabs[that.tabIndex]
      if (tab.tagIndex === tagIndex) {
        tab.tagIndex = -1
      } else {
        tab.tagIndex = tagIndex
      }
      that.getPageData(that.tabIndex)
      baike.mtaReport('health_qalist_illx:' + that.currentTab.tags[tagIndex].name)
    },
    scrollToTab: function (index) {
      var listElem = $('.crumb-tabs')
      var tagsElem = $('.crumb-tabs li')
      if (!listElem.length || !tagsElem.length) return

      var indexLeft = Math.min(Math.max(index, 0), tagsElem.length - 1)
      var diff = (listElem[0].offsetWidth - tagsElem[indexLeft].offsetWidth) / 2
      listElem[0].scrollLeft = tagsElem[indexLeft].offsetLeft < diff ? 0 : tagsElem[indexLeft].offsetLeft - diff
    },
    scrollToTop () {
      if (!this.fixTab) return
      var container = $('#health')
      var scrollTop = container.length ? container.offset().top : $(window).scrollTop()
      $(window).scrollTop(scrollTop)
    },
    updateTabByTitle (title) {
      if (!title) return
      var tabIdx = this.tabs.findIndex((tab) => tab.title === title)
      if (tabIdx !== -1) {
        this.tabIndex = tabIdx
        this.fixTab = true
        this.$nextTick(() => {
          this.scrollToTop()
          this.scrollToTab(tabIdx)
        })
      }
    },
    getInterestList: function () {
      if (window.localStorage.getItem('interest')) return
      var that = this
      baike.post('/mobile/getHomeContentData', {
        type: 11,
        mode: '',
        name: '',
        offset: 0,
        count: 0
      }, function (o) {
        if (o.retcode === 0 && o.home_tags.length) {
          that.predefined = o.home_tags.map((item) => {
            return item.name
          })
          // 默认选择全部关注项
          that.interestIn(0)
          that.showInterest = true
        }
      })
    },
    getOtherTab: function () {
      var that = this
      baike.post('/mobile/getHomeContentData', {
        type: 7,
        mode: '',
        name: '',
        offset: 0,
        count: 0
      }, function (o) {
        if (o.retcode === 0) {
          var others = o.home_tags || []
          for (var i = 0; i < others.length; i++) {
            that.tabs.push({
              title: others[i].name,
              id: that.tabs.length,
              ptag: '',
              data: [],
              tags: [],
              loaded: false,
              tagIndex: -1,
              tagExpand: false,
              readflag: others[i].readflag
            })
          }
          that.getPageData(-1)
        }
        // that.tabs.push({
        //   title: '专题',
        //   id: that.tabs.length,
        //   ptag: '',
        //   data: [],
        //   tags: [],
        //   loaded: false,
        //   tagIndex: -1,
        //   tagExpand: false,
        //   readflag: true
        // })
      })
    },
    getQATag: function () {
      var that = this
      var qaTab = that.tabs[1]
      baike.post('/mobile/getHomeContentData', {
        type: 10,
        mode: '',
        name: '',
        offset: 0,
        count: 0
      }, function (o) {
        if (o.retcode === 0 && o.tags.length) {
          qaTab.tags = o.tags
        }
      })
    },
    getHealthRecommend: function (isFirst, droploadPlugin) {
      var that = this
      var pageSize = 10
      // 上拉更新时数据前置
      var shift = !!droploadPlugin
      var callback = function (pageData) {
        var displayList = pageData.list || []
        var extraData = pageData.extraData

        var start = that.tabs[0].data.length
        var sortrule = extraData.docs.length ? extraData.sortrule : []
        // sortrule默认offset升序
        $.each(sortrule, (index, item) => {
          var offset = shift ? item.offset + index : start + item.offset + index
          var nextItem = null

          if (item.type === 7) {
            // 推荐文章分类 - 1.16暂无
            nextItem = {
              isTag: true
            }
            var tags = extraData.home_tags || []
            if (!tags.length) return
            nextItem.tag = $.map(tags, (subItem, subIndex) => {
              subItem.notInterested = false
              // 搜索框
              if (subItem.searchtitle) {
                nextItem.searchtitle = subItem.searchtitle
              }
              return subItem
            })
          } else if (item.type === 12) {
            // 推荐医生
            nextItem = {
              isDoctor: true
            }
            var doctors = extraData.home_doctors || []
            if (!doctors.length) return
            // doctorItem.doctors = $.map(doctors, (subItem, subIndex) => {
            //   return subItem
            // })
            nextItem.doctors = doctors
          } else if (item.type === 13) {
            // 当季预防疾病
            nextItem = {
              isDisease: true
            }
            var diseases = extraData.home_diseases || []
            if (!diseases.length) return
            nextItem.diseases = $.map(diseases, (subItem, subIndex) => {
              subItem.notInterested = false
              return subItem
            })
          } else if (item.type === 14) {
            // 运营banner
            var activelist = extraData.activelist || []
            nextItem = activelist[0] || {}
            nextItem.isAd = true
          } else if (item.type === 15) {
            // 急救
            nextItem = {
              isEmergency: true
            }
            var emergency = extraData.home_tags || []
            if (!emergency.length) return
            nextItem.emergency = $.map(emergency, (subItem, subIndex) => {
              subItem.notInterested = false
              return subItem
            })
          } else if (item.type === 101) {
            // 推荐关注健康资讯 - 1.16暂无
            nextItem = {
              isFoucs: true
            }
            var focus = extraData.home_tags || []
            if (!focus.length) return
            nextItem.focus = $.map(focus, (subItem, subIndex) => {
              subItem.notInterested = false
              return subItem
            })
          } else if (item.type === 102) {
            nextItem = {
              isSearch: true
            }
          }
          if (!nextItem) return
          displayList.splice(offset, 0, nextItem)
        })

        that.tabs[0].data = baike.resolveTpl(displayList)
        that.tabs[0].loaded = pageData.loaded

        // if (isFirst && !baike.lstore.getItem('health_feed')) {
        //   that.droploadPlugin.simulateLoad()
        // }

        // if (droploadPlugin) {
        //   droploadPlugin.resetload()
        //   baike.lstore.setItem('health_feed', 'loaded', 15)
        // }
      }

      pageLoad({
        key: 'getHealthRecommend',
        url: '/mobile/getHomeContentData',
        retKey: 'docs',
        pageSize: pageSize,
        shift: shift,
        cb: callback
      }, {
        type: 8,
        mode: shift ? 0 : 1,
        name: ''
      })

      baike.mtaReport('healthfeeds_loading')
    },
    getHealthQA: function (tab, droploadPlugin) {
      var qaTab = tab
      var qaTag = (qaTab.tags && qaTab.tags[qaTab.tagIndex] && qaTab.tags[qaTab.tagIndex].name) || ''
      var key = 'getHealthQA_' + qaTag
      // qaTab.data = baike.pageLoad.data[key] ? baike.resolveTpl(baike.pageLoad.data[key].list) : []
      pageLoad({
        key: key,
        url: '/mobile/getHomeContentData',
        retKey: 'docs',
        pageSize: 10,
        cb: (pageData) => {
          var list = baike.resolveTpl(pageData.list)
          if (list && list.length) {
            list.forEach(function (item) {
              item.readflag = item.readflag || false
            })
          }
          qaTab.data = list
          qaTab.loaded = pageData.loaded
          // if (droploadPlugin) {
          //   droploadPlugin.resetload()
          // }
          this.updateTabByTitle(baike.query('tab'))
        }
      }, {
        type: 9,
        mode: 1,
        name: qaTag
      })
    },
    getHealthTopic: function (tab, droploadPlugin) {
      var topicTab = tab
      pageLoad({
        key: 'getHealthTopic',
        url: '/mobile/getHomeContentData',
        retKey: 'topics',
        pageSize: 10,
        cb: function (pageData) {
          var list = pageData.list
          if (list && list.length) {
            list.forEach(function (item) {
              item.isTopic = item.isTopic || true
            })
          }
          topicTab.data = list
          topicTab.loaded = pageData.loaded
          // if (droploadPlugin) {
          //   droploadPlugin.resetload()
          // }
        }
      }, {
        type: 6,
        mode: 1,
        name: ''
      })
    },
    getOtherTabDoc: function (tab, droploadPlugin) {
      var page = tab.page
      var pageSize = 10
      if (tab.loading || tab.loaded) {
        return
      }
      baike.post('/mobile/getHomeContentData', {
        type: 3,
        mode: 1,
        name: tab.tag,
        offset: (page - 1) * pageSize,
        count: pageSize
      }, (o) => {
        tab.loading = false
        if (o.retcode === 0) {
          tab.page++
          var docs = baike.resolveTpl(o.docs || [])
          if (docs.length > 0) {
            tab.data = tab.data.concat(docs.filter(function (item, index) {
              return !!item
            }))
          }
          tab.loaded = (o.tailflag === 0 || o.tailflag === 1) ? !!o.tailflag : docs.length < pageSize
        }
        this.updateTabByTitle(baike.query('tab'))
      })
      tab.loading = true
    },
    getPageData: function (index, droploadPlugin) {
      var that = this
      index = index < 0 ? that.tabIndex : index
      var tab = that.tabs[index]
      if (!tab) return
      // if (tab.loaded && droploadPlugin) {
      //   droploadPlugin.resetload()
      //   return
      // }
      if (tab.title === '推荐') {
        that.getHealthRecommend(false, droploadPlugin)
      } else if (tab.type === 1) {
        // 问答
        that.getHealthQA(tab, droploadPlugin)
      } else if (tab.title === '专题') {
        that.getHealthTopic(tab, droploadPlugin)
      } else {
        that.getOtherTabDoc(tab, droploadPlugin)
      }
    },
    fixedStatusOnChange (status) {
      this.showFixPaperTag = status
    },
    load (event) {
      var that = this
      var scrollTop = $(window).scrollTop()
      var scrollHeight = $('body').height()
      var windowHeight = $(window).height()
      if (scrollTop >= scrollHeight - windowHeight) {
        that.getPageData(-1)
      }

      var doclist = $('#health .main-content')
      var doclistTop = doclist.length ? doclist[0].offsetTop : 0
      var docTabs = $('#health .crumb')
      var docTabsHeight = docTabs.length && !that.fixTab ? docTabs[0].offsetHeight : 0
      that.fixTab = doclistTop - docTabsHeight < scrollTop
    },
    bind: function () {
      window.addEventListener('scroll', this.load)

      // function load (event) {
      //   var scrollTop = $(window).scrollTop()
      //   var scrollHeight = $('body').height()
      //   var windowHeight = $(window).height()
      //   if (scrollTop >= scrollHeight - windowHeight) {
      //     that.getPageData(-1)
      //   }

      //   var doclist = $('#health .main-content')
      //   var doclistTop = doclist.length ? doclist[0].offsetTop : 0
      //   var docTabs = $('#health .crumb')
      //   var docTabsHeight = docTabs.length && !that.fixTab ? docTabs[0].offsetHeight : 0
      //   that.fixTab = doclistTop - docTabsHeight < scrollTop
      // }

      // that.droploadPlugin = baike.dropload('#health', {
      //   loadUpFn: function (droploadPlugin) {
      //     that.getPageData(0, droploadPlugin)
      //   }
      // })
    }
  }
}

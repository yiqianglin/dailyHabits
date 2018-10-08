/* global $, baike */

import { ActiveBanner } from 'components/activity/activity'
import tmenu from 'components/tmenu/tmenu.vue'
import loading from 'components/loading/loading.vue'

var searchVar = {
  curSt: 0, // 当前滚动条高度
  pageHeight: $(window).height(),
  getFixTop: function () {
    var scroll = 0
    var offset = $('#listBlock').offset()
    // var scroll = 0
    if (offset && offset.top) {
      scroll = offset.top
    }
    return scroll
  }
}

export default {
  data () {
    return {
      lib: baike.query('lib'),
      depart: baike.query('depart'),
      isShow: false,
      fixAlphaTab: null,
      isShowCategory: false,
      currentFilter: '全部疾病',
      fixCategory: false,
      commonImages: [],
      commonList: [],
      category: [],
      userAgent: '',
      shouldPreventTouch: false,
      activeOps: null,
      // 数据缓存
      cache: {},
      alphaList: [],
      totalList: [],
      list: null,
      diseases: null,
      // 当前左侧列表选中项
      // currentIndex: 0,
      mostSearched: [],
      mostVisited: [],
      rkeys: {
        hisClear: 'ydd_list_searchhisclear',
        searchHis: 'YDD_List_SearchHisX',
        searchHot: 'YDD_List_SearchHotX',
        searchNull: 'ydd_list_searchresultnull',
        searchResult: 'YDD_List_SearchResultX',
        searchCancel: 'ydd_list_searchcancel',
        searchDel: 'ydd_list_searchdel',
        searchShow: 'ydd_list_search'
      }
    }
  },
  components: {
    ActiveBanner,
    tmenu,
    loading
  },
  computed: {},
  activated () {
    // 单页缓存分享数据重置
    this.setShare(this.shareCache)
    window.addEventListener('scroll', this.scrollToTop)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollToTop)
  },
  deactivated () {
    window.removeEventListener('scroll', this.scrollToTop)
  },
  created: function () {
    var that = this
    that.initSearch()
    // that.getCommonDiseaseDataV2()
    // that.getActiveData()
    that.initEvents()
    if (that.lib === 'WebMD') {
      that.setShare({
        title: 'WebMD合作疾病目录-企鹅医典',
        desc: 'WebMD是美国专业的医疗健康信息服务商'
      })
    }
  },
  mounted: function () {
    this.bind()
    baike.sstore && baike.sstore.setItem('search_lib', this.lib, 60)
  },
  watch: {
    isShowCategory: function (newVal) {
      if (newVal) {
        $('body')
          .addClass('disscroll')
          .css('top', 0 - searchVar.curSt)
      } else {
        $('body')
          .removeClass('disscroll')
          .css('top', '')
      }
    }
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
    getGroup: function (arr, num) {
      var out = []
      for (var i = 0, leni = arr.length; i < leni; i += num) {
        out.push(arr.slice(i, i + num))
      }
      return out
    },
    // 运营位
    getActiveData () {
      baike.post('/mobile/getActiveData', {
        activetype: 1,
        name: ''
      }, o => {
        if (o.retcode === 0) {
          this.activeOps = {
            list: o.activelist,
            area: 'list_top'
          }
        }
      })
    },
    // 初始化事件
    initEvents: function () {
      var that = this
      window.addEventListener('scroll', that.scrollToTop)
      that.userAgent = navigator.userAgent.toLowerCase()
      that.shouldPreventTouch =
        that.isAndroid() && (that.isUCBrowser() || that.isQQBrowser())
    },
    scrollToTop: function (e) {
      var that = this
      var scroll = that.getScrollTopOfBody()
      var $tabs = document.querySelectorAll('.list-block-alpha')

      var $allTab = $('#allTab')
      var allTabHeight = $allTab.height()
      var fixTop =
        searchVar.getFixTop() + (that.isShowCategory ? searchVar.curSt : 0)
      if (allTabHeight > 0) {
        // 没有被隐藏
        that.fixCategory = scroll > fixTop
      }
      for (var i = 0; i < $tabs.length; i++) {
        var offAlphaTop = $tabs[i].offsetTop - allTabHeight
        if (offAlphaTop <= scroll) {
          that.fixAlphaTab = $tabs[i].innerHTML
        } else if (i === 0 && offAlphaTop > scroll) {
          that.fixAlphaTab = null
        }
      }
    },
    getCommonDiseaseDataV2: function () {
      var that = this
      baike.get('/mobile/getCommonDiseaseDataV2', {}, function (json) {
        if (json.retcode === 0) {
          var mostSearched = json.mostSearched
          var mostVisited = json.mostVisited
          if (mostSearched && mostSearched.length > 0) {
            that.mostSearched = mostSearched.slice(0, 3)
          }
          if (mostVisited && mostVisited.length > 0) {
            that.mostVisited = mostVisited
          }
        }
      })
    },
    initSearch: function () {
      var that = this
      // var startTime = new Date().getTime()
      // var finTime = 0
      // 获取种类
      var url = '/mobile/init_search'
      baike.get(
        url, {
          type: 'A-Z',
          offset: 0,
          count: 10,
          source: that.lib === 'WebMD' ? 2 : (that.lib === 'Healthwise' ? 1 : 0)
        },
        function (o) {
          if (Number(o.retcode) === 0) {
            that.alphaList = that.resolveList(o.list)
            that.totalList = that.resolveList(o.list)
            if (that.depart) {
              that.doFilter(that.depart, true)
              if (that.currentFilter === that.depart) {
                that.isShow = true
              }
            } else {
              that.isShow = true
            }
            that.$nextTick(function () {
              that.scrollToTop()
            })
            baike.get(
              url, {
                type: 'A-Z',
                offset: null,
                count: null,
                source: that.lib === 'WebMD' ? 2 : (that.lib === 'Healthwise' ? 1 : 0)
              },
              function (o) {
                if (Number(o.retcode) === 0) {
                  that.alphaList = that.resolveList(o.list)
                  that.totalList = that.resolveList(o.list)
                  if (that.depart) {
                    that.doFilter(that.depart, true)
                  }
                  that.isShow = true
                  that.$nextTick(function () {
                    that.scrollToTop()
                  })
                }
              }
            )
          }
          window.medTimer && window.medTimer.reportTime({
            action: 'search_page',
            ispage: 1
          })
        },
        true
      )

      this.getDiseaseCategory()
    },
    resolveList: function (list) {
      for (var i = 0; i < list.length; i++) {
        var diseases = list[i].diseases
        list[i].published = []
        list[i].building = []
        for (var j = 0; j < diseases.length; j++) {
          if (Number(diseases[j].released) === 0) {
            list[i].building.push(diseases[j])
          } else {
            list[i].published.push(diseases[j])
          }
        }
      }
      return list
    },
    quickToList: function (e) {
      var that = this
      e.stopPropagation()
      e.preventDefault()

      var touch = e.changedTouches[0]
      var elem = document.elementFromPoint(
        touch.pageX - window.pageXOffset,
        touch.pageY - that.getScrollTopOfBody()
      )
      if (elem && elem.nodeName === 'A' && elem.classList.length !== 0) {
        if (
          $('.list')[0].scrollHeight >
          that.getScrollTopOfBody() + $(window).height() ||
          elem.textContent < this.fixAlphaTab ||
          !this.fixAlphaTab
        ) {
          elem.click()
        }
      }
    },
    scrollTopAlpha: function (e) {
      var that = this
      var elem = e.target
      // if (!that.shouldPreventTouch) {
      e.preventDefault()
      e.stopPropagation()
      var fixHeight = $('#allTab').height()
      that.setScrollTopOfBody(
        that.$('#alpha-' + (elem.textContent === '#' ? '' : elem.textContent))
          .offsetTop - fixHeight
      )
      // }
    },
    isUCBrowser: function () {
      var re = /UCBrowser/gi
      var that = this
      return re.test(that.userAgent)
    },

    isQQBrowser: function () {
      var re = /MQQBrowser/gi
      var that = this
      return re.test(that.userAgent) && !that.isMobileQQ() && !that.isWeixin()
    },

    isAndroid: function () {
      var re = /Android/gi
      var that = this
      return re.test(that.userAgent)
    },
    isWeixin: function () {
      var re = /MicroMessenger/gi
      var that = this
      return re.test(that.userAgent)
    },
    isMobileQQ: function () {
      var re = /\s+qq/gi
      var that = this
      return re.test(that.userAgent)
    },
    showCategory: function () {
      searchVar.curSt = $(window).scrollTop()
      this.isShowCategory = true
    },
    hideCategory: function () {
      var that = this
      that.isShowCategory = false
      that.$nextTick(function () {
        that.setScrollTopOfBody(searchVar.curSt)
      })
    },
    doFilter: function (name, noCancel) {
      var that = this
      // if (name === that.currentFilter) {
      //   that.hideCategory()
      //   return
      // }
      var scroll = searchVar.getFixTop() + searchVar.curSt
      if (scroll > 0) {
        scroll += 10
      }
      that.fixAlphaTab = null
      if ((!noCancel && that.currentFilter === name) || name === '全部疾病') {
        that.alphaList = that.totalList
        that.currentFilter = '全部疾病'
      } else {
        var filterList = []
        for (var i = 0; i < that.totalList.length; i++) {
          for (var j = 0; j < that.totalList[i].diseases.length; j++) {
            if (
              that.totalList[i].diseases[j].discategorys.indexOf(name) !== -1
            ) {
              if (!filterList.length) {
                filterList.push({
                  name: that.totalList[i].name,
                  diseases: [that.totalList[i].diseases[j]]
                })
              } else {
                /* eslint-disable-next-line no-labels */
                checkExist: for (var k = 0; k < filterList.length; k++) {
                  if (filterList[k].name !== that.totalList[i].name) {
                    if (k === filterList.length - 1) {
                      filterList.push({
                        name: that.totalList[i].name,
                        diseases: [that.totalList[i].diseases[j]]
                      })
                    }
                  } else if (filterList[k].name === that.totalList[i].name) {
                    for (var l = 0; l < filterList[k].diseases.length; l++) {
                      if (
                        JSON.stringify(filterList[k].diseases[l]) ===
                        JSON.stringify(that.totalList[i].diseases[j])
                      ) {
                        /* eslint-disable-next-line no-labels */
                        break checkExist
                      } else {
                        if (l === filterList[k].diseases.length - 1) {
                          filterList[k].diseases.push(
                            that.totalList[i].diseases[j]
                          )
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (filterList.length) {
          that.alphaList = that.resolveList(filterList)
          that.currentFilter = name
        }
      }
      that.isShowCategory = false
      that.$nextTick(function () {
        that.setScrollTopOfBody(scroll)
      })
    },
    toBuilding: function (name) {
      baike.goToUrl('/mobile/building.html?name=' + name)
    },
    toBack: function () {
      baike.goBack()
    },
    // 列表右侧点击跳转事件
    toOverview: function (name, type, ptag) {
      var that = this
      if (baike.query('adtag') === 'tx.wx.hr') {
        ptag = 'ydd_hr_diseasex:' + name
      } else if (ptag) {
        ptag += ':' + name
      } else {
        ptag = ''
      }
      if (that.lib === 'WebMD') {
        ptag = 'YDD_WebMDList_DiseaseX:' + name
        baike.goToUrl('/mobile/overview_wm.html?released=1&name=' + name + '&type=' + type + '&ptag=' + ptag)
        return
      }
      // baike.goToUrl('mobile/search_new.html?stag=&search=抑郁症&ptag=YDD_rangesearch_historyX%3A抑郁症&source=')
      baike.goToUrl(
        baike.getOverview({
          name: name,
          type: type
        }) + '&ptag=' + ptag
      )
    },
    toVisitedMore: function () {
      baike.goToUrl('/mobile/publicConcern.html?ptag=ill_more_clk')
    },
    toSearch: function () {
      baike.mtaReport('ydd_main_searchnew')
      this.$store.dispatch('showMiniSearch', { stag: this.lib })
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.lib })
      }
    },
    toEmergency: function () {
      baike.goToUrl('/mobile/emergency.html?ptag=ill_emergency_clk')
    },
    getScrollTopOfBody: function () {
      var scrollTop
      if (typeof window.pageYOffset !== 'undefined') {
        // pageYOffset指的是滚动条顶部到网页顶部的距离
        scrollTop = window.pageYOffset
      } else if (
        typeof document.compatMode !== 'undefined' &&
        document.compatMode !== 'BackCompat'
      ) {
        scrollTop = document.documentElement.scrollTop
      } else if (typeof document.body !== 'undefined') {
        scrollTop = document.body.scrollTop
      }
      return scrollTop
    },
    setScrollTopOfBody: function (scrollTop) {
      $(window).scrollTop(scrollTop)
    },
    getScrollRoot: function () {
      var html = document.documentElement
      var body = document.body
      var cacheTop =
        (typeof window.pageYOffset !== 'undefined'
          ? window.pageYOffset
          : null) ||
        body.scrollTop ||
        html.scrollTop // cache the window's current scroll position
      var root

      html.scrollTop = body.scrollTop = cacheTop + (cacheTop > 0) ? -1 : 1
      // find root by checking which scrollTop has a value larger than the cache.
      root = html.scrollTop !== cacheTop ? html : body

      root.scrollTop = cacheTop // restore the window's scroll position to cached value

      return root // return the scrolling root element
    },
    getCommonDiseaseData: function () {
      var that = this
      baike.post('/mobile/getCommonDiseaseData', {}, function (o) {
        for (var i = 0; i < o.diseases.length; i++) {
          if (o.diseases[i].image !== '') {
            that.commonImages.push(o.diseases[i])
          } else {
            that.commonList.push(o.diseases[i])
          }
        }
      })
    },
    getDiseaseCategory: function () {
      var that = this
      baike.post('/mobile/getDiseaseCategory', {}, function (o) {
        if (o.retcode === 0) {
          var list = o.list
          if (list && list.length > 0) {
            that.category = list
          }
        }
      })
    },
    bind: function () { }
  }
}

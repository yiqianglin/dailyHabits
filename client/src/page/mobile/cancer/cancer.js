/* global $, baike */

import tmenu from 'components/tmenu/tmenu.vue'
import loading from 'components/loading/loading.vue'
import { CardDisease, CardTiled, CardFilter, CardTree, CardActive } from './cards/cards'

import memoryLoader from 'src/js/memoryLoader'

export default {
  data () {
    return {
      show: false,
      name: baike.query('name') || '',
      diseaseOps: null,
      activeMap: {},
      tree: []
    }
  },
  components: {
    tmenu,
    CardDisease,
    CardTiled,
    CardFilter,
    CardTree,
    CardActive,
    loading
  },
  deactivated () {
    this.pageHideSetCache()
  },
  destroyed () {
    this.pageHideSetCache()
  },
  activated () {
    // 单页缓存分享信息重写
    this.setShare(this.shareCache)
  },
  created () {
    if (!this.name) return
    this.getOverviewBaseinfo()
    this.getOverviewActiveData()
    this.getOverviewTree()
  },
  mounted () {
    this.bind()
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    // 获取疾病题头信息
    getOverviewBaseinfo () {
      var that = this
      baike.get('/mobile/getOverviewBaseinfo', {
        name: this.name,
        type: 4
      }, o => {
        if (o.retcode === 0) {
          var baseinfo = baike.resolveTpl(o.baseinfo) || []
          this.name = (baseinfo[0] && baseinfo[0].name) || this.name
          this.diseaseOps = {
            name: this.name,
            follow: !!o.follow,
            baseinfo: baseinfo,
            wmdcount: o.wmdcount,
            from: baike.query('from')
          }

          // baike.setTitle('企鹅医典·' + this.name)
          that.setShare({
            title: '企鹅医典·' + this.name,
            desc: (baseinfo[0] && baseinfo[0].definition) || '传递健康与信赖'
          })
        }
      })
    },
    // 获取运营区信息
    getOverviewActiveData: function () {
      baike.post('/mobile/getActiveData', {
        name: this.name,
        activetype: 10
      }, o => {
        if (o.retcode === 0) {
          var map = (o.activelist || []).reduce((result, item) => {
            item.titles = item.titles.map(title => {
              return {
                text: title
              }
            })
            if (!result[item.index]) {
              result[item.index] = []
            }
            result[item.index].push(item)
            return result
          }, {})
          this.activeMap = map
        }
      })
    },
    // 获取标签树
    getOverviewTree () {
      var options = {
        dataKey: 'treetags',
        keyGenerator: (params) => {
          return params.name
        }
      }
      var params = {
        name: this.name
      }
      memoryLoader.load('get', '/mobile/getOverviewTreeV3', options, params)
        .then(({ data }) => {
          var cache = window.location.hash ? null : baike.sstore.getItem('cancer_card' + this.name)
          this.show = true
          this.tree = (data || []).map(item => {
            item.activeIdx = cache && cache[item.id] !== undefined ? cache[item.id] : item.treetags && item.treetags.length ? 0 : -1
            if (item.activeIdx > -1) {
              this.$nextTick(() => {
                this.scrollToTab(item.id, item.activeIdx)
              })
            }
            return item
          })
          setTimeout(() => {
            var tabId = decodeURIComponent(window.location.hash.slice(1))
            if (tabId) {
              var tabIdx = -1
              var found = this.tree.find(function (item, index) {
                return item.treetags.find(function (card, cardIdx) {
                  if (card.id === tabId) {
                    tabIdx = cardIdx
                    return true
                  }
                  return false
                })
              })
              if (found) {
                this.scrollToCard(found.id)
                this.clickTab(found, tabIdx)
              }
              var _url = window.location.href.replace(/#(.*)$/, '')
              window.history.replaceState({}, document.title, _url)
              // 重置分享数据
              this.setShare({
                link: _url
              })
              return
            }

            var scrollTop = baike.sstore.getItem('cancer_card_scrolltop' + this.name) || $(window).scrollTop()
            $(window).scrollTop(scrollTop)
          }, 300)
        }, error => {
          if (error && !(error.code >= 200 && error.code < 300)) {
            this.$msg.toast('数据加载失败，请重试', '', 1500, 'slide-up')
          }
        })
    },
    // 点击平铺型卡片的tab
    clickTab (card, index) {
      card.activeIdx = index
      this.scrollToTab(card.id, index)
      baike.mtaReport('pv')
    },
    scrollToCard (cardId) {
      var cardElem = $(`#group${cardId}`)
      var tmenuElem = $('.tmenu')
      if (!cardElem.length || !tmenuElem.length) return

      $(window).scrollTop(cardElem[0].offsetTop - tmenuElem[0].offsetHeight - 10)
    },
    scrollToTab (cardId, tabIdx) {
      var listElem = $(`#group${cardId} .tab-list`)
      var tagsElem = $(`#group${cardId} .tab-list li`)
      if (!listElem.length || !tagsElem.length) return

      var indexLeft = Math.min(Math.max(tabIdx, 0), tagsElem.length - 1)
      var diff = (listElem[0].offsetWidth - tagsElem[indexLeft].offsetWidth) / 2
      listElem[0].scrollLeft = tagsElem[indexLeft].offsetLeft < diff ? 0 : tagsElem[indexLeft].offsetLeft - diff
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.name })
      }
    },
    bind () {
      window.addEventListener('pagehide', () => {
        this.pageHideSetCache()
      })
    },
    pageHideSetCache () {
      var activeTab = (this.tree || []).reduce((result, item) => {
        if (item.activeIdx > -1) {
          result[item.id] = item.activeIdx
        }
        return result
      }, {})
      baike.sstore.setItem('cancer_card' + this.name, activeTab, 7 * 24 * 60)
      baike.sstore.setItem('cancer_card_scrolltop' + this.name, $(window).scrollTop(), 7 * 24 * 60)
    }
  }
}

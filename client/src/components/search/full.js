/* global $, baike */
import tagitem from './tagitem/tagitem.vue'
import cardNote from './card_note/card_note.vue'
import cardDrug from './card_drug/card_drug.vue'
import cardDisease from './card_disease/card_disease.vue'
import cardRelationMap from './card_relation_map/card_relation_map.vue'
import papertagMultiline from 'components/tagTabCommon/multiLine.vue'
import papertagMultilineOutter from 'components/tagTabCommon/multiLineOutter.vue'

import mini from './mini'

export default {
  extends: mini,
  props: {
    options: {
      type: Object,
      default: function () {
        return {
          // 疾病标签
          stag: '',
          // 发起搜索的来源
          source: 0,
          // 初始搜索词
          initKey: ''
        }
      }
    }
  },
  data () {
    return {
      // 高亮标绿词列表
      keywords: [],
      // 是否显示吸顶标签
      showFixPaperTag: false,
      // 搜索结果数据
      searchData: [{
        nav: '综合',
        type: 0,
        tabIdx: 0,
        showInTab: true,
        ptag: 'search_alltab_clk',
        // 综合的标签：更多关键词
        tags: [],
        tagIdx: -1
      }, {
        // tab标题
        nav: '疾病',
        // tab类型，与sortrule对应
        type: 1,
        // tab索引，即在searchData的索引
        tabIdx: 1,
        // 是否在tab区显示
        showInTab: true,
        // 是否在综合区显示
        showInOverall: true,
        // 展示更多文案时是否需要展示总数
        showTotal: true,
        // 更多的文案
        moreTxt: '更多相关疾病',
        // tab点击的上报事件
        ptag: 'search_deseasetab_clk',
        // 在tab区的数据列表
        list: [],
        // 在综合区的数据列表
        overList: [],
        // 综述入口
        questions: [],
        // 相关疾病知识：疾病和名词解释混合
        mixnotes: [],
        // 全部数据加载完成
        loaded: false,
        // 综合区最多显示的数据个数
        num: 2,
        // 数据总数
        count: 0,
        // 响应中数据列表对应的字段名
        retKey: 'diseases',
        // 响应中数据列表总数对应的字段名
        totalKey: 'diseaseCount'
      }, {
        nav: '问答',
        type: 5,
        tabIdx: 2,
        showInTab: true,
        showInOverall: true,
        showTotal: true,
        moreTxt: '更多权威问答',
        ptag: 'search_qa_clk',
        list: [],
        overList: [],
        tags: [],
        // 选中标签的索引
        tagIdx: -1,
        loaded: false,
        num: 3,
        count: 0,
        retKey: 'qas',
        totalKey: 'qaCount'
      }, {
        nav: '文章',
        type: 2,
        tabIdx: 3,
        showInTab: true,
        showInOverall: true,
        showTotal: true,
        moreTxt: '更多优质文章',
        ptag: 'search_articletab_clk',
        list: [],
        overList: [],
        tags: [],
        tagIdx: -1,
        loaded: false,
        num: 3,
        count: 0,
        retKey: 'docs',
        totalKey: 'docCount'
      }, {
        nav: '视频',
        type: 8,
        tabIdx: 4,
        showInTab: true,
        showInOverall: true,
        showTotal: true,
        moreTxt: '更多专家视频',
        ptag: 'YDD_search_videotabclkX',
        list: [],
        overList: [],
        loaded: false,
        num: 2,
        count: 0,
        retKey: 'videos',
        totalKey: 'videoCount'
      }, {
        nav: '医生',
        type: 3,
        tabIdx: 5,
        showInTab: true,
        showInOverall: true,
        showTotal: true,
        moreTxt: '更多相关医生',
        ptag: 'search_doctab_clk',
        list: [],
        overList: [],
        loaded: false,
        num: 3,
        count: 0,
        retKey: 'doctors',
        totalKey: 'doctorCount'
      }, {
        nav: '医院',
        type: 4,
        tabIdx: 6,
        showInTab: true,
        showInOverall: true,
        showTotal: true,
        moreTxt: '更多相关医院',
        ptag: 'search_hosptab_clk',
        list: [],
        overList: [],
        loaded: false,
        num: 3,
        count: 0,
        retKey: 'hospitals',
        totalKey: 'hospitalCount'
      }, {
        nav: '混排',
        type: 6,
        tabIdx: 7,
        showInTab: false,
        showInOverall: true,
        showTotal: false,
        list: [],
        overList: [],
        loaded: false,
        num: 5,
        count: 0,
        retKey: 'mixdocs',
        totalKey: 'mixCount'
      }, {
        nav: '名词',
        type: 7,
        tabIdx: 8,
        showInTab: false,
        showInOverall: true,
        list: [],
        overList: [],
        loaded: false,
        num: 1,
        count: 0,
        retKey: 'notes',
        totalKey: 'noteCount'
      }, {
        nav: '知识图谱',
        type: 9,
        tabIdx: 9,
        showInTab: false,
        showInOverall: true,
        list: [],
        overList: [],
        loaded: false,
        num: 1,
        count: 0,
        retKey: 'answer',
        totalKey: ''
      }, {
        nav: '药品',
        type: 10,
        tabIdx: 10,
        showInTab: false,
        showInOverall: true,
        list: [],
        overList: [],
        loaded: false,
        num: 1,
        count: 0,
        retKey: 'drug',
        totalKey: ''
      }],
      // 综合区各个tab的排序
      sortrule: [],
      // 上一次综合搜索的搜索词
      prevSearch: ''
    }
  },
  components: {
    papertagMultiline,
    papertagMultilineOutter,
    tagitem,
    cardNote,
    cardDrug,
    cardDisease,
    cardRelationMap
  },
  created () {
    // 获取热搜和历史
    this.updateSearcher().then(() => {
      this.$emit('init')
    })
    var { initKey, stag, source } = this.options || {}
    // 结果页初始化stag
    if (stag && ['急救', '内容'].indexOf(stag) === -1) {
      this.stag = stag
    }
    // 结果页初始化source
    this.source = source || 0
    // 结果页初始化搜索
    if (initKey) {
      this.searchInput = initKey
      this.prevSearch = this.searchInput
      this.getSearchData()
    }
  },
  destroyed () {
    $(window).off('scroll', this.handleScrollFn)
  },
  deactivated () {
    $(window).off('scroll', this.handleScrollFn)
  },
  watch: {},
  computed: {
    // 当前搜索tab
    curTab () {
      return this.searchData[this.tabIdx] || {}
    },
    // 当前搜索tab的标签
    formatTagsList () {
      return (this.curTab.tags || []).map(tag => { return { name: tag } })
    },
    // 按sortrule排序、过滤的综合区数据
    sortedOverall () {
      var sortrule = this.sortrule || [7, 1, 5, 2, 6, 3, 4]
      var searchData = this.searchData
      var searchDataByType = searchData.map(item => item.type)
      var sortedOverall = []
      sortrule.forEach(type => {
        var tabIdx = searchDataByType.indexOf(type)
        if (tabIdx !== -1) {
          sortedOverall.push(searchData[tabIdx])
        }
      })
      return sortedOverall
    },
    // 混排的item
    mixDataItem () {
      var searchData = this.searchData
      var searchDataByType = searchData.map(item => item.nav)
      var index = searchDataByType.indexOf('混排')
      return searchData[index]
    },
    // 更多关键词列表，仅在综合tab激活时显示
    tagsList () {
      return this.searchData[0].tags
    }
  },
  methods: {
    // 设置搜索历史
    setSearchHistory (searchQuery = this.searchQuery) {
      return this.$store.dispatch('appSearch/updateHistoryList', searchQuery)
    },
    // 点击搜索分类的tab
    clickNav (index, ptag) {
      if (this.tabIdx === index) return
      this.tabIdx = index
      if (ptag) baike.mtaReport(ptag)
      // tab切换返回顶部
      $(window).scrollTop(0)
      this.getSearchData(this.stag, this.searchInput, this.tabIdx, true).then(() => {
        // tab切换默认收起标签列表
        if (this.$refs.papertagInner) {
          this.$refs.papertagInner.expandStatus = false
        }
      })
    },
    // 点击综合tab的标签
    clickOverallTag (item) {
      if (this.searchInput.indexOf(item) === -1) {
        this.searchAble = false
        this.searchInput = this.searchInput + item
        // 不拉取新的综合标签
        this.getSearchData(this.stag, this.searchInput, 0, false, false)
      }
    },
    // 点击非综合tab的标签
    clickCommonTag (tagIdx) {
      var tabIdx = this.tabIdx
      var item = this.searchData[tabIdx]
      // tag切换返回顶部
      $(window).scrollTop(0)
      // 重复点击取消
      item.tagIdx = item.tagIdx === tagIdx ? -1 : tagIdx
      this.getSearchData(this.stag, this.searchInput, tabIdx, true)
      baike.mtaReport('search_articletag_clk')
    },
    // 结果页搜索
    searchOnFull (stag = this.stag, searchInput = this.searchInput, ptag = '') {
      if (!searchInput) return
      if (ptag) baike.mtaReport(ptag)
      stag = (stag === '内容' || stag === '急救') ? '' : stag
      this.searchAble = false
      this.searchInput = searchInput
      this.getSearchData(stag, this.searchInput, 0, false)
    },
    // 清除胶囊标签
    clearStag () {
      this.stag = ''
      // 结果页清除后返回不出现胶囊标签，蒙层下清除后再次拉起保持胶囊标签
      var searchUrl = window.location.href.replace(/ptag=([^&#]*)/, 'ptag=').replace(/stag=([^&#]*)/, 'stag=')
      window.history.replaceState({}, document.title, searchUrl)
      // 调父组件的分享重置分享数据
      this.$emit('changeUrl', searchUrl)
      // 以搜索词重新进行搜索
      if (this.searchInput) {
        this.searchAble = false
        this.getSearchData()
      }
    },
    // 点击搜索bar的取消
    cancel () {
      // 返回上一页
      baike.goBack()
    },
    // 显示/隐藏吸顶标签
    fixedStatusOnChange (status) {
      this.showFixPaperTag = status
    },
    // 搜索结果数据统计
    reportAfterSearch (searchKey = '', searchData = {}) {
      // 名词解释统计
      if (searchData.noteCount) {
        baike.mtaReport(`YDD_List_SearchnoteX_show:${searchKey}`)
      }

      // 药品搜索统计
      if (searchData.drug && searchData.drug.common_name) {
        let tradeNameReg = new RegExp(`(${this.keywords.join('|')})`, 'ig')
        let tradeNameHit = tradeNameReg.test(searchData.drug.trade_name.join('、')) ? 1 : 0
        let chemicalNameHit = this.keywords.indexOf(searchData.drug.common_name) !== -1 ? 1 : 0
        baike.mtaReport(`YDD_searchdrugX:${searchData.drug.discostflag}_${searchData.drug.druginstrucflag}_${searchData.drug.recruitflag}_${tradeNameHit}_${chemicalNameHit}_${searchKey}`)
      }

      var {
        keywords = [],
        mixdocs = [],
        qas = [],
        docs = []
      } = searchData

      // 可能出现段落的类别里搜索结果个数
      var paraResCnt = docs.length + mixdocs.length
      // 出现问答个数
      var qaCnt = 0
      // 出现段落摘要个数
      var paraCnt = 0
      // 搜索词命中段落摘要个数
      var paraHitCnt = 0
      // 搜索词命中问答摘要个数
      var qaHitCnt = 0
      mixdocs.forEach((item = {}) => {
        if (item.type === 2) {
          if (keywords.some(keyword => item.doc && item.doc.summary && item.doc.summary.indexOf(keyword) !== -1)) {
            paraHitCnt++
          }
        } else if (item.type === 5) {
          qaCnt++
          if (keywords.some(keyword => item.qa && item.qa.md_text && item.qa.md_text.indexOf(keyword) !== -1)) {
            qaHitCnt++
          }
        }
      })
      qas.forEach((item = {}) => {
        qaCnt++
        if (keywords.some(keyword => item.md_text && item.md_text.indexOf(keyword) !== -1)) {
          qaHitCnt++
        }
      })
      docs.forEach((item = {}) => {
        if (item.paraid) {
          paraCnt++
        }
        if (keywords.some(keyword => item.summary && item.summary.indexOf(keyword) !== -1)) {
          paraHitCnt++
        }
      })
      // 段落命中统计
      baike.mtaReport('ydd_search_summaryx4:' + `${searchKey}_${paraResCnt}_${paraCnt}_${paraHitCnt}`)
      // 问答命中统计
      baike.mtaReport('YDD_search_QAbriefX:' + `${searchKey}_${qaCnt}_${qaHitCnt}`)
    },
    // 获取更多关键词
    getOverallTag (searchQuery = this.searchQuery) {
      var overallTab = this.searchData.find(item => item.nav === '综合')
      if (!overallTab || !searchQuery) return
      this.$store.dispatch('appSearch/fetchOverallTag', searchQuery).then((data) => {
        overallTab.tags = data || []
      }, error => {
        if (error && !(error.code >= 200 && error.code < 300)) {
          this.$msg.toast('数据加载失败，请重试', '', 1500, 'slide-up')
        }
      })
    },
    // 拉取tab索引对应的搜索tab的数据
    getSearchData (stag = this.stag, searchInput = this.searchInput, tabIdx = 0, switchTab = false, getOverallTag = true) {
      // 更新页面URL，保证返回的是正确的搜索词
      if (this.prevSearch !== searchInput) {
        var searchUrl = window.location.href.replace(/ptag=([^&#]*)/, 'ptag=').replace(/search=([^&=]*)/, `search=${searchInput}`)
        // 上报一次pv
        baike.mtaReport('pv', { referer: searchUrl })
        window.history.replaceState({}, document.title, searchUrl)
        // 调父组件的分享重置分享数据
        this.$emit('changeUrl', searchUrl)
        this.prevSearch = searchInput
      }
      var searchQuery = (stag ? stag + ' ' : '') + searchInput || ''
      tabIdx = tabIdx < 0 ? 0 : tabIdx
      if (tabIdx === 0) {
        return this.getOverallData(searchQuery, switchTab, getOverallTag)
      } else {
        return this.getCommonData(searchQuery, tabIdx, switchTab)
      }
    },
    // 拉取综合tab的数据
    getOverallData (searchQuery = this.searchQuery, switchTab = false, getOverallTag = true) {
      if (!searchQuery || switchTab) return Promise.resolve()
      // 标记为搜索中
      this.searchStatus = 2
      // 发起新搜索时回至顶部
      $(window).scrollTop(0)
      this.searchData[0].tags = []
      if (getOverallTag) {
        this.getOverallTag(searchQuery)
      }
      this.$store.dispatch('appSearch/fetchOverallData', {
        searchQuery,
        source: (this.options && this.options.source) || 0
      }).then((data) => {
        // 标记为搜索结束
        this.searchStatus = 3
        this.keywords = data.keywords || []
        this.sortrule = data.sortrule || []

        // 有搜索结果的tab的个数，用于统计上报搜索有无结果
        var tabWithResult = 0
        var qaCount = 0
        var qaShow = false
        var docCount = 0
        this.searchData.forEach(tab => {
          if (tab.nav === '综合') return
          tab.loaded = false
          tab.count = data[tab.totalKey] || 0
          if (tab.nav !== '知识图谱' && tab.nav !== '药品') {
            tab.overList = data[tab.retKey] || []
            tab.list = tab.overList
            tabWithResult += tab.overList.length ? 1 : 0
          }
          switch (tab.nav) {
            case '疾病':
              // 只有一个疾病词条时显示综述内页的入口
              // tab.questions = tab.list.length === 1 ? data.questions : []

              // 相关疾病知识：疾病和名词解释混合
              tab.mixnotes = data.mixnotes || []
              // 相关疾病知识中疾病的个数
              tab.diseaseInMix = tab.mixnotes.filter(item => item.type === 1).length

              // 疾病词条下搜索不在综合区显示，在tab区显示标题，但不显示结果
              if (this.stag) {
                if (tab.overList.length) tabWithResult--
                tab.showInOverall = false
                // 置空数据同时tab切换不再拉新
                tab.loaded = true
                tab.count = 0
                tab.overList = []
                tab.list = []
              } else {
                tab.showInOverall = true
              }
              break
            case '文章':
              // 文章的标签在第一次拉取综合时设置
              tab.tags = data.tags || []
              tab.tagIdx = -1
              docCount = tab.count
              break
            case '问答':
              // 问答的标签在第一次拉取综合时设置
              tab.tags = data.qatags || []
              tab.tagIdx = -1
              qaCount = tab.count
              // 没有更多则不显示问答tab
              tab.showInTab = tab.count > tab.num
              qaShow = tab.showInTab
              break
            case '混排':
              // 混排的list是放更多加载的数据，所以初次时置空
              tab.list = []
              tab.loaded = tab.count <= tab.num
              break
            case '知识图谱':
              tab.overList = data[tab.retKey] && data[tab.retKey].qtype ? [data[tab.retKey]] : []
              tab.list = tab.overList
              tab.count = tab.overList.length
              tabWithResult += tab.overList.length ? 1 : 0
              break
            case '药品':
              tab.overList = data[tab.retKey] && data[tab.retKey].common_name ? [data[tab.retKey]] : []
              tab.list = tab.overList
              tab.count = tab.overList.length
              tabWithResult += tab.overList.length ? 1 : 0
              break
            case '视频':
              // 出现视频，需要上报
              if (tab.count) {
                tab.ptag = tab.ptag.split(':')[0] + ':' + searchQuery
                baike.mtaReport('YDD_search_videoshowX:' + searchQuery)
              }
              // 没有更多则不显示视频tab
              tab.showInTab = tab.count > tab.num
              break
          }
        })
        // 统计上报搜索有无结果
        baike.mtaReport((tabWithResult ? 'YDD_List_SearchResultX:' : 'YDD_List_SearchResultNullX:') + searchQuery + (this.keywords.length ? '__' + this.keywords.join('_') : ''))
        // 搜索后的相关数据统计，如段落、问答
        this.reportAfterSearch(searchQuery, data)
        // 综合有结果则显示
        this.tabIdx = tabWithResult ? 0 : -1
        if (this.stag && docCount && !qaCount) {
          // 词条内搜索有文章无问答则优先展示文章
          this.clickNav(3)
        } else if (qaCount && qaShow && baike.query('nav') === 'qa') {
          // 问答详情页点击底部的相关标签拉起搜索，优先显示问答tab
          this.clickNav(2)
        }
      }, error => {
        if (error && !(error.code >= 200 && error.code < 300)) {
          // 标记为搜索出错
          this.searchStatus = 4
          this.$msg.toast('数据加载失败，请重试', '', 1500, 'slide-up')
        }
      })
    },
    // 拉取非综合tab的数据
    getCommonData (searchQuery = this.searchQuery, tabIdx, switchTab) {
      var tab = this.searchData[tabIdx]
      if (!searchQuery || !tab) {
        return Promise.resolve()
      }
      // 标记为搜索中
      this.searchStatus = 2

      var options = {
        listKey: tab.retKey,
        totalKey: tab.totalKey
      }
      if (tab.nav !== '混排') {
        options.count = 15
      } else if (!tab.list.length) {
        // 混排一次拉10篇
        options.count = 10
        // 混排从特定位置开始拉取（第一次综合拉取已展示了部分混排文章）
        options.offset = tab.num
      }

      var source = (this.options && this.options.source) || 0
      var type = tab.nav === '混排' ? 0 : tab.type
      // 问答或文章的标签
      var tags = tab.tags || []
      var tag = tags[tab.tagIdx] || ''
      var params = {
        // query: searchQuery,
        searchQuery,
        source,
        type,
        tag
      }

      // tab数据总数大于综合里展示的数据量，则需要拉取更多
      var loadMore = !!tag || tab.count > tab.overList.length
      if (!loadMore) {
        // 标记为搜索结束
        this.searchStatus = 3
        tab.loaded = true
        tab.list = tab.nav !== '混排' ? tab.overList : []
        return Promise.resolve()
      }

      if (!tab.loaded && !tab.list.length) {
        switchTab = true
      }

      // tab切换不拉新，直接显示已有数据
      return this.$store.dispatch('appSearch/fetchCommonData', { ...params, ...options, switchTab })
        .then(({ loaded, list, response }) => {
          // 标记为搜索结束
          this.searchStatus = 3
          // 混排上拉刷新上报
          if (tab.nav === '混排') {
            baike.mtaReport('expertvideo_detail_clk')
          }
          tab.loaded = loaded
          tab.list = list
          this.keywords = response.keywords || this.keywords
          // 搜索后的相关数据统计，如段落、问答
          this.reportAfterSearch(searchQuery, response)
        }, error => {
          if (error && !(error.code >= 200 && error.code < 300)) {
            // 标记为搜索出错
            this.searchStatus = 4
            this.$msg.toast('数据加载失败，请重试', '', 1500, 'slide-up')
          }
        })
    },
    // dom事件绑定
    bindEvent () {
      // 自动收起软键盘
      $('.search-container').on('touchstart', function (e) {
        var $this = $(e.srcElement || e.target)
        if ($this.hasClass('.search-bar') || $this.parents('.search-bar').length > 0) return
        $('#searchInput').blur()
      })

      // 上拉加载
      $(window).on('scroll', this.handleScrollFn)
    },
    handleScrollFn () {
      var that = this
      var $window = $(window)
      var windowHeight = $window.height()
      var scrollTop = $window.scrollTop()
      var scrollHeight = $('body').height()
      if (windowHeight + scrollTop >= scrollHeight - 100 && that.tabIdx > -1) {
        that.getSearchData(that.stag, that.searchInput, that.tabIdx > 0 ? that.tabIdx : that.mixDataItem.tabIdx, false)
      }
    }
  }
}

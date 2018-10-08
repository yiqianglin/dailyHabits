/* global $, baike */
import { mapState, mapGetters } from 'vuex'

import filters from 'src/js/filters'

const reportKeys = {
  'his': 'ydd_list_searchhisx:',
  'hot': 'ydd_list_searchhotx:',
  'smart': 'ydd_list_searchautoinputx:',
  'smarHis': 'ydd_searchassociate_historyx:',
  'stagHis': 'YDD_rangesearch_historyX:'
}

export default {
  filters: {
    highLight: filters.highLight
  },
  data () {
    return {
      // 胶囊标签
      stag: '',
      // 发起搜索的来源
      source: 0,
      // 输入的搜索词
      searchInput: '',
      // 搜索状态，0-联想词搜索中，1-联想词搜索结束，2-结果搜索中，3-结果搜索结束
      searchStatus: 0,
      // 可否搜索，控制搜索bar的按钮显示文案
      searchAble: false,
      // 当前搜索tab
      tabIdx: -1
    }
  },
  components: {},
  created () { },
  activated () {
    this.bindEvent()
  },
  mounted () {
    this.bindEvent()
  },
  watch: {},
  computed: {
    // getSearchNew接口中的query参数值，由胶囊标签和输入词组合而成
    searchQuery () {
      return (this.stag ? this.stag + ' ' : '') + this.searchInput || ''
    },
    ...mapState('appSearch', {
      // 历史搜索列表
      historyList: 'historyList',
      // 是否显示
      show ({ showMini, miniOps }) {
        this.stag = ['急救', '内容'].indexOf(miniOps.stag) === -1 ? miniOps.stag : ''
        this.source = miniOps.source
        if (showMini) this.updateSearcher()
        return showMini
      }
    }),
    ...mapGetters('appSearch', {
      // 热门搜索列表
      hotList: 'appHotList'
    }),
    // 联想词列表
    associateList () {
      return this.$store.getters['appSearch/getAssociateList'](this.searchInput)
    },
    // 联想词高亮列表
    associateKeyword () {
      return this.$store.getters['appSearch/getAssociateKeyword'](this.searchInput)
    }
  },
  methods: {
    // 获取热门搜索词和历史搜索词
    updateSearcher () {
      return Promise.all([
        this.$store.dispatch('appSearch/updateHotList'),
        this.$store.dispatch('appSearch/updateHistoryList')
      ])
    },
    // 点击搜索建议词，包括热搜、历史、联想
    searchBySuggest (name, type, index) {
      if (!name) return
      // 增加急救入口，待废弃
      if (name === '日常急救') {
        baike.goToUrl('/mobile/emergency.html')
        return
      }
      var reportKey = reportKeys[type] ? reportKeys[type] + name + (index < 3 ? index : '') : ''
      // 只有联想词需要带上stag
      var stag = type === 'smart' ? this.stag : ''
      this.searchOnFull(stag, name, reportKey)
    },
    // 点击搜索bar、软键盘的搜索按钮
    clickSearch () {
      baike.mtaReport('YDD_List_SearchX_clk:' + this.searchQuery)
      // 收起软键盘
      $('#searchInput').blur()
      this.searchOnFull()
    },
    // 清除胶囊标签
    clearStag () {
      this.stag = ''
    },
    // 清除搜索历史
    clearHis (name = '', index) {
      return this.$store.dispatch('appSearch/clearHistory', { name, index })
    },
    // 清除输入历史
    clearInput () {
      this.searchInput = ''
      this.searchAble = false
      // 显示热搜和历史
      this.tabIdx = -1
      // 切换至顶部，显示热搜和历史时应在顶部
      $(window).scrollTop(0)
    },
    // 点击搜索bar的取消
    cancel () {
      // 关闭蒙层
      // 保证下次拉起蒙层时在顶部
      $('.search-detail').scrollTop(0)
      this.$store.dispatch('hideMiniSearch')
    },
    // 搜索框输入
    changeInput () {
      var searchInput = this.searchInput
      // 隐藏吸顶标签
      this.showFixPaperTag = false
      this.searchAble = !!searchInput
      // 获取联想词
      this.getAssociateWord(searchInput)
    },
    // 获取联想词
    getAssociateWord (searchInput) {
      if (!searchInput) return
      // 显示联想词
      this.tabIdx = -1
      // 标记为正在搜索联想词
      this.searchStatus = 0
      this.$store.dispatch('appSearch/fetchAssociateList', searchInput).then(() => {
        // 标记为结束搜索联想词
        this.searchStatus = 1
      }, error => {
        if (error && !(error.code >= 200 && error.code < 300)) {
          // 标记为搜索出错
          this.searchStatus = 4
          this.$msg.toast('数据加载失败，请重试', '', 1500, 'slide-up')
        }
      })
    },
    // 跳转至搜索结果页搜索
    // 改成单页后无需传递ptag
    searchOnFull (stag = this.stag, searchInput = this.searchInput, ptag = '') {
      if (!searchInput) return
      stag = (stag === '内容' || stag === '急救') ? '' : stag
      this.$store.dispatch('hideMiniSearch')
      // 跳转之前清空输入框修复返回展示搜索中
      this.clearInput()
      baike.goToUrl(`/mobile/search.html?stag=${stag}&search=${searchInput}&ptag=${ptag}&source=${(this.source) || ''}`)
    },
    // dom事件绑定
    bindEvent () {
      // 自动收起软键盘
      $('.search-container').on('touchstart', function (e) {
        var $this = $(e.srcElement || e.target)
        if ($this.hasClass('.search-bar') || $this.parents('.search-bar').length > 0) return
        $('#searchInput').blur()
      })
    }
  }
}

/* global baike */

export default {
  props: {
    options: {
      type: Object,
      default: function () {
        return {
          disease: '',
          card: null
        }
      }
    }
  },
  data () {
    return {
      disease: '',
      id: '',
      name: '',
      hint: '',
      treetags: [],
      bookmarkL1: baike.lstore.getItem('bookmarkL1') || '',
      bookmarkL2: baike.lstore.getItem('bookmarkL2') || '',
      bookmarkL3: baike.lstore.getItem('bookmarkL3') || ''
    }
  },
  components: {
  },
  computed: {
  },
  created () {
    var disease = (this.options && this.options.disease) || baike.query('name') || ''
    var card = (this.options && this.options.card) || {}
    // 卡片id
    var id = card.id || ''
    // 卡片名
    var name = card.label || ''
    // 提示文案
    var hint = card.desc || ''
    // 卡片标签
    var treetags = (card.treetags || []).map(item => {
      return {
        ...item,
        foldflag: true
      }
    })
    var cache = window.location.hash ? null : baike.sstore.getItem('cancer_tree' + id)
    this.disease = disease
    this.id = id
    this.name = name
    this.hint = hint
    this.treetags = cache && cache.treetags && cache.treetags.length ? cache.treetags : treetags
  },
  mounted () {
    this.bind()
  },
  deactivated () {
    this.pageHideSetCache()
  },
  destroyed () {
    this.pageHideSetCache()
  },
  methods: {
    clickTagL1 (tagL1) {
      if (tagL1.treetags && tagL1.treetags.length) {
        tagL1.foldflag = !tagL1.foldflag
        baike.mtaReport('treecard_1st_clk')
      } else {
        baike.lstore.setItem('bookmarkL1', this.name, 24 * 60)
        baike.lstore.setItem('bookmarkL2', tagL1.id, 24 * 60)
        this.toTagArticle(this.name, tagL1.label, tagL1.id, 'treecard_1st_clk')
      }
    },
    clickTagL2 (tagL1, tagL2) {
      baike.lstore.setItem('bookmarkL1', this.name, 24 * 60)
      baike.lstore.setItem('bookmarkL2', tagL1.id, 24 * 60)
      baike.lstore.setItem('bookmarkL3', tagL2.id, 24 * 60)
      this.toTagArticle(`${this.name}|${tagL1.label}`, tagL2.label, tagL2.id, 'treecard_2nd_clk')
    },
    toTagArticle: function (cate, tag, id, ptag) {
      baike.goToUrl(`/mobile/tag_article.html?name=${this.disease}&cate=${cate}&tag=${encodeURIComponent(tag)}&tagId=${id}&parflag=1&type=5&src=cancer&ptag=${ptag}`)
    },
    bind () {
      window.addEventListener('pagehide', () => {
        this.pageHideSetCache()
      })
    },
    pageHideSetCache () {
      baike.sstore.setItem('cancer_tree' + this.id, { treetags: this.treetags }, 7 * 24 * 60)
    }
  }
}

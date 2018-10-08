/* global baike */
import author from '../tagitem/author.vue'
import filters from 'src/js/filters'

export default {
  props: {
    // 图谱搜索结果
    item: {
      type: Object,
      default: function () {
        return {
          query: '',
          answer: [],
          highlight: [],
          // 1 - 文本类，2 - 列表类
          qtype: 1,
          // 来源文章
          doc: null
        }
      }
    },
    // 搜索词
    searchkey: ''
  },
  components: {
    author
  },
  filters: {
    highLight: filters.highLight
  },
  data () {
    return {}
  },
  methods: {
    toArticle () {
      var { doc } = this.item
      if (doc && doc.docid) {
        baike.goToUrl(`/mobile/article.html?docid=${doc.docid}&ptag=YDD_Search_ClickGraghCard`)
      }
    }
  }
}

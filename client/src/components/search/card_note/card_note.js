/* global baike */
import filters from 'src/js/filters'

export default {
  props: {
    // 名词
    item: {
      type: Object,
      default: function () {
        return {
          name: '',
          alias: [],
          note: ''
        }
      }
    },
    // 名词的综述
    count: 0,
    // 关键词
    keywords: {
      type: Array,
      default: function () {
        return []
      }
    },
    // 搜索词
    searchkey: ''
  },
  filters: {
    highLight: filters.highLight
  },
  methods: {
    toWord () {
      baike.goToUrl(`/mobile/note_explain.html?searchkey=${this.searchkey}&ptag=YDD_List_SearchnoteX_clk:${this.searchkey}`)
    }
  }
}

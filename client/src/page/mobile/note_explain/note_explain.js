/* global baike */
import tmenu from 'components/tmenu/tmenu.vue'
import paper from 'components/paper/paper.vue'
import { pageLoad } from 'src/js/specialReq.js'

export default {
  data () {
    return {
      // 搜索词
      searchkey: baike.query('searchkey'),
      loaded: false,
      noteIdx: 0,
      noteList: []
    }
  },
  activated () {
  },
  created () {
    this.getNoteExplainations()
  },
  components: {
    tmenu,
    paper
  },
  methods: {
    getNoteExplainations () {
      pageLoad({
        key: `getSearchNew_${this.searchkey}`,
        url: '/mobile/getSearchNew',
        retKey: 'notes',
        totalKey: 'noteCount',
        pageSize: this.noteList.length ? 5 : 4,
        cb: (pageData) => {
          var list = pageData.list
          this.loaded = pageData.loaded
          if (list && list.length > 0) {
            this.noteList = list
          }
        }
      }, {
        query: this.searchkey,
        type: 7
      })
    },
    noteClick (item, index) {
      this.noteIdx = index
    },
    moreClick () {
      this.getNoteExplainations()
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch')
      }
    }
  }
}

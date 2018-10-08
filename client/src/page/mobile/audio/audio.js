/* global $, baike */
import tmenu from 'components/tmenu/tmenu.vue'
import paper from 'components/paper/paper.vue'
import { pageLoad } from 'src/js/specialReq.js'

var util = {
  resolveDocs: function (docs) {
    var result = docs.map(function (doc) {
      if (doc && doc['tid' + doc.tid]) {
        return doc['tid' + doc.tid]
      } else {
        return doc
      }
    })
    return result
  }
}

export default {
  data () {
    return {
      name: baike.query('name'),
      docList: [],
      loaded: false
    }
  },
  components: {
    tmenu,
    paper
  },
  created: function () {
    this.getVoiceDocs()
  },
  destroyed () {
    $(window).off('scroll', this.handleScrollFn)
  },
  deactivated () {
    $(window).off('scroll', this.handleScrollFn)
  },
  activated () {
    this.bind()
  },
  mounted: function () {
    this.bind()
  },
  methods: {
    getVoiceDocs: function () {
      var that = this
      var pageSize = 10

      pageLoad({
        key: 'getVoiceDocs_' + that.name,
        url: 'getVoiceDocs',
        pageSize: pageSize,
        retKey: 'docs',
        cb: function (pageData) {
          var docs = pageData.list
          if (docs && docs.length > 0) {
            var list = util.resolveDocs(docs)
            that.docList = list
          }
          that.loaded = pageData.loaded
        }
      }, { disease: that.name })
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.name })
      }
    },
    bind: function () {
      $(window).on('scroll', this.handleScrollFn)
    },
    handleScrollFn () {
      var that = this
      var scrollTop = $(window).scrollTop()
      var scrollHeight = $('body').height()
      var windowHeight = $(window).height()
      if (scrollTop >= scrollHeight - windowHeight) {
        that.getVoiceDocs()
      }
    }
  }
}

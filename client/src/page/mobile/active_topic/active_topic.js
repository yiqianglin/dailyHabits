/* global baike */
import paper from 'components/paper/paper.vue'
import { ActiveBanner } from 'components/activity/activity'

import filters from 'src/js/filters'
import memoryLoader from 'src/js/memoryLoader'
export default {
  data () {
    return {
      activeOps: null,
      videoList: [],
      storyList: [],
      docList: [],
      cancerList: [],
      showAllDoc: false
    }
  },
  components: {
    paper,
    ActiveBanner
  },
  filters: {
    formatTime: filters.formatTime
  },
  created () {
    this.getActiveData(16)
    this.getActiveData(17)
    this.getActiveData(18)
    this.getActiveData(19)
    this.getActiveData(20)
  },
  methods: {
    getActiveData (type) {
      var options = {
        dataKey: 'activelist',
        keyGenerator: (params) => {
          return params.activetype + params.name
        }
      }
      var params = {
        activetype: type,
        name: ''
      }
      return memoryLoader.load('post', '/mobile/getActiveData', options, params)
        .then(({ data }) => {
          switch (type) {
            case 16:
              this.activeOps = {
                list: data,
                area: 'home_cancer'
              }
              break
            case 17:
              this.videoList = data.map(item => item.docinfo.tid10)
              break
            case 18:
              this.storyList = data.map(item => { return { ...item.docdata.tid6, docid: item.docid } })
              break
            case 19:
              this.docList = data.map(item => item.docinfo.tid4)
              break
            case 20:
              this.cancerList = data
              break
          }
        }, error => {
          if (error && !(error.code >= 200 && error.code < 300)) {
            this.$msg.toast('数据加载失败，请重试', '', 1500, 'slide-up')
          }
        })
    },
    toSearch: function () {
      this.$store.dispatch('showMiniSearch')
    },
    toBack: function () {
      baike.goBack()
    },
    toMy: function () {
      baike.goToUrl('/mobile/my.html')
    },
    toCancer (item, ptag) {
      var name = item.text
      baike.goToUrl(`${baike.getOverview({ name: name, type: item.type, released: true })}&ptag=${ptag}:${name}`)
    },
    toArticle ({ docid, name, diseases }, ptag) {
      if (docid) {
        baike.goToUrl('/mobile/article.html?docid=' + docid + '&name=' + (name || (diseases[0] && diseases[0].name)) + '&ptag=' + ptag + ':' + docid)
      }
    }
  }
}

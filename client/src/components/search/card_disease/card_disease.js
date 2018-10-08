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
          count: '',
          tabs: []
        }
      }
    },
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
  data () {
    return {}
  },
  methods: {
    toOverview ({ name, type, released }) {
      if (!name) return
      if (!released) {
        baike.goToUrl(`/mobile/building.html?name=${name}&ptag=YDD_search_carddiseaseX:${name}`)
      } else {
        baike.goToUrl(
          baike.getOverview({
            name: name,
            type: type
          }) + '&ptag=' + 'YDD_search_carddiseaseX:' + name
        )
      }
    },
    toDdetailTab ({ tab, disease, entry }) {
      if (disease && entry) {
        baike.goToUrl(`/mobile/ddetail.html?name=${disease}&ptag=YDD_search_carddisease_entryX:${tab}#${entry}`)
      }
    }
  }
}

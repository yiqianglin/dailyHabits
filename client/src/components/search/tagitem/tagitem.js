/* global baike */
import author from './author'

import filters from 'src/js/filters'

export default {
  components: {
    author
  },
  filters: {
    formatTime: filters.formatTime,
    highLight: filters.highLight
  },
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    isoverall: {
      type: Boolean,
      default: false
    },
    keywords: {
      type: Array,
      default () {
        return []
      }
    },
    searchkey: {
      type: String,
      default: ''
    }
  },
  methods: {
    getList: function () {
      var that = this
      // var isoverall = that.isoverall
      var item = that.item
      return that.isoverall ? item.overList.slice(0, item.num) : item.list
    },
    getTags: function (src, item) {
      // 疾病  symptoms  文章 tags
      if (src === '疾病') {
        return item.symptoms || []
      }
      // 首先需要查看是否包含关键词
      var tags = item.tags
      var keys = this.keywords || []
      var isContain = false
      var that = this
      if (that.isoverall) {
        if (item.curTagIndex > -1) {
          var curTag = tags[item.curTagIndex]
          if (curTag) keys = keys.concat(curTag)
        }
      }
      if (tags && tags.length > 0 && keys && keys.length > 0) {
        var regex = new RegExp('(' + keys.join('|') + ')', 'ig')
        if (regex.test(tags.join('|'))) {
          isContain = true
        }
      }
      if (!isContain) tags = []
      return tags
    },
    toMixDN (item, index) {
      if (item.type === 7) {
        baike.goToUrl(`/mobile/note_explain.html?searchkey=${item.note.name}&patg=YDD_search_revelantillknowX:${item.note.name}_${index}`)
      } else {
        var disease = item.disease
        if (!disease.released) {
          baike.goToUrl(`/mobile/building.html?name=${disease.name}&ptag=YDD_search_revelantillknowX:${disease.name}_${index}`)
        } else {
          baike.goToUrl(
            baike.getOverview({
              name: disease.name,
              type: disease.type
            }) + `&ptag=YDD_search_revelantillknowX:${disease.name}_${index}`
          )
        }
      }
    },
    toOverview: function (name, type, index, isBuilding) {
      if (name) {
        var that = this
        var ptag = 'YDD_SearchN_DiseaseX:' + (that.searchkey || '') + (index + 1)
        if (isBuilding) {
          baike.goToUrl('/mobile/building.html?name=' + name + '&ptag=' + ptag)
        } else {
          baike.goToUrl(
            baike.getOverview({
              name: name,
              type: type
            }) + '&ptag=' + ptag
          )
        }
      }
    },
    toQuestion (disease, entry, index) {
      if (disease) {
        var ptag = 'YDD_SearchN_QAX:' + (this.searchkey || '') + (index + 1)
        baike.goToUrl(
          '/mobile/ddetail.html?name=' + disease + '&ptag=' + ptag + '#' + entry
        )
      }
    },
    toArticle ({
      docid,
      paraid
    }, index, ptag) {
      if (docid) {
        ptag = (ptag || 'YDD_SearchN_ArticleX') + ':' + (this.searchkey || '')
        ptag = paraid ? 'ydd_search_paragraphx_clk:' + this.searchkey : ptag
        baike.goToUrl('/mobile/article.html?docid=' + docid + '&ptag=' + ptag + (paraid ? '#' + paraid : ''))
      }
    },
    toDoctor (doctorId, index) {
      if (doctorId) {
        var ptag = 'YDD_search_doc_clk:' + (this.searchkey || '') + (index + 1)
        baike.goToUrl(
          '/mobile/doctor.html?doctor_id=' + doctorId + '&ptag=' + ptag
        )
      }
    },
    toHospital (hospitalId, index) {
      if (hospitalId) {
        var ptag = 'YDD_search_hosp_clk:' + (this.searchkey || '') + (index + 1)
        baike.goToUrl(
          '/mobile/hospital.html?hospital_id=' + hospitalId + '&ptag=' + ptag
        )
      }
    }
  }
}

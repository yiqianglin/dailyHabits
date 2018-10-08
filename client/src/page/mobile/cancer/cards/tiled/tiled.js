/* global baike */

import entry from '../entry/entry.vue'
import tag from '../tag/tag.vue'

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
      entryList: [],
      cateIdx: -1
    }
  },
  components: {
    entry,
    tag
  },
  computed: {
  },
  deactivated () {
    this.pageHideSetCache()
  },
  destroyed () {
    this.pageHideSetCache()
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
    var treetags = (card.treetags || []).reduce((result, item) => {
      if (item.type === 0) {
        // item.treetags.forEach(tag => {
        //   tag.direct = tag.treetags && !tag.treetags.length
        // })
        result.push({
          ...item,
          activeIdx: -1
        })
      }
      return result
    }, [])
    // 直达入口
    var entryList = (card.treetags || []).reduce((result, item) => {
      if (item.type === 4) {
        result.push({
          ...item
        })
      }
      return result
    }, [])
    var cache = window.location.hash ? null : baike.sstore.getItem('cancer_tiled' + id)
    this.disease = disease
    this.id = id
    this.name = name
    this.hint = hint
    this.treetags = cache && cache.treetags && cache.treetags.length ? cache.treetags : treetags
    this.entryList = entryList
    this.cateIdx = cache ? cache.cateIdx : -1
  },
  mounted () {
    this.bind()
  },
  methods: {
    // 点击一级标签
    selectTag (cate, cateIdx, tagIdx) {
      cate.activeIdx = this.cateIdx === cateIdx && cate.activeIdx === tagIdx ? -1 : tagIdx
      this.cateIdx = cateIdx
      var tag = cate.treetags[cate.activeIdx]
      // if (tag && !tag.treetags.length) {
      this.clickTag(cate, tag)
      // 跳转之后重置，防止返回点击时要点2次
      cate.activeIdx = -1
      // }
    },
    // 点击一级标签详情或二级标签
    clickTag (cate, tagL1, tagL2) {
      if (cate && tagL1 && !tagL2 && tagL1.doc && tagL1.doc.docid) {
        baike.goToUrl(`/mobile/article.html?docid=${tagL1.doc.docid}&name=${this.disease}&ptag=onco_cardcancer_kowpx:${this.disease}`)
      } else if (cate && tagL1 && !tagL2) {
        baike.goToUrl(`/mobile/tag_article.html?name=${this.disease}&cate=${this.name}|${cate.label}&tag=${encodeURIComponent(tagL1.label)}&tagId=${tagL1.id}&parflag=1&type=5&ptag=onco_cardcancer_kowpx:${tagL1.label}&src=cancer`)
      } else if (cate && tagL1 && tagL2 && tagL2.doc && tagL2.doc.docid) {
        baike.goToUrl(`/mobile/article.html?docid=${tagL2.doc.docid}&name=${this.disease}&ptag=onco_cardcancer_kowpx:${this.disease}`)
      } else if (cate && tagL1 && tagL2) {
        baike.goToUrl(`/mobile/tag_article.html?name=${this.disease}&cate=${this.name}|${cate.label}|${tagL1.label}&tag=${encodeURIComponent(tagL2.label)}&tagId=${tagL2.id}&parflag=1&type=5&ptag=onco_cardcancer_kowpx:${tagL2.label}&src=cancer`)
      }
    },
    bind () {
      window.addEventListener('pagehide', () => {
        this.pageHideSetCache()
      })
    },
    pageHideSetCache () {
      var treetags = this.treetags.map(item => {
        // var activeTag = item.treetags[item.activeIdx]
        // var activeIdx = activeTag && activeTag.treetags && activeTag.treetags.length ? item.activeIdx : -1
        var activeIdx = -1
        return {
          ...item,
          activeIdx
        }
      })
      baike.sstore.setItem('cancer_tiled' + this.id, { cateIdx: this.cateIdx, treetags }, 7 * 24 * 60)
    }
  }
}

/* global baike */

export default {
  props: {
    options: {
      type: Object,
      default: function () {
        return {
          disease: '',
          cate: '',
          list: []
        }
      }
    }
  },
  data () {
    var disease = (this.options && this.options.disease) || baike.query('name') || ''
    var cate = (this.options && this.options.cate) || ''
    // var list = (this.options && this.options.list) || []
    return {
      // 运营区
      disease,
      cate
      // list
    }
  },
  computed: {
    list () {
      return (this.options && this.options.list) || []
    }
  },
  created () {
  },
  methods: {
    // 点击直达型入口
    toEntry (item, index) {
      var ptag = 'onco_cardcancer_ywddx:' + (index + 1)
      if (item.doc && item.doc.docid) {
        baike.goToUrl(`/mobile/article.html?docid=${item.doc.docid}&name=${this.disease}&ptag=${ptag}`)
      } else if (this.cate && item.label) {
        baike.goToUrl(`/mobile/tag_article.html?name=${this.disease}&cate=${this.cate}&tag=${encodeURIComponent(item.label)}&tagId=${item.id}&type=5&ptag=${ptag}&src=cancer`)
      }
    }
  }
}

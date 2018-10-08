/* global baike, $ */
import filters from 'src/js/filters'
export default {
  props: [
    'list',
    'curindex',
    'disease',
    'showdisease',
    'ptag',
    'type' // 2：视频合集 1：名家之声
  ],
  data: function () {
    return {

    }
  },
  created: function () {

  },
  filters: {
    formatTime: filters.formatTime
  },
  watch: {
    curindex: {
      handler (val) {
        if (this.type === 2 && typeof val === 'number') {
          this.itemScrollToMiddle(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    goVideoArticle (item, index) { // 跳转到精选视频
      if (this.type === 2) {
        this.$emit('video-item-click', this.type, item, { ptag: this.ptag }) // 相关系列视频在本页播放
        this.itemScrollToMiddle(index)
        return
      }
      if (this.type === 1) {
        this.$emit('video-item-click', this.type, item, { ptag: this.ptag }) // 名家之声跳转播放
        return
      }
      var name = (item.diseases && item.diseases[0] && item.diseases[0].name) || ''
      baike.goToUrl('/mobile/article.html?docid=' + item.docid + (name ? '&name=' + name : '') + (this.disease ? '&disease=' + this.disease : '') + (this.ptag ? '&ptag=' + this.ptag : ''))
    },
    itemScrollToMiddle (index) {
      this.$nextTick(() => {
        let $ul = $('.video-ul')
        let $curLi = $ul.find('li').eq(index)
        $ul.scrollLeft($ul.scrollLeft() + $curLi.offset().left - (($ul.width() - $curLi.width()) / 2))
      })
    }
  }
}

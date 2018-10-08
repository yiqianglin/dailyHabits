/* global $ */
export default {
  props: {
    tags: { // 展示的tag
      type: Array,
      require: true,
      default: () => {
        return []
      }
    },
    index: { // 当前激活状态的索引
      type: Number,
      default: 0
    },
    fixedStatusFromParent: { // 用于避开z-index从父原则的展示的状态
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      activeIndex: this.index
    }
  },
  computed: {
  },
  watch: {
    index (val) {
      this.activeIndex = val
    },
    fixedStatusFromParent (val) {
      if (val) this.scrollToCurrentTag()
    }
  },
  created () {
  },
  methods: {
    tagClick: function (index) {
      this.activeIndex = index
      this.scrollToCurrentTag()
      this.$emit('tagclick', index, this.fixedStatusFromParent)
    },
    toggleExpand: function () {
      this.expandStatus = !this.expandStatus
      this.$emit('expand')
    },
    scrollToCurrentTag () {
      if (this.activeIndex < 0) return
      let $tagUl = $('.papertag-wrp-outter .papertag').find('ul')
      this.$nextTick(() => {
        $tagUl.scrollLeft($tagUl.scrollLeft() + $tagUl.find('li').eq(this.activeIndex).offset().left - 30)
      })
    }
  }
}

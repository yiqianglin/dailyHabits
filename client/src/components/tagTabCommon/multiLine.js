/* global $ */
export default {
  props: {
    tags: { // 展示的tag
      type: Array,
      require: true,
      default: []
    },
    index: { // 当前激活状态的索引
      type: Number,
      default: 0
    },
    needScrollFixed: { // 是否要吸顶，再根据scroll来判断fixed
      type: Boolean,
      default: true
    },
    parentDom: { // papertag展示和隐藏的区域块范围， ***如果页面有多个papertag，则parentDom必须是能唯一指定papertag
      type: String,
      require: true
    },
    topMinusDom: { // fixed在顶部的时候，在papertag上面的dom
      type: [String, Array]
    },
    isExpand: { // 是否默认展开
      type: Boolean,
      default: false
    },
    oneLine: { // v2.0.3后又改回非吸顶需要支持单行
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      expandStatus: this.isExpand, // 是否被展开的状态
      paperTagHeight: {
        noExpand: 0,
        expand: 0
      },
      fixedStyleTop: 0, // 吸顶的时候的top
      fixedStatus: false, // 是否吸顶的状态
      fixedStyle: {},
      placeHolderStyle: {},
      activeIndex: this.index,
      showExpandIcon: false // 是否显示展开按钮，根据宽度计算
    }
  },
  computed: {
    showArrown () {
      var tags = this.tags || []
      var names = tags.map(function (item) {
        return item.name
      })
      var showArrow = names.join('').length > 16
      return showArrow
    }
  },
  watch: {
    index (val) {
      this.activeIndex = val
    },
    fixedStatus (val) {
      if (val) {
        this.fixedStyle = {
          position: 'fixed',
          top: this.fixedStyleTop + 'px'
        }
        this.placeHolderStyle = {
          height: this.paperTagHeight.noExpand + 'px'
        }
        this.scrollToCurrentTag()
      } else {
        this.fixedStyle = {}
        this.placeHolderStyle = {}
        this.scrollToCurrentTag()
      }
    },
    tags: { // tag改变
      handler (val, oVal) {
        this.$nextTick(() => {
          var $ul = $(`${this.parentDom} .papertag ul`)[0]
          if ($ul) {
            this.scrollToCurrentTag()
            this.showExpandIcon = Boolean($ul.scrollWidth > $ul.clientWidth)
          } else {
            this.showExpandIcon = false
          }
        })
      },
      immediate: true
    }
  },
  created () {

  },
  destroyed () {
    window.removeEventListener('scroll', this.showPaperTag)
  },
  deactivated () {
    window.removeEventListener('scroll', this.showPaperTag)
  },
  activated () {
    window.addEventListener('scroll', this.showPaperTag)
  },
  mounted () {
    // this.$nextTick(() => {
    //   var $ul = $(`${this.parentDom} .papertag ul`)[0]
    //   this.showExpandIcon = $ul.scrollWidth > $ul.clientWidth
    // })
    if (!this.needScrollFixed) return
    // 初始化吸顶时候，fixed的top
    if (this.topMinusDom) {
      var heightNeedMinus = 0
      if (typeof this.topMinusDom === 'string') {
        heightNeedMinus = $(this.topMinusDom).length ? $(this.topMinusDom).height() : 0
      } else {
        this.topMinusDom.forEach(item => {
          heightNeedMinus += $(item).length ? $(item).height() : 0
        })
      }
      this.fixedStyleTop = heightNeedMinus
    }
    // 初始化吸顶时候，fixed的height
    // console.log('初始化了fixed的高度',`${this.parentDom} .papertag`, $(`${this.parentDom} .papertag`),$(`${this.parentDom} .papertag`).height())

    this.$nextTick(() => {
      // this.paperTagHeight.noExpand = $(`${this.parentDom} .papertag`).height() // 多行fixed占位
      this.paperTagHeight.noExpand = this.fixedStyleTop // 单行fixed占位
    })
    this.bind()
  },
  methods: {
    tagClick: function (index) {
      this.activeIndex = index
      if (!this.expandStatus) {
        this.scrollToCurrentTag()
      }
      this.$emit('tagclick', index, this.fixedStatus)
    },
    toggleExpand: function () {
      this.expandStatus = !this.expandStatus
      if (!this.expandStatus) {
        this.scrollToCurrentTag()
      }
      this.$emit('expand')
    },
    bind () {
      window.addEventListener('scroll', this.showPaperTag)
    },
    scrollToCurrentTag () {
      let $tagUl = $(this.parentDom).find('.papertag').find('ul')
      if ($tagUl.length === 0) {
        return
      }
      if (this.activeIndex <= 0) {
        this.$nextTick(() => {
          $tagUl.scrollLeft(0)
        })
      } else {
        this.$nextTick(() => {
          $tagUl.scrollLeft($tagUl.scrollLeft() + $tagUl.find('li').eq(this.activeIndex).offset().left - 30)
        })
      }
    },
    showPaperTag () {
      if (this.parentDom && $(this.parentDom).length) {
        var heightNeedMinus = 0
        var scrollTop = $(window).scrollTop()
        if (this.topMinusDom) {
          if (typeof this.topMinusDom === 'string') {
            heightNeedMinus = $(this.topMinusDom).length ? $(this.topMinusDom).height() : 0
          } else {
            this.topMinusDom.forEach(item => {
              heightNeedMinus += $(item).length ? $(item).height() : 0
            })
          }
        }
        // console.log(scrollTop , $(this.parentDom).offset().top , $(this.parentDom).height() , heightNeedMinus)
        // console.log(scrollTop > $(this.parentDom).offset().top - heightNeedMinus , scrollTop < $(this.parentDom).offset().top + $(this.parentDom).height() - heightNeedMinus)
        if (scrollTop > $(this.parentDom).offset().top - heightNeedMinus) {
          this.expandStatus = false
        }
        if (scrollTop > $(this.parentDom).offset().top - heightNeedMinus && scrollTop < $(this.parentDom).offset().top + $(this.parentDom).height() - heightNeedMinus) {
          this.$emit('fixedStatusOnChange', true)
          this.fixedStatus = true
        } else {
          this.$emit('fixedStatusOnChange', false)
          this.fixedStatus = false
          this.expandStatus = this.isExpand
        }
      }
    }
  }
}

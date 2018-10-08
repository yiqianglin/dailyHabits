import filterPanel from 'components/expenseCalculator/filterPanel/filterPanel.vue'

const addAtoZ = () => {
  var arr = []
  for (var i = 0; i < 26; i++) {
    arr.push(String.fromCharCode(65 + i))
  }
  return arr
}

export default {
  name: 'filterSortPanel',
  props: {
    isShow: {
      type: Boolean,
      default: false,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    showBackBtn: {
      type: Boolean,
      default: false
    },
    showClosekBtn: {
      type: Boolean,
      default: false
    },
    showResetBtn: {
      type: Boolean,
      default: false
    },
    domId: { // 用于ref，获取dom
      type: String,
      required: true
    },
    data: { // 数据
      /*
        例子：
        locationPanelData:Object
        autoLocation:"上海"
        autoLocationStatus:1
        data:[{"name":"b","city":[{"name":"北京"}]},{"name":"c","city":[{"name":"重庆"}]},{"name":"f","city":[{"name":"福州"}]},{"name":"g","city":[{"name":"广州"}]},{"name":"h","city":[{"name":"哈尔滨"},{"name":"杭州"}]},{"name":"s","city":[{"name":"上海"},{"name":"沈阳"}]},{"name":"x","city":[{"name":"西安"}]},{"name":"z","city":[{"name":"郑州"}]}]
        selected:"上海"
      */
      type: Object,
      required: true
    },
    dataKey: { // 'city'
      type: String,
      required: true
    }
  },
  data () {
    return {
      alphaData: addAtoZ(),
      alphaDataActive: ''
    }
  },
  computed: {
  },
  watch: {
    isShow () { // 打开重置右边A-Z的状态
      this.alphaDataActive = ''
    }
  },
  components: {
    filterPanel
  },
  mounted () {},
  methods: {
    backBtnClick () {
      this.$emit('onBack')
    },
    closeBtnClick () {
      this.$emit('onClose')
    },
    resetBtnClick () {
      this.$emit('onReset')
    },
    filterSelect (item) {
      if (item === null) {
        if (this.showBackBtn) {
          this.$emit('onBack')
        } else {
          this.$emit('onClose')
        }
        return
      }
      this.$emit('onFilterSelect', item)
    },
    alphaFixedBtnClick (item) {
      this.animationScroll(this.domId, `alphaLoc-${item}`)
      this.alphaDataActive = item
      // this.animationScroll(this.$refs.drugsPanel.domId)
    },
    alphaFixedTouchmove (e) {
      e.stopPropagation()
      e.preventDefault()
      var touch = e.changedTouches[0]
      var elem = document.elementFromPoint(
        touch.pageX - window.pageXOffset,
        touch.pageY - this.getScrollTopOfBody()
      )
      elem && elem.click()
    },
    animationScroll (parentDomId, childDomId, lastStepScroll) {
      var $parentDom = document.querySelector(`#${parentDomId}`)
      var $childDom = document.querySelector(`#${parentDomId} #${childDomId}`)
      if (!$parentDom || !$childDom) return
      $parentDom.scrollTop = $childDom.offsetTop
      // const needScroll = $childDom.offsetTop - $childDom.offsetTop
      // let cardinalNumber = 0
      // if (needScroll > 20) { // 根据需要移动的距离，调整基数
      //   cardinalNumber = 20
      // } else {
      //   cardinalNumber = 10
      // }
      // $parentDom.scrollTop = currentScroll + (needScroll / cardinalNumber)
      // window.animationFrame = window.requestAnimationFrame(() => { this.animationScroll(parentDomId, childDomId, currentScroll) })
    },
    characterCapsLook (str, type) { // type: 0 大写转小写 1 小写转大写
      return type === 1 ? str.toLocaleUpperCase() : str.toLocaleLowerCase()
    },
    getScrollTopOfBody: function () {
      var scrollTop
      if (typeof window.pageYOffset !== 'undefined') {
        // pageYOffset指的是滚动条顶部到网页顶部的距离
        scrollTop = window.pageYOffset
      } else if (
        typeof document.compatMode !== 'undefined' &&
        document.compatMode !== 'BackCompat'
      ) {
        scrollTop = document.documentElement.scrollTop
      } else if (typeof document.body !== 'undefined') {
        scrollTop = document.body.scrollTop
      }
      return scrollTop
    }
  }
}

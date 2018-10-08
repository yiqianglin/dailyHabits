/* global $, baike, WeixinJSBridge */
import { Accordion, AccordionItem } from 'vue-ydui/dist/lib.rem/accordion'
import VueSlideBar from 'vue-slide-bar'
import tmenu from 'components/tmenu/tmenu.vue'

import memoryLoader from 'src/js/memoryLoader'

export default {
  data () {
    return {
      drugName: baike.query('drugName'),
      locationHash: baike.query('hash'),
      adjustVisible: false, // 字体大小调整弹窗是否可见
      showSlider: false, // 字体大小的slider可见，特殊处理
      sliderValue: 2,
      slider: {
        value: 2,
        data: [1, 2, 3, 4],
        range: [
          {
            label: '较小',
            value: 1
          },
          {
            label: '标准',
            value: 2
          },
          {
            label: '较大',
            value: 3
          },
          {
            label: '超大',
            value: 4
          }
        ],
        lineHeight: 1
      },
      sections: null, // 说明书内容
      indexHash: '' // 定位到某个标题下
    }
  },
  components: {
    VueSlideBar,
    Accordion,
    AccordionItem,
    tmenu
  },
  created () {
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady () {
      WeixinJSBridge.call('hideOptionMenu')
    })
    this.getDrugInstruction()
  },
  watch: {
    adjustVisible: function (val) {
      baike.lstore.setItem('instrGuideAdjust', val, 24 * 60 * 30)
      baike.mtaReport(val ? 'ydd_Instructions_Font' : 'ydd_Instructions_FontFold')
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.bindEvents()
    })
  },
  methods: {
    callbackRange (val) {
      baike.mtaReport('ydd_Instructions_FontX|' + (val.value - 1))
      this.sliderValue = val.value
    },
    showAdjustFs () {
      this.adjustVisible = !this.adjustVisible
      if (this.adjustVisible) {
        this.$nextTick(() => {
          this.showSlider = true
        })
      }
    },
    getDrugInstruction () {
      var options = {
        dataKey: 'sections',
        keyGenerator: (params) => {
          return params.common_name
        }
      }
      var params = { common_name: this.drugName }
      memoryLoader.load('post', '/mobile/getDrugInstructionAgent', options, params)
        .then(({ data }) => {
          if (!data.length) return
          data[0].open = true
          this.sections = this.findHash(data)
          this.$nextTick(() => {
            // 是否关闭过字体
            var instrGuideAdjust = baike.lstore.getItem('instrGuideAdjust')
            // 若之前是打开的，则进入页面打开，否则关闭
            if (instrGuideAdjust) {
              this.showAdjustFs()
            }
            if (this.indexHash) {
              setTimeout(() => {
                var scrollTop = this.$el.querySelector(
                  '#J_anchor' + this.indexHash
                ).offsetTop
                var menuDom = $('.tmenu')
                var menuHeight = (menuDom[0] && menuDom[0].offsetHeight) || 0
                window.scrollTo(0, scrollTop - menuHeight)
              }, 500)
            }
            this.bindClickEvents()
          })
        })
    },
    findHash (sections) {
      var indexHash = ''
      if (sections && sections.length) {
        sections.forEach((item, index) => {
          if (item.title === this.locationHash) {
            item.open = true
            indexHash = index
          }
        })
      }
      this.indexHash = indexHash
      return sections
    },
    bindClickEvents () {
      this.sections &&
        this.sections.forEach((item, index) => {
          this.reportSection(item, index)
        })
    },
    reportSection (item, index) {
      this.$el
        .querySelector('#J_anchor' + index + ' .yd-accordion-head')
        .addEventListener('click', function (e) {
          try {
            var arrowElem = e.currentTarget.querySelector(
              '.yd-accordion-head-arrow'
            )
            if (arrowElem && arrowElem.classList) {
              if (arrowElem.classList.contains('yd-accordion-rotated')) {
                baike.mtaReport('ydd_Instructions_TabFoldX|' + item.title)
              } else {
                baike.mtaReport('ydd_Instructions_TabUnfoldX|' + item.title)
              }
            }
          } catch (e) { }
        })
    },
    bindEvents () {
      // 滚动收起字体大小调整区域
      window.addEventListener('scroll', () => {
        // 字体调整区域dom
        var adjustWrapDom = this.$refs.adjustWrap
        // 导航菜单的高度
        if (adjustWrapDom) {
          // 字体调整区域距离文档的高度
          var adjustWrapDomOffsetTop = adjustWrapDom.offsetTop
          // 字体调整区域的高度
          var adjustWrapDomHeight = adjustWrapDom.offsetHeight
          // 滚动条滚动的距离
          var scrollTop = $(window).scrollTop() || 0
          if (scrollTop > adjustWrapDomOffsetTop + adjustWrapDomHeight) {
            this.adjustVisible = false
            this.showSlider = false
          }
        }
      })
    }
  }
}

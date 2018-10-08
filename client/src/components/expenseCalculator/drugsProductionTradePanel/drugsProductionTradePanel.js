/* global baike, $ */
export default {
  name: 'drugsProductionTradePanel',
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
    commonNameData: {
      /*
        A2Z的数据
      */
      type: Object,
      required: true
    },
    tradeNameData: {
      /*
        A2Z的数据
      */
      type: Object,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {
    commonNameShowList () {
      let temp = []
      this.commonNameData.data.forEach((pItem, pIndex) => {
        if (pItem.item) {
          pItem.item.forEach((sItem, sIndex) => {
            temp.push(sItem)
          })
        }
      })
      return temp
    },
    tradeNameShowList () {
      let temp = []
      this.tradeNameData.data.forEach((pItem, pIndex) => {
        if (pItem.item) {
          pItem.item.forEach((sItem, sIndex) => {
            temp.push(sItem)
          })
        }
      })
      return temp
    }
  },
  watch: {
    isShow: {
      handler (val, oVal) {
        this.$nextTick(() => {
          this.scrollToPosition(0)
          this.scrollToPosition(1)
        })
      },
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
    sureBtnClick () {
      this.$emit('onSure')
    },
    backBtnClick () {
      this.$emit('onBack')
    },
    closeBtnClick () {
      this.$emit('onClose')
    },
    resetBtnClick () {
      this.$emit('onReset')
      this.$nextTick(() => {
        this.scrollToPosition(0)
        this.scrollToPosition(1)
      })
    },
    onProductionNameSelect (item) {
      this.$emit('onProductionNameSelect', item)
      baike.mtaReport('drugprice_drugchoose')
      this.$nextTick(() => {
        this.scrollToPosition(0)
        // this.scrollToPosition(1)
      })
    },
    onTradeNameSelect (item) {
      this.$emit('onTradeNameSelect', item)
      baike.mtaReport('drugprice_drugchoose')
      this.$nextTick(() => {
        this.scrollToPosition(1)
      })
    },
    searchFormClick () {
      this.$emit('onSearchFormClick')
      baike.mtaReport('drugprice_drugsearch')
    },
    scrollToPosition (type) { // 0 commonName 1 tradeName
      var needSrcoll = 0
      if (type === 0) {
        if (this.commonNameData.selected) { // 有选择
          this.$nextTick(() => {
            if ($('.selection-production-ul').find('.selected')[0]) {
              needSrcoll = $('.selection-production-ul').find('.selected')[0].offsetTop - $('.selection-production-ul')[0].offsetTop
              $('.selection-production-ul').scrollTop(needSrcoll)
            }
          })
        } else {
          $('.selection-production-ul').scrollTop(0)
        }
      } else {
        if (this.tradeNameData.selected) {
          this.$nextTick(() => {
            if ($('.selection-trade-ul').find('.selected')[0]) {
              needSrcoll = $('.selection-trade-ul').find('.selected')[0].offsetTop - $('.selection-trade-ul')[0].offsetTop
              $('.selection-trade-ul').scrollTop(needSrcoll)
            }
          })
        } else {
          $('.selection-trade-ul').scrollTop(needSrcoll)
        }
      }
    }
  }
}

/* global baike */
import filters from 'src/js/filters'

export default {
  props: {
    // 药品
    item: {
      type: Object,
      default: function () {
        return {
          common_name: '', // 药品名
          trade_name: [], // 商品名
          enterprise: '', // 厂商
          indication: '', // 适应症
          effect: '', // 不良反应
          price_min: 0, // 药品价格(单位分)
          price_max: 0, // 药品价格(单位分)
          diseases: [], // 适用疾病(第一个传到药品价格页 / 仅有一个传到临床招募页)
          city: '', // 所在城市(药品价格)
          discostflag: 0, // 药品价格标志位, 1表示有入口
          druginstrucflag: 0, // 药码说明书标志位, 1表示有入口
          recruitflag: 0 // 临床招募标志位, 1表示有入口
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
    highLight: filters.highLight,
    convertUnit: filters.convertUnit
  },
  methods: {
    // 点击入口：0 - 价格查询，1 - 药品说明，2 - 临床试验
    clickEntry (type) {
      let tradeNameReg = new RegExp(`(${this.keywords.join('|')})`, 'ig')
      let tradeNameHit = tradeNameReg.test(this.item.trade_name.join('、')) ? 1 : 0
      let chemicalNameHit = this.keywords.indexOf(this.item.common_name) !== -1 ? 1 : 0
      let reportValue = `${tradeNameHit}_${chemicalNameHit}_${this.searchkey}`
      switch (type) {
        case 0:
          baike.goToUrl(`/mobile/expenseCalculator.html?type=1&name=${this.item.diseases[0]}&city=${this.item.city}&drugName=${this.item.common_name}&ptag=YDD_searchdrug_priceX:${reportValue}`)
          break
        case 1:
          baike.goToUrl(`/mobile/instrGuide.html?drugName=${this.item.common_name}&ptag=YDD_searchdrug_explainX:${reportValue}`)
          break
        case 2:
          baike.goToUrl(`/mobile/clinical_recruitment.html?name=${this.item.diseases[0]}&drugName=${this.item.common_name}&ptag=YDD_searchdrug_experimentX:${reportValue}`)
          break
      }
    }
  }
}

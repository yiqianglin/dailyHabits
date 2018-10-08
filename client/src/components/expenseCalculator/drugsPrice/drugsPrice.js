/* global $, baike, Raven */
import { mapState } from 'vuex'
// import filterLi from 'components/expenseCalculator/filterLi/filterLi.vue'
import filterPanel from 'components/expenseCalculator/filterPanel/filterPanel.vue'
import filterSortPanel from 'components/expenseCalculator/filterSortPanel/filterSortPanel.vue'
import filterDiseasePanel from 'components/expenseCalculator/filterDiseasePanel/filterDiseasePanel.vue'
import drugsProductionTradePanel from 'components/expenseCalculator/drugsProductionTradePanel/drugsProductionTradePanel.vue'

const div = (a, b) => {
  var c = 0
  var d = 0
  var e = 0
  var f = 0
  try {
    e = a.toString().split('.')[1].length
  } catch (g) {}
  try {
    f = b.toString().split('.')[1].length
  } catch (g) {}
  c = Number(a.toString().replace('.', ''))
  d = Number(b.toString().replace('.', ''))
  return (c / d * Math.pow(10, f - e))
}

export default {
  name: 'drugsPrice',
  data () {
    return {
      drugName: baike.query('drugName'),
      isShowDiseasePanel: false, // 疾病选择面板
      isShowLocationPanel: false, // 城市选择面板
      isShowEnterprisePanel: false, // 厂商选择面板
      isShowProductionAndTradePanel: false, // 药品+商品选择面板
      isShowSearchPanel: false, // 药品+商品搜索面板

      commonNamePanelData: {
        data: [
        ],
        selected: ''
      },
      tradeNamePanelData: {
        data: [
        ],
        selected: ''
      },
      enterprisePanelData: {
        data: [
        ],
        selected: ''
      },

      drugsData: [ // 未排序的原始数据
        // {"common_name":"昂丹司琼","insured":1,"price_max":6758,"item":[{"disease":"乳腺癌","city":"上海","trade_name":"恩诺平","common_name":"昂丹司琼","dosage_forms":"","specification":"8mg","enterprise":"石家庄四药","price":6758,"price_type":"","insured":1}]}
      ],
      drugsDataSorted: [], // 排序后的

      drugsDataUpdated: false, // durgs拉取的数据是否更新（用于动画）
      productionAndTradeSearchPanelData: { // 商品-药品名搜索面板
        searchInput: '',
        searchAble: false,
        isSearching: false,
        resultList: []
      },
      timeoutSearch: null
    }
  },
  computed: {
    isShowMask: {
      get () {
        return this.isShowDiseasePanel || this.isShowLocationPanel || this.isShowEnterprisePanel || this.isShowProductionAndTradePanel
      },
      set (newVal) {
        if (newVal === false) {
          this.isShowDiseasePanel = false
          this.isShowLocationPanel = false
          this.isShowEnterprisePanel = false
          this.isShowProductionAndTradePanel = false
        }
      }
    },
    tradeShowName () {
      if (this.commonNamePanelData.selected && this.tradeNamePanelData.selected) {
        return this.commonNamePanelData.selected + ' - ' + this.tradeNamePanelData.selected
      } else if (!this.commonNamePanelData.selected && this.tradeNamePanelData.selected) {
        return this.tradeNamePanelData.selected
      } else if (this.commonNamePanelData.selected && !this.tradeNamePanelData.selected) {
        return this.commonNamePanelData.selected
      }
    },
    ...mapState({
      diseasePanelData: state => state.expenseCalculator.diseasePanelData,
      locationPanelData: state => state.expenseCalculator.locationPanelData
    })
  },
  components: {
    // filterLi,
    filterPanel,
    filterSortPanel,
    filterDiseasePanel,
    drugsProductionTradePanel
  },
  created () {
    if (this.drugName) {
      this.commonNamePanelData.selected = this.drugName
    }
    if (this.locationPanelData.data.length) {
      this.init()
    }
  },
  mounted () {
  },
  watch: {
    isShowMask: 'disableScroll',
    locationPanelData: { // 城市变化，重置底下所有项
      handler (val, oVal) {
        if (val.selected && oVal.selected && (val.selected !== oVal.selected)) {
          this.resetSelection(1)
        }
      },
      deep: true
    },
    diseasePanelData: { // 疾病变化，重置底下所有项
      handler (val, oVal) {
        this.resetSelection(1)
      },
      deep: true
    },
    'productionAndTradeSearchPanelData.searchInput' (val, oVal) {
      let currentVal = val.replace(/(^\s*)|(\s*$)/g, '')
      let oldVal = oVal.replace(/(^\s*)|(\s*$)/g, '')
      let that = this
      if (currentVal && currentVal !== oldVal) {
        that.productionAndTradeSearchPanelData.isSearching = true
        clearTimeout(that.timeoutSearch)
        that.timeoutSearch = setTimeout(() => {
          that.getSugDrugCostFilter()
            .then(() => {
              that.productionAndTradeSearchPanelData.isSearching = false
            })
        }, 100)
      }
      if (currentVal) {
        this.productionAndTradeSearchPanelData.searchAble = true
      } else {
        this.productionAndTradeSearchPanelData.searchAble = false
      }
    }
  },
  filters: {
    fen2yuan (val) {
      if (!val) return '0'
      let temp = Number(div(val, 100)).toFixed(2)
      return temp.toString()
    }
  },
  methods: {
    init () {
      this.getDrugCostBtnClick()
    },
    disableScroll: function (newVal, oldVal) {
      var that = this
      that.stopScroll = false
      if (newVal) {
        that.scrollTop = $(window).scrollTop()
        document.body.classList.add('disscroll')
        document.body.style.top = -that.scrollTop + 'px'
      } else {
        document.body.classList.remove('disscroll')
        // document.body.scrollTop = that.scrollTop
        $(window).scrollTop(that.scrollTop)
        document.body.style.top = ''
        that.stopScroll = true
      }
    },
    _getDrugCostFilter (type) { // 获取药品价格筛选条件
      return new Promise((resolve, reject) => {
        let params = {}
        switch (type) { // 城市和疾病管理不在type内
          case 3:
            params = {
              type,
              disease: this.diseasePanelData.selected,
              city: this.locationPanelData.selected,
              common_name: '',
              trade_name: '',
              enterprise: ''
            }
            break
          case 4:
            params = {
              type,
              disease: this.diseasePanelData.selected,
              city: this.locationPanelData.selected,
              common_name: this.commonNamePanelData.selected,
              trade_name: '',
              enterprise: this.enterprisePanelData.selected
            }
            break
          case 5:
            params = {
              type,
              disease: this.diseasePanelData.selected,
              city: this.locationPanelData.selected,
              common_name: this.commonNamePanelData.selected,
              trade_name: this.tradeNamePanelData.selected,
              enterprise: ''
            }
            break
        }
        baike.post('/mobile/getDrugCostFilter', params, (data) => {
          if (data.retcode === 0) {
            resolve(data)
          } else {
            reject(data)
          }
        }, null, (err) => {
          reject(err)
        })
      })
    },
    async getDrugCostFilter (type) {
      try {
        const data = await this._getDrugCostFilter(type)
        if (data.retcode === 0) {
        }
        return data
      } catch (err) {
        console.log(err)
        Raven.captureException(err)
      }
    },
    _getDrugCost () { // 获取药品价格筛选条件
      return new Promise((resolve, reject) => {
        // setTimeout(() => {
        //   resolve({'cityname': '上海', retcode: 0})
        // }, 3000)
        let params = {
          disease: this.diseasePanelData.selected,
          city: this.locationPanelData.selected,
          common_name: this.commonNamePanelData.selected,
          trade_name: this.tradeNamePanelData.selected,
          enterprise: this.enterprisePanelData.selected
        }
        baike.post('/mobile/getDrugCost', params, (data) => {
          if (data.retcode === 0) {
            resolve(data)
          } else {
            reject(data)
          }
        }, null, (err) => {
          reject(err)
        })
      })
    },
    async getDrugCost () {
      try {
        this.drugsDataUpdated = false
        const data = await this._getDrugCost()
        this.drugsDataUpdated = true
        if (data.retcode === 0) {
          this.drugsData = JSON.parse(JSON.stringify(data.list))
          this.drugsDataSorted = JSON.parse(JSON.stringify(data.list))
        }
        return data
      } catch (err) {
        this.drugsDataUpdated = true
        console.log(err)
        Raven.captureException(err)
      }
    },
    _getSugDrugCostFilter () { // 获取药品名联想词
      return new Promise((resolve, reject) => {
        baike.post('/mobile/sugDrugCostFilter', {
          disease: this.diseasePanelData.selected,
          city: this.locationPanelData.selected,
          query: this.productionAndTradeSearchPanelData.searchInput
        }, (data) => {
          if (data.retcode === 0) {
            resolve(data)
          } else {
            reject(data)
          }
        }, null, (err) => {
          reject(err)
        })
      })
    },
    async getSugDrugCostFilter () {
      try {
        const data = await this._getSugDrugCostFilter()
        if (data.retcode === 0) {
          this.productionAndTradeSearchPanelData.resultList = data.list
        }
        return data
      } catch (err) {
        console.log(err)
        Raven.captureException(err)
      }
    },
    maskClick () {
      this.isShowMask = false
    },
    // 接收疾病面板选项点击
    diseasePanelOnBack () {
      this.isShowDiseasePanel = false
    },
    diseasePanelOnClose () {
      this.isShowDiseasePanel = false
    },
    diseaseSelectionClick (item) {
      this.$store.commit('expenseCalculator/SET_DISEASE_PANEL_DATA', { selected: item.name })
      this.isShowDiseasePanel = false
      baike.mtaReport('drugprice_disease')
    },
    // 筛选面板 城市
    onLocationPanelSelect (item) { // 城市面板筛选，本组件弹回筛选面板，并通知父组件修改locationPanel数据
      this.isShowLocationPanel = false
      this.$store.commit('expenseCalculator/SET_LOCATION_PANEL_DATA', { selected: item.name })
      // 需要重置费用工具的社保选择
      this.$store.commit('expenseCalculator/SET_SBTYPE_SELECTION', { selected: '' })
      this.$store.commit('expenseCalculator/SET_CBTYPE_SELECTION', { selected: '' })
      baike.mtaReport('drugprice_city')
    },
    locationPanelOnClose () {
      this.isShowLocationPanel = false
    },
    // 药品名-商品名选择面板
    onCommonNamePanelSelect (item) {
      if (item.name !== this.commonNamePanelData.selected) {
        this.enterprisePanelData.selected = ''
        if (item.name === '') {
          this.commonNamePanelData.selected = ''
        } else {
          this.commonNamePanelData.selected = item.name
        }
        this.getDrugCostFilter(4)
          .then((data) => {
            this.tradeNamePanelData.data = data.list
            this.tradeNamePanelData.selected = ''
            // this.$refs['drugs-production-trade-panel'].scrollToPosition(0)
            this.$refs['drugs-production-trade-panel'].scrollToPosition(1)
          })
      }
    },
    onTradeNamePanelSelect (item) {
      if (item.name === '') this.tradeNamePanelData.selected = ''
      this.tradeNamePanelData.selected = item.name
      this.isShowProductionAndTradePanel = false
    },
    onSearchFormClick () {
      this.productionAndTradeSearchPanelData.searchInput = ''
      this.productionAndTradeSearchPanelData.resultList = ''
      this.isShowSearchPanel = true
    },
    onProductionAndTradePanelReset () {
      this.commonNamePanelData.selected = ''
      this.tradeNamePanelData.selected = ''
      this.getDrugCostFilter(4)
        .then((data) => {
          this.tradeNamePanelData.data = data.list
        })
    },
    // 筛选面板 厂商
    onEnterprisePanelSelect (item) {
      this.enterprisePanelData.selected = item.name
      this.isShowEnterprisePanel = false
      baike.mtaReport('drugprice_mnf')
    },
    enterprisePanelOnClose () {
      this.isShowEnterprisePanel = false
    },
    enterprisePanelOnReset () {
      this.enterprisePanelData.selected = ''
      this.isShowEnterprisePanel = false
    },
    // 筛选项点击，弹出对应弹窗
    filterOptionsClick (type) { // 1疾病 2地址 3药品名 4商品名 5厂商 6药品-商品（联合）
      switch (type) {
        case 1:
          this.isShowDiseasePanel = true
          break
        case 2:
          this.isShowLocationPanel = true
          break
        case 3:
          this.getDrugCostFilter(3)
            .then((data) => {
              this.commonNamePanelData.data = data.list
              this.isShowCommonNamePanel = true
            })
          break
        case 4:
          this.getDrugCostFilter(4)
            .then((data) => {
              this.tradeNamePanelData.data = data.list
            })
          break
        case 5:
          this.getDrugCostFilter(5)
            .then((data) => {
              this.enterprisePanelData.data = data.list
              this.isShowEnterprisePanel = true
            })
          break
        case 6:
          // Promise.all([this.getDrugCostFilter(3), this.getDrugCostFilter(4)])
          //   .then((data) => {
          //     console.log(data)
          //     this.commonNamePanelData.data = data[0].list
          //     this.tradeNamePanelData.data = data[1].list
          //     this.isShowProductionAndTradePanel = true
          //   })
          const func = async () => {
            const commonNameSeverData = await this.getDrugCostFilter(3)
            this.commonNamePanelData.data = commonNameSeverData.list
            this.isShowProductionAndTradePanel = true
            const tradeNameServerData = await this.getDrugCostFilter(4)
            this.tradeNamePanelData.data = tradeNameServerData.list
          }
          func()
          break
      }
    },
    // 点击查询按钮
    getDrugCostBtnClick () {
      if (!this.diseasePanelData.selected) {
        this.$emit('toast', '请选择疾病名')
        return
      }
      if (!this.locationPanelData.selected) {
        this.$emit('toast', '请选择所在城市')
        return
      }
      this.getDrugCost()
      baike.mtaReport('drugprice_search')
    },
    resetSelection (type) { // 重置选项 case 1：疾病和城市改变，重置底下所有选择， case 2: 药品名改变，重置商品名和厂商
      if (type === 1) {
        this.commonNamePanelData.selected = ''
        this.tradeNamePanelData.selected = ''
        this.enterprisePanelData.selected = ''
      } else if (type === 2) {
        this.tradeNamePanelData.selected = ''
        this.enterprisePanelData.selected = ''
      }
      this.drugsData = []
      this.drugsDataSorted = []
      this.drugsDataUpdated = false
    },
    // 搜索
    highLight (commonName, tradeName) {
      let str = ''
      if (commonName && tradeName) {
        str = commonName + ' ' + tradeName
      } else if (commonName && !tradeName) {
        str = commonName
      } else if (!commonName && tradeName) {
        str = tradeName
      }
      var keys = this.productionAndTradeSearchPanelData.searchInput
      if (keys) {
        var regex = new RegExp('(' + keys + ')', 'ig')
        str = str.replace(regex, '<span class="match">$1</span>')
      }
      return str
    },
    cancelSearchPanel () {
      this.isShowSearchPanel = false
    },
    cleanSearchInput () {
      this.productionAndTradeSearchPanelData.searchInput = ''
      this.productionAndTradeSearchPanelData.resultList = []
    },
    searchItemSelect (commonName, tradeName) {
      this.tradeNamePanelData.selected = tradeName || ''
      this.commonNamePanelData.selected = commonName || ''
      // 关闭搜索，选择面板选中搜索项
      // this.getDrugCostFilter(4)
      //   .then((data) => {
      //     this.tradeNamePanelData.data = data.list
      //     this.$refs['drugs-production-trade-panel'].scrollToPosition(1)
      //   })
      // 直接拉结果
      this.getDrugCostBtnClick()
      this.isShowProductionAndTradePanel = false
      this.isShowSearchPanel = false
      // this.$nextTick(() => {
      //   this.$refs['drugs-production-trade-panel'].scrollToPosition(0)
      //   this.$refs['drugs-production-trade-panel'].scrollToPosition(1)
      // })
    },
    // 表格价格排序点击
    priceSort (index, event) {
      let oldClassName = event.currentTarget.className
      if (new RegExp(/up/).test(oldClassName)) {
        event.currentTarget.className = `price-sort-th down`
        this.drugsDataSorted[index].item.sort((a, b) => {
          return b.price - a.price
        })
      } else if (new RegExp(/down/).test(oldClassName)) {
        event.currentTarget.className = `price-sort-th`
        this.drugsDataSorted.splice(index, 1, JSON.parse(JSON.stringify(this.drugsData[index])))
      } else {
        event.currentTarget.className = `price-sort-th up`
        this.drugsDataSorted[index].item.sort((a, b) => {
          return a.price - b.price
        })
      }
    }
  }
}

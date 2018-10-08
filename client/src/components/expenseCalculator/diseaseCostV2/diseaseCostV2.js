/* global $, baike, Raven */
import { mapState } from 'vuex'
import VeRing from 'v-charts/lib/ring.common'
import 'v-charts/lib/style.css'
import filterPanel from 'components/expenseCalculator/filterPanel/filterPanel.vue'
import filterLi from 'components/expenseCalculator/filterLi/filterLi.vue'
import filterSortPanel from 'components/expenseCalculator/filterSortPanel/filterSortPanel.vue'
import filterDiseasePanel from 'components/expenseCalculator/filterDiseasePanel/filterDiseasePanel.vue'
import picker from 'components/expenseCalculator/picker/picker.vue'

const autoPx = (px) => { // 以750单位的px转换
  var docEl = document.documentElement
  var size = 750
  var zoom = docEl.clientWidth / size
  zoom = zoom.toFixed(2)
  if (zoom >= 1) return px
  return px * zoom
}

const add = (a, b) => {
  var c, d, e
  try {
    c = a.toString().split('.')[1].length
  } catch (f) {
    c = 0
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) {
    d = 0
  }
  e = Math.pow(10, Math.max(c, d))
  return (mul(a, e) + mul(b, e)) / e
}

const sub = (a, b) => {
  var c, d, e
  try {
    c = a.toString().split('.')[1].length
  } catch (f) {
    c = 0
  }
  try {
    d = b.toString().split('.')[1].length
  } catch (f) {
    d = 0
  }
  e = Math.pow(10, Math.max(c, d))
  return (mul(a, e) - mul(b, e)) / e
}

const mul = (a, b) => {
  var c = 0
  var d = a.toString()
  var e = b.toString()
  try {
    c += d.split('.')[1].length
  } catch (f) {}
  try {
    c += e.split('.')[1].length
  } catch (f) {}
  return (
    (Number(d.replace('.', '')) * Number(e.replace('.', ''))) / Math.pow(10, c)
  )
}

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
  return (c / d) * Math.pow(10, f - e)
}

const createNumList = (type, num) => {
  if (type === 0) {
    var arr = new Array(num + 1)
    for (var i = 0; i < arr.length; i++) {
      if (i === 0) arr[i] = '请选择次数'
      else arr[i] = i
    }
    return arr
  }
}

const createCustomizationMap = () => [
  {
    itemName: '手术总花费',
    color: '#FE7575',
    frequencyName: '手术',
    slot: [
      {
        flex: 1,
        values: createNumList(0, 100),
        defaultIndex: 0,
        currentValue: '请选择次数'
      }
    ]
  },
  {
    itemName: '放疗总花费',
    color: '#50BDFE',
    frequencyName: '放疗',
    slot: [
      {
        flex: 1,
        values: ['伽马刀', '传统放疗'],
        defaultIndex: 0,
        currentValue: '伽马刀'
      },
      {
        flex: 1,
        values: createNumList(0, 100),
        defaultIndex: 0,
        currentValue: '请选择次数'
      }
    ]
  },
  {
    itemName: '化疗总花费',
    color: '#09D877',
    frequencyName: '化疗',
    slot: [
      {
        flex: 1,
        values: createNumList(0, 100),
        defaultIndex: 0,
        currentValue: '请选择次数'
      }
    ]
  },
  {
    itemName: '内分泌总花费',
    color: '#FEC201',
    frequencyName: '消融',
    slot: [
      {
        flex: 1,
        values: createNumList(0, 100),
        defaultIndex: 0,
        currentValue: '请选择次数'
      }
    ]
  },
  {
    itemName: '靶向总花费',
    color: '#FFA000',
    frequencyName: '靶向药',
    slot: [
      {
        flex: 1,
        values: createNumList(0, 100),
        defaultIndex: 0,
        currentValue: '请选择次数'
      }
    ]
  },
  {
    itemName: '其他花费',
    color: '#E4E4E4',
    frequencyName: '其他花费'
  }
]

let customizationMap = createCustomizationMap()

export default {
  name: 'diseaseCountV2',
  data () {
    const self = this
    return {
      // 图表数据
      canvasLoading: true,
      canvasInited: false, // 第一次初始化 && dataEmpty
      chartSettings: {
        dimension: '项目',
        metrics: '费用',
        width: '100%', // 图总宽度
        height: '100%',
        radius: ['32%', '62%'],
        offsetY: '50%',
        clickable: false,
        legend: {
          selectedMode: false,
          show: false
        },
        // containLabel: true,
        grid: {
          containLabel: true
        },
        // 点击事件
        chartEvents: {
          click (e) {
            setTimeout(() => { // v-chart的点击穿透bug兼容
              self.customizationCollapse = true
            }, 10)
          }
        },
        // 去掉点击和hover
        selectedMode: false,
        legendHoverLink: false,
        hoverAnimation: false,
        emphasis: { // 高亮
          label: {
            show: false
          }
        },
        label: {
          position: 'outside',
          formatter: `{a|{c}万元}\n{hr|}\n{b|{b}}`,
          margin: 0,
          padding: [autoPx(16), -autoPx(130)],
          // borderWidth: 0.5,
          // borderColor: '#333',
          rich: {
            a: {
              color: '#333',
              fontSize: autoPx(26),
              lineHeight: autoPx(24),
              height: autoPx(24),
              align: 'center'
            },
            hr: {
              width: '100%',
              borderWidth: 0.5,
              height: autoPx(16),
              borderColor: 'transparent'
            },
            b: {
              color: '#80888C',
              fontSize: autoPx(26),
              lineHeight: autoPx(24),
              height: autoPx(24)
              // borderWidth: 0.5,
              // borderColor: '#333'
            }
          }
        },
        labelLine: {
          normal: {
            lineStyle: {
              color: '#aaa',
              width: 0.5
            },
            smooth: 0, // 是否平滑视觉引导线
            length: autoPx(28),
            length2: autoPx(130)
          }
        }
      },
      chartExtend: { // 根据series来判断颜色
        series (v) {
          v[0].data.forEach(item => {
            customizationMap.forEach(mapItem => {
              if (item.name === mapItem.itemName) {
                item.itemStyle = {
                  color: mapItem.color
                }
              }
            })
          })
          return v
        }
      },
      // 图表源数据
      chartOriginData: {

      },
      // 图表数据format
      chartData: {
        columns: ['项目', '费用'],
        rows: [
          // { '项目': '化疗治疗', '费用': 2500 },
          // { '项目': '手术治疗', '费用': 3530 },
          // { '项目': '靶向治疗', '费用': 2923 },
          // { '项目': '放疗治疗', '费用': 1723 },
          // { '项目': '放弃治疗', '费用': 500 }
        ]
      },
      diseaseShow: '', // 现在显示的疾病名，场景：蒙层出来，弹出疾病面板，修改疾病选择后，在没确认查询之前，不修改正在显示的疾病名
      locationShow: '', // 同上
      customizationCollapse: false, // 次数选择被展开
      insuredExpendCost: 0, // 社保报销费用
      customizationData: [],
      customizationPickerPanelData: {
        slot: []
      }, // picker面板对应的数据 n:1
      SBTypePickerPanelData: {
        name: '社保类型',
        slot: [
          {
            flex: 1,
            values: ['请选择'],
            defaultIndex: 0,
            currentValue: '请选择'
          }
        ]
      },
      CBTypePickerPanelData: {
        name: '参保类型',
        slot: [
          {
            flex: 1,
            values: ['请选择'],
            defaultIndex: 0,
            currentValue: '请选择'
          }
        ]
      },
      feedbackPanelData: {
        fastChoice: [],
        fastChoiceSelectedIndex: -1,
        accurateChoice: {
          min: '',
          max: ''
        }
      },
      // 弹窗数据
      isShowFilterPanel: false, // 筛选条件面板
      isShowDiseasePanel: false, // 疾病面板
      isShowLocationPanel: false, // 城市选择面板
      isShowCustomizationPickerPanel: false, // 次数picker选择面板
      isShowSBTypePickerPanel: false, // 社保类型
      isShowCBTypePickerPanel: false, // 参保类型
      isShowFeedbackPanel: false, // 反馈

      // 记录location和disease是否被修改，用来重置社保选择方案
      locationIsModified: false,
      diseaseIsModified: false
    }
  },
  computed: {
    ...mapState({
      diseasePanelData: state => state.expenseCalculator.diseasePanelData,
      locationPanelData: state => state.expenseCalculator.locationPanelData,
      SBTypeSelectedFromStore: state => state.expenseCalculator.SBTypeSelected,
      CBTypeSelectedFromStore: state => state.expenseCalculator.CBTypeSelected
    }),
    isShowMask: {
      get () {
        return this.isShowFilterPanel || this.isShowDiseasePanel || this.isShowLocationPanel || this.isShowFeedbackPanel
      },
      set (newVal) {
        if (newVal === false) {
          this.isShowFilterPanel = false
          this.isShowDiseasePanel = false
          this.isShowLocationPanel = false
          this.isShowFeedbackPanel = false
        }
      }
    },
    dataEmpty () {
      if (!this.chartData.rows.length && this.canvasInited) {
        return true
      }
      return false
    },
    currentCity () {
      if (this.locationPanelData.autoLocationStatus === 1) {
        return this.locationPanelData.autoLocation
      } else {
        if (this.locationPanelData.autoLocationStatus === -1) {
          return '城市陆续更新中'
        } else {
          return '正在定位中'
        }
      }
    },
    isShowCustomizationCost () { // 是否展示个人治疗费用
      let flag = false
      flag = this.customizationJudgement()
      return flag
    },
    personalCost () { // 个人花费
      return sub(this.chartData.totalAverage, this.insuredExpendCost)
    },
    formatFrequencyList () { // 个人选择方案
      const frequencyList = [] // 次数列表
      this.customizationData.forEach((item, index) => {
        if (item.name !== '放疗' && item.name !== '其他花费') {
          frequencyList.push({name: item.name, frequency: item.slot[0].currentValue})
        } else if (item.name === '其他花费') {
          frequencyList.push({name: item.name, frequency: 1})
        } else {
          frequencyList.push({name: item.name, frequency: item.slot[1].currentValue, type: item.slot[0].currentValue})
        }
      })
      return frequencyList
    },
    chartAreaTitle () {
      if (this.isShowCustomizationCost !== true && this.customizationCollapse === false) {
        return '平均治疗明细'
      }
      return '个人治疗明细'
    },
    isShowInsuredRemark () { // 是否显示医保报销的选择提示 （选择了社保类型，没选择参保类型时，提示选择参保类型）
      return this.SBTypePickerPanelData.slot[0].currentValue !== '请选择' && this.CBTypePickerPanelData.slot[0].currentValue === '请选择'
    },
    feedbackBtnStatus () {
      if (this.feedbackPanelData.fastChoiceSelectedIndex > -1) {
        return true
      }
      if (this.feedbackPanelData.accurateChoice.min > 0 || this.feedbackPanelData.accurateChoice.max > 0) {
        return true
      }
      return false
    }
  },
  watch: {
    isShowMask: 'disableScroll',
    'locationPanelData.selected' (val, oval) { // 切换城市，需要重置医保报销，保留个人治疗方案
      // console.log('watch: 修改地区')
      this.locationIsModified = true
    },
    'diseasePanelData.selected' (val, oval) { // 切换疾病，需要重置个人治疗方案，保留医保报销
      // console.log('watch: 修改疾病')
      this.diseaseIsModified = true
    },
    SBTypePickerPanelData: {
      handler (val, oval) {
        if (val.slot[0].defaultIndex === 0) {
          this.insuredExpendCost = 0
        }
      },
      deep: true
    },
    CBTypePickerPanelData: {
      handler (val, oval) {
        if (val.slot[0].defaultIndex === 0) {
          this.insuredExpendCost = 0
        }
      },
      deep: true
    },
    'feedbackPanelData.accurateChoice': {
      handler (val) {
        // console.log('watch:', val.min, val.max)
        this.feedbackPanelData.fastChoiceSelectedIndex = -1
        var reg = new RegExp(/^\D*(0*)([1-9]\d{0,2})?.*$/)
        if (new RegExp(/\./).test(val.min)) {
          val.min = val.min.replace(/^\D*([0]{0,1}[0-9]\d{0,2}\.?\d{0,1})?.*$/, '$1')
        } else {
          val.min.match(reg)
          // console.log('1:', RegExp.$1, '2:', RegExp.$2, '3:', RegExp.$3)
          if (RegExp.$1 !== '' && RegExp.$2 === '') {
            val.min = RegExp.$1
          } else {
            val.min = RegExp.$2
          }
        }
        if (new RegExp(/\./).test(val.max)) {
          val.max = val.max.replace(/^\D*([0]{0,1}[0-9]\d{0,2}\.?\d{0,1})?.*$/, '$1')
        } else {
          val.max.match(reg)
          if (RegExp.$1 !== '' && RegExp.$2 === '') {
            val.max = RegExp.$1
          } else {
            val.max = RegExp.$2
          }
        }
      },
      deep: true
    }
  },
  filters: {
    frequencyFormate (val) {
      if (val === '请选择次数') return '请选择'
      else return val
    },
    fastChoiceFormate ({ min, max }) { // min 和 max 都是整数位 例如 12万-14万 min: 120 max: 140
      if (+min === 0 && +max !== 0) {
        return max + '万元以下'
      } else if (+min !== 0 && +max === 0) {
        return min + '万元以上'
      } else if (+min !== 0 && +max !== 0 && +min !== +max) {
        return min + '~' + max + '万元'
      }
    }
  },
  directives: { // 拿不到this，舍弃
    numberOnly: {
      bind (el, binding) {
        // el.handler = () => {
        //   console.log('bind')
        //   el.value = el.value.replace(/^\D*([1-9]\d*\.?\d{0,2})?.*$/, '$1')
        //   // this.feedbackPanelData.accurateChoice.min = el.value
        // }
        // el.addEventListener('input', el.handler)
        // console.log(this)
      },
      inserted () {
        console.log('inserted')
      },
      update (el, binding) {
        console.log('update')
        el.value = binding.value
      },
      componentUpdated (el) {
        console.log('componentUpdated')
      },
      unbind (el) {
        console.log('unbind')
        // el.removeEventListener('input', el.handler)
      }
    }
  },
  components: {
    VeRing,
    filterPanel,
    filterLi,
    filterSortPanel,
    filterDiseasePanel,
    picker
  },
  created: function () {
    // 重置个人选择方案
    this.resetCustomizationData()
    if (this.locationPanelData.data.length) {
      this.init()
    }
  },
  mounted: function () {
    this.bind()
    this.$nextTick(_ => {
      this.$refs['chartRing'].echarts.resize()
    })
  },
  methods: {
    init () {
      this.filterPanelOnSure()
    },
    _getDiseaseCost () { //  获取肿瘤治疗费用
      return new Promise((resolve, reject) => {
        baike.post('/mobile/getDiseaseCost', {
          disease: this.diseasePanelData.selected,
          city: this.locationPanelData.selected
        }, (data) => {
          if (data.retcode === 0) {
            resolve(data)
          } else {
            reject(data)
          }
        })
      })
    },
    async getDiseaseCost () {
      try {
        this.canvasLoading = true
        let data = await this._getDiseaseCost()
        this.canvasInited = true
        /*
        data = {
          "disease": "肺癌",
          "city": "北京",
          "chemo_cost_min": 50,
          "chemo_cost_max": 70,
          "surg_cost_min": 45,
          "surg_cost_max": 60,
          "radio_cost_min": 10,
          "radio_cost_max": 25,
          "target_cost_min": 50,
          "target_cost_max": 90,
          "other_cost_min": 40,
          "other_cost_max": 90,
          "total_cost_min": 200,
          "total_cost_max": 330,
          "endoc_cost_min": 0,
          "endoc_cost_max": 0,

          "chemo_avg_cost": 60,
          "surg_avg_cost": 50,
          "radio_avg_cost": 20,
          "radiox_avg_cost": 80,
          "target_avg_cost": 80,
          "endoc_avg_cost": 70,
          "retcode": 0,
          "retmsg": "E_SUCCESS"
        } */
        if (data.retcode === 0) {
          // 设置原始数据
          this.chartOriginData.total_cost_min = data.total_cost_min || 0 // 总治疗费用
          this.chartOriginData.total_cost_max = data.total_cost_max || 0
          this.chartOriginData.chemo_cost_min = data.chemo_cost_min || 0 // 化疗
          this.chartOriginData.chemo_cost_max = data.chemo_cost_max || 0
          this.chartOriginData.surg_cost_min = data.surg_cost_min || 0 // 手术
          this.chartOriginData.surg_cost_max = data.surg_cost_max || 0
          this.chartOriginData.radio_cost_min = data.radio_cost_min || 0 // 放疗
          this.chartOriginData.radio_cost_max = data.radio_cost_max || 0
          this.chartOriginData.target_cost_min = data.target_cost_min || 0 // 靶向
          this.chartOriginData.target_cost_max = data.target_cost_max || 0
          this.chartOriginData.other_cost_min = data.other_cost_min || 0 // 其他
          this.chartOriginData.other_cost_max = data.other_cost_max || 0
          this.chartOriginData.endoc_cost_min = data.endoc_cost_min || 0 // 内分泌
          this.chartOriginData.endoc_cost_max = data.endoc_cost_max || 0
          // 平均项数据
          this.chartOriginData.chemoCostAverage = Number(div(this.chartOriginData.chemo_cost_min + this.chartOriginData.chemo_cost_max, 2))
          this.chartOriginData.surgCostAverage = Number(div(this.chartOriginData.surg_cost_min + this.chartOriginData.surg_cost_max, 2))
          this.chartOriginData.radioCostAverage = Number(div(this.chartOriginData.radio_cost_min + this.chartOriginData.radio_cost_max, 2))
          this.chartOriginData.targetCostAverage = Number(div(this.chartOriginData.target_cost_min + this.chartOriginData.target_cost_max, 2))
          this.chartOriginData.otherCostAverage = Number(div(this.chartOriginData.other_cost_min + this.chartOriginData.other_cost_max, 2))
          this.chartOriginData.endocCostAverage = Number(div(this.chartOriginData.endoc_cost_min + this.chartOriginData.endoc_cost_max, 2))
          this.chartOriginData.totalCostAverage = Number(div(this.chartOriginData.total_cost_min + this.chartOriginData.total_cost_max, 2))
          // 单项单次数据
          this.chartOriginData.chemoCostOnce = data.chemo_avg_cost || 0
          this.chartOriginData.surgCostOnce = data.surg_avg_cost || 0
          this.chartOriginData.radioxCostOnce = data.radiox_avg_cost || 0
          this.chartOriginData.radioCostOnce = data.radio_avg_cost || 0
          this.chartOriginData.targetCostOnce = data.target_avg_cost || 0
          this.chartOriginData.endocCostOnce = data.endoc_avg_cost || 0
          this.chartOriginData.otherCostOnce = this.chartOriginData.otherCostAverage || 0

          // 判断个人选择项，如果有选，则渲染个人治疗费用饼图，否则渲染平均费用饼图
          let flag = false
          this.formatFrequencyList.forEach((item) => {
            if (item.name !== '其他花费' && item.frequency > 0) {
              flag = true
            }
          })
          if (flag) {
            this.renderChart(1)
          } else {
            this.renderChart(0)
            this.renderCustomizationData()
          }
          this.canvasLoading = false
        } else {
          this.canvasLoading = false
        }
        return data
      } catch (err) {
        this.canvasLoading = false
        Raven.captureException(err)
      }
    },
    _getDiseaseCostFilter (type, isReset) { // 获取肿瘤治疗费用工具筛选条件
      return new Promise((resolve, reject) => {
        var params = {
          type: type || 0,
          city: this.locationPanelData.selected,
          insure_type: this.SBTypePickerPanelData.slot[0].defaultIndex > 0 ? this.SBTypePickerPanelData.slot[0].currentValue : '',
          insure_person: this.CBTypePickerPanelData.slot[0].defaultIndex > 0 ? this.CBTypePickerPanelData.slot[0].currentValue : '',
          hospital_grade: ''
        }
        if (type === 1 && isReset) { // 社保选择的时候，重置参保类型
          params.insure_person = ''
        }
        baike.post('/mobile/getDiseaseCostFilter', params, (data) => {
          if (data.retcode === 0) {
            resolve(data)
          } else {
            reject(data)
          }
        })
      })
    },
    async getDiseaseCostFilter (type, isReset) { // type 拉取类型 isReset 是否为重置（例如选择社保类型会重置参保类型）
      try {
        const data = await this._getDiseaseCostFilter(type, isReset)
        if (data && data.retcode === 0) {
        } else {
          this.$emit('toast', '获取筛选条件错误')
        }
        return data
      } catch (err) {
        this.$emit('toast', '获取筛选条件错误')
      }
    },
    _getDiseaseExpenseCost (type) { // type 0 平均费用 1 个人
      return new Promise((resolve, reject) => {
        baike.post('/mobile/getDiseaseExpenseCost', {
          city: this.locationPanelData.selected,
          insure_type: this.SBTypePickerPanelData.slot[0].defaultIndex > 0 ? this.SBTypePickerPanelData.slot[0].currentValue : '',
          insure_person: this.CBTypePickerPanelData.slot[0].defaultIndex > 0 ? this.CBTypePickerPanelData.slot[0].currentValue : '',
          hospital_grade: '三级医疗机构',
          cost: mul(this.chartData.totalAverage, 10000) // 这个单位是元
        }, (data) => {
          if (data.retcode === 0) {
            resolve(data)
          } else {
            reject(data)
          }
        })
      })
    },
    async getDiseaseExpenseCost () { // 获取医保报销费用信息
      try {
        let data = await this._getDiseaseExpenseCost()
        if (data && data.retcode === 0) {
          this.insuredExpendCost = Number(div(data.expense_cost, 10000).toFixed(1))
        } else {
          this.$emit('toast', '网络繁忙，请稍后再试')
        }
        return data
      } catch (err) {
        this.$emit('toast', '网络繁忙，请稍后再试')
      }
    },
    async restoreTypeSelection () { // 根据缓存的数据恢复社保类型和参保类型
      if (this.SBTypeSelectedFromStore && this.SBTypePickerPanelData.slot[0].currentValue !== this.SBTypeSelectedFromStore) {
        console.log('sbType 有')
        await this.getDiseaseCostFilter(1, true).then((data) => {
          if (data.retcode === 0) {
            const list = data.list
            console.log(list)
            console.log(this.SBTypeSelectedFromStore)
            this.SBTypePickerPanelData.slot[0].values = ['请选择', ...list]
            this.SBTypePickerPanelData.slot[0].values.forEach((item, index) => {
              if (item === this.SBTypeSelectedFromStore) {
                this.SBTypePickerPanelData.slot[0].defaultIndex = index
                this.SBTypePickerPanelData.slot[0].currentValue = item
              }
            })
          } else {
            this.$emit('toast', '网络繁忙，请稍后再试')
          }
        })
      }
      if (this.CBTypeSelectedFromStore && this.CBTypePickerPanelData.slot[0].currentValue !== this.CBTypeSelectedFromStore) {
        console.log('cbType 有')
        await this.getDiseaseCostFilter(2).then((data) => {
          if (data.retcode === 0) {
            const list = data.list
            console.log(list)
            console.log(this.CBTypeSelectedFromStore)
            this.CBTypePickerPanelData.slot[0].values = ['请选择', ...list]
            this.CBTypePickerPanelData.slot[0].values.forEach((item, index) => {
              if (item === this.CBTypeSelectedFromStore) {
                this.CBTypePickerPanelData.slot[0].defaultIndex = index
                this.CBTypePickerPanelData.slot[0].currentValue = item
              }
            })
          } else {
            this.$emit('toast', '网络繁忙，请稍后再试')
          }
        })
      }
    },
    renderChart (type, onlyData) { // 渲染图表， type: 0平均 1个人花费  onlyData: boolean 只更新数据，不更新图表
      this.feedbackPanelRest()
      if (type === 0) {
        const tempList = [
          { '项目': '手术总花费', '费用': div(this.chartOriginData.surgCostAverage, 10).toFixed(1) },
          { '项目': '放疗总花费', '费用': div(this.chartOriginData.radioCostAverage, 10).toFixed(1) },
          { '项目': '化疗总花费', '费用': div(this.chartOriginData.chemoCostAverage, 10).toFixed(1) },
          { '项目': '内分泌总花费', '费用': div(this.chartOriginData.endocCostAverage, 10).toFixed(1) },
          { '项目': '靶向总花费', '费用': div(this.chartOriginData.targetCostAverage, 10).toFixed(1) },
          { '项目': '其他花费', '费用': div(this.chartOriginData.otherCostAverage, 10).toFixed(1) }
        ]
        // this.chartData.totalAverage = div(this.chartOriginData.totalCostAverage, 10)
        this.$set(this.chartData, 'totalAverage', div(this.chartOriginData.totalCostAverage, 10).toFixed(1))

        this.chartData.rows = []
        tempList.forEach((item, idnex) => {
          if (item['费用'] > 0) {
            this.chartData.rows.push(item)
          }
        })
        if (!onlyData) {
          this.$nextTick(_ => {
            this.$refs['chartRing'].echarts.resize()
          })
        }
      } else {
        const tempList = []
        this.formatFrequencyList.forEach((item, index) => {
          switch (item.name) {
            case '手术':
              tempList.push({ '项目': '手术总花费', '费用': Number(div(mul(item.frequency, this.chartOriginData.surgCostOnce), 10).toFixed(1)) })
              break
            case '放疗':
              if (item.type === '伽马刀') {
                tempList.push({ '项目': '放疗总花费', '费用': Number(div(mul(item.frequency, this.chartOriginData.radioxCostOnce), 10).toFixed(1)) })
              } else if (item.type === '传统放疗') {
                tempList.push({ '项目': '放疗总花费', '费用': Number(div(mul(item.frequency, this.chartOriginData.radioCostOnce), 10).toFixed(1)) })
              }
              break
            case '化疗':
              tempList.push({ '项目': '化疗总花费', '费用': Number(div(mul(item.frequency, this.chartOriginData.chemoCostOnce), 10).toFixed(1)) })
              break
            case '消融':
              tempList.push({ '项目': '内分泌总花费', '费用': Number(div(mul(item.frequency, this.chartOriginData.endocCostOnce), 10).toFixed(1)) })
              break
            case '靶向药':
              tempList.push({ '项目': '靶向总花费', '费用': Number(div(mul(item.frequency, this.chartOriginData.targetCostOnce), 10).toFixed(1)) })
              break
            case '其他花费':
              tempList.push({ '项目': '其他花费', '费用': Number(div(mul(item.frequency, this.chartOriginData.otherCostOnce), 10).toFixed(1)) })
              break
          }
        })
        // this.chartData.totalAverage = 0
        this.$set(this.chartData, 'totalAverage', 0)
        this.chartData.rows = []
        tempList.forEach((item, idnex) => {
          if (item['费用'] > 0) {
            this.chartData.rows.push(item)
            this.chartData.totalAverage = add(this.chartData.totalAverage, item['费用'])
          }
        })
        if (!onlyData) {
          this.$nextTick(_ => {
            this.$refs['chartRing'].echarts.resize()
          })
        }
      }
      this.insureCostJudgement()
    },
    renderCustomizationData () {
      this.customizationData = []

      const tempMap = [
        { frequencyName: '手术', dataName: 'surgCostAverage', onceDataName: 'surg_avg_cost' },
        { frequencyName: '放疗', dataName: 'radioCostAverage', onceDataName: 'radiox_avg_cost', onceDataAliasName: 'radio_avg_cost' },
        { frequencyName: '化疗', dataName: 'chemoCostAverage', onceDataName: 'chemo_avg_cost' },
        { frequencyName: '消融', dataName: 'endocCostAverage', onceDataName: 'endoc_avg_cost' },
        { frequencyName: '靶向药', dataName: 'targetCostAverage', onceDataName: 'target_avg_cost' },
        { frequencyName: '其他花费', dataName: 'otherCostAverage', onceDataName: 'target_avg_cost' }
      ]
      tempMap.forEach((tempItem, tempIndex) => {
        if (this.chartOriginData[tempItem.dataName]) { // 如果平均值存在，则需要展示可调整次数项
          customizationMap.forEach((cusItem, cusIndex) => {
            if (tempItem.frequencyName === cusItem.frequencyName) {
              if (cusItem.slot) {
                this.customizationData.push({
                  name: cusItem.frequencyName,
                  slot: cusItem.slot,
                  color: cusItem.color
                })
              } else { // 其他费用
                this.customizationData.push({
                  name: cusItem.frequencyName,
                  value: div(this.chartOriginData[tempItem.dataName], 10).toFixed(1),
                  color: cusItem.color
                })
              }
            }
          })
        }
      })
    },
    resetInsuredData () { // 重置所有医保类信息
      this.insuredExpendCost = 0
      this.SBTypePickerPanelData = {
        name: '社保类型',
        slot: [
          {
            flex: 1,
            values: ['请选择'],
            defaultIndex: 0,
            currentValue: '请选择'
          }
        ]
      }
      this.CBTypePickerPanelData = {
        name: '参保类型',
        slot: [
          {
            flex: 1,
            values: ['请选择'],
            defaultIndex: 0,
            currentValue: '请选择'
          }
        ]
      }
    },
    resetCustomizationData () { // 重置个人选择项
      customizationMap = createCustomizationMap()
      this.customizationData.forEach((item, index) => {
        if (item.name !== '放疗' && item.name !== '其他花费') {
          item.slot[0].currentValue = '请选择次数'
          item.slot[0].defaultIndex = 0
        } else if (item.name === '放疗') {
          item.slot[0].currentValue = '伽马刀'
          item.slot[0].defaultIndex = 0
          item.slot[1].currentValue = '请选择次数'
          item.slot[0].defaultIndex = 0
        }
      })
    },
    insureCostJudgement () { // 判断是否要拉取医保报销
      if (this.SBTypePickerPanelData.slot[0].defaultIndex === 0 || this.CBTypePickerPanelData.slot[0].defaultIndex === 0) {
        return false
      } else {
        this.getDiseaseExpenseCost()
      }
    },
    bind () {
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
    // 筛选面板
    filterPanelShow () {
      baike.mtaReport('1stchooser_click')
      this.isShowFilterPanel = true
    },
    filterPanelOnBack (params) {
      this.isShowFilterPanel = false
    },
    filterPanelOnClose () {
      this.isShowFilterPanel = false
      this.$store.commit('expenseCalculator/SET_DISEASE_PANEL_DATA', { selected: this.diseaseShow })
      this.$store.commit('expenseCalculator/SET_LOCATION_PANEL_DATA', { selected: this.locationShow })
    },
    async filterPanelOnSure () {
      if (!this.diseasePanelData.selected) {
        this.$emit('toast', '请选择疾病名')
        return
      }
      if (!this.locationPanelData.selected) {
        this.$emit('toast', '请选择所在城市')
        return
      }
      this.diseaseShow = this.diseasePanelData.selected
      this.locationShow = this.locationPanelData.selected
      this.customizationCollapse = false
      /*
        判断localStore里面是否有社保类型选择数据，如果有,根据城市、疾病参数等获取社保类型，则帮用户选中记录，则带上社保类型，查询对应参保类型；否则，为未选择
        查询到参保类型同上
      */
      await this.restoreTypeSelection()
      // 如果用户选了医保报销，切换城市，需要重置；切换疾病，需要保留原选择
      // 如果用户选了治疗方案，切换城市，需要保留原选择；切换疾病，需要重置
      if (this.locationIsModified) {
        this.resetInsuredData() // 重置医保类信息
      }
      if (this.diseaseIsModified) {
        customizationMap = createCustomizationMap()
        this.resetCustomizationData()
      }
      this.getDiseaseCost().then((data) => {
        if (data.retcode === 0) {
          this.isShowFilterPanel = false
          this.locationIsModified = false
          this.diseaseIsModified = false
        } else {
          this.$emit('toast', '网络繁忙，请稍后再试')
        }
      })
    },
    maskClick () {
      this.isShowMask = false
      this.$store.commit('expenseCalculator/SET_DISEASE_PANEL_DATA', { selected: this.diseaseShow })
      this.$store.commit('expenseCalculator/SET_LOCATION_PANEL_DATA', { selected: this.locationShow })
    },
    // 筛选面板选项点击
    filterOptionsClick ({name}) {
      this.isShowFilterPanel = false
      switch (name) {
        case '疾病名称':
          this.isShowDiseasePanel = true
          break
        case '所在城市':
          this.isShowLocationPanel = true
          break
      }
    },
    // 接收疾病面板选项点击
    diseasePanelOnBack () {
      this.isShowDiseasePanel = false
      this.isShowFilterPanel = true
    },
    diseasePanelOnClose () {
      this.isShowDiseasePanel = false
    },
    diseaseSelectionClick (item) {
      this.$store.commit('expenseCalculator/SET_DISEASE_PANEL_DATA', { selected: item.name })
      this.isShowDiseasePanel = false
      this.isShowFilterPanel = true
      baike.mtaReport('trtmntcost_disease')
    },
    // 接收城市面板选项点击
    locationPanelOnBack () {
      this.isShowLocationPanel = false
      this.isShowFilterPanel = true
    },
    locationPanelOnClose () {
      this.isShowLocationPanel = false
    },
    onLocationPanelSelect (item) { // 城市面板筛选，本组件弹回筛选面板，并通知父组件修改locationPanel数据
      this.isShowLocationPanel = false
      this.isShowFilterPanel = true
      this.$store.commit('expenseCalculator/SET_LOCATION_PANEL_DATA', { selected: item.name })
      // 需要重置费用工具的社保选择
      this.$store.commit('expenseCalculator/SET_SBTYPE_SELECTION', { selected: '' })
      this.$store.commit('expenseCalculator/SET_CBTYPE_SELECTION', { selected: '' })
      baike.mtaReport('trtmntcost_city')
    },
    // picker面板
    collapseBtnClick (type) { // 次数展开按钮点击 0 展开 1 收起
      if (type) {
        this.customizationCollapse = false
        baike.mtaReport('trmntoption_close')
      } else {
        this.customizationCollapse = true
        baike.mtaReport('trtmntoption_open')
      }
    },
    modifyFrequency (item) { // 修改次数
      if (!item.slot) { // “其他花费”无slot
        return
      }
      this.customizationPickerPanelData = item
      this.isShowCustomizationPickerPanel = true
    },
    customizationPickerOnChange (picker, values) {
      // 放疗如果修改了slot1，重置slot2
      // if (picker.slots[1] && (values[0] !== picker.slots[0].currentValue)) {
      //   picker.slots[1].currentValue = '请选择'
      //   picker.slots[1].defaultIndex = 0
      // }
    },
    customizationPickerCancel () {
      this.isShowCustomizationPickerPanel = false
    },
    customizationPickerConfirm (data, index) {
      let reportData = ''
      data.forEach((dataItem, dataIndex) => {
        let valueIndex = 0
        let currentValue = ''
        const valueName = this.customizationPickerPanelData.name
        this.customizationPickerPanelData.slot[dataIndex].values.forEach((item, index) => { // 更新picker面板数据
          if (item === data[dataIndex]) {
            valueIndex = index
            currentValue = item
            this.customizationPickerPanelData.slot[dataIndex].defaultIndex = index
            this.customizationPickerPanelData.slot[dataIndex].currentValue = item
          }
        })
        this.customizationData.forEach((item, index) => { // 更新所有picker的数据列表
          if (item.name === valueName) {
            item.slot[dataIndex].defaultIndex = valueIndex
            item.slot[dataIndex].currentValue = currentValue
          }
        })
        this.isShowCustomizationPickerPanel = false
      })

      var type = ''
      var typeValue = ''
      if (this.customizationPickerPanelData.name === '放疗') {
        type = this.customizationPickerPanelData.slot[0].currentValue
        typeValue = this.customizationPickerPanelData.slot[1].currentValue
        reportData = `trtmntoption_number:${type}_${typeValue}`
      } else {
        type = this.customizationPickerPanelData.name
        typeValue = this.customizationPickerPanelData.slot[0].currentValue
        reportData = `trtmntoption_number:${type}_${typeValue}`
      }
      // 重新渲染chart
      let renderType = this.customizationJudgement() ? 1 : 0
      this.renderChart(renderType, true)
      baike.mtaReport(reportData)
    },
    modifySBType () {
      if (!this.locationPanelData.selected) {
        return
      }
      this.getDiseaseCostFilter(1, true).then((data) => {
        if (data.retcode === 0) {
          const list = data.list
          this.SBTypePickerPanelData.slot[0].values = ['请选择', ...list]
          this.isShowMask = false
          this.isShowSBTypePickerPanel = true
        } else {
          this.$emit('toast', '网络繁忙，请稍后再试')
        }
      })
    },
    SBTypePickerCancel () {
      this.isShowSBTypePickerPanel = false
    },
    SBTypePickerConfirm (data, index) {
      // 判断是否修改了
      if (this.SBTypePickerPanelData.slot[0].currentValue !== data[0]) {
        this.SBTypePickerPanelData.slot[0].currentValue = data[0]
        this.SBTypePickerPanelData.slot[0].values.forEach((item, index) => {
          if (item === data[0]) {
            this.SBTypePickerPanelData.slot[0].defaultIndex = index
          }
        })
        this.$store.commit('expenseCalculator/SET_SBTYPE_SELECTION', { selected: data[0] !== '请选择' ? data[0] : '' })
        this.isShowSBTypePickerPanel = false
        baike.mtaReport(`reimb_type:${data[0]}`)
        this.CBTypePickerPanelData = { // 修改了就重置参保类型
          name: '参保类型',
          slot: [
            {
              flex: 1,
              values: ['请选择'],
              defaultIndex: 0,
              currentValue: '请选择'
            }
          ]
        }
        this.$store.commit('expenseCalculator/SET_CBTYPE_SELECTION', { selected: '' })
      } else {
        this.isShowSBTypePickerPanel = false
        this.insureCostJudgement()
      }
    },
    modifyCBType () {
      if (!this.locationPanelData.selected) {
        return
      }
      this.getDiseaseCostFilter(2).then((data) => {
        if (data.retcode === 0) {
          const list = data.list
          this.CBTypePickerPanelData.slot[0].values = ['请选择', ...list]
          this.isShowMask = false
          this.isShowCBTypePickerPanel = true
        } else {
          this.$emit('toast', '网络繁忙，请稍后再试')
        }
      })
    },
    CBTypePickerCancel () {
      this.isShowCBTypePickerPanel = false
    },
    CBTypePickerConfirm (data, index) {
      if (this.CBTypePickerPanelData.slot[0].currentValue !== data[0]) {
        this.CBTypePickerPanelData.slot[0].currentValue = data[0]
        this.CBTypePickerPanelData.slot[0].values.forEach((item, index) => {
          if (item === data[0]) {
            this.CBTypePickerPanelData.slot[0].defaultIndex = index
          }
        })
        this.$store.commit('expenseCalculator/SET_CBTYPE_SELECTION', { selected: data[0] !== '请选择' ? data[0] : '' })
        // 判断社保类型，如果没选，拉取数据（数据唯一，则自动勾选）
        if (this.SBTypePickerPanelData.slot[0].currentValue === '请选择') {
          this.getDiseaseCostFilter(1).then((data) => {
            if (data.retcode === 0) {
              const list = data.list
              if (list.length === 1) {
                this.SBTypePickerPanelData.slot[0].values = ['请选择', ...list]
                this.SBTypePickerPanelData.slot[0].currentValue = this.SBTypePickerPanelData.slot[0].values[1]
                this.SBTypePickerPanelData.slot[0].defaultIndex = 1
                this.$store.commit('expenseCalculator/SET_SBTYPE_SELECTION', {
                  selected: this.SBTypePickerPanelData.slot[0].values[1]
                })
              } else {
                this.SBTypePickerPanelData.slot[0].values = ['请选择', ...list]
                this.$store.commit('expenseCalculator/SET_SBTYPE_SELECTION', { selected: '' })
              }
              this.insureCostJudgement()
            } else {
              this.$emit('toast', '网络繁忙，请稍后再试')
            }
          })
        }

        this.isShowCBTypePickerPanel = false
        this.insureCostJudgement()
        baike.mtaReport(`reimb_subtype:${data[0]}`)
      } else {
        this.isShowCBTypePickerPanel = false
        this.insureCostJudgement()
      }
    },
    customizationJudgement () { // 判断是否选择了个人明细项
      let flag = false
      this.customizationData.forEach((item, index) => {
        if (item.name !== '放疗' && item.name !== '其他花费') {
          if (Number(item.slot[0].currentValue) > 0) {
            flag = true
          }
        } else if (item.name === '放疗') {
          if (Number(item.slot[1].currentValue) > 0) {
            flag = true
          }
        }
      })
      return flag
    },
    getCustomizationItemCost (name, frequency, params) { // 用于计算个人选择方案每一项的总价
      var price = 0
      var times = Number(frequency) ? Number(frequency) : 0
      switch (name) {
        case '手术':
          price = this.chartOriginData.surgCostOnce
          break
        case '化疗':
          price = this.chartOriginData.chemoCostOnce
          break
        case '靶向药':
          price = this.chartOriginData.targetCostOnce
          break
        case '消融':
          price = this.chartOriginData.endocCostOnce
          break
        case '放疗':
          if (params === '伽马刀') price = this.chartOriginData.radioxCostOnce
          else price = this.chartOriginData.radioCostOnce
          break
        case '其他花费':
          break
      }
      var cost = div(mul(price, times), 10)
      return cost ? cost.toFixed(1) + '万元' : 0
    },
    /* ---- 用户数据反馈逻辑 ---- */
    feedBackBtnClick () {
      // 生成对应的快速筛选项数据
      var temp = []
      if (this.insuredExpendCost) { // 社保报销数据
        temp = this.feedBackFastChoiceGenerator(this.personalCost)
      } else {
        if (this.isShowCustomizationCost) { // 个人治疗费用
          temp = this.feedBackFastChoiceGenerator(this.chartData.totalAverage)
        } else {
          temp = this.feedBackFastChoiceGenerator(this.chartData.totalAverage)
        }
      }
      this.feedbackPanelData.fastChoice = temp
      this.isShowFeedbackPanel = true
      baike.mtaReport('Cost_mistake')
    },
    feedBackFastChoiceGenerator (val) { // 对val进行四舍五入，取整数
      let middleNum = +Number(val).toFixed(0)
      let areaMin = 0
      let areaMax = 0
      let areaList = []
      if (middleNum < 10) { // 费用平均值小于10
        if (middleNum - 3 <= 0) {
          while (areaList.length < 6) {
            areaMax = areaMin + 1
            if (areaMin !== middleNum && areaMax !== middleNum) {
              areaList.push({
                min: areaMin,
                max: areaMax
              })
            }
            areaMin = areaMin + 1
          }
        } else {
          areaMin = middleNum - 3
          while (areaList.length < 6) {
            areaMax = areaMin + 1
            if (areaMin !== middleNum && areaMax !== middleNum) {
              areaList.push({
                min: areaMin,
                max: areaMax
              })
            }
            areaMin = areaMin + 1
          }
        }
      } else { // 费用平均值大于10
        areaMin = 0
        areaMax = middleNum - 6
        areaList.push({
          min: areaMin,
          max: areaMax
        })
        areaMin = areaMax
        while (areaList.length < 3) {
          areaMax = areaMin + 2
          areaList.push({
            min: areaMin,
            max: areaMax
          })
          areaMin = areaMin + 3
        }
        areaMin = middleNum + 1
        while (areaList.length < 5) {
          areaMax = areaMin + 2
          areaList.push({
            min: areaMin,
            max: areaMax
          })
          areaMin = areaMin + 3
        }
        areaMin = areaMax + 1
        areaList.push({
          min: areaMin,
          max: ''
        })
      }
      return areaList
    },
    feedBackFastChoiceClick (index) {
      const { min, max } = this.feedbackPanelData.fastChoice[index]
      this.feedbackPanelData.accurateChoice.min = String(min)
      this.feedbackPanelData.accurateChoice.max = String(max)
      this.$nextTick(() => {
        this.feedbackPanelData.fastChoiceSelectedIndex = index
      })
    },
    feedbackPanelRest () {
      this.feedbackPanelData.fastChoiceSelectedIndex = -1
      this.feedbackPanelData.accurateChoice.min = ''
      this.feedbackPanelData.accurateChoice.max = ''
    },
    feedbackPanelClose () {
      this.isShowFeedbackPanel = false
    },
    _feedbackPost () { //  提交反馈数据
      let min = 0
      let max = 0
      let inputData = this.feedbackPanelData.accurateChoice
      let choseData = this.feedbackPanelData.fastChoice[this.feedbackPanelData.fastChoiceSelectedIndex]
      let type = 0
      let costType = 0
      let totalCost = 0
      // 设置min，max，type
      if (inputData.min || inputData.max) {
        min = Number(inputData.min) * 10 || 0
        max = Number(inputData.max) * 10 || 0
      } else {
        min = Number(choseData.min) * 10
        max = Number(choseData.max) * 10
      }
      if (this.feedbackPanelData.fastChoiceSelectedIndex === -1) {
        type = 1
      }
      // 设置总费用total_cost
      if (this.insuredExpendCost) { // 如果有社保报销数据
        totalCost = Number(this.personalCost) * 10
      } else {
        totalCost = Number(this.chartData.totalAverage) * 10
      }
      // 设置cost_type
      if (!this.insuredExpendCost) { // 非报销数据
        if (this.isShowCustomizationCost) { // 个人治疗费用
          costType = 1
        } else { // 平均治疗费用
          costType = 0
        }
      } else {
        if (this.isShowCustomizationCost) {
          costType = 3
        } else {
          costType = 2
        }
      }
      return new Promise((resolve, reject) => {
        baike.post('/mobile/correctDiseaseCost', {
          disease: this.diseasePanelData.selected,
          city: this.locationPanelData.selected,
          type: type, // 0: 区间, 1: 用户手动输入
          cost_type: costType, // 0: 总价, 1: 总价(个人), 2: 报销总价, 3: 报销总价(个人)
          total_cost: totalCost, // 总费用(单位0.1万元)
          correct_cost_min: min, // 纠正费用(最小值, 单位0.1万元)
          correct_cost_max: max // 纠正费用(最大值, 单位0.1万元)
        }, (data) => {
          if (data.retcode === 0) {
            baike.mtaReport(
              `Cost_usercost:${this.diseasePanelData.selected}_${this.locationPanelData.selected}_${type}_${costType}_${totalCost}_${min}_${max}`
            )
            resolve(data)
          } else {
            reject(data)
          }
        })
      })
    },
    async feedbackPost () {
      try {
        let data = await this._feedbackPost()
        if (data.retcode === 0) {
          this.feedbackPanelClose()
          this.$emit('toast', '提交成功', 1)
          this.feedbackPanelData.fastChoiceSelectedIndex = -1
          this.feedbackPanelData.accurateChoice.min = ''
          this.feedbackPanelData.accurateChoice.max = ''
        } else {
          this.$emit('toast', '您的输入有误')
        }
        return data
      } catch (err) {
        Raven.captureException(err)
      }
    },
    feedbackBtnClick () {
      if (!this.feedbackDataValidator()) {
        return
      }
      this.feedbackPost()
    },
    feedbackDataValidator () {
      let { min: minInput, max: maxInput } = this.feedbackPanelData.accurateChoice
      if (minInput !== '' && maxInput !== '') {
        if (+maxInput < +minInput) {
          this.$emit('toast', '您的输入有误')
          return false
        }
      } else if (minInput === '' && maxInput === '' && this.feedbackPanelData.fastChoiceSelectedIndex === -1) {
        this.$emit('toast', '您的输入有误')
        return false
      }
      return true
    }
  }
}

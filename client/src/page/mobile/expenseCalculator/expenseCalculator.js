/* global baike */
import { mapState } from 'vuex'
import { Picker } from 'mint-ui'
import tmenu from 'components/tmenu/tmenu.vue'
import drugsPrice from 'components/expenseCalculator/drugsPrice/drugsPrice.vue'
import diseaseCount from 'components/expenseCalculator/diseaseCostV2/diseaseCostV2.vue'

const tempData = {
  diseaseCount: [
    {
      name: '肺癌',
      img: require('src/assets/images/mobile/expenseCalculator/disease_01.png'),
      selectable: true
    },
    {
      name: '乳腺癌',
      img: require('src/assets/images/mobile/expenseCalculator/disease_02.png'),
      selectable: true
    },
    {
      name: '结直肠癌',
      img: require('src/assets/images/mobile/expenseCalculator/disease_03.png'),
      selectable: true
    },
    {
      name: '宫颈癌',
      img: require('src/assets/images/mobile/expenseCalculator/disease_04_unable.png'),
      selectable: false
    },
    {
      name: '膀胱癌',
      img: require('src/assets/images/mobile/expenseCalculator/disease_05_unable.png'),
      selectable: false
    }
  ],
  // drugsPrice: [
  //   { name: '肺癌', img: require('src/assets/images/mobile/expenseCalculator/disease_01.png'), selectable: true },
  //   { name: '乳腺癌', img: require('src/assets/images/mobile/expenseCalculator/disease_02.png'), selectable: true },
  //   { name: '结直肠癌', img: require('src/assets/images/mobile/expenseCalculator/disease_03.png'), selectable: true },
  //   { name: '宫颈癌', img: require('src/assets/images/mobile/expenseCalculator/disease_04.png'), selectable: true },
  //   { name: '膀胱癌', img: require('src/assets/images/mobile/expenseCalculator/disease_05.png'), selectable: true }
  // ],
  drugsPrice: [
    {
      name: 'f',
      disease: [
        {
          name: '肺癌'
        }
      ]
    },
    {
      name: 'g',
      disease: [
        {
          name: '宫颈癌'
        }
      ]
    },
    {
      name: 'j',
      disease: [
        {
          name: '甲状腺癌'
        },
        {
          name: '结直肠癌'
        }
      ]
    },
    {
      name: 'l',
      disease: [
        {
          name: '卵巢癌'
        }
      ]
    },
    {
      name: 'p',
      disease: [
        {
          name: '膀胱癌'
        }
      ]
    },
    {
      name: 'q',
      disease: [
        {
          name: '前列腺癌'
        }
      ]
    },
    {
      name: 'r',
      disease: [
        {
          name: '乳腺癌'
        }
      ]
    },
    {
      name: 'w',
      disease: [
        {
          name: '胃癌'
        }
      ]
    }
  ]
}

export default {
  data () {
    return {
      name: baike.query('name'),
      type: baike.query('type'),
      city: baike.query('city'),
      pageComponent:
        baike.query('type') === '1' ? 'drugsPrice' : 'diseaseCount', // 'diseaseCount' 'drugsPrice'
      toast: {
        isShow: false,
        msg: '请输入正确信息',
        type: 0
      }
    }
  },
  computed: {
    ...mapState({
      diseasePanelData: state => state.expenseCalculator.diseasePanelData,
      locationPanelData: state => state.expenseCalculator.locationPanelData
    })
  },
  watch: {
    'toast.isShow' (val) {
      if (val === true) {
        setTimeout(() => {
          this.toast.isShow = false
        }, 1500)
      }
    }
    // locationPanelData: {
    //   handler (val, oVal) {
    //     // case 1： 城市列表已经获取，定位未完成 （判断是否传入了city，是则使用city，否则等待定位）
    //     // case 2： 城市列表已经获取，定位已完成 （判断是否传入了city，是则使用city，否则判断定位autoLocation是否在城市列表内）
    //     if (val.data.length > 0 && val.selected !== '' && val.autoLocationStatus === 0) {
    //       if (this.pageComponent === 'diseaseCount') {
    //         this.$refs[this.pageComponent].filterPanelOnSure()
    //       } else {
    //         this.$refs[this.pageComponent].getDrugCostBtnClick()
    //       }
    //     } else if (val.data.length > 0 && val.selected === '' && val.autoLocationStatus === -1) {
    //       this.$store.commit('expenseCalculator/SET_LOCATION_PANEL_DATA', { selected: val.data[0] && val.data[0].city[0] && val.data[0].city[0].name })
    //       if (this.pageComponent === 'diseaseCount') {
    //         this.$refs[this.pageComponent].filterPanelOnSure()
    //       } else {
    //         this.$refs[this.pageComponent].getDrugCostBtnClick()
    //       }
    //     } else if (val.data.length > 0 && val.selected === '' && val.autoLocationStatus === 1) {
    //       let hasFlag = false
    //       val.data.filter((item, index) => {
    //         if (item) {
    //           item.city.filter((itemi, indexi) => {
    //             if (itemi.name === val.autoLocation) {
    //               hasFlag = true
    //               this.$store.commit('expenseCalculator/SET_LOCATION_PANEL_DATA', { selected: itemi.name })
    //             }
    //             return hasFlag
    //           })
    //         }
    //         return hasFlag
    //       })
    //       if (hasFlag) {
    //         if (this.pageComponent === 'diseaseCount') {
    //           this.$refs[this.pageComponent].filterPanelOnSure()
    //         } else {
    //           this.$refs[this.pageComponent].getDrugCostBtnClick()
    //         }
    //       } else {
    //         this.$store.commit('expenseCalculator/SET_LOCATION_PANEL_DATA', { selected: val.data[0] && val.data[0].city[0] && val.data[0].city[0].name })
    //         if (this.pageComponent === 'diseaseCount') {
    //           this.$refs[this.pageComponent].filterPanelOnSure()
    //         } else {
    //           this.$refs[this.pageComponent].getDrugCostBtnClick()
    //         }
    //       }
    //     }
    //   },
    //   deep: true
    // }
  },
  components: {
    tmenu,
    diseaseCount,
    drugsPrice,
    mtPicker: Picker
  },
  activated () {
    // console.log('父组件触发activated')
  },
  deactivated () {
    // console.log('父组件触发deactivated')
  },
  created: function () {
    // 设置component名
    this.$store.commit('expenseCalculator/SET_DISEASE_PANEL_DATA', { selected: '', data: baike.query('type') === '1' ? tempData.drugsPrice : tempData.diseaseCount })
    // 城市数据
    if (this.city) {
      // 如果url有传入city，去拉取城市列表：
      // case1：如果city在城市列表内，则选择默认选中city
      // case2：如果city不在城市列表内，则选择cityList[0]
      this.getCityList()
        .then(data => {
          const { citylist } = data
          if (this.judgeCityInList(this.city, citylist)) {
            // 如果city值跟local存的不相同，则清除之前的社保选项，并重新设值
            if (this.city !== this.locationPanelData.selected) {
              this.$store.commit('expenseCalculator/SET_SBTYPE_SELECTION', { selected: '' })
              this.$store.commit('expenseCalculator/SET_CBTYPE_SELECTION', { selected: '' })
              this.$store.commit('expenseCalculator/SET_LOCATION_PANEL_DATA', { selected: this.city })
            }
          } else {
            let cityFirst = citylist[0] && citylist[0].city[0] && citylist[0].city[0].name
            if (cityFirst !== this.locationPanelData.selected) {
              this.$store.commit('expenseCalculator/SET_SBTYPE_SELECTION', { selected: '' })
              this.$store.commit('expenseCalculator/SET_CBTYPE_SELECTION', { selected: '' })
              this.$store.commit('expenseCalculator/SET_LOCATION_PANEL_DATA', { selected: cityFirst })
            }
          }
          // 触发拉取费用、价格逻辑
          if (this.pageComponent === 'diseaseCount') {
            this.$refs[this.pageComponent].filterPanelOnSure()
          } else {
            this.$refs[this.pageComponent].getDrugCostBtnClick()
          }
        })
    } else {
      // 如果url没有传入city，先拉取城市列表：
      // 判断store，如果store有之前选过的city，且在城市列表范围内，则使用store里面的city（无需修改）
      // 判断store，如果没有选过，则使用定位，然后根据经纬度去拉取城市名，判断城市名是否在城市列表范围内，是则使用定位城市，否则使用list[0]
      this.getCityList()
        .then(data => {
          const { citylist } = data
          if (this.locationPanelData.selected) {
            if (!this.judgeCityInList(this.locationPanelData.selected, citylist)) {
              let cityFirst = citylist[0] && citylist[0].city[0] && citylist[0].city[0].name
              if (cityFirst !== this.locationPanelData.selected) {
                this.$store.commit('expenseCalculator/SET_SBTYPE_SELECTION', { selected: '' })
                this.$store.commit('expenseCalculator/SET_CBTYPE_SELECTION', { selected: '' })
                this.$store.commit('expenseCalculator/SET_LOCATION_PANEL_DATA', { selected: cityFirst })
              }
            }
            // 触发拉取费用、价格逻辑
            if (this.pageComponent === 'diseaseCount') {
              this.$refs[this.pageComponent].filterPanelOnSure()
            } else {
              this.$refs[this.pageComponent].getDrugCostBtnClick()
            }
          } else {
            this.getCurrentCity()
              .then(data => {
                const { cityname: GPSCityName } = data
                if (this.judgeCityInList(GPSCityName, citylist)) {
                  this.$store.commit('expenseCalculator/SET_LOCATION_PANEL_DATA', { selected: GPSCityName })
                } else {
                  this.$store.commit('expenseCalculator/SET_LOCATION_PANEL_DATA', { selected: citylist[0] && citylist[0].city[0] && citylist[0].city[0].name })
                }
                // 触发拉取费用、价格逻辑
                if (this.pageComponent === 'diseaseCount') {
                  this.$refs[this.pageComponent].filterPanelOnSure()
                } else {
                  this.$refs[this.pageComponent].getDrugCostBtnClick()
                }
              })
          }
        })
    }

    // 疾病数据
    if (this.pageComponent === 'drugsPrice') {
      let dataList = []
      let tempList = []
      this.diseasePanelData.data.forEach(element => {
        element.disease.forEach(item => {
          dataList.push(item)
        })
      })
      tempList = dataList.filter((item, index) => {
        if (item.name === this.name) {
          this.$store.commit('expenseCalculator/SET_DISEASE_PANEL_DATA', { selected: item.name })
        }
        return item.name === this.name
      })
      if (tempList.length === 0) {
        this.$store.commit('expenseCalculator/SET_DISEASE_PANEL_DATA', { selected: this.diseasePanelData.data[0].disease[0].name })
      }
    } else if (this.pageComponent === 'diseaseCount') {
      const temList = this.diseasePanelData.data.filter((item, index) => {
        if (item.name === this.name && item.selectable === true) {
          this.$store.commit('expenseCalculator/SET_DISEASE_PANEL_DATA', { selected: item.name })
        }
        return item.name === this.name && item.selectable === true
      })
      if (temList.length === 0) {
        this.$store.commit('expenseCalculator/SET_DISEASE_PANEL_DATA', { selected: this.diseasePanelData.data[0].name })
      }
    }
    // this.test().then((val) => {
    //   console.log('then拿到的值：', val)
    // }, (val) => {
    //   console.log(val)
    // })

    // this.testWrp()
    // this.testWrpPromise().then((val) => {
    //   console.log('skjskdfjksjfkjdskjf')
    //   console.log(val)
    // })
  },
  methods: {
    async getCurrentCity () {
      const resultLocation = await this.$store.dispatch('expenseCalculator/getLocation')
      console.log('最终 resultLocation', resultLocation)
      const resultCity = await this.$store.dispatch('expenseCalculator/getCityName', { latitude: resultLocation.latitude, longitude: resultLocation.longitude })
      if (resultCity.retcode === 0 && resultCity.city) {
        this.$store.commit('expenseCalculator/SET_LOCATION_PANEL_DATA', { autoLocation: resultCity.city, autoLocationStatus: 1 })
      } else {
        this.$store.commit('expenseCalculator/SET_LOCATION_PANEL_DATA', { autoLocationStatus: -1 })
      }
      return resultCity
    },
    async getDiseaseCostFilter () {
      const result = await this.$store.dispatch('expenseCalculator/getDiseaseCostFilter', {})
      return result
    },
    async getCityList () {
      const result = await this.$store.dispatch('expenseCalculator/getCityList', {})
      return result
    },
    toastShow (msg, type) {
      // 接收子组件$emit('toast')
      if (type) {
        this.toast.type = 1
      } else {
        this.toast.type = 0
      }
      this.toast.msg = msg
      this.toast.isShow = true
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.diseasePanelData.selected || this.name })
      }
    },
    tabHeaderClick (pageName) {
      if (pageName !== this.pageComponent) {
        this.pageComponent = pageName
        document.querySelector('html').scrollTop = 0
      }
      if (pageName === 'drugsPrice') {
        this.$store.commit('expenseCalculator/SET_DISEASE_PANEL_DATA', { data: tempData.drugsPrice })
        baike.mtaReport('drugprice_tabclick')
      } else {
        this.$store.commit('expenseCalculator/SET_DISEASE_PANEL_DATA', { data: tempData.diseaseCount })
        baike.mtaReport('trntcost_tabclick')
      }
      if (this.pageComponent === 'drugsPrice') {
        let dataList = []
        let tempList = []
        this.diseasePanelData.data.forEach(element => {
          element.disease.forEach(item => {
            dataList.push(item)
          })
        })
        tempList = dataList.filter((item, index) => {
          return item.name === this.diseasePanelData.selected
        })
        if (tempList.length === 0) {
          this.$store.commit('expenseCalculator/SET_DISEASE_PANEL_DATA', { selected: this.diseasePanelData.data[0].disease[0].name })
        }
      } else if (this.pageComponent === 'diseaseCount') {
        const temList = this.diseasePanelData.data.filter((item, index) => {
          if (
            item.name === this.diseasePanelData.selected &&
            item.selectable === true
          ) {
            this.$store.commit('expenseCalculator/SET_DISEASE_PANEL_DATA', { selected: item.name })
          }
          return (
            item.name === this.diseasePanelData.selected &&
            item.selectable === true
          )
        })
        if (temList.length === 0) {
          this.$store.commit('expenseCalculator/SET_DISEASE_PANEL_DATA', { selected: this.diseasePanelData.data[0].name })
        }
      }
    },
    /**
     * 根据城市名，判断城市名是否在城市列表内
     * @param {any} cityName 城市名
     * @returns {boolean}
     */
    judgeCityInList (cityName) {
      var temp = this.locationPanelData.data.filter((item, index) => {
        let hasFlag = false
        if (item) {
          item.city.filter((itemi, indexi) => {
            if (itemi.name === cityName) {
              hasFlag = true
            }
            return hasFlag
          })
        }
        return hasFlag
      })
      return temp.length > 0
    },
    async test () {
      console.log('test----------------------')
      const temp = await new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('resolve')
          resolve(1111)
          // return 11111
        }, 2000)
        // resolve('1111')
      })
      return temp
    },
    async testWrp () {
      const temp = await this.test()
      if (temp === 1111) {
        console.log('返回没错')
      } else {
        console.log('返回出错', temp)
      }
      return temp
    },
    async testWrpPromise () {
      const temp = await new Promise((resolve, reject) => {
        setTimeout(() => {
          this.test().then((data) => {
            resolve(data)
          })
        }, 1000)
      })
      return temp
    }
  }
}

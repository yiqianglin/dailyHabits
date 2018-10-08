/* global $, baike */
import { mapState, mapGetters } from 'vuex'
import filterSortPanel from 'components/expenseCalculator/filterSortPanel/filterSortPanel.vue'
import tmenu from 'components/tmenu/tmenu.vue'
import 'components/paper/paper.scss'

export default {
  data () {
    return {
      isShowFilterPanel: false,
      filterPanelActiveType: null, // 1 科室 2 医师
      disease: baike.query('disease'),
      hospitalId: baike.query('hospitalId'),
      mode: baike.query('mode'),
      departmentSelected: '全部科室',
      doctitleSelected: '全部医师',
      isShowSearchPanel: false, // 显示医生搜索面板
      isShowLocationPanel: false, // 显示城市搜索面板
      doctorSearchPanelData: { // 医生搜索面板数据
        searchInput: '',
        searchAble: false,
        isSearching: false,
        resultList: []
      },
      timeoutSearch: null,
      pageShow: false // 页面展示
    }
  },
  computed: {
    ...mapState({
      hospitalInfo: state => state.doctorSearch.hospitalInfo,
      doctorSearchList: state => state.doctorSearch.doctorSearchList,
      locationPanelData: state => state.doctorSearch.locationPanelData
    }),
    ...mapGetters('doctorSearch', {
      consultantIds: 'consultantIds'
    }),
    consultantList () {
      return this.$store.getters['doctorSearch/getConsultantListByFilter']({
        disease: this.disease,
        city: this.locationPanelData.selected
      })
    },
    doctorSearchListByFilter () {
      const temp = this.$store.getters['doctorSearch/getDoctorSearchListByFilter']({
        department: this.departmentSelected,
        doctitle: this.doctitleSelected
      })
      return temp
    },
    departmentList () {
      const options = new Set()
      options.add('全部科室')
      this.doctorSearchList.forEach((itemI, indexI) => {
        // if (this.doctitleSelected === '全部医师' && itemI.main_depart) {
        //   options.add(itemI.main_depart)
        // } else if (itemI.doctitle === this.doctitleSelected && itemI.main_depart) {
        //   options.add(itemI.main_depart)
        // }
        // 改成重置逻辑
        options.add(itemI.main_depart)
        if (itemI.depart && itemI.depart.length > 0) { // 有极少医生有多个科室
          itemI.depart.forEach((itemJ) => {
            options.add(itemJ.name)
          })
        }
      })
      return Array.from(options)
    },
    doctitleList () {
      const options = new Set()
      options.add('全部医师')
      this.doctorSearchList.forEach((itemI, indexI) => {
        if (this.departmentSelected === '全部科室' && itemI.doctitle) {
          options.add(itemI.doctitle)
        } else {
          if (itemI.main_depart === this.departmentSelected && itemI.doctitle) { // 有极少医生有多个科室
            options.add(itemI.doctitle)
          } else {
            if (itemI.depart && itemI.depart.length > 0) {
              itemI.depart.forEach((itemJ) => {
                if (itemJ.name === this.departmentSelected) {
                  options.add(itemI.doctitle)
                }
              })
            }
          }
        }
        // else if (itemI.main_depart === this.departmentSelected && itemI.doctitle) {
        //   options.add(itemI.doctitle)
        // }
      })
      return Array.from(options)
    },
    isShowMask: {
      get () {
        return this.isShowFilterPanel || this.isShowLocationPanel
      },
      set (newVal) {
        if (newVal === false) {
          this.isShowFilterPanel = false
          this.isShowLocationPanel = false
        }
      }
    }
  },
  watch: {
    isShowMask: 'disableScroll',
    isShowSearchPanel: 'disableScroll',
    'doctorSearchPanelData.searchInput' (val, oVal) {
      let currentVal = val.replace(/(^\s*)|(\s*$)/g, '')
      let oldVal = oVal.replace(/(^\s*)|(\s*$)/g, '')
      let that = this
      if (currentVal && currentVal !== oldVal) {
        that.doctorSearchPanelData.isSearching = true
        that.doctorSearchPanelData.resultList = []
        clearTimeout(that.timeoutSearch)
        that.timeoutSearch = setTimeout(() => {
          that.sugTumourDoctorFilter()
            .then(() => {
              that.doctorSearchPanelData.isSearching = false
            })
          baike.mtaReport('chadoc_2ndsearch')
        }, 100)
      }
      if (currentVal) {
        this.doctorSearchPanelData.searchAble = true
      } else {
        this.doctorSearchPanelData.searchAble = false
      }
    },
    isShowLocationPanel (val) {
      if (!val) $(window).scrollTop(0)
    }
  },
  components: {
    filterSortPanel,
    tmenu
  },
  created: function () {
    if (this.mode !== 'ask') {
      this.$router.replace({name: 'buildingDoctorSearch'})
      return
    }
    this.hospitalId = baike.query('hospitalId')
    this.disease = baike.query('disease')
    this.init()
  },
  beforeDestroy () {
    this.doctorSearchPanelData = {
      searchInput: '',
      searchAble: false,
      isSearching: false,
      resultList: []
    }
    this.isShowSearchPanel = false
    this.timeoutSearch = null
    this.filterPanelActiveType = null
    this.isShowFilterPanel = false
  },
  beforeRouteUpdate (to, from, next) {
    this.hospitalId = to.query.hospitalId
    this.init()
    next()
  },
  methods: {
    async getTumourDoctor () {
      await this.$store.dispatch('doctorSearch/getTumourDoctor', { hospital_id: this.hospitalId, disease: this.disease })
    },
    async getDoctorBaseInfoListHdf () {
      await this.$store.dispatch('doctorSearch/getDoctorBaseInfoListHdf', { type: 2 })
    },
    async sugTumourDoctorFilter () {
      const result = await this.$store.dispatch('doctorSearch/sugTumourDoctorFilter', {
        query: this.doctorSearchPanelData.searchInput,
        disease: this.disease || '',
        city: '',
        hospital_id: this.hospitalId
      })
      this.doctorSearchPanelData.resultList = result.list
      return result
    },
    init () {
      this.departmentSelected = '全部科室'
      this.doctitleSelected = '全部医师'
      this.pageShow = false
      $(window).scrollTop(0)
      if (this.hospitalId) this.$store.dispatch('doctorSearch/getHospitalInfo', { hospital_id: this.hospitalId })
      let getDoctor = this.mode === 'ask' ? this.getDoctorBaseInfoListHdf() : this.getTumourDoctor()
      getDoctor.then((data) => {
        this.pageShow = true
      })
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.isShowSearchPanel = true
      }
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
    maskClick () {
      this.isShowMask = false
      this.filterPanelActiveType = null
    },
    locationFilterBtnClick () {
      this.isShowLocationPanel = true
    },
    // 筛选面板 城市
    onLocationPanelSelect (item) { // 城市面板筛选，本组件弹回筛选面板，并通知父组件修改locationPanel数据
      this.isShowLocationPanel = false
      this.$store.commit('doctorSearch/SET_LOCATION_PANEL_DATA', { selected: item.name })
    },
    locationPanelOnClose () {
      this.isShowLocationPanel = false
    },
    locationPanelOnReset () {
      this.isShowLocationPanel = false
      this.$store.commit('doctorSearch/SET_LOCATION_PANEL_DATA', { selected: '全部城市' })
    },
    filterClick (type) {
      if (this.filterPanelActiveType === null) {
        this.filterPanelActiveType = type
        this.isShowFilterPanel = true
        return
      }
      if (this.filterPanelActiveType === type) {
        this.filterPanelActiveType = null
        this.isShowFilterPanel = false
      } else {
        this.filterPanelActiveType = type
      }
    },
    filterOptionClick (type, item, index) { // type 1科室 2职称
      if (type === 1) {
        if (item === this.departmentSelected) {
          this.filterPanelActiveType = null
          this.isShowFilterPanel = false
        } else {
          baike.mtaReport('chadoc_deptselect')
          this.departmentSelected = item
          // 重置右侧
          this.doctitleSelected = '全部医师'
          this.filterPanelActiveType = null
          this.isShowFilterPanel = false
          this.$nextTick(() => {
            $(window).scrollTop(0)
          })
        }
      } else {
        if (item === this.doctitleSelected) {
          this.filterPanelActiveType = null
          this.isShowFilterPanel = false
        } else {
          baike.mtaReport('chadoc_titleselect')
          this.doctitleSelected = item
          this.filterPanelActiveType = null
          this.isShowFilterPanel = false
          this.$nextTick(() => {
            $(window).scrollTop(0)
          })
        }
      }
    },
    goToHospital () {
      // this.$router.push({name: 'hospital', query: { hospital_id: this.hospitalId }})
      baike.goToUrl('/mobile/hospital.html?hospital_id=' + this.hospitalId)
    },
    goToDoctor (doctorId) {
      baike.mtaReport('chadoc_docselect')
      // this.$router.push({name: 'doctor', query: { doctor_id: doctorId }})
      baike.goToUrl('/mobile/doctor.html?doctor_id=' + doctorId + '&fromDoctorSearch=true')
    },
    /* 搜索相关 */
    cancelSearchPanel () {
      this.isShowSearchPanel = false
    },
    searchBtnClick () {
      this.isShowSearchPanel = true
    },
    cleanSearchInput () {
      this.doctorSearchPanelData.searchInput = ''
      this.doctorSearchPanelData.resultList = []
    },
    highLight (doctorName, hospitalName, departName) {
      let str = ''
      str = doctorName + ' ' + hospitalName + ' ' + departName
      var keys = this.doctorSearchPanelData.searchInput
      if (keys) {
        var regex = new RegExp('(' + keys + ')', 'ig')
        str = str.replace(regex, '<span class="match">$1</span>')
      }
      return str
    },
    searchItemSelect (doctorId) {
      // this.$router.push({name: 'doctor', query: { doctor_id: doctorId }})
      baike.goToUrl('/mobile/doctor.html?doctor_id=' + doctorId + '&fromDoctorSearch=true')
    },
    territory (territoryList) {
      if (!territoryList.length) {
        return '无'
      } else {
        return territoryList.join('、')
      }
    }
  }
}

/* global baike, $ */
import { mapState } from 'vuex'
import tmenu from 'components/tmenu/tmenu.vue'
import 'components/paper/paper.scss'

export default {
  data () {
    return {
      disease: baike.query('disease'),
      isShowFilterPanel: false, // 展示筛选面板
      locationSelectedIndex: 0,
      isShowSearchPanel: false, // 显示医生搜索面板
      doctorSearchPanelData: { // 医生搜索面板数据
        searchInput: '',
        searchAble: false,
        isSearching: false,
        resultList: []
      },
      timeoutSearch: null
    }
  },
  computed: {
    ...mapState({
      hospitalSearchData: state => state.doctorSearch.hospitalSearchList
    }),
    locationData () {
      const options = new Set()
      options.add('全部')
      this.hospitalSearchData.forEach((item, index) => {
        options.add(item.city)
      })
      return Array.from(options)
    },
    location () { /* 获取查医院选择的地区 */
      return this.locationData[this.locationSelectedIndex]
    },
    hospitalResult () {
      return this.$store.getters['doctorSearch/getHospitalSearchListByLocation']({ location: this.location === '全部' ? '' : this.location })
    },
    isShowMask: {
      get () {
        return this.isShowFilterPanel
      },
      set (newVal) {
        if (newVal === false) {
          this.isShowFilterPanel = false
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
          baike.mtaReport('chadoc_1stsearch')
        }, 100)
      }
      if (currentVal) {
        this.doctorSearchPanelData.searchAble = true
      } else {
        this.doctorSearchPanelData.searchAble = false
      }
    }
  },
  components: {
    tmenu
  },
  created: function () {
    this.getTumourHospital()
  },
  deactivated () {
    this.doctorSearchPanelData = {
      searchInput: '',
      searchAble: false,
      isSearching: false,
      resultList: []
    }
    this.isShowSearchPanel = false
    this.timeoutSearch = null
    this.isShowFilterPanel = false
  },
  methods: {
    async getTumourHospital () {
      const result = await this.$store.dispatch('doctorSearch/getTumourHospital', { location: this.location, disease: this.disease })
      return result
    },
    async sugTumourDoctorFilter () {
      const result = await this.$store.dispatch('doctorSearch/sugTumourDoctorFilter', {
        query: this.doctorSearchPanelData.searchInput,
        disease: this.disease || '',
        city: this.locationSelectedIndex === 0 ? '' : this.location,
        hospital_id: ''
      })
      this.doctorSearchPanelData.resultList = result.list
      return result
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.isShowSearchPanel = true
      }
    },
    maskClick () {
      this.isShowMask = false
    },
    disableScroll (newVal, oldVal) {
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
    locationFilterBtnClick () {
      this.isShowFilterPanel = !this.isShowFilterPanel
    },
    filterLiClick (index) {
      baike.mtaReport('chadoc_cityselect')
      this.locationSelectedIndex = index
      this.isShowFilterPanel = false
      this.$nextTick(() => {
        $(window).scrollTop(0)
      })
    },
    hospitalItemClick (item) {
      baike.mtaReport('chadoc_hospitalselect')
      // this.$router.push({name: 'doctor_search_doctor', query: {hospitalId: item.hospital_id, disease: this.disease}})
      baike.goToUrl('/mobile/doctor_search_doctor.html?hospitalId=' + item.hospital_id + '&disease=' + this.disease)
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
    }
  }
}

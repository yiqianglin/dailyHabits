/* global $, baike */
import tmenu from 'components/tmenu/tmenu.vue'

export default {
  data () {
    return {
      title: '企鹅医典',
      list: [],
      name: '',
      isXcx: baike.isXcx() || false
    }
  },
  components: {
    tmenu
  },
  activated () {
  },
  created: function () {
    this.name = baike.query('name')
    this.count = baike.query('count') || 1000
    this.init()
  },
  mounted: function () {
    this.bindEvent()
  },
  watch: {
    // currentBranch: 'init',
    // isShowProblem: 'disableScroll'
  },
  computed: {

  },
  methods: {
    init: function () {
      this.getDiseaseHospitalInfo(true)
      // window.addEventListener('scroll', this.scrollToStep);
      this.title = '企鹅医典·' + this.name
    },
    scrollToStep: function (e) {
      var that = this
      var scroll = that.getScrollTopOfBody() // 滚动条距离
      var conHeight = $('#qa-main').height()
      if (scroll + that.winHeight > conHeight - 100) {
        that.getDiseaseHospitalInfo()
      }
    },
    getDiseaseHospitalInfo: function (isInit) {
      var that = this
      var name = that.name
      var count = that.count
      baike.post('/mobile/getDiseaseHospitalInfo',
        {
          name: name,
          offset: 0,
          count: count
        }, function (json) {
          if (json.retcode === 0) {
            var hospital = json.hospital || []
            if (hospital.length > 0) {
              that.list = that.list.concat(hospital)
            }
          }
          if (isInit) {
            window.medTimer && window.medTimer.reportTime({
              action: 'hospital_info_page',
              ispage: 1
            })
          }
        }, true)
    },
    showMore (index) {
      $('#con-list-' + index).toggleClass('more')
      // this.moreContent = this.moreContent===true ? false : true;
    },
    getScrollTopOfBody: function () {
      var scrollTop
      if (typeof window.pageYOffset !== 'undefined') { // pageYOffset指的是滚动条顶部到网页顶部的距离
        scrollTop = window.pageYOffset
      } else if (typeof document.compatMode !== 'undefined' && document.compatMode !== 'BackCompat') {
        scrollTop = document.documentElement.scrollTop
      } else if (typeof document.body !== 'undefined') {
        scrollTop = document.body.scrollTop
      }
      return scrollTop
    },
    bindEvent: function () {
      // var that = this
    },
    isThree: function (arr) {
      var isThree = false
      if (arr && arr.length > 0) {
        for (var i = 0, leni = arr.length, itemi; i < leni; i++) {
          itemi = arr[i]
          if (itemi && itemi.svalue === '三甲') {
            isThree = true
            break
          }
        }
      }
      return isThree
    },
    toHospital: function (hospitalId) {
      if (hospitalId) {
        baike.goToUrl('/mobile/hospital.html?type=card&name=' + this.name + '&hospital_id=' + hospitalId)
      }
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch')
      }
    }
  }
}

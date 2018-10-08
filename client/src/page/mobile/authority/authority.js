/* global baike */
import tmenu from 'components/tmenu/tmenu.vue'

export default {
  data () {
    return {
      title: '',
      title_intro: '',
      organ_info: {},
      hospital_info: {},
      doctor_info: {}
    }
  },
  components: {
    tmenu
  },
  activated () {
  },
  created: function () {
    var that = this
    that.getAuthInfoV2()
  },
  methods: {
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch')
      }
    },
    getAuthInfoV2: function () {
      var that = this
      var url = '/mobile/getAuthInfoV2'
      baike.get(url, {}, function (json) {
        if (json.retcode === 0) {
          that.title = json.title
          that.title_intro = json.title_intro
          that.organ_info = json.organ_info
          that.doctor_info = json.doctor_info
          var list = json.hospital_info.list
          if (list && list.length) { // 医院需要三个分组
            var threeList = []
            for (var i = 0, leni = list.length; i < leni; i = i + 3) {
              var tmpList = [list[i]]
              if (i + 1 < leni) tmpList.push(list[i + 1])
              if (i + 2 < leni) tmpList.push(list[i + 2])
              threeList.push(tmpList)
            }
            json.hospital_info.list = threeList
          }
          that.hospital_info = json.hospital_info
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'authority_page',
          ispage: 1
        })
      })
    },
    toHospital: function (hospitalId, index) {
      if (hospitalId === 1000) {
        return '/mobile/authority_wm.html'
      } else if (hospitalId === 47) {
        return '/mobile/authority_hw.html'
      } else {
        return '/mobile/hospital.html?hospital_id=' + hospitalId
      }
    },
    toPolicy: function () {
      baike.goToUrl('/mobile/authority_policy.html')
    }
  }
}

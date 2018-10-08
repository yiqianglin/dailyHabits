/* global baike */
import tmenu from 'components/tmenu/tmenu.vue'

export default {
  data () {
    return {
      doctors: [],
      isShow: true,
      isXcx: baike.isXcx() || false

    }
  },
  components: {
    tmenu
  },
  activated () {
  },
  created: function () {
    var that = this
    that.init()
  },
  methods: {
    init: function () {
      var that = this
      var url = '/mobile/init_mydoctor'
      baike.get(url, {
        offset: 0,
        count: 200
      }, function (o) {
        if (o.retcode === 0) {
          that.doctors = o.list
          that.isShow = !!that.doctors.length
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'mydoctor_page',
          ispage: 1
        })
      })
    },
    goBack: function () {
      baike.goToUrl('/mobile/my.html?ptag=ydd_mydoctornav_back')
    },
    toDoctor: function (doctorId) {
      if (doctorId) {
        baike.goToUrl('/mobile/doctor.html?ptag=ydd_mydoctor_click&doctor_id=' + doctorId)
      }
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.name })
      }
    }
  }
}

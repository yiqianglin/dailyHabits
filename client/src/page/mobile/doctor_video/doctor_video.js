/* global $, baike */
import tmenu from 'components/tmenu/tmenu.vue'
import paper from 'components/paper/paper.vue'
import doctor from 'components/doctor/doctor.vue'
import { pageLoad } from 'src/js/specialReq.js'

export default {
  data () {
    return {
      name: baike.query('name'),
      doctor_id: baike.query('doctor_id'),
      doctor: '',
      doctorLogo: '',
      paperList: [],
      loaded: false,
      isXcx: baike.isXcx() || false
    }
  },
  components: {
    tmenu,
    paper,
    doctor
  },
  created: function () {
    var that = this
    that.init_doctor()
    that.bindEvent()
  },
  destroyed () {
    $(window).off('scroll', this.handleScrollFn)
  },
  deactivated () {
    $(window).off('scroll', this.handleScrollFn)
  },
  activated () {
    this.bindEvent()
  },
  mounted: function () {

  },
  watch: {
  },
  computed: {

  },
  methods: {
    init_doctor: function () {
      var that = this
      if (!that.doctor_id) return
      baike.get('/mobile/init_doctor', {
        doctor_id: that.doctor_id
      }, function (o) {
        if (o.retcode === 0) {
          that.doctor = o.name
          that.doctorLogo = o.hand
          that.getDocsDataByTags()
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'doctor_video_page',
          ispage: 1
        })
      })
    },
    getDocsDataByTags: function (isFirst) {
      var that = this
      if (!that.name || !that.doctor) return
      pageLoad({
        key: 'getDocsDataByTags_' + that.name + '_' + that.doctor,
        url: '/mobile/getDocsDataByTags',
        retKey: 'docs',
        cb: function (pageData) {
          var list = pageData.list
          if (list && list.length > 0) {
            var tmplist = []
            list.forEach(function (item) {
              if (item && item['tid' + item.tid]) {
                tmplist.push(item['tid' + item.tid])
              } else {
                tmplist.push(item)
              }
            })
            that.paperList = tmplist
          }
          that.loaded = pageData.loaded
        }
      }, { name: that.name + '|' + that.doctor, type: 8 })
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.name })
      }
    },
    bindEvent: function () {
      var $window = $(window)
      $window.on('scroll', this.handleScrollFn)
    },
    handleScrollFn () {
      var $window = $(window)
      var that = this
      var pageHeight = $window.height()
      var st = $window.scrollTop()
      if ($('.loading').length > 0 && st > $('.loading').offset().top - pageHeight - 100) {
        that.getDocsDataByTags()
      }
    },
    toDoctor: function () {
      var doctorId = this.doctor_id
      if (doctorId) {
        baike.goToUrl('/mobile/doctor.html?doctor_id=' + doctorId)
      }
    }
  }
}

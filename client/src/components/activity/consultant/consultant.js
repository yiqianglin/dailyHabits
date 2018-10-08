/* global $, MtaH5, baike */

export default {
  props: {
    options: {
      type: Object,
      default () {
        return {
          list: [],
          maxCnt: 5,
          dom: '',
          area: ''
        }
      }
    }
  },
  data () {
    return {}
  },
  created () { },
  computed: {
    list () {
      this.$nextTick(() => {
        this.bindConsultant()
      })
      return ((this.options && this.options.list) || []).slice(0, this.options.maxCnt || 5)
    }
  },
  watch: {
  },
  mounted () {
    setTimeout(() => {
      if (this.eventBound) return
      this.bindConsultant()
    }, 500)
  },
  methods: {
    // common
    report (action, index) {
      var area = this.area
      var type = this.type
      var key = area + (type === 'banner' ? 'bn' : 'bc') + '_' + action
      if (type === 'consultant') {
        key = 'main_consult_' + action
      } else if (area === 'main' && type === 'banner') {
        key = 'main_bn_' + action
        key = 'main_consult_' + action
      } else if (area === 'health_recommend') {
        key = action === 'clk' ? 'health_recommend_bannerX' : ''
      } else if (area === 'home_cancer') {
        key = action === 'clk' ? 'onco_hotzone' : ''
      }
      if (key) {
        baike.mtaReport(key + ':' + (index + 1))
      }
    },
    initConsultant (o) {
      if (this.list && this.list.length) {
        // this.report('show')
        this.bindConsultant()
      }
    },
    toDoctor (doctor, index) {
      this.report('clk')
      if (doctor.doctor_id) {
        baike.goToUrl('/mobile/doctor.html?doctor_id=' + doctor.doctor_id)
      }
    },
    fClick (expert) {
      var that = this
      var url = '/mobile/setFollowingDoctor'
      var doctorId = expert.doctor_id
      expert.fClickable = expert.fClickable === undefined ? 1 : expert.fClickable
      if (expert.fClickable === 1) {
        expert.fClickable = 0
        if (expert.follow === 0) {
          baike.post(url, {
            doctor_id: doctorId,
            follow: 1
          }, function (o) {
            if (o.retcode === 0) {
              that.$msg.toast('已添加到“我的医生”', 'success')
              expert.follow = 1
              expert.fClickable = 1
              MtaH5.clickStat('ydd_dochome_follow')
            }
          })
        } else {
          baike.post(url, {
            doctor_id: doctorId,
            follow: 0
          }, function (o) {
            if (o.retcode === 0) {
              expert.follow = 0
              expert.fClickable = 1
              MtaH5.clickStat('ydd_dochome_followcancel')
            }
          })
        }
      }
    },
    bindConsultant () {
      var that = this
      var getPosition = function (e) {
        var touch = e.changedTouches ? e.changedTouches[0] : e
        return {
          x: touch.pageX,
          y: touch.pageY
        }
      }

      var $experts = $((this.options.dom ? this.options.dom + ' ' : '') + '.experts')
      if ($experts.length) {
        that.eventBound = true
      } else {
        that.eventBound = false
        return
      }
      var start = 0
      var step = 0
      var scrollOnX = 0

      $experts.on('touchstart', function (event) {
        start = getPosition(event)
        scrollOnX = 0
      })

      $experts.on('touchmove', function (event) {
        var touch = getPosition(event)
        step = {
          x: touch.x - start.x,
          y: touch.y - start.y
        }
        scrollOnX = Math.abs(step.x) > Math.abs(step.y) ? 1 : 0
        if (scrollOnX) {
          event.stopPropagation()
        }
      })
    }
  }
}

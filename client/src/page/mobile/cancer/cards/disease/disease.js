/* global baike */
import {lockedReq} from 'src/js/specialReq.js'
export default {
  props: {
    options: {
      type: Object,
      default () {
        return {
          name: '',
          follow: false,
          baseinfo: [],
          wmdcount: 0,
          from: ''
        }
      }
    }
  },
  data () {
    var name = (this.options && this.options.name) || baike.query('name') || ''
    var follow = (this.options && this.options.follow) || false
    var baseinfo = (this.options && this.options.baseinfo) || []
    var wmdcount = (this.options && this.options.wmdcount) || 0
    var from = (this.options && this.options.from) || baike.query('from') || ''
    return {
      name,
      follow,
      baseinfo,
      wmdcount,
      from
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    // 疾病题头点击关注
    followClick () {
      lockedReq({
        method: 'post',
        url: this.follow ? '/mobile/del_follow' : '/mobile/add_follow',
        callback: (o) => {
          if (o.retcode === 0) {
            if (!this.follow) {
              this.$msg.toastAdd('focus')
            }
            this.follow = !this.follow
          }
        }
      }, { disease: this.name })
    },
    toWebmd: function () {
      baike.goToUrl('/mobile/authority_wm.html?ptag=onco_cardcancer_webmdentry&name=' + this.name)
    },
    toCommittee () {
      baike.goToUrl('/mobile/cancer_committee.html?name=' + this.name)
    },
    toDoctor (doctorId, clickable) {
      if (clickable === 0 || !doctorId) return
      baike.goToUrl('/mobile/doctor.html?doctor_id=' + doctorId)
    },
    goCSCO () {
      baike.goToUrl('/mobile/authority_csco.html')
    }
  }
}

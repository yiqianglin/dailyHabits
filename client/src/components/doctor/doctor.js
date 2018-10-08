/* global baike */
export default {
  props: ['doctorinfo', 'showfollow'],
  data: function () {
    return {
      fClickable: 1
    }
  },
  watch: {

  },
  mounted: function () {

  },
  computed: {

  },
  methods: {
    followDoctor: function (docid) {
      var that = this
      var url = '/mobile/setFollowingDoctor'
      if (that.fClickable === 1) {
        that.fClickable = 0
        if (that.doctorinfo.follow === 0) {
          baike.post(url, {
            doctor_id: docid,
            follow: 1
          }, function (o) {
            if (o.retcode === 0) {
              that.$msg.toastAdd('follow')
              that.doctorinfo.follow = 1
              that.fClickable = 1
              baike.mtaReport('expertvideo_detail_FollowDoc')
            }
          })
        } else {
          baike.post(url, {
            doctor_id: docid,
            follow: 0
          }, function (o) {
            if (o.retcode === 0) {
              that.doctorinfo.follow = 0
              that.fClickable = 1
              baike.mtaReport('expertvideo_detail_FollowDocDel')
            }
          })
        }
      }
    },
    toDoctor: function (doctorId) {
      if (doctorId) baike.goToUrl('/mobile/doctor.html?doctor_id=' + doctorId)
    }
  }
}

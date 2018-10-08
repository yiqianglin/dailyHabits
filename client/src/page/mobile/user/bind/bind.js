/* global baike */
export default {
  data () {
    return {
      phone: '',
      smscode: '',
      btnSmsDesc: '发送验证码',
      smsLocked: false,
      error: '',
      info: '',
      isShowAlert: false,
      isShowBox: false,
      alertmsg: '验证码已发送'
    }
  },
  components: {
  },
  activated () {
  },
  created: function () {
    this.init()
  },
  watch: {
    currentBranch: 'init'
  },
  methods: {
    init: function () {
      if (!baike.getCookie('is_login')) {
        baike.toLogin()
      }
      // var that = this
    },
    bind: function () {
      var that = this
      var url = '/mobile/bindPhone'

      if (!that.phone) {
        that.error = '请输入手机号'
        return
      }

      if (!baike.isPhoneNum(that.phone)) {
        that.error = '请输入正确的手机号'
        return
      }

      if (!that.smscode) {
        that.error = '请输入验证码'
        return
      }

      if (!/^\d{6}$/.test(that.smscode)) {
        that.error = '验证码格式不正确'
        return
      }

      that.error = ''
      that.info = ''

      baike.post(url, { phone: that.phone, smscode: that.smscode }, function (o) {
        if (o.retcode === 0) {
          that.isShowAlert = true
          that.alertmsg = '绑定成功'
          setTimeout(function () {
            that.isShowAlert = false
            //   window.location.href = '/mobile/user/bindlist.html'
            baike.goToUrl('/mobile/user/bindlist.html')
          }, 2000)
        } else {
          if (o.retcode === 4014) {
            that.isShowBox = true
            return
          }
          that.error = o.retmsg
        }
      })
    },
    sendSmsCode: function () {
      var that = this
      var url = '/mobile/sendSmsCode'

      if (that.smsLocked) {
        return
      }

      if (!that.phone) {
        that.error = '请输入手机号'
        return
      }

      if (!baike.isPhoneNum(that.phone)) {
        that.error = '请输入正确的手机号'
        return
      }

      that.error = ''
      that.info = ''

      this.countStart()
      baike.post(url, { phone: that.phone }, function (o) {
        if (o.retcode === 0) {
          that.smscode = ''
          that.isShowAlert = true
          that.alertmsg = '验证码已发送'
          setTimeout(function () {
            that.isShowAlert = false
          }, 1000)
        } else {
          that.error = o.retmsg
        }
      })
    },
    countStart: function () {
      var that = this
      var second = 60
      that.smsLocked = true
      count()

      function count () {
        second--
        if (second > 0) {
          that.btnSmsDesc = second + 's 可重发'
          setTimeout(function () {
            count()
          }, 1000)
        } else {
          that.smsLocked = false
          that.btnSmsDesc = '发送验证码'
        }
      }
    },
    logout: function () {
      // var that = this
      var url = '/mobile/logout'
      baike.post(url, {}, function (o) {
        if (o.retcode === 0) {
          baike.setCookie('from_uri', window.location.protocol + '//' + window.location.host + '/mobile/user/bindlist.html')
          //  window.location.href = '/mobile/user/login.html'
          baike.goToUrl('/mobile/user/login.html')
        } else {
          window.alert(o.retmsg)
        }
      })
    },
    phoneLogin: function () {
      var that = this
      that.logout()
    },
    hideBox: function () {
      this.isShowBox = false
    }
  }
}

/* global baike, MtaH5 */
import tmenu from 'components/tmenu/tmenu.vue'

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
      platform: ''
    }
  },
  components: {
    tmenu
  },
  activated () {
  },
  created: function () {
  },
  mounted: function () {
    baike.checkLogin()
    this.init()
    this.platform = baike.getPlatform()
  },
  watch: {
    currentBranch: 'init'
  },
  computed: {

  },
  methods: {
    init: function () {
      // var that = this
      baike.checkLogin()
      MtaH5.clickStat('ydd_login_show')
    },
    bindEvent: function () {

    },
    login: function () {
      var that = this
      var url = '/mobile/loginWithPhone'

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
        } else {
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

      MtaH5.clickStat('ydd_sendcode_clk')
      this.countStart()
      baike.post(url, { phone: that.phone }, function (o) {
        if (o.retcode === 0) {
          that.smscode = ''
          that.isShowAlert = true
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
          }, 2000)
        } else {
          that.smsLocked = false
          that.btnSmsDesc = '发送验证码'
        }
      }
    },
    loginWithWx: function () {
      var that = this
      var url = '/mobile/do_wx_login'
      var bkUri = window.location.protocol + '//' + window.location.host + '/mobile/user/login_success.html'
      MtaH5.clickStat('ydd_wxlogin_clk')
      baike.post(url, { bk_uri: bkUri, scope: 'snsapi_userinfo' }, function (o) {
        if (o.retcode === 0) {
          console.log(o)
        } else {
          that.error = o.retmsg
        }
      })
    },
    loginWithQq: function () {
      var that = this
      var url = '/mobile/do_qq_login'
      var bkUri = window.location.protocol + '//' + window.location.host + '/mobile/user/login_success.html'
      MtaH5.clickStat('ydd_qqlogin_clk')
      baike.post(url, { bk_uri: bkUri }, function (o) {
        if (o.retcode === 0) {
        } else {
          that.error = o.retmsg
        }
      })
    }
  }
}

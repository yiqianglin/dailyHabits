/* global baike, MtaH5 */
import tmenu from 'components/tmenu/tmenu.vue'
import popdialog from 'components/popdialog/popdialog.vue'

export default {
  data () {
    return {
      bindWx: 0,
      bindQq: 0,
      phone: '',
      nickname: '',
      loginType: '',
      qq: '',
      isShow: false,
      platform: '',
      bindingType: '',
      popDialog: {
        dialogTitle: '',
        dialogContent: '绑定后，该账号内所关注的医生、关注的疾病及收藏的文章会合并到当前账号。',
        cancelBtnText: '',
        confirmBtnText: '继续绑定',
        isShowPop: false
      },
      isXcx: baike.isXcx()
    }
  },
  components: {
    tmenu,
    popdialog
  },
  activated () {
  },
  created: function () {
    this.init()
  },
  mounted: function () {
    // this.bindEvent();
    this.platform = baike.getPlatform()
  },
  watch: {
    currentBranch: 'init'
  },
  computed: {

  },
  methods: {
    init: function () {
      var that = this
      that.getUserInfo()
      that.loginType = baike.getCookie('is_login') || ''
    },
    bindEvent: function () {

    },
    getUserInfo: function () {
      var that = this
      var url = '/mobile/getUserInfo'
      baike.post(url, {}, function (o) {
        if (o.retcode === 0 || o.retcode === 4006) {
          that.bindWx = o.bindWx
          that.phone = o.phone
          that.nickname = o.nickname
          that.qq = o.qq
          that.isShow = true
          that.thirdParty = o.thirdParty
        } else {
          // alert(o.retmsg);
        }
        if (baike.isWeixin() && !o.nickname && !o.avatarUrl && !baike.getCookie('tried_relogin')) {
          baike.post('/mobile/logout', {}, function (o) {
            baike.setCookie('tried_relogin', true)
            window.location.reload()
          })
        }
      }, true)
    },
    bind: function (type) {
      // var that = this

      this.bindingType = type
      // MtaH5.clickStat('Biding_notice_show')
      if (type === 'phone') {
        // MtaH5.clickStat('ydd_persona_mobile_bind')
        setTimeout(function () {
          baike.goToUrl('/mobile/user/bind.html?ptag=ydd_persona_mobile_bind')
        }, 10)
      } else {
        this.popDialog.isShowPop = true
      }
      /*        if (type === 'wx') {
              url = '/mobile/ask_wx_bind'
              bkUri = window.location.href
              baike.post(url, {bk_uri: bkUri}, function (o) {})
            }
            if (type === 'qq') {
              MtaH5.clickStat('ydd_persona_qq_bind')
              url = '/mobile/ask_qq_bind'
              bkUri = window.location.href
              baike.post(url, {bk_uri: bkUri}, function (o) {})
            } */
    },
    unbind: function (type) {
      var url = '/mobile/user/unbind.html'
      if (window.sessionStorage) {
        window.sessionStorage.setItem('unbind', type)
      } else {
        url += '?unbind=' + type
      }
      if (type === 'phone') {
        // MtaH5.clickStat('ydd_persona_mobile_unbind')
        url = '/mobile/user/unbind.html?ptag=ydd_persona_mobile_unbind'
      }
      setTimeout(function () {
        //  window.location.href = url
        baike.goToUrl(url)
      }, 10)
    },
    closePop: function () {
      this.popDialog.isShowPop = false
    },
    confirmPop: function () {
      var url = ''
      var bkUri = ''
      MtaH5.clickStat('Biding_notice_next')
      if (this.bindingType === 'phone') {
        // MtaH5.clickStat('ydd_persona_mobile_bind')
        setTimeout(function () {
          // window.location.href = '/mobile/user/bind.html'
          baike.goToUrl('/mobile/user/bind.html?ptag=ydd_persona_mobile_bind')
        }, 10)
      }
      if (this.bindingType === 'wx') {
        url = '/mobile/ask_wx_bind'
        bkUri = window.location.href
        baike.post(url, { bk_uri: bkUri, scope: 'snsapi_userinfo' }, function (o) { })
      }
      if (this.bindingType === 'qq') {
        MtaH5.clickStat('ydd_persona_qq_bind')
        url = '/mobile/ask_qq_bind'
        bkUri = window.location.href
        baike.post(url, { bk_uri: bkUri }, function (o) { })
      }
    }
  }
}

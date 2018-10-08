/* global baike */
import {lockedReq} from 'src/js/specialReq.js'
export default {
  data () {
    return {
      desc: '',
      isShowAlert: false,
      type: ''
    }
  },
  components: {
  },
  activated () {
  },
  created: function () {
    this.init()
  },
  mounted: function () {
    // this.bindEvent();
  },
  watch: {
    currentBranch: 'init'
  },
  computed: {

  },
  methods: {
    init: function () {
      var that = this
      var type = window.sessionStorage ? window.sessionStorage.getItem('unbind') : baike.query('unbind')
      if (!type) {
        window.alert('解绑类型不能为空')
        return
      }
      that.type = type
      switch (type) {
        case 'phone':
          that.getUserInfo()
          break
        case 'qq':
          that.desc = '解绑QQ后，将无法使用QQ登录当前帐号'
          break
        case 'wx':
          that.desc = '解绑微信后，将无法使用微信登录当前帐号'
          break
      }
    },
    getUserInfo: function () {
      var that = this
      var url = '/mobile/getUserInfo'
      baike.post(url, {}, function (o) {
        if (o.retcode === 0 || o.retcode === 4006) {
          that.desc = o.phone
        } else {
          window.alert(o.retmsg)
        }
      })
    },
    unbind: function () {
      var that = this
      var url = '/mobile/unbind'
      lockedReq({
        url: url,
        method: 'post',
        callback: function (o) {
          if (o.retcode === 0) {
            that.isShowAlert = true
            //   var url = '/mobile/logout'
            if (baike.isWeixin() && that.type === 'wx') {
              baike.post('/mobile/logout', {}, function (o) {
                that.isShowAlert = false
                //   window.location.href = '/mobile/user/bindlist.html'
                baike.goToUrl('/mobile/user/bindlist.html')
                //  window.location.reload()

                // window.alert(o.retmsg)
              })
            } else {
              setTimeout(function () {
                that.isShowAlert = false
                //   window.location.href = '/mobile/user/bindlist.html'
                baike.goToUrl('/mobile/user/bindlist.html')
              }, 2000)
            }
          } else {
            if (!that.isShowAlert) window.alert('解绑失败')
          }
        }
      }, { 'thirdParty': that.type })
    }
  }
}

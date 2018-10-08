/* global baike */
// import pagenav from 'components/pagenav/pagenav.vue'
import tmenu from 'components/tmenu/tmenu.vue'
import loading from 'components/loading/loading.vue'
export default {
  data () {
    return {
      isShow: false,
      isFollowUpdate: false,
      doctorUpdate: false,
      ftab: 'my',
      suggest_url: '',
      history_url: '',
      data: '',
      // avatar: "/res/images/mobile/my/avatar.png",
      avatar: require('src/assets/images/mobile/user/login/logo.png'),
      isHistoryUpdate: false,
      name: '游客',
      is_login: '',
      is_wechat: false,
      doctor_id: '',
      isShowActivity: true,
      isXcx: baike.isXcx() || false,
      isWx: baike.isWeixin(),
      isCancer: baike.query('wxmp') === 'cancer' || baike.query('miniprogram') === 'xcx_cancer'
    }
  },
  components: {
    loading,
    tmenu
  },
  created: function () {
    this.init()
  },
  watch: {
    currentBranch: 'init'
  },
  mounted: function () {
    this.bind()
  },
  methods: {
    init: function () {
      var that = this
      baike.post('/mobile/init_my', {}, function (o) {
        // if(o.retcode === 0){
        that.isFollowUpdate = o.update
        that.doctorUpdate = o.doctor_update
        that.doctor_id = o.doctor_id
        that.avatar = o.avatarUrl || that.avatar
        that.name = o.nickname || that.name
        that.isHistoryUpdate = o.count > 0
        that.suggest_url = o.suggest_url
        that.history_url = o.history_url
        that.is_login = o.is_login
        that.is_wechat = o.is_wechat

        if (o.is_login === 'phone') {
          that.name = o.phone || that.name
        }
        if (o.is_login) {
          that.avatar = o.avatarUrl || require('src/assets/images/mobile/my/avatar.png')
        }
        if (baike.isWeixin() && !o.nickname && !o.avatarUrl && !baike.getCookie('tried_relogin')) {
          baike.post('/mobile/logout', {}, function (o) {
            baike.setCookie('tried_relogin', true)
            window.location.reload()
          })
        }
        that.isShow = true
        window.medTimer && window.medTimer.reportTime({
          action: 'my_page',
          ispage: 1
        })
        // }
      }, true)
      that.getQQRewardData()
      if (baike.isWeixin()) {
        that.isShowActivity = false
      }
    },
    getQQRewardData: function () {
      var that = this
      var url = '/mobile/getQQRewardData'
      baike.post(url, {

      }, function (o) {
        if (o.retcode === 1005 || baike.isWeixin()) {
          that.isShowActivity = false
        }
      })
    },
    itemClick: function (item) {
      var that = this
      var url = ''

      // if (item !== 'about' && !baike.getCookie('is_login')) {
      //   return baike.toLogin()
      // }

      switch (item) {
        case 'focus':
          url = '/mobile/focus.html?ptag=ydd_my_follow'
          break
        case 'favorite':
          url = '/mobile/favorite.html?ptag=ydd_my_favor'
          break
        case 'doctor':
          url = '/mobile/mydoctor.html?ptag=ydd_my_mydoc'
          break
        case 'suggest':
          url = baike.replaceParam('ptag', 'ydd_my_feedback', that.suggest_url)
          break
        case 'history':
          url = baike.replaceParam('ptag', 'ydd_my_feedbackhistory', that.history_url)
          break
        case 'about':
          url = '//baike.qq.com/mobile/about?ptag=ydd_my_about'
          // 不是医典页面，直接跳转
          location.href = url
          return
          // break
        case 'activity':
          url = '/mobile/hongbao/hb_index.html?ptag=ydd_my_activity'
          break
        case 'logout':
          baike.mtaReport('ydd_logout_clk')
          if (window.confirm('确定退出当前帐号？')) {
            baike.mtaReport('ydd_logout_confirm_clk')
            return that.logout()
          } else {
            return
          }
        // break
        case 'homepage':
          url = that.doctor_id ? '/mobile/doctor.html?doctor_id=' + that.doctor_id : '/mobile/my.html'
          break
      }
      baike.goToUrl(url)
    },
    login: function () {
      // var that = this
      var url = '/mobile/check_login'
      baike.post(url, {}, function (o) { })
    },
    logout: function () {
      // var that = this
      var url = '/mobile/logout'
      baike.post(url, {}, function (o) {
        if (o.retcode === 0) {
          window.alert('退出成功')
          window.location.reload()
        } else {
          window.alert(o.retmsg)
        }
      })
    },
    toBindList: function () {
      var that = this
      if (that.is_login) {
        baike.goToUrl('/mobile/user/bindlist.html')
      }
    },
    bind: function () { }
  }
}

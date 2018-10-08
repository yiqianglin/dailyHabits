/* global baike */
export default {
  data () {
    return {
      avatar: require('src/assets/images/mobile/my/avatar.png'),
      name: ''
    }
  },
  components: {
  },
  activated () {
  },
  created: function () {
    this.init()
  },
  methods: {
    init: function () {
      var that = this
      // var that = this
      baike.post('/mobile/getUserInfo', {}, function (o) {
        var isLogin = baike.getCookie('is_login')
        if (!o.thirdParty[isLogin]) return
        that.avatar = o.thirdParty[isLogin]['avatarUrl'] ? o.thirdParty[isLogin]['avatarUrl'] : o.avatarUrl ? o.avatarUrl : that.avatar
        that.name = o.thirdParty[isLogin]['nickname'] ? o.thirdParty[isLogin]['nickname'] : o.nickname
        if (o.phone) {
          return that.jump()
        }
      })
    },
    toBind: function () {
      var isLogin = baike.getCookie('is_login')
      var url = '/mobile/user/bind.html'
      if (isLogin === 'qq') {
        //  MtaH5.clickStat('ydd_qqlogin_mobil_clk')
        url = '/mobile/user/bind.html?ptag=ydd_qqlogin_mobil_clk'
      }
      baike.goToUrl(url)
      //  window.location.href = '/mobile/user/bind.html'
    },
    jump: function () {
      // MtaH5.clickStat('ydd_qqlogin_mobilno_clk')
      function changeParam (name, value) {
        var url = baike.getCookie('from_uri') || '/'
        var newUrl = ''
        var reg = new RegExp('(^|)' + name + '=([^&]*)(|$)')
        var tmp = name + '=' + value
        if (url.match(reg) != null) {
          newUrl = url.replace(reg, tmp)
        } else {
          if (url.match('[?]')) {
            newUrl = url + '&' + tmp
          } else {
            newUrl = url + '?' + tmp
          }
        }
        // location.href = newUrl
        newUrl = newUrl.replace('https://baike.sparta.html5.qq.com', '')
        baike.goToUrl(newUrl)
      }
      changeParam('ptag', 'ydd_qqlogin_mobilno_clk')
      //   var uri = baike.getCookie('from_uri') + '&ptag=ydd_qqlogin_mobilno_clk' || '/'
      // //  window.location.href = uri
      //   baike.goToUrl(uri)
    }
  }
}

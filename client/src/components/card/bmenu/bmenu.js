export default {
  props: ['tab'],
  data: function () {
    return {
      isShow: true,
      isIphonex: false
    }
  },
  created: function () {
    var that = this
    that.initPage()
  },
  mounted: function () {
  },
  methods: {
    tabClick: function (tab) {
      var that = this
      if (that.tab === tab || (that.tab === 'refer' && tab !== 'trend')) return // 重复点击
      this.$emit('tabclick', tab)
    },
    initPage: function () {
      var that = this
      if (navigator.userAgent.match(/(iPhone)/i)) {
        if ((window.screen.availHeight === 812) && (window.screen.availWidth === 375)) {
          that.isIphonex = true
          that.$emit('isiphonex', true)
        }
      }
    },
    bindEvent: function () {
      // var beforeScrollTop = 0,$window = $(window),that=this;
      // $window.on('scroll',function(){
      //     var afterScrollTop = $window.scrollTop();
      //     var delta = afterScrollTop - beforeScrollTop;
      //     beforeScrollTop = afterScrollTop;
      //     that.isShow = delta<0;
      // });
    }
  }
}

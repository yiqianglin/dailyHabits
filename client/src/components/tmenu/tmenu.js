/* global $, baike */
export default {
  props: ['name', 'issearchbar', 'nosearch', 'nomore', 'zindex', 'ishide', 'backurl', 'backact', 'stag', 'nomy'],
  data: function () {
    return {
      showMore: false,
      searchBar: true,
      from: baike.query('from')
    }
  },
  created: function () {
    var that = this
    that.bindEvent()
  },
  destroyed () {
    $(window).off('scroll', this.handleScrollFn)
  },
  deactivated () {
    $(window).off('scroll', this.handleScrollFn)
  },
  activated () {
    this.bindEvent()
  },
  methods: {
    toBack: function () {
      if (this.backact) { // 有自定义的返回事件，则执行
        this.backact()
        return
      }
      baike.goBack(this.backurl)
    },
    toIndex: function () {
      baike.goToUrl(baike.getIndexUrl())
    },
    toSearch: function () {
      // var that = this
      if (baike.query('adtag') === 'tx.qq.qqyd.yety') {
        baike.mtaReport('YDD_Hongbao_articleSearch_clk')
      }
      var page = baike.getPageName(window.location.href)
      var ptag = 'YDD_Navbar_SearchX:' + page
      baike.mtaReport(ptag)
      // if (['overview', 'overview_m', 'overview_pt', 'overview_zz', 'overview_zl', 'card', 'cancer'].indexOf(page) !== -1 && that.name) {
      //   baike.goToUrl('/mobile/search.html?stag=' + that.name + '&ptag=' + ptag)
      // } else {
      //   var stag = that.stag
      //   if (stag === '内容' || stag === '急救') { // 产品会将文章关联此
      //     stag = ''
      //   }
      //   baike.goToUrl('/mobile/search.html?ptag=' + ptag + (stag ? '&stag=' + stag : ''))
      // }
      this.$emit('callback', 'search_clk')
    },
    toMy: function () {
      if (baike.query('adtag') === 'tx.qq.qqyd.yety') {
        baike.mtaReport('YDD_Hongbao_articleMy_clk')
      }
      baike.goToUrl('/mobile/my.html')
    },
    bindEvent: function () {
      var that = this
      $(document).on('click', function (e) {
        that.showMore = false
        // e = e || window.event
        // if(e){
        //   var targetNode = e.srcElement || e.target
        //   var $dom = $(targetNode)
        //   if($dom.hasClass('more')&&$dom.parent('.tmenu').length) return
        //   that.showMore = false
        // }
      })
      $(window).on('scroll', this.handleScrollFn)
    },
    handleScrollFn () {
      var that = this
      that.showMore = false
      var st = $(window).scrollTop()
      that.searchBar = !(st > $('.tmenu').height())
    }
  }
}

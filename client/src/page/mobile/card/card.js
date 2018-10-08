/* global $, baike */
import 'src/libs/dropload/dropload.min.css'
import 'src/libs/dropload/dropload'
import tmenu from 'components/tmenu/tmenu.vue'
import diseasetrend from 'components/card/diseasetrend/diseasetrend.vue'
import medicalrefer from 'components/card/medicalrefer/medicalrefer.vue'
import allarticle from 'components/card/allarticle/allarticle.vue'
import bmenu from 'components/card/bmenu/bmenu.vue'
import paper from 'components/paper/paper.vue'

var globalVar = {
  hot: {
    '腰椎间盘突出症': {
      'B': '5a2e7ebf79a33',
      'allpaper': '5a2e88037063c',
      'refer': '5a2e88133d139',
      'C': '5a4caf9de307a'
    },
    '哮喘': {
      'B': '5a2e7eae59336',
      'allpaper': '5a2e87dce4e3d',
      'refer': '5a2e87eee66f3',
      'C': '5a4caf81dd99e'
    },
    '乳腺癌': {
      'B': '5a2e7e9e6cc41',
      'allpaper': '5a2e87a3c162c',
      'refer': '5a2e87b372ab4',
      'C': '5a4caf9227e4b'
    }
  },
  startTime: new Date()
}

export default {
  data () {
    return {
      name: '',
      isIphonex: false,
      tab: window.location.hash.replace('#', '') || 'trend',
      showMode: parseInt(baike.query('mode')),
      closeTipsActionList: null,
      isXcx: baike.isXcx() || false
    }
  },
  components: {
    tmenu,
    medicalrefer,
    allarticle,
    bmenu,
    paper,
    diseasetrend
  },
  computed: {
    showGuideTips: function () {
      var flag = Boolean(this.closeTipsActionList !== null && !this.closeTipsActionList.cardPageCategory)
      if (flag) {
        setTimeout(function (that) {
          that.closeGuideTips(true)
        }, 4000, this)
      }
      return flag
    }
  },
  created: function () {
    var that = this
    that.init()
  },
  mounted: function () {
    // var that = this
    // that.bindEvent()
  },
  activated () {
    // 单页缓存分享数据重置
    this.setShare(this.shareCache)
    this.bindEvent()
  },
  deactivated () {
    window.removeEventListener('scroll', this.finishReading)
  },
  destroyed () {
    window.removeEventListener('scroll', this.finishReading)
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    init: function () {
      var that = this
      var name = baike.query('name')
      that.name = name
      var version = (that.showMode === 0 ? 'C' : 'B')
      var hid = globalVar.hot[name] && globalVar.hot[name][version]
      if (hid) {
        var el = document.createElement('script')
        el.src = '//pingjs.qq.com/h5/hotclick.js?v2.0'
        el.setAttribute('name', 'mtah5hotclick')
        el.setAttribute('sid', '500487122')
        el.setAttribute('hid', hid)
        $('body').append(el)
      }
      this.initGuideTips()
    },
    initGuideTips: function () {
      var local = JSON.parse(window.localStorage.getItem('closeTipsActionList'))
      this.closeTipsActionList = local || {}
    },
    closeGuideTips: function () {
      this.toRecordGuideTips()
      this.closeTipsActionList = JSON.parse(window.localStorage.getItem('closeTipsActionList'))
    },
    toRecordGuideTips: function () {
      var local = this.closeTipsActionList
      local.cardPageCategory = new Date().getTime()
      window.localStorage.setItem('closeTipsActionList', JSON.stringify(local))
    },
    changename: function (name) {
      var that = this
      that.name = name
    },
    tabclick: function (tab) {
      var that = this
      $(window).scrollTop(0)
      window.location.hash = tab
      that.tab = tab
    },
    isiphonex: function (flag) {
      this.isIphonex = flag
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.name })
      }
    },
    bindDropload: function () {
      var that = this
      window.dropload = $('#card').dropload({
        scrollArea: window,
        domUp: {
          domClass: 'dropload-up-custom',
          domRefresh: '<div class="dropload-refresh"><img src="http://s.pc.qq.com/tdf/baike/dropload/FST_01.png" alt="" /></div>',
          domUpdate: '<div class="dropload-update"><img src="http://s.pc.qq.com/tdf/baike/dropload/FST_02.png" alt="" /></div>',
          domLoad: '<div class="dropload-load"> <img src="http://s.pc.qq.com/tdf/baike/dropload/loop.gif" alt="" /></div>'
        },
        distance: 50,
        loadUpFn: function (me) {
          $('.dropload-up-custom').css('opacity', 1)
          if (that.tab === 'trend') {
            that.$refs.diseasetrend.getDocsDataByTags(null, me)
          } else if (that.tab === 'allpaper') {
            that.$refs.allarticle.dropLoadFunc(me)
          }

          //  that.getDocsDataByTags(null, me)
        },
        pullingFun: function (progress) {
          $('.dropload-up-custom').css('opacity', progress * 0.3)
        }
      })
    },
    finishReading () {
      var $content = $('.cate-item.bottom').last()
      if (!$content.length) return
      var scrollTop = $(window).scrollTop()
      var scrollHeight = $('body').height()
      var windowHeight = $(window).height()
      var contentBtm = $content.offset().top + $content.offset().height
      if (scrollTop >= scrollHeight - windowHeight || scrollTop >= contentBtm) {
        baike.mtaReport('allarticle_guide_show|' + baike.query('name'))
        window.removeEventListener('scroll', this.finishReading)
      }
    },
    bindEvent: function () {
      var that = this
      var $window = $(window)
      $window.on('hashchange', hashchange)
      hashchange()
      function hashchange () {
        that.tab = window.location.hash.replace('#', '') || 'trend'
        that.setShare()
        if (that.tab === 'refer') {
          window.dropload && window.dropload.lock()
        } else {
          window.dropload && window.dropload.unlock()
        }
      }
      window.addEventListener('scroll', this.finishReading)
      // function finishReading () {
      //   var $content = $('.cate-item.bottom').last()
      //   if (!$content.length) return
      //   var scrollTop = $(window).scrollTop()
      //   var scrollHeight = $('body').height()
      //   var windowHeight = $(window).height()
      //   var contentBtm = $content.offset().top + $content.offset().height
      //   if (scrollTop >= scrollHeight - windowHeight || scrollTop >= contentBtm) {
      //     baike.mtaReport('allarticle_guide_show|' + baike.query('name'))
      //     window.removeEventListener('scroll', finishReading)
      //   }
      // }
      $window.on('touchstart', function (e) {
        if (that.showGuideTips) {
          that.closeGuideTips()
        }
      })
      $window.on('tap', function (e) {
        if (that.showGuideTips) {
          that.closeGuideTips()
        }
      })
      // 给关联内容添加跳转点击事件
      $(document).on('click', '.related-docs-content-link', function () {
        var ctype = $(this).parent('.related-docs-content').attr('data-ctype')
        var ptag = ''
        if (parseInt(ctype) === 1) {
          ptag = 'insertlink_article'
        } else if (parseInt(ctype) === 8) {
          ptag = 'insertlink_video'
        } else if (parseInt(ctype) === 11) {
          ptag = 'insertlink_question'
        }
        baike.goToUrl('/mobile/article.html?docid=' + $(this).parent('.related-docs-content').attr('data-docid') + '&ptag=' + ptag)
      })
    }
  }
}

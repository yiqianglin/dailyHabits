/* global $, baike, Txplayer, history */
import Vue from 'vue'
import 'src/libs/txplayer/txplayer'
import { ActiveBanner } from 'components/activity/activity'
import actionbar from 'components/actionbar/actionbar.vue'
import annotation from 'components/annotation/annotation.vue'
import imgviewer from 'components/imgviewer/imgviewer.vue'
import depressiontest from 'components/depressiontest/depressiontest.vue'
import paper from 'components/paper/paper.vue'
import papertagMultiLine from 'components/tagTabCommon/multiLine.vue'
import papertagMultiLineOutter from 'components/tagTabCommon/multiLineOutter.vue'
import sourceDisclaimer from 'components/source_disclaimer/source_disclaimer.vue'
import tmenu from 'components/tmenu/tmenu.vue'
import loading from 'components/loading/loading.vue'
import { pageLoad } from 'src/js/specialReq.js'

let docFetching = false

export default {
  data () {
    return {
      name: '',
      isHideDetailGuide: false,
      showFixPaperTag: false,
      activeOps: null,
      // tab & nav
      tab: 0,
      showCate: false,
      swiperOps: {},
      rendered: false,
      // block
      baseinfo: [],
      overviews: [],
      tabList: [],
      // tabs:[],
      doclist: {},
      isShow: false,
      showClaimer: false,
      // video
      video: '',
      showVideo: false,
      isAutoPlay: false,
      player: {
        play: function () { },
        pause: function () { }
      },
      // ref
      references: [],
      allReferences: false,
      // feedback & helpful
      helpfulObj: {},
      feedbackObj: {},
      setannotation: 0,
      setimgviewer: 0,
      doc_id: '',
      edits: [],
      editUp: false,
      isXcx: baike.isXcx() || false,
      search_lib: '',
      from: baike.query('from'),
      backurl: ''
    }
  },
  components: {
    papertagMultiline: papertagMultiLine,
    papertagMultilineOutter: papertagMultiLineOutter,
    ActiveBanner,
    actionbar,
    annotation,
    imgviewer,
    depressiontest,
    paper,
    tmenu,
    sourceDisclaimer,
    loading
  },
  activated () {
    // 单页缓存分享数据重置
    this.setShare(this.shareCache)
    window.addEventListener('scroll', this.finishReading)
  },
  created: function () {
    var that = this
    that.name = baike.query('name')
    that.doc_id = baike.query('doc_id')
    if (that.doc_id) {
      that.overviews.push({
        icon: require('src/assets/images/mobile/card/icon_tujie.png'),
        name: '图解',
        pinyin: 'tujie',
        docMd: ''
      })
      that.getArticleData()
    }
    that.isHideDetailGuide = window.localStorage.getItem('isHideDetailGuide') || that.isHideDetailGuide
    that.init()
    that.getActiveData()
    that.search_lib = baike.sstore.getItem('search_lib')
    // baike.setTitle('企鹅医典·' + that.name)
  },
  destroyed () {
    window.removeEventListener('scroll', this.finishReading)
  },
  deactivated () {
    window.removeEventListener('scroll', this.finishReading)
  },
  mounted: function () {
    var that = this

    setTimeout(function () {
      that.scrollTotab()
    }, 1000)
    if (!that.isHideDetailGuide) {
      setTimeout(function () {
        that.isHideDetailGuide = true
        window.localStorage.setItem('isHideDetailGuide', 'true')
      }, 4000)
    }
  },
  watch: {
    currentBranch: 'init',
    showCate: 'disableScroll',
    tab: 'scrollTotab'
  },
  computed: {
    tabObj: function () {
      return this.overviews[this.tab] || {}
    },
    // feedback & helpful
    hStatus: function () {
      return this.helpfulObj[this.tabObj.name] ? this.helpfulObj[this.tabObj.name].helpful : 0
    },
    hCount: function () {
      return this.helpfulObj[this.tabObj.name] ? this.helpfulObj[this.tabObj.name].helpfulCount : 0
    },
    fbStatus: function () {
      return !!this.feedbackObj[this.tabObj.name]
    },
    // docid: function () {
    //   var that = this
    //   return (that.tabObj.pinyin === 'tujie' ? that.doc_id : (that.name + '+' + that.tabObj.name))
    // },
    actionOps: function () {
      var docid = this.tabObj.pinyin === 'tujie' ? this.doc_id : ''
      var tid = this.tabObj.pinyin === 'tujie' ? 6 : 4
      return {
        container: '.swiper-slide-active',
        docid: docid,
        name: this.name,
        tab: this.tabObj.name,
        hStatus: this.hStatus,
        hCount: this.hCount,
        fbStatus: this.fbStatus,
        topnav: '.crumb',
        showHelp: true,
        showFdbk: true,
        showDoubt: this.name === '哮喘' || this.name === '乳腺癌' || this.name === '腰椎间盘突出症',
        // page: '疾病页',
        tid: tid
      }
    },
    curTags: function () {
      if (this.tabObj.name === '概述' || this.tabObj.name === '图解') return ''
      var block = this.overviews[this.tab]
      if (block && block.tagData && block.tagData.tags.length) {
        var tags = block.tagData
        var tag = tags.tags[tags.tagIndex]
        return {
          tagIndex: tags.tagIndex,
          tags: tags.tags,
          expand: tags.expand,
          list: tag.list,
          loaded: tag.loaded && tag.docUpper >= tag.list.length,
          docUpper: tag.docUpper
        }
      }
      return ''
    }
  },
  methods: {
    init: function () {
      var that = this
      that.loadData()
      that.bind()
      // 给关联内容添加跳转点击事件
      $(document).on('click', '.related-docs-content-link', function () {
        var ctype = parseInt($(this).parent('.related-docs-content').attr('data-ctype'))
        var ptag = ''
        if (ctype === 1) {
          ptag = 'insertlink_article'
        } else if (ctype === 8) {
          ptag = 'insertlink_video'
        } else if (ctype === 11) {
          ptag = 'insertlink_question'
        }
        baike.goToUrl('/mobile/article.html?docid=' + $(this).parent('.related-docs-content').attr('data-docid') + '&ptag=' + ptag)
      })
    },
    // 运营位
    getActiveData () {
      baike.post('/mobile/getActiveData', {
        activetype: 4,
        name: this.name
      }, o => {
        if (o.retcode === 0) {
          this.activeOps = {
            list: o.activelist,
            area: 'content_end',
            maxCnt: 5
          }
        }
      })
    },
    loadData: function (isSwitch) {
      var that = this
      if (!isSwitch) that.getDiseaseTabList()
      if (that.curHash() === 'tujie') {
        // that.getArticleData()
      } else if (isSwitch) {
        that.getDiseaseTabList(isSwitch)
        that.getDocList(that.tabObj)
      }
    },
    getDiseaseTabList: function (isSwitch) {
      var that = this
      var url = '/mobile/getDiseaseTabList'
      var tab = that.tab
      var overItem = that.overviews[tab]
      if (overItem && overItem.tabData) {
        if (!that.curTags.list || !that.curTags.list.length) {
          that.clickTag(0)
        }
        return
      }
      var pinyin = that.curHash()
      if (pinyin === 'tujie') pinyin = 'gaishu'
      baike.post(url, {
        disease: that.name,
        tab: pinyin
      }, function (o) {
        if (o.retcode === 0) {
          if (!isSwitch) { // 初始化
            var tabs = o.tabs
            if (tabs && tabs.length > 0) {
              for (var i = 0, leni = tabs.length; i < leni; i++) {
                that.overviews.push($.extend({
                  helpful: 0,
                  helpfulCount: 0,
                  feedback: 0,
                  tabData: '',
                  artlist: '',
                  doclist: [],
                  docUpper: 3,
                  tagData: ''
                }, tabs[i]))
              }
              that.initTab()
              that.getOtherTabData()
              that.initSwiper()
              var edits = o.edits
              if (edits && edits.length > 0) that.edits = edits
              that.references = (o.ref_info || that.references).reduce((result, item) => {
                if (item) result.push(item)
                return result
              }, [])
              that.allReferences = that.references.length <= 1
            }
            that.isShow = true
            that.type = o.type
            that.backurl = baike.getOverview({
              name: that.name,
              type: that.type
            }) + '&ptag=ydd_reviewnavbar_card'
            that.showClaimer = o.op_review && o.op_review.text
            // that.getDiseaseTabDocs()
          }
          var overviews = that.overviews
          var overItem = ''
          for (let i = 0, leni = overviews.length, itemi; i < leni; i++) {
            itemi = overviews[i]
            if (itemi.pinyin === pinyin) {
              overItem = itemi
              break
            }
          }
          if (overItem) {
            that.resolveOverItem(overItem, o)
            that.getDocList(overItem)
            that.resolveVideo(overItem.tabData.op_video)
            that.$nextTick(function () {
              that.imgLoaded()
              that.setannotation++
            })
            that.clickTag(0)
          }
        }
        if (!isSwitch) {
          window.medTimer && window.medTimer.reportTime({
            action: 'ddetail_page',
            ispage: 1
          })
        }
      }, true)
    },
    resolveOverItem: function (overItem, o) {
      var that = this
      overItem.helpful = o.helpful
      overItem.helpfulCount = o.helpfulCount
      overItem.feedback = o.feedback
      overItem.tabData = o.tabData
      if (!overItem.tagData && overItem.pinyin !== 'gaishu' && overItem.pinyin !== 'tujie') {
        var tags = o.tags.map(function (item) {
          return {
            name: item.name,
            tag: item.tag,
            list: [],
            loaded: false,
            docUpper: 0
          }
        })
        overItem.tagData = {
          tagIndex: 0,
          expand: false,
          tags: tags
        }
      }
      that.resolveVideo(overItem.tabData.op_video)
      if (overItem.pinyin === 'tujie') return
      Vue.set(that.helpfulObj, overItem.name, {
        helpfulCount: o.helpfulCount,
        helpful: o.helpful
      })
      Vue.set(that.feedbackObj, overItem.name, o.feedback)
    },
    getDocList: function (overItem) {
      if (overItem.artlist || !overItem.tabData) return
      var that = this
      var arr = overItem.tabData.op_related
      if (arr && arr.length > 0) {
        var list = []
        arr.forEach(function (item) {
          if (item.docid) list.push(item.docid)
        })
        docFetching = true
        baike.post('/mobile/getDocList', {
          'docidlist': list
        }, function (json) {
          docFetching = false
          if (json.retcode === 0) {
            if (json.list && json.list.length > 0) {
              overItem.artlist = json.list
              that.$nextTick(function () {
                that.imgLoaded()
                that.setannotation++
              })
            }
          }
        })
      }
    },
    getOtherTabData: function () {
      var that = this
      var pinyin = that.curHash()
      if (pinyin === 'tujie') pinyin = 'gaishu'
      var overviews = that.overviews
      var tabList = []
      for (var i = 0, leni = overviews.length, itemi; i < leni; i++) {
        itemi = overviews[i]
        if (itemi.pinyin !== pinyin) {
          tabList.push(itemi.name)
        }
      }
      if (tabList.length > 0) {
        baike.post('/mobile/getOtherTabData', {
          tab: tabList.join(','),
          disease: that.name
        }, function (o) {
          if (o.retcode === 0) {
            var tabDatas = o.tabDatas
            if (tabDatas) {
              for (var i = 0, leni = overviews.length, itemi, itemj; i < leni; i++) {
                itemi = overviews[i]
                itemj = tabDatas[itemi.name]
                if (itemj) {
                  that.resolveOverItem(itemi, itemj)
                }
              }
            }
          }
        })
      }
    },
    // getDiseaseTabDocs: function () {
    //   var that = this
    //   var overItem = that.overviews[that.tab]
    //   if (!overItem || overItem.name === '图解' || overItem.docLoaded) return
    //   overItem.docLoaded = true
    //   baike.post('/mobile/getDiseaseTabDocs', {disease: that.name, tab: overItem.name}, function (o) {
    //     if (o.retcode === 0) {
    //       var docs = o.docs
    //       if (docs && docs.length > 0) {
    //         var list = []
    //         docs.forEach(function (item) {
    //           list.push(item['tid' + item.tid] || item)
    //         })
    //         overItem.doclist = list
    //       }
    //     }
    //   })
    // },
    getArticleData: function () {
      var that = this
      if (that.tab !== 0 || !that.doc_id) return
      var overItem = that.overviews[0]
      if (overItem && overItem.docMd) return
      baike.get('/mobile/init_article', {
        docid: that.doc_id
      }, function (o) {
        if (o.retcode === 0) {
          if (o.data && o.data.v_md_text) {
            overItem.docMd = o.data.v_md_text
            that.$nextTick(function () {
              that.imgLoaded()
            })
          }
          Vue.set(that.helpfulObj, overItem.name, {
            helpfulCount: o.helpfulCount,
            helpful: o.helpful
          })
          Vue.set(that.feedbackObj, overItem.name, o.feedback)
        }
      })
    },
    curHash: function () {
      // var that = this
      return (window.location.hash.replace('#', '') || 'gaishu')
    },
    initTab: function () {
      var that = this
      var tabName = that.curHash()
      var overviews = that.overviews
      for (var i = 0, leni = overviews.length; i < leni; i++) {
        if (overviews[i].pinyin === tabName) {
          that.tab = i
          break
        }
      }
    },
    initSwiper: function () {
      var that = this
      that.swiperOps = {
        direction: 'horizontal',
        autoplay: 0,
        initialSlide: that.tab,
        autoHeight: true,
        onInit: function (swiper) {
          that.swiper = swiper
        },
        onTransitionEnd: function (swiper) {
          if (swiper.activeIndex !== that.tab) {
            var reportKey = swiper.activeIndex > that.tab ? 'ydd_review_leftslide' : 'ydd_review_rightslide'
            baike.mtaReport(reportKey)
            that.clickTab(swiper.activeIndex)
          }
        },
        onSlideChangeEnd: function (swiper) {

        }
      }
    },
    resolveVideo: function (video) {
      var that = this

      if (!video || !video['src']) {
        return
      }
      video.time = Math.floor(video['timelen'] / 60) + ':' + ((video['timelen'] % 60 < 10) ? ('0' + video['timelen'] % 60) : video['timelen'] % 60)
      video.name = video['duration'] + '分钟了解' + that.name
      that.video = video
      that.showVideo = true
      if (that.isWifi()) {
        baike.mtaReport('ydd_review_videowifi')
        that.isAutoPlay = false
      } else {
        that.isAutoPlay = false
      }

      that.initPlayer(that.video.src, false)
    },
    initPlayer: function (vid, auto) {
      var player = new Txplayer({
        containerId: 'video',
        vid: vid,
        width: '100%',
        height: '100%', // screen.availHeight/3,
        autoplay: auto,
        videoType: 'vod',
        playerType: 'h5',
        useComboService: auto,
        poster: 'http://s.pc.qq.com/tdf/ydd/common_black.png'
      })
      player.on('play', function () {
        baike.mtaReport('ydd_review_videoplay')
      })
      player.on('pause', function () {
        baike.mtaReport('ydd_review_videopause')
      })
      this.player = player
    },
    isWifi: function () {
      var ua = navigator.userAgent
      var re = /wifi/ig
      return re.test(ua)
    },
    goBack: function () {
      var that = this
      var url = baike.getOverview({
        name: that.name,
        type: that.type
      }) + '&ptag=ydd_reviewnavbar_card'
      if (window.history.length > 2 || document.referrer) {
        window.location.replace(url)
        // history.back()
      } else {
        baike.goToUrl(url)
      }
    },
    searchByTag: function (tag) {
      baike.goToUrl('/mobile/search.html?ptag=content_tag_clk&search=' + tag)
    },
    getDiseaseTagDocs: function (tag) {
      if (!tag) return
      var that = this
      var isHot = tag.name === '热门文章'
      var docUpper = tag.list.length ? 5 : 3
      var pageSize = isHot ? 10 : docUpper
      if (isHot && docUpper === 5) {
        tag.docUpper += docUpper
        return
      }
      pageLoad({
        key: that.tabObj.name + tag.tag,
        url: '/mobile/getDiseaseTagDocs',
        retKey: isHot ? 'hotdocs' : 'docs',
        pageSize: pageSize,
        cb: function (pageData) {
          var list = pageData.list
          if (list && list.length > 0) {
            var tmplist = []
            list.forEach(function (item) {
              if (item && item['tid' + item.tid]) {
                tmplist.push(item['tid' + item.tid])
              } else {
                tmplist.push(item)
              }
            })
            tag.list = tmplist
            tag.docUpper += docUpper
          }
          tag.loaded = pageData.loaded
        }
      }, {
        disease: that.name,
        tab: that.tabObj.name,
        tag: tag.tag
      })
    },
    clickTag: function (index, fixed) {
      var that = this
      if (that.tabObj.name === '概述' || that.tabObj.name === '图解') return
      var tab = that.overviews[that.tab]
      if (!tab) return
      var tags = tab.tagData
      tags.tagIndex = index === -1 ? tags.tagIndex : index
      var tag = tags.tags[tags.tagIndex]
      that.getDiseaseTagDocs(tag)
      if (fixed) {
        $(window).scrollTop($('.swiper-slide-active .block-paper').offset().top - $('.crumb').height())
      }
      if (that.curTags && that.curTags.tags && index >= 0) {
        let reportkey = 'reviewdetail_tagx:'
        if (index >= 0) {
          reportkey += that.curTags.tags[index].name
        } else {
          reportkey += that.curTags.tags[that.curTags.tagIndex].name
        }
        baike.mtaReport(reportkey)
      }
    },
    toggleExpand: function () {
      var tab = this.overviews[this.tab]
      if (!tab) return
      var tags = tab.tagData
      tags.expand = !tags.expand
    },
    clickMask: function () {
      this.closeCate()
    },
    clickCate: function () {
      var that = this
      that.showCate = !that.showCate
      that.showVideo = false
    },
    closeCate: function () {
      var that = this
      that.showCate = !that.showCate
    },
    clickTab: function (tab, type) {
      var that = this
      if (!that.isHideDetailGuide) return
      var oriTab = that.tab || 0
      that.tab = tab || 0
      // 不形成历史记录
      var _url = window.location.href.replace(/#(.*)$/, '') + '#' + that.overviews[that.tab].pinyin
      window.history.replaceState({}, document.title, _url)
      // window.location.hash = '#' + that.overviews[that.tab].pinyin
      baike.mtaReport('pv', { // 上报一次pv
        referer: location.href.split('#')[0] + '#' + that.overviews[oriTab].pinyin
      })
      that.loadData(true)
      // document.body.scrollTop = 0
      $(window).scrollTop(0)
      that.showFixPaperTag = false
      that.showPlus = false
      that.changeVideo()
      if (that.showCate) {
        that.showCate = false
      }
      var tabObj = that.overviews[tab]
      var tabType = tabObj.pinyin
      that.setannotation++
      that.setimgviewer++
      if (type === 'tag') {
        switch (tabType) {
          case 'gaishu':
            baike.mtaReport('ydd_review_abstractlabel')
            break
          case 'zhengzhuang':
            baike.mtaReport('ydd_review_diseasesymlabel')
            break
          case 'bingyin':
            baike.mtaReport('ydd_review_diseaserealabel')
            break
          case 'zhenduan':case 'jiuyi':
            baike.mtaReport('ydd_review_diseasedialabel')
            break
          case 'zhiliao':
            baike.mtaReport('ydd_review_diseasecurelabel')
            break
          case 'richang':
            baike.mtaReport('ydd_review_diseasedaylabel')
            break
          case 'yufang':
            baike.mtaReport('ydd_review_diseasegualabel')
            break
          case 'tujie':
            baike.mtaReport('ydd_content_10pic_clk')
            break
          default:
            return
        }
      } else
      if (type === 'topnav') {
        switch (tabType) {
          case 'gaishu':
            baike.mtaReport('ydd_reviewnavbar_abstracttab')
            break
          case 'zhengzhuang':
            baike.mtaReport('ydd_reviewnavbar_diseasesymtab')
            break
          case 'bingyin':
            baike.mtaReport('ydd_reviewnavbar_diseasereatab')
            break
          case 'zhenduan':case 'jiuyi':
            baike.mtaReport('ydd_reviewnavbar_diseasediatab')
            break
          case 'zhiliao':
            baike.mtaReport('ydd_reviewnavbar_diseasecuretab')
            break
          case 'richang':
            baike.mtaReport('ydd_reviewnavbar_diseasedaytab')
            break
          case 'yufang':
            baike.mtaReport('ydd_reviewnavbar_diseaseguatab')
            break
          case 'tujie':
            baike.mtaReport('ydd_content_10pic_clk')
            break
          default:
            return
        }
      }
      that.setShare({
        title: that.name + '-企鹅医典',
        desc: that.overviews[0].definition || '传递健康与信赖',
        link: _url
      })
    },
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    scrollTotab: function () {
      var that = this
      var tab = that.tab
      var scrollLeft = Math.min(tab - (that.doc_id ? 3 : 2), that.overviews.length - 1) * 66 + Math.max(tab - that.overviews.length, 0) * 96
      var nav = document.querySelector('.crumb .content')
      // nav && nav.children[tab] && nav.children[tab].scrollIntoView();
      that.setimgviewer++
      if (nav && scrollLeft) {
        nav.scrollLeft = scrollLeft
      }

      if (that.swiper && that.swiper.activeIndex !== tab) {
        that.swiper && that.swiper.slideTo(tab)
      }
    },
    play: function () {
      var that = this
      if (!that.video) return
      if (!that.isAutoPlay) {
        that.isAutoPlay = true
        that.initPlayer(that.video.src, false)
      }
      that.isAutoPlay = true
      // that.player && that.player.play();
    },
    actionCb: function (action, type, res) {
      var that = this
      var tab = this.tabObj.name
      if (type === 'click') {
        let actionbar = this.$refs.actionbar
        if (!actionbar) return
        switch (action) {
          case 'help':
            actionbar.hClick()
            break
          case 'feedback':
            actionbar.fbClick()
            break
          case 'doubt':
            actionbar.dClick()
            break
          default:
            break
        }
        return
      }

      if (action === 'help') {
        if (!that.helpfulObj[tab]) that.helpfulObj[tab] = {}
        switch (type) {
          case 'add':
            that.helpfulObj[tab].helpfulCount = res.helpfulCount
            that.helpfulObj[tab].helpful = 1
            break
          case 'del':
            that.helpfulObj[tab].helpfulCount = res.helpfulCount
            that.helpfulObj[tab].helpful = 0
            break
          default:
            break
        }
      } else if (action === 'feedback') {
        that.feedbackObj[tab] = true
        that.$msg.toast('我们会努力做得更好', 'success')
      }
    },
    toArticle: function (type, docid, index) {
      if (docid) {
        baike.goToUrl('/mobile/article.html?docid=' + docid + '&name=' + this.name + (type === 'related' ? '&ptag=ydd_content_article_clk' : ''))
      }
    },
    moreClick: function (blockIndex) {
      var that = this
      var block = that.overviews[blockIndex]
      if (block) {
        block.docUpper = Math.min(block.docUpper + 5, block.doclist.length)
      }
    },
    disableScroll: function (newVal, oldVal) {
      newVal ? document.body.classList.add('disscroll') : document.body.classList.remove('disscroll')
    },
    changeVideo: function () {
      var that = this
      if (that.tab !== 0) {
        that.player && that.player.pause && that.player.pause()
      } else if (that.tab === 0 && that.isWifi()) {
        that.play()
      }
    },
    reShowVideo: function () {
      this.showVideo = true
    },
    showActionbar: function () {
      this.$refs.actionbar.showActionbar = true
    },
    guideClick: function () {
      this.isHideDetailGuide = true
      window.localStorage.setItem('isHideDetailGuide', 'true')
    },
    editUpClk: function () {
      var that = this
      that.editUp = !that.editUp
    },
    resizeSwiper: function () {
      var $detail = $('#detail')
      $detail.find('.swiper-wrapper').css('height', $detail.find('.swiper-slide-active').height())
      this.swiper.updateContainerSize()
    },
    imgLoaded: function () {
      var $detail = $('#detail')
      var that = this
      $detail.find('.md img,.ppt img').off().on('load', function () {
        that.resizeSwiper()
      })
    },
    finishReading () {
      var that = this
      if (docFetching) return
      var section = that.tabObj.name
      var $curBlock = $('.detail .swiper-slide').eq(that.tab).find('.sumary.md, .ppt').last()
      if (!$curBlock || !$curBlock.length || $curBlock[0].finishReading) return
      var scrollTop = $(window).scrollTop()
      var scrollHeight = $('body').height()
      var windowHeight = $(window).height()
      var contentBtm = $curBlock.offset().top + $curBlock.offset().height
      if (scrollTop >= scrollHeight - windowHeight || scrollTop >= contentBtm - windowHeight) {
        baike.mtaReport('maincontent_end_show|' + section)
        $curBlock[0].finishReading = true
      }
    },
    bind: function () {
      var that = this
      window.addEventListener('hashchange', function () {
        var tabs = that.overviews
        var tab = that.curHash()
        for (var i = 0; i < tabs.length; i++) {
          if (tabs[i].pinyin === tab && that.tab !== i) {
            that.clickTab(i)
            break
          }
        }
      }, false)

      window.addEventListener('scroll', that.finishReading)
      window.addEventListener('touchstart', that.finishReading)
    },
    toCollectMp: function () { // 关注公众号上报
      baike.mtaReport('ydd_articledetail_followwechart')
      window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzIzMzg4Mzc5Nw==&scene=124#wechat_redirect'
    },
    fixedStatusOnChange (status) {
      this.showFixPaperTag = status
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.name })
      }
    }
  }
}

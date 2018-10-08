/* global $,Txplayer, baike */
import 'src/libs/txplayer/txplayer'
import 'src/libs/qmplayer/player'
import pagenav from 'components/pagenav/pagenav.vue'
import tmenu from 'components/tmenu/tmenu.vue'
import actionbar from 'components/actionbar/actionbar.vue'
import depressiontest from 'components/depressiontest/depressiontest.vue'
import { ActiveBanner } from 'components/activity/activity'
import annotation from 'components/annotation/annotation.vue'
import fixedcollectiontips from 'components/fixedcollectiontips/fixedcollectiontips.vue'
import paper from 'components/paper/paper.vue'
import sourceDisclaimer from 'components/source_disclaimer/source_disclaimer.vue'
import player from 'components/player/player.vue'
import doctor from 'components/doctor/doctor.vue'
import videoUl from 'components/video_ul/video_ul.vue'
import loading from 'components/loading/loading.vue'
import filters from 'src/js/filters'
import circleProgress from 'components/circleProgress/circleProgress.vue'
import papertagMultiline from 'components/tagTabCommon/multiLine.vue'
import author from './author.vue'
import pageLoader from 'src/js/pageLoader'

var util = {
  getScrollTopOfBody: function () {
    var scrollTop
    if (typeof window.pageYOffset !== 'undefined') { // pageYOffset指的是滚动条顶部到网页顶部的距离
      scrollTop = window.pageYOffset
    } else if (typeof document.compatMode !== 'undefined' && document.compatMode !== 'BackCompat') {
      scrollTop = document.documentElement.scrollTop
    } else if (typeof document.body !== 'undefined') {
      scrollTop = document.body.scrollTop
    }
    return scrollTop
  },
  getDoctor: function (author) {
    return author && author.op_doctor && author.op_doctor.length ? author.op_doctor : null
  },
  getHospital: function (author, source, name) {
    var hos = null
    if (author && author.op_doctor && author.op_doctor.length > 0 && author.op_doctor[0].hospital) {
      var opDoctor = author.op_doctor[0]
      hos = {
        name: opDoctor.hospital,
        clickable: opDoctor.hospital_clickable,
        hpid: opDoctor.hpid
      }
    } else if (author && author.op_hospital && author.op_hospital.hpid === 1000) {
      // webmd的文章
      hos = {
        name: 'WebMD',
        icon: require('src/assets/images/mobile/authority_wm/webmd_circle.png'),
        clickable: 1,
        url: '/mobile/authority_wm.html' + (name ? '?name=' + name : ''),
        hpid: author.op_hospital.hpid,
        desc: '美国知名的医疗健康信息服务商'
      }
    } else if (author && author.op_hospital && author.op_hospital.hpid === 47) {
      // healthwise的文章
      hos = {
        name: 'Healthwise',
        icon: require('src/assets/images/mobile/authority_hw/hw_logo_circle.png'),
        clickable: 1,
        url: '/mobile/authority_hw.html',
        hpid: author.op_hospital.hpid,
        desc: '美国专业的医疗健康信息服务商'
      }
    } else if (author && author.op_hospital && author.op_hospital.hpid === 10174) {
      // healthwise的文章
      hos = {
        name: 'NCI',
        icon: '',
        clickable: 0,
        hpid: author.op_hospital.hpid,
        desc: '美国国家癌症研究所'
      }
    } else if (author && author.op_hospital && author.op_hospital.name) {
      hos = author.op_hospital
    } else if (source) {
      hos = {
        name: source,
        icon: 'https://s.pc.qq.com/tdf/ydd/common_logo.png',
        clickable: 1,
        url: '/mobile/doctor_team.html'
      }
    }
    return hos
  }
}

export default {
  data () {
    return {
      // 其他
      show: false,
      name: baike.query('name'),
      docid: baike.query('docid'),
      articleSrc: baike.query('src'),
      disease: baike.query('disease'),
      // 文章对应的疾病
      docDisease: null,
      actionOps: {},
      setannotation: 0,
      depressionShow: false,
      reachEndofAritle: false,
      wifiTestable: baike.isWeixin() || baike.getNetworkType() !== undefined,
      // common
      tid: 0,
      title: '',
      v_md_text: '',
      abs: '',
      releasetime: '',
      source: '',
      sourceid: null, // '来源编号，int，doc_info中source字段'
      copyright_head: '', // 来源字符串， string
      op_copyright: '', // 一句话版权
      info_type: 0, // 文章类型 0: 常规资讯, 1: 深度资讯, 2: 前沿资讯
      info_type_has_show: false,
      op_text: '', // 审阅人
      op_author: {},
      references: [],
      allReferences: false,
      tags: [],
      artTags: [], // 文章所属tag标签
      extraDocs: [],
      extraDiseases: [],
      docUpper: 3,
      activeOps: null,
      // 视频
      vType: parseInt(baike.query('vType')) || 0, // 系列视频拉取类型
      image: '',
      size: '',
      src: '',
      time: '',
      networkType: '',
      videoFixed: false,
      isAutoPlay: false,
      isAutoPlayText: '使用流量播放',
      allVideo: false,
      extraVideo: [],
      curVideo: {},
      curVideoStatus: null, // null 初始化 0 未开始播放 1 播放中 2 播放结束
      videoContinueCountdown: 10, // 播放结束10秒倒计时
      continueInterval: null, // 自动续播的定时器
      endingMiddleVideoIndex: 0, // 播放结束，轮播中间的视频在当前系列的index
      isNewVideoCategory: null, // 是否是新的视频集（是，则本页播放；否，则跳转播放（不改逻辑））
      lastVideoIdPlayed: null, // 最近一个播放的视频（不是播放完，是播放） docid， 用来判断是否暂停后继续播放
      changeVideoByManualOperation: false, // 是否手动切换视频源，用于区分是否是视频连播上报
      doctor: null,
      // 音频
      audioOps: {
        mode: 0,
        fixed: true
      },
      audio: null,
      showAudioPlayer: false,
      showAudioHint: false,
      showAudioTip: true,
      // 急救
      showFixTitle: false,
      curSectionTitle: '',
      curStepTitle: '',
      sections: [],
      // 问答
      op_sole: 0,
      question: [],
      extraQuestion: [],
      // 招募
      recruit_area: [],
      recruit_diseases: [],
      tname: '详情',
      tidName: '',
      from: baike.query('from'),
      noArtTags: false,
      // 快速返回按钮
      quickReturnStatus: 1, // 0 不显示 1 大标题 2 小标题
      quickReturnData: window.sessionStorage.getItem('lastStapArticle') ? JSON.parse(window.sessionStorage.getItem('lastStapArticle')) : null,
      moreVideo: [],
      nextstage: '',
      relateset: [],
      playerInterval: null,
      playerHasPlayedOnce: false,
      // 相关标签
      relatedTags: [],
      // 当前相关标签索引
      relatedTagIdx: 0,
      // 文章数
      docnum: 0,
      showDiseaseEntry: false,
      routerHasLeft: false
    }
  },
  components: {
    pagenav,
    tmenu,
    author,
    papertagMultiline,
    actionbar,
    depressiontest,
    ActiveBanner,
    annotation,
    fixedcollectiontips,
    paper,
    sourceDisclaimer,
    player,
    doctor,
    videoUl,
    circleProgress,
    loading
  },

  filters: {
    tagFormat: function (value, type) { // 疾病 》 1级 》2级 》3级，字数限制为 5个字 》5个字 》8个字》8个字；
      if (type === 1) {
        return value.length > 5 ? value.substring(0, 5) + '...' : value
      } else if (type === 2 || type === 3) {
        return value.length > 8 ? value.substring(0, 8) + '...' : value
      } else {
        return value.length > 5 ? value.substring(0, 5) + '...' : value
      }
    },
    formatSize: filters.formatSize
    // formatTime: filters.formatTime
  },

  computed: {
    // 文章作者信息
    author () {
      let doctors = util.getDoctor(this.op_author)
      let hospital = util.getHospital(this.op_author, this.source, this.name)
      return doctors || hospital ? { doctors, hospital } : null
    },
    showRecruitInfo: function () {
      return !!(this.recruit_area.length && this.recruit_diseases.length && this.op_author && this.op_author.op_doctor && this.op_author.op_doctor.length)
    },
    formatRecruitArea: function () {
      return this.recruit_area.join(' 、 ')
    },
    formatRecruitDisease: function () {
      return this.recruit_diseases.join(' ︱ ')
    },
    formatRecruitInvestigator: function () {
      let temp = ''
      if (this.op_author && this.op_author.op_doctor) {
        this.op_author.op_doctor.forEach(function (item, index, arr) {
          temp += index ? (' ︱ ' + item.name) : item.name
        })
      }
      return temp
    },
    isCancer () {
      if (!this.extraDiseases && !this.extraDiseases.length) {
        return false
      }
      var temp = this.extraDiseases.filter((item) => {
        return item.type === 4
      })
      return Boolean(temp.length)
    },
    videoCompilationTopic () {
      var extraDiseases = this.extraDiseases
      return '/mobile/video_compilation_topic.html?name=' + (this.disease || this.name) + (this.isNewVideoCategory ? '&video_type=2' : '&video_type=1') + '&type=' + ((extraDiseases && extraDiseases[0] && extraDiseases[0].type) || '')
    },
    endingMiddleVideo () {
      return this.extraVideo[this.endingMiddleVideoIndex >= this.extraVideo.length ? (this.endingMiddleVideoIndex - 1) : this.endingMiddleVideoIndex]
    },
    endingTranslate () {
      // translate偏移量，计算公式(n-2)*4.3 + (n-2)*0.34 + 3.04 n为下一个视频的索引+1
      let n = this.endingMiddleVideoIndex >= this.extraVideo.length ? this.endingMiddleVideoIndex : this.endingMiddleVideoIndex + 1
      let temp = (0 - 1) * ((n - 2) * 4.3 + (n - 2) * 0.34 + 3.04)
      return temp.toFixed(2) + 'rem'
    },
    progress () {
      return (10 - this.videoContinueCountdown) * 10
    },
    curVideoIndex () {
      let i
      if (!this.isNewVideoCategory) {
        return i
      }
      this.extraVideo.filter((item, index) => {
        if (item.docid === this.docid) {
          i = index
        }
      })
      return i
    }
  },
  watch: {
    docid () { // 现在播放的video在当前系列的index
      this.extraVideo.forEach((item, itemIndex) => {
        if (item.docid === this.docid) {
          this.endingMiddleVideoIndex = itemIndex + 1
        }
      })
    },
    extraVideo () {
      this.extraVideo.forEach((item, itemIndex) => {
        if (item.docid === this.docid) {
          this.endingMiddleVideoIndex = itemIndex + 1
        }
      })
    }
  },
  created: function () {
    this.getDocDataRelated()
  },
  mounted: function () {
    this.bindEvent()
  },
  activated () {
    this.routerHasLeft = false
    this.init()
    // 单页缓存分享信息重写
    this.setShare(this.shareCache)
    window.sessionStorage.removeItem('lastStapArticle')
    // 点赞的hack
    if (this.$refs.actionbar) {
      this.$refs.actionbar.bind()
    }
  },
  deactivated () {
    // 前进时暂停音频播放
    this.pauseAudio()
    this.quickReturnStatus = 1
    this.quickReturnData = null
    // 修复返回没发翻底事件
    this.reachEndofAritle = false
  },
  destroyed () {
    // 返回时销毁全局滚动事件
    var handlers = [this.removeEventListener, this.finishReading]
    handlers.forEach((item) => {
      window.removeEventListener('scroll', item)
    })
    this.quickReturnStatus = 1
    this.quickReturnData = null
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    init: function (lazyGetData) { // type传入1，则是只更新必要信息
      var that = this
      baike.get('/mobile/init_article', {
        docid: that.docid
      }, function (o) {
        var article = o.data
        if (o.retcode === 4032) { // 文章没有数据，或者已经下线
          baike.goToUrl(baike.getIndexUrl(), true)
          return
        }
        if (that.tid !== article.tid) {
          that.tid = article.tid
        }
        if (that.tid === 17) {
          // 视频
          that.curVideo = article
          that.time = filters.formatSize(article.duration)
          that.size = article.size
          that.src = article.src
          that.image = article.image || that.image
          that.doctor = article.op_doctor
          if (!that.doctor.drid) { // 需要添加webmd
            if (article.op_hospital && article.op_hospital.hpid === 1000) {
              that.doctor = {
                name: 'WebMD',
                icon: require('src/assets/images/mobile/authority_wm/webmd_circle.png'),
                clickable: 1,
                url: '/mobile/authority_wm.html',
                hpid: 1000,
                desc: '美国知名的医疗健康信息服务商'
              }
            }
          }
          if (that.isWifi()) {
            that.isAutoPlay = true
            that.initPlayer(article.src, true, true)
          } else if (baike.isWeixin()) {
            that.isAutoPlay = false
          } else {
            that.isAutoPlay = false
            that.isAutoPlayText = '该视频大小约'
          }
        } else if (that.tid === 24) {
          // 急救
          that.sections = article.data
          window.addEventListener('scroll', that.scrollToStep)
        } else if (that.tid === 26) {
          // 问答
          var question = article.info
          for (var j = 0; j < question.length; j++) {
            let doctors = util.getDoctor(question[j].op_author)
            let hospital = util.getHospital(question[j].op_author, question[j].source)
            question[j].author = doctors || hospital ? { doctors, hospital } : null
            question[j].related = question[j].op_relateddoc || []
            question[j].v_md_text = that.removeDoc(question[j].v_md_text, article.related_docs)
          }
          that.question = question
        }
        if (that.tid !== 17 && article.url) {
          that.audio = {
            src: article.url,
            size: article.size || 0,
            duration: article.duration || 0,
            docid: that.docid
          }
        }
        that.title = article.title
        that.abs = article.abs || that.abs
        that.v_md_text = that.removeDoc(article.v_md_text || that.v_md_text, article.related_docs)
        that.source = article.source || that.source
        that.sourceid = article.sourceid || that.sourceid
        that.copyright_head = article.copyright_head || that.copyright_head
        that.info_type = article.info_type || that.info_type
        that.releasetime = article.releasetime
        that.tags = article.op_keyword || that.tags
        that.op_author = article.op_author || that.op_author
        that.op_sole = article.op_sole || that.op_sole
        that.op_copyright = article.op_copyright || that.op_copyright
        that.recruit_area = article.recruit_area || that.recruit_area
        that.recruit_diseases = article.recruit_diseases || that.recruit_diseases
        that.references = (article.ref_info || that.references).reduce((result, item) => {
          if (item) result.push(item)
          return result
        }, [])
        that.allReferences = that.references.length <= 1
        if (article.op_doctors && article.op_doctors.length) {
          var hptext = {}
          var textArr = []
          var hpArr = []
          var hptextArr = []
          article.op_doctors.forEach(function (item) {
            if (item.text) {
              textArr.push(item.text)
            } else {
              if (!hptext[item.hpid]) {
                hptext[item.hpid] = [item.hospital + item.name + item.position]
                hpArr.push(item.hpid)
              } else {
                hptext[item.hpid].push(item.name + item.position)
              }
            }
          })
          hpArr.forEach(function (item) {
            hptextArr.push(hptext[item].join('、'))
          })
          that.op_text = textArr.join('，') + hptextArr.join('，')
        }
        if (article.diseases && article.diseases.length && !lazyGetData) {
          that.name = article.diseases[0].name
          that.$nextTick(function () {
            that.getActiveData()
          })
        }
        if ((article.diseases || []).map(item => item.name).indexOf('抑郁症') !== -1) {
          that.depressionShow = true
        }
        that.actionOps = {
          docid: that.docid,
          name: that.name,
          fStatus: o.favorite,
          hStatus: o.helpful,
          hCount: o.helpfulCount > 99999 ? '100000+' : o.helpfulCount,
          fbStatus: o.feedback,
          topnav: '.tmenu',
          showHelp: true,
          showFavor: true,
          showFdbk: true,
          showAnimation: that.actionOps.showAnimation || false,
          showDoubt: that.name === '哮喘' || that.name === '乳腺癌' || that.name === '腰椎间盘突出症',
          // page: that.tid === 24 ? '急救页' : '文章页',
          tid: that.tid
        }
        that.tidName = (that.tid === 24 ? '急救知识' : that.tid === 26 ? '问答详情' : (that.tid === 17 ? '视频详情' : '文章详情'))
        that.tname = that.tidName
        that.show = true
        that.setannotation++
        that.noArtTags = ((that.name === '肺癌' || that.name === '乳腺癌') && baike.isToCard) || (that.tid === 17)
        that.scrollToPara()
        if (that.quickReturnStatus !== 0) {
          if (that.quickReturnData) baike.mtaReport('article_quickback_show')
          setTimeout(() => { // 快速返回（滚动则修改快速返回按钮）
            window.addEventListener('scroll', () => {
              that.quickReturnStatus = 2
            })
          }, 500)
        }
        that.$nextTick(() => {
          var scrollTop = $(window).scrollTop()
          // 改变导航条文案
          that.showDiseaseEntry = scrollTop > 120 && !!that.docDisease
        })
        that.setShare({
          title: that.title + '-企鹅医典',
          desc: article.abs
        })
        window.medTimer && window.medTimer.reportTime({
          action: 'article_page',
          ispage: 1
        })
      }, true)

      that.showAudioTip = !baike.lstore.getItem('showAudioTip')
    },
    scrollToStep: function (e) {
      var that = this
      var scroll = $('body').hasClass('disscroll') ? Math.abs($('body').css('top').replace('px', '')) : util.getScrollTopOfBody()
      var $sections = $('.section')
      var $steps = $('.section .step')
      var $titles = $('.section-title')
      var $fixTitle = $('.fixTitle')
      var previewHeight = $('.tmenu').height()

      if ($fixTitle.length) {
        previewHeight += $fixTitle[0].offsetHeight
      }
      for (var i = 0; i < $steps.length; i++) {
        var sectionIndex = $steps.eq(i).data('section')
        var section = that.sections[sectionIndex]
        var step = $steps.eq(i).data('step')

        if (sectionIndex === undefined || !section || step === undefined) continue

        var stepTop = $steps[i].offsetTop
        var stepPreview = previewHeight

        if ($titles.length && $titles[sectionIndex] && step === 0) {
          stepPreview += $titles[sectionIndex].offsetHeight
        }
        if ($sections.length && $sections[sectionIndex] && step === 0) {
          stepPreview += parseInt($sections.eq(sectionIndex).css('margin-top').replace('px', '')) || 0
        }

        if (stepTop - stepPreview <= scroll) {
          that.curSectionTitle = section.title || ''
          that.curStepTitle = section.type ? '(' + (step + 1) + '/' + section.v_md_text.length + ')' : ''
          that.showFixTitle = true
        } else if (i === 0 && stepTop > scroll) {
          that.curSectionTitle = ''
          that.curStepTitle = ''
          that.showFixTitle = false
        }
      }
    },
    scrollToPara () {
      setTimeout(() => {
        var paraid = window.location.hash.slice(1)
        var match = paraid.match(/^[a-zA-Z0-9]+$/)
        if (!match || !match.length) return
        var para = $('#' + match[0])
        var tmenu = $('.tmenu')
        if (paraid && paraid.length > 1 && para.length && tmenu.length) {
          $(window).scrollTop(para.offset().top - tmenu.height())
        }
      }, 400)
    },
    // 参考文献展开全部
    toggleReference () {
      this.allReferences = !this.allReferences
      // 解决收起后文章工具栏消失
      if (!this.allReferences && this.$refs.actionbar) {
        this.$nextTick(() => {
          this.$refs.actionbar.bind()
        })
      }
    },
    // 获取文章其他内容
    getDocDataRelated: function () {
      var that = this
      baike.get('/mobile/getDocDataRelated', {
        docid: that.docid,
        type: that.vType,
        disease: that.disease
      }, function (o) {
        that.docDisease = o.docdiseases[0] ? o.docdiseases[0] : null
        that.docnum = o.docnum || 0
        that.extraDiseases = o.docdiseases || that.extraDiseases
        that.artTags = o.tms_tags || that.artTags
        that.extraVideo = baike.resolveTpl(o.videorelated || [])
        that.extraVideo.forEach((item) => {
          item.abs = item.text || ''
        })
        // 判断是否是新的集合还是旧的名家之声
        if (that.isNewVideoCategory === null) {
          let flag = false
          that.extraVideo.forEach((item, index) => {
            if (item.docid === that.docid) {
              flag = true
            }
          })
          that.isNewVideoCategory = flag
        }
        that.extraQuestion = baike.resolveTpl(o.qarelated || [])
        that.extraDocs = baike.resolveTpl(o.related || []).map(item => {
          if (item.type === 2) {
            item.showRelated = true
          } else if (item.type === 4) {
            item.showHot = true
          }
          return item
        })
        // 相关标签：推荐 + 3个文章关联标签
        let relatedTags = (o.relatetags || []).slice(0, 3)
        that.relatedTags = (that.extraDocs.length ? ['推荐', ...relatedTags] : relatedTags).map(tag => {
          return {
            name: tag,
            type: that.tid === 26 || new RegExp(/^qa/).test(that.docid) ? 5 : 2,
            docs: [],
            loaded: false
          }
        })
        that.clickRelatedTag(0)
        that.relateset = o.relateset
        that.nextstage = o.nextstage
        that.$nextTick(() => {
          var scrollTop = $(window).scrollTop()
          // 改变导航条文案
          that.showDiseaseEntry = scrollTop > 120 && !!that.docDisease
        })
      })
    },
    // 运营位
    getActiveData () {
      baike.post('/mobile/getActiveData', {
        activetype: 5,
        name: this.name
      }, o => {
        if (o.retcode === 0) {
          this.activeOps = {
            list: o.activelist,
            area: 'detail_end',
            maxCnt: 5
          }
        }
      })
    },
    pauseAudio () {
      // 已经暂停的不执行
      this.$refs.audioPlayer && this.$refs.audioPlayer.play && this.$refs.audioPlayer.togglePlay()
    },
    toOverview: function (name, type, released, ptag) {
      ptag = ptag || 'ydd_contentsearch_disecard'
      if (baike.query('adtag') === 'tx.wx.hr') {
        ptag += ',ydd_hr_diseasex|' + name
      }
      baike.goToUrl(baike.getOverview({
        name: name,
        type: type,
        released
      }) + '&ptag=' + ptag)
    },
    searchByTag: function (tag, index) {
      var name = this.name || ''
      var ptag = this.tid === 26 ? 'qadetail_tagx:' + (name + index + 1) : 'content_tag_clk:' + (name + (index + 1))
      baike.goToUrl('/mobile/search.html?ptag=' + ptag + (this.tid === 26 ? '&nav=qa' : '') + '&search=' + tag + '&stag=' + (tag !== name ? name : ''))
    },
    toTagContnet: function (type, index, hash, tindex) {
      var that = this
      if (type === 2) {
        // let cate = that.artTags[index].tag[0].label
        // let tag = that.artTags[index].tag[1].label
        let cateList = []
        let cate = ''
        let tag = ''
        that.artTags[index].tag.forEach((item) => {
          if (item.type === 1) {
            cateList.push(item.label)
          }
        })
        cate = cateList.join('|')
        tag = that.artTags[index].tag[tindex].label
        baike.goToUrl(`/mobile/tag_article.html?ptag=tagbelongjourney:${that.name}&name=${that.name}&cate=${cate}&tag=${tag}&type=4`)
      } else if (type === 1) {
        window.sessionStorage.removeItem(`overview_zl_filterDataSelected_${that.name}`)
        window.sessionStorage.removeItem(`overview_zl_tabSelected_${that.name}`)
        let cate = that.artTags[index].tag[0].label
        baike.goToUrl(`/mobile/overview_zl.html?ptag=tagbelongjourney:${that.name}&name=${that.name}&cate=${cate}#${hash}`)
      } else {
        window.sessionStorage.removeItem(`overview_zl_filterDataSelected_${that.name}`)
        window.sessionStorage.removeItem(`overview_zl_tabSelected_${that.name}`)
        baike.goToUrl(`/mobile/overview_zl.html?ptag=tagbelongjourney:${that.name}&name=${that.name}`)
      }
    },
    play: function () {
      var that = this
      that.isAutoPlay = true
      // that.initPlayer(that.src, false, true)
      if (that.player && that.player.play) {
        that.player.play()
      } else {
        that.initPlayer(that.src, true, true)
      }
    },
    initPlayer: function (vid, auto, immediately) {
      var that = this
      if (that.player && that.player.play) {
        that.listenPlayer()
        return
      }
      console.log('txplayer初始化', vid, 'true')
      // 条件渲染导致new Txplayer之前找不到video
      this.$nextTick(() => {
        var player = new Txplayer({
          containerId: 'video',
          vid: vid,
          width: '100%',
          height: '100%', // screen.availHeight/3,
          autoplay: auto, // 原本auto，直接改成true
          videoType: 'vod',
          playerType: 'h5',
          // useComboService: auto,
          poster: that.image || 'http://s.pc.qq.com/tdf/ydd/common_black.png'
        })
        that.player = player
        // if (immediately) {
        //   this.playerInterval = setInterval(this.playerCheckStatusAndPlay, 500)
        // }
        that.listenPlayer()
      })
    },
    playerCheckStatusAndPlay () {
      var that = this
      console.log('定时检测player状态', that.curVideo.src, that.player.getPlayerState())
      if (that.player && that.player.getPlayerState) {
        if (+that.player.getPlayerState() === -1 || +that.player.getPlayerState() === 0 || +that.player.getPlayerState() === 2 || +that.player.getPlayerState() === 3) {
          console.log('that.player.play', that.curVideo.src)
          that.player.play()
        } else {
          that.playerHasPlayedOnce = true
          clearInterval(that.playerInterval)
          that.playerInterval = null
        }
      }
    },
    listenPlayer: function () {
      var that = this
      that.player.off('playStateChange')
      that.player.on('playStateChange', function (state) {
        if (state === 1) {
          console.log('------监听到视频播放事件---------')
          that.playerHasPlayedOnce = true
          if (that.lastVideoIdPlayed) {
            if (that.lastVideoIdPlayed === that.docid) {
              // console.log('上报：ydd_video_continue_playing 视频取消暂停继续播放')
              baike.mtaReport('ydd_video_continue_playing:' + that.docid)
            } else { // 如果上一次播放的视频不是当前视频，而且非手动切换视频，则为连播开始
              if (that.changeVideoByManualOperation === false) {
                // console.log('上报：ydd_video_continuous_playback 视频默认连续播放')
                baike.mtaReport('ydd_video_continuous_playback:' + that.docid)
              } else {
                // console.log('上报：ydd_video_startplaying 视频正文页开始播放')
                baike.mtaReport('ydd_video_startplaying:' + that.docid)
              }
            }
          } else {
            // console.log('上报：ydd_video_startplaying 视频正文页开始播放')
            baike.mtaReport('ydd_video_startplaying:' + that.docid)
          }
          that.lastVideoIdPlayed = that.docid
        } else if (state === 0) {
          that.curVideoStatus = 0
          that.changeVideoByManualOperation = false // 手动切换视频源标识变成false
          console.log('playStateChange结束')
          // console.log('上报：ydd_video_end_playback 视频结束播放', that.docid)
          baike.mtaReport('ydd_video_end_playback:' + that.docid)
          if (!that.isNewVideoCategory) { // 名家之声逻辑
            if (that.extraVideo && that.extraVideo.length > 0) {
              that.curVideo = that.extraVideo.shift()
              that.title = that.curVideo.title
              that.docid = that.curVideo.docid
              window.history.replaceState({}, that.curVideo.name, '/mobile/article.html?docid=' + that.curVideo.docid + '&name=' + that.name + (that.disease ? '&disease=' + that.disease : '') + (baike.query('ptag') ? '&ptag=' + baike.query('ptag') : ''))
              that.init()
              that.getDocDataRelated()
              setTimeout(() => {
                that.player.play(that.curVideo.src)
                that.setShare({
                  title: that.title + '-企鹅医典'
                })
              }, 1000)
            }
          } else {
            that.curVideoStatus = 2
            if (that.endingMiddleVideoIndex >= that.extraVideo.length) { // 名家之声逻辑
            } else { // 集合逻辑
              that.videoContinueCountdown = 10
              that.continueInterval = setInterval(that.timeInterval, 1000)
            }
          }
        }
      })
    },
    timeInterval () {
      if (this.videoContinueCountdown === 0) {
        this.endingAutoPlay()
      } else {
        this.videoContinueCountdown -= 1
      }
    },
    isWifi: function () {
      var ua = navigator.userAgent
      var re = /wifi/ig
      var networkType = baike.getNetworkType()
      return re.test(ua) || re.test(networkType)
    },
    videoItemClick (type, item, { ptag }) {
      if (type === 1) { // type: 1 名家之声 2 视频合集
        // console.log('上报：ydd_video_switch_video 手动点击切换视频')
        baike.mtaReport('ydd_video_switch_video:' + this.docid + '_' + item.docid)
        var name = (item.diseases && item.diseases[0] && item.diseases[0].name) || ''
        baike.goToUrl('/mobile/article.html?docid=' + item.docid + (name ? '&name=' + name : '') + (this.disease ? '&disease=' + this.disease : '') + (ptag ? '&ptag=' + ptag : ''))
        return
      }
      var that = this
      // console.log('上报：ydd_video_switch_video 手动点击切换视频')
      baike.mtaReport('ydd_video_switch_video:' + this.docid + '_' + item.docid)
      this.curVideoStatus = 0
      this.curVideo = item
      this.docid = item.docid
      this.title = this.curVideo.title
      this.size = this.curVideo.size
      this.image = this.curVideo.image
      this.v_md_text = this.curVideo.md_text || ''
      this.changeVideoByManualOperation = true
      if (!that.player) {
        // clearInterval(this.playerInterval)
        this.initPlayer(this.curVideo.src, true, true)
      } else {
        if (this.playerHasPlayedOnce) {
          this.isAutoPlay = true
          this.curVideoStatus = 1
          this.$nextTick(() => {
            console.log('修改播放：', this.curVideo.src)
            that.player.once('error', function (err) {
              console.log('播放出错', err)
            })
            clearInterval(this.playerInterval)
            that.player.play(that.curVideo.src)
            that.playerInterval = setInterval(that.playerCheckStatusAndPlay, 1000)
          })
        } else {
          // clearInterval(this.playerInterval)
          that.player = null
          this.initPlayer(this.curVideo.src, true, true)
        }
      }
      if (this.continueInterval) {
        clearInterval(this.continueInterval)
        this.continueInterval = null
      }
      window.history.replaceState({}, item.name, '/mobile/article.html?docid=' + item.docid + '&name=' + this.name + (this.disease ? '&disease=' + this.disease : '') + (ptag ? '&ptag=' + ptag : ''))
      this.init()
      this.getDocDataRelated()
      this.setShare({
        title: this.title + '-企鹅医典'
      })
    },
    endingIconClick (type) { // type 0：左 1：右边
      if (type === 0) {
        if (this.endingMiddleVideoIndex === 0) {
          return
        }
        if (this.endingMiddleVideoIndex === this.extraVideo.length) {
          this.endingMiddleVideoIndex -= 2
          return
        }
        this.endingMiddleVideoIndex -= 1
      } else {
        if (this.endingMiddleVideoIndex === this.extraVideo.length - 1) {
          return
        }
        this.endingMiddleVideoIndex += 1
      }
      if (this.continueInterval) {
        clearInterval(this.continueInterval)
        this.continueInterval = null
      }
    },
    endingPlayClick () {
      this.endingAutoPlay(this.docid)
      this.changeVideoByManualOperation = true
    },
    endingAutoPlay (reportPreDocid) {
      var that = this
      this.curVideoStatus = 1
      this.curVideo = this.extraVideo[this.endingMiddleVideoIndex > this.extraVideo.length - 1 ? this.extraVideo.length - 1 : this.endingMiddleVideoIndex]
      this.docid = this.curVideo.docid
      this.title = this.curVideo.title
      this.size = this.curVideo.size
      this.image = this.curVideo.image
      if (reportPreDocid) {
        // console.log('上报：ydd_video_switch_video 手动点击切换视频')
        baike.mtaReport('ydd_video_switch_video:' + reportPreDocid + '_' + this.docid)
      }
      if (!that.player) {
        if (that.playerHasPlayedOnce) { // 播放一次之后，即使非wifi环境
          that.isAutoPlay = true
        }
        this.initPlayer(this.curVideo.src, true, true)
      } else {
        if (that.playerHasPlayedOnce) { // 播放一次之后，即使非wifi环境
          that.isAutoPlay = true
        }
        this.curVideoStatus = 1
        this.$nextTick(() => {
          clearInterval(that.playerInterval)
          that.player.play(that.curVideo.src)
          that.playerInterval = setInterval(that.playerCheckStatusAndPlay, 1000)
        })
      }
      if (this.continueInterval) {
        clearInterval(this.continueInterval)
        this.continueInterval = null
      }
      window.history.replaceState({}, this.curVideo.name, '/mobile/article.html?docid=' + this.curVideo.docid + '&name=' + this.name + (this.disease ? '&disease=' + this.disease : '') + (baike.query('ptag') ? '&ptag=' + baike.query('ptag') : ''))
      this.init()
      this.getDocDataRelated()
      this.setShare({
        title: this.title + '-企鹅医典'
      })
    },
    convertRemToPixels (rem) {
      return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
    },
    toDoctor: function (doctor) {
      if (doctor.doctor_clickable === 1) {
        baike.goToUrl('/mobile/doctor.html?doctor_id=' + doctor.drid + '&ptag=ydd_content_doctorname')
      }
    },
    toHospital: function (hospital) {
      if (!hospital) return
      var url = ''
      if (hospital.url) {
        url = hospital.url
      } else if (hospital.clickable === 1) {
        url = '/mobile/hospital.html?hospital_id=' + hospital.hpid + '&ptag=ydd_content_hospital'
      }
      if (url) {
        baike.goToUrl(url)
      }
    },
    showActionbar: function () {
      this.$refs.actionbar.showActionbar = true
    },
    actionCb: function (action, type, res) {
      if (action === 'favorite' && type === 'add') {
        this.$msg.toastAdd('favor')
      } else if (action === 'feedback') {
        this.$msg.toast('我们会努力做得更好', 'success')
      }
    },
    audioClk: function () {
      if (this.showAudioPlayer) return

      this.showAudioTip = false
      baike.lstore.setItem('showAudioTip', true, 30 * 24 * 60)

      if (this.isWifi()) {
        this.audioPlay()
        return
      }
      this.showAudioHint = true
      if (this.wifiTestable) {
        baike.mtaReport('ydd_audiodoc_wifi')
      }
    },
    audioPlay: function () {
      this.showAudioHint = false
      this.showAudioPlayer = true
      if (this.$refs.audioPlayer) {
        this.$refs.audioPlayer.showMini()
        this.$refs.audioPlayer.togglePlay()
      }
    },
    audioCb: function (action, data) {
      if (action === 'close') {
        this.showAudioPlayer = false
      }
    },
    removeDoc: function (htmlStr, relatedDocs) {
      if (htmlStr) {
        relatedDocs = relatedDocs || []
        htmlStr = htmlStr.replace(/data-docid\s*=\s*"([^"]+)"/ig, function ($0, $1) {
          var str = $0
          if ($1 && relatedDocs.indexOf($1) === -1) { // 文章未上线，需要隐藏
            str += ' style="display:none;"'
          }
          return str
        })
      }
      return htmlStr
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.name })
      }
    },
    closeTypeInfoNotice () {
      this.info_type_has_show = true
    },
    quickReturnArticle () {
      baike.mtaReport('article_quickback_clk')
      window.history.go(-1)
    },
    // 点击相关标签
    clickRelatedTag (index, switchTab = true, ptag) {
      let tag = this.relatedTags[index]
      if (!tag) return
      if (ptag) {
        baike.mtaReport(`${ptag}:${tag.name}`)
      }
      this.relatedTagIdx = index
      if (tag.name === '推荐') {
        tag.docs = this.extraDocs.slice(0, switchTab && tag.docs.length ? tag.docs.length : tag.docs.length + 6)
        tag.loaded = tag.docs.length >= this.extraDocs.length
        return
      }
      this.getDocsDataByTags(`${this.name} ${tag.name}`, tag.type, switchTab)
        .then(({ loaded, list }) => {
          tag.docs = list
          // 没有问答则拉取文章
          if (tag.type === 5 && !tag.docs.length) {
            tag.type = 2
            this.clickRelatedTag(index, switchTab)
          } else {
            tag.loaded = loaded
          }
        }, error => {
          if (error && !(error.code >= 200 && error.code < 300)) {
            this.$msg.toast('数据加载失败，请重试', '', 1500, 'slide-up')
          }
        })
    },
    // 根据标签拉取文章，问答拉问答
    getDocsDataByTags (name, type, switchTab) {
      const options = {
        listKey: 'docs',
        totalKey: 'count',
        getTpl: true,
        count: 6,
        resetSignal: baike.query('VNK')
      }
      const params = {
        query: name,
        type
      }
      const url = '/mobile/saSearchAgent'
      return pageLoader.load(url, options, params, loader => {
        // tab切换直接返回已有数据
        return !(switchTab && loader.list.length)
      })
    },
    finishReading () {
      var that = this
      var docid = this.docid
      var $content = $('.tpl .md').last()
      var scrollTop = $(window).scrollTop()
      // 改变导航条文案
      that.showDiseaseEntry = scrollTop > 120 && !!that.docDisease
      that.videoFixed = that.tid === 17 && scrollTop > 0
      if (!$content.length) return
      var scrollHeight = $('body').height()
      var windowHeight = $(window).height()
      var contentBtm = $content.offset().top + $content.offset().height
      if ((scrollTop >= scrollHeight - windowHeight || scrollTop >= contentBtm - windowHeight) && !that.reachEndofAritle) {
        baike.mtaReport('maincontent_end_show|' + docid)
        that.reachEndofAritle = true
        that.actionOps.showAnimation = true
      }
    },
    bindEvent: function () {
      var that = this
      window.addEventListener('scroll', that.finishReading)
      // 给关联内容添加跳转点击事件,单页缓存尽量不要挂在全局
      $('#article').on('click', '.related-docs-content-link', function (e) {
        e.preventDefault()
        e.stopPropagation()
        var ctype = $(this).parent('.related-docs-content').attr('data-ctype')
        var ptag = ''
        if (ctype === '1') {
          ptag = 'insertlink_article'
          window.sessionStorage.setItem('lastStapArticle', JSON.stringify({ title: that.title, docid: that.docid }))
          baike.goToUrl('/mobile/article.html?docid=' + $(this).parent('.related-docs-content').attr('data-docid') + '&ptag=' + ptag)
        } else if (ctype === '8') {
          ptag = 'insertlink_video'
          window.sessionStorage.setItem('lastStapArticle', JSON.stringify({ title: that.title, docid: that.docid }))
          baike.goToUrl('/mobile/article.html?docid=' + $(this).parent('.related-docs-content').attr('data-docid') + '&ptag=' + ptag)
        } else if (ctype === '11') {
          ptag = 'insertlink_question'
          window.sessionStorage.setItem('lastStapArticle', JSON.stringify({ title: that.title, docid: that.docid }))
          baike.goToUrl('/mobile/article.html?docid=' + $(this).parent('.related-docs-content').attr('data-docid') + '&ptag=' + ptag)
        } else if (ctype === 'docList') {
          ptag = 'insertlink_list'
          baike.goToUrl('/mobile/tag_article.html?src=article_related_link&name=' + decodeURIComponent($(this).parent('.related-docs-content').attr('data-did-name')) + '&tagId=' + $(this).parent('.related-docs-content').attr('data-tag-id') + '&ptag=' + ptag)
        } else if (ctype === 'url') {
          ptag = 'insertlink_page'
          var url = decodeURIComponent($(this).parent('.related-docs-content').attr('data-url'))
          let reg = new RegExp(/article.html/)
          if (reg.test(url)) {
            window.sessionStorage.setItem('lastStapArticle', JSON.stringify({ title: that.title, docid: that.docid }))
          }
          baike.goToUrl(url + (url.indexOf('?') ? '&ptag=' + ptag : '?ptag=' + ptag))
        }
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (!this.routerHasLeft) {
      // console.log('上报： ydd_video_return_page 跳出视频正文页')
      baike.mtaReport('ydd_video_return_page:' + this.docid)
    }
    this.routerHasLeft = true
    next()
  }
}

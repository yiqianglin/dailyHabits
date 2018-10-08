/* global $, baike */
var annotationVar = {
  data: {},
  getNoteData: function (name, cb) {
    if (name) {
      var key = 'getNoteData_' + name
      var that = this
      if (name === 'PHQ-9') {
        that.data[key] = {
          type: 0,
          name: 'PHQ-9',
          content: 'PHQ-9量表，全名Patient Health Questionnaire-9，它可以作为抑郁症的筛查量表，但是阳性结果只能说明患者患有抑郁症的可能性较高，不能做诊断用；此外PHQ-9也可以在患者确诊抑郁症后用来评估其严重程度。'
        }
      }
      if (that.data[key]) {
        cb && cb(that.data[key])
        return
      }
      var url = '/mobile/getNoteData'
      baike.post(url, {
        name: name
      }, function (json) {
        if (json.retcode === 0) {
          that.data[key] = json
          cb && cb(that.data[key])
        }
      })
    }
  },
  getDiseaseType: function (name, cb) {
    if (name) {
      var key = 'getDiseaseType_' + name
      var that = this
      if (that.data[key]) {
        cb && cb(that.data[key])
        return
      }
      var url = '/mobile/getDiseaseType'
      baike.post(url, {
        disease: name
      }, function (o) {
        if (o.retcode === 0) {
          var type = o.type
          o.url = baike.getOverview({ name: name, type: type })
          that.data[key] = o
          cb && cb(that.data[key])
        }
      })
    }
  }
}

export default {
  props: ['dom', 'setannotation', 'rkeys', 'topnav', 'references', 'articleTitle', 'articleDocid'],
  data: function () {
    return {
      show: false,
      isRef: false,
      refIndex: -1,
      refDetail: '',
      direction: {
        v: 'down',
        h: 'left'
      },
      arrowStyle: '',
      wrapperStyle: '',
      name: '',
      op_docid: '',
      h5url: [],
      title: '',
      contentHtml: '',
      alias: '',
      type: -1 // 注释类型, 0: 普通注释, 1: 疾病, 2: 急救
    }
  },
  created: function () {

  },
  activated () {
    this.bind()
  },
  mounted: function () {
    this.bind()
  },
  watch: {
    setannotation: function () {
      this.setAnnotation()
      this.setReference()
    },
    show: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('toggle', newVal)
      }
    }
  },
  computed: {
    viewMore: function () {
      var that = this
      var type = that.type
      var out = ''
      switch (type) {
        case 1:
          if (that.name) out = { title: '查看词条' }
          break
        case 2: case 3:
          if (that.op_docid) out = { title: type === 3 ? '查看文章' : '查看词条', url: '/mobile/article.html?docid=' + that.op_docid + '&ptag=ydd_content_viewemcomments' }
          break
        case 4:
          if (that.h5url && that.h5url[0]) out = { title: '查看更多', url: that.h5url[0] }
          break
      }
      return out
    }
  },
  methods: {
    bind: function () {
      var that = this
      $('.routerView').on('touchmove', '.annotation-box', that.eventFun)
    },
    eventFun (e) {
      var that = this
      var $this = $(e.srcElement || e.target)
      if ($this.hasClass('wrapper') || $this.parents('.wrapper').length > 0) return
      if ($this.parents('a[title]').length > 0) return
      if ($this.parents('sup.reference-index').length > 0) return
      that.hideAnnotation()
    },
    setAnnotation: function () {
      var that = this
      $('.annotation-mark').remove()
      var dom = (that.dom ? that.dom + ' ' : '')
      var $doms = $(dom + 'a[title]').attr('href', 'javascript:void(0);')
      var arr = []
      // console.log('xxxx '+this.setannotation)
      for (var i = 0, leni = $doms.length, itemi, title; i < leni; i++) {
        itemi = $doms.eq(i)
        title = itemi.attr('title')
        if (title && arr.indexOf(title) === -1) {
          arr.push(title)
          itemi.html('<span class="annotation-span">' + itemi.text() + '</span>')
        } else {
          itemi.removeAttr('title')
        }
      }
      $(dom + 'a[title]').off().on('click', function () {
        var val = $.trim($(this).attr('title') || '')
        if (val) {
          that.showAnnotation(val, $(this))
          if (that.rkeys && that.rkeys.clicked) baike.mtaReport(that.rkeys.clicked)
        }
      })
      let showAnnotationGuide = baike.lstore.getItem('showAnnotationGuide')
      if (!showAnnotationGuide) {
        $doms.eq(0).append('<span class="annotation-mark">注</span>')
      }
    },
    setReference: function () {
      var that = this
      var dom = (that.dom ? that.dom + ' ' : '')
      var $doms = $(dom + 'sup.reference-index')
      $doms.off().on('click', function () {
        var text = $(this).text()
        var reg = /\[(\d+)\]/
        var match = text.match(reg)
        if (match && match[1]) {
          that.showReference(match[1], $(this))
          if (that.rkeys && that.rkeys.refClk) baike.mtaReport(that.rkeys.refClk)
        }
      })
    },
    showReference: function (refIndex, target) {
      var that = this
      var index = (parseInt(refIndex) || 0) - 1
      var refDetail = that.references[index] || ''
      if (!refDetail) return
      that.isRef = true
      that.show = true
      that.refIndex = refIndex
      that.refDetail = refDetail
      setTimeout(function () {
        that.posAnnotation(target)
      }, 0)
    },
    showAnnotation: function (val, target) {
      var that = this
      that.isRef = false
      var report = {
        0: 'ydd_content_comments',
        1: 'ydd_content_diseasecomments',
        2: 'ydd_content_emcomments'
      }
      if (that.title === val) {
        target.addClass('annotation-selected')
        let $mark = target.find('.annotation-mark')
        if ($mark.length) {
          baike.lstore.setItem('showAnnotationGuide', true, 24 * 60 * 30)
          $mark.remove()
        }
        that.show = true
        setTimeout(function () {
          that.posAnnotation(target)
        }, 0)
        var reportKey = report[that.type]
        if (reportKey) baike.mtaReport(reportKey)
        return
      }
      annotationVar.getNoteData(val, function (notedata) {
        if (notedata.name && notedata.content) {
          target.addClass('annotation-selected')
          let $mark = target.find('.annotation-mark')
          if ($mark.length) {
            baike.lstore.setItem('showAnnotationGuide', true, 24 * 60 * 30)
            $mark.remove()
          }
          that.type = notedata.type
          that.name = notedata.name
          that.title = val
          that.contentHtml = (notedata.content || '')
          if (notedata.op_image) {
            that.contentHtml = '<img src="' + notedata.op_image + '">' + that.contentHtml
          }
          that.alias = notedata.alias || ''
          that.show = true
          setTimeout(function () {
            that.posAnnotation(target)
          }, 0)
          that.op_docid = notedata.op_docid || ''
          that.h5url = notedata.h5url || []
          var reportKey = report[that.type]
          if (reportKey) baike.mtaReport(reportKey)
        }
      })
    },
    posAnnotation: function (target) {
      var that = this
      var $annotation = $('#tplAnnotation')
      var $content = $('.container')
      var $topnav = $(that.topnav)
      if (!target || !$annotation.length || !$content.length || !that.show) return
      var annotationW = $annotation.width()
      var annotationH = $annotation.height()
      var annotationL = $annotation.offset().left
      var topnavH = $topnav.length ? $topnav.height() : 0
      var deviationH = topnavH / 8
      var targetOffset = target.offset()
      var topHeight = targetOffset.top - $(window).scrollTop()
      var fontSize = parseInt(window.getComputedStyle(target[0], null).fontSize) || 0
      that.wrapperStyle = ''
      if (topHeight >= annotationH + topnavH + deviationH) {
        // 上方展示
        that.direction.v = 'up'
        // $annotation.css('top', (topHeight - annotationH) + 'px')
        $annotation.css('top', (targetOffset.top - annotationH - deviationH) + 'px')
      } else {
        // 下方展示
        that.direction.v = 'down'
        // $annotation.css('top', (topHeight + targetOffset.height) + 'px')
        $annotation.css('top', (targetOffset.top + targetOffset.height + deviationH) + 'px')
      }
      if (targetOffset.height > fontSize * 1.5) {
        let tdParent = target.parents('td')
        let parentL = tdParent.length ? tdParent.offset().left : 0
        let offsetLeft = target[0].offsetLeft + parentL
        // 两行注释
        if (that.direction.v === 'up') {
          // 上方展示
          that.arrowStyle = 'left:' + (targetOffset.width + (targetOffset.left - annotationL) + offsetLeft) / 2 + 'px;'
          that.direction.h = (targetOffset.width + (targetOffset.left - annotationL) + offsetLeft) / 2 > $content.width() / 2 ? 'right' : 'left'
        } else {
          // 下方展示
          that.arrowStyle = 'left:' + (targetOffset.left - annotationL) + 'px;margin-left:0;'
          that.direction.h = targetOffset.left > $content.width() / 2 ? 'right' : 'left'
        }
      } else {
        // 一行注释
        that.arrowStyle = 'left:' + (targetOffset.left + targetOffset.width / 2) + 'px;'
        if ((targetOffset.left + targetOffset.width / 2) > annotationW / 2 && (targetOffset.left + targetOffset.width / 2) < $content.width() - annotationW / 2) {
          that.wrapperStyle = 'position:relative;left:' + ((targetOffset.left + targetOffset.width / 2) - annotationW / 2) + 'px;'
        } else {
          that.direction.h = (targetOffset.left + targetOffset.width / 2) > $content.width() / 2 ? 'right' : 'left'
        }
      }
    },
    hideAnnotation: function () {
      this.show = false
      $('.annotation-selected').removeClass('annotation-selected')
    },
    viewAnnotation: function () {
      var that = this
      that.hideAnnotation()
      var viewMore = that.viewMore
      var type = that.type
      var name = that.name
      if (viewMore) {
        if (type === 2) {
          if (baike.query('adtag') === 'tx.wx.hr') {
            baike.mtaReport('ydd_hr_emergencyx|' + name)
          }
        } else if (type === 1) {
          if (baike.query('adtag') === 'tx.wx.hr') {
            baike.mtaReport('ydd_hr_diseasex|' + name)
          }
          annotationVar.getDiseaseType(name, function (json) {
            let reg = new RegExp(/article.html/)
            if (reg.test(json.url) && reg.test(window.location.href)) {
              window.sessionStorage.setItem('lastStapArticle', JSON.stringify({ title: this.articleTitle, docid: this.articleDocid }))
            }
            if (json.url) baike.goToUrl(baike.replaceParam('ptag', 'ydd_content_viewcomments', json.url))
          })
        }
        if (viewMore.url) {
          let reg = new RegExp(/article.html/)
          if (reg.test(viewMore.url) && reg.test(window.location.href)) {
            window.sessionStorage.setItem('lastStapArticle', JSON.stringify({ title: this.articleTitle, docid: this.articleDocid }))
          }
          baike.goToUrl(baike.replaceParam('ptag', 'ydd_content_commentlinks', viewMore.url))
        }
      }
    }
  }
}

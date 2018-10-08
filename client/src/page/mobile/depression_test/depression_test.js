/* global $, baike, MtaH5 */
import annotation from 'components/annotation/annotation.vue'

var depressionVar = {
  popup: {},
  timeout: 0
}

export default {
  data () {
    return {
      pageHeight: $(window).height(),
      questions: [],
      curIndex: 0,
      answer: ['A', 'B', 'C', 'D'],
      shareShow: false,
      score: -1,
      setannotation: 0,
      popup: {
        show: false,
        title: '',
        desc: '',
        isTip: false
      },
      isXcx: baike.isXcx() || false
    }
  },
  components: {
    annotation
  },
  activated () {
    // 单页缓存分享数据重置
    this.setShare(this.shareCache)
  },
  created: function () {
    var that = this
    that.initQuestion()
    that.calcScore(true)
    this.setShare({ title: '测测你的抑郁指数', desc: '回答几个问题，看看你是否被抑郁所困扰' })
  },
  mounted: function () {
    this.setannotation++
  },
  computed: {
    'result': function () {
      var result = {}
      var score = this.score
      if (score > -1 && score < 5) {
        result.className = ''
        result.desc = '无或极低'
        result.info = '可以持续关注自己的心理健康状况，并不需要接受治疗。'
      } else if (score > 4 && score < 10) {
        result.className = 'little'
        result.desc = '轻微'
        result.info = '建议持续关注自己的心理健康状况，并定期使用小工具自查。通常无需接受治疗。'
      } else if (score > 9 && score < 15) {
        result.className = 'middle'
        result.desc = '中度'
        result.info = '抑郁指数不代表抑郁症程度，建议进一步进行专业医学评估，以判断是否需要接受治疗（可能涉及心理治疗和抗抑郁药治疗）。'
      } else if (score > 14 && score < 20) {
        result.className = 'midhigh'
        result.desc = '中重度'
        result.info = '抑郁指数不代表抑郁症程度，推荐向专业人士寻求帮助，进一步进行专业医学评估，考虑接受治疗（可能涉及心理治疗和抗抑郁药治疗）。'
      } else if (score > 19) {
        result.className = 'high'
        result.desc = '重度'
        result.info = '抑郁指数不代表抑郁症程度，应尽早寻求专业医学评估和治疗（可能涉及心理治疗和抗抑郁药治疗）。'
      }
      return result
    },
    'questionLen': function () {
      return this.questions.length
    }
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    initQuestion: function () {
      var that = this
      var choice = ['从来没有', '有几天', '超过一半的日子', '几乎每天']
      var title = '在过去2周，您是否遇到这个问题？'
      var list = [
        { title: title, subtitle: '做任何事都没有兴趣，或根本不想做任何事', choice: choice, answer: '' },
        { title: title, subtitle: '感觉心情低落、沮丧或绝望', choice: choice, answer: '' },
        { title: title, subtitle: '入睡困难或在半夜醒来；或睡得过多', choice: choice, answer: '' },
        { title: title, subtitle: '感觉疲倦或没有精力', choice: choice, answer: '' },
        { title: title, subtitle: '胃口极差或吃得过多', choice: choice, answer: '' },
        { title: title, subtitle: '对自己有负面情绪：觉得自己很失败，或辜负了自己或家人的期望', choice: choice, answer: '' },
        { title: title, subtitle: '做事时（例如看报纸或看电视时）难以集中精神', choice: choice, answer: '' },
        { title: title, subtitle: '被周围人指出自己行动或说话速度格外迟缓；或正好相反—感觉自己比平时更加烦躁、坐立不安或停不下来', choice: choice, answer: '' },
        { title: title, subtitle: '有自己不如死掉或用某种方式自残的念头', choice: choice, answer: '' },
        { title: '上述问题对你的影响？', subtitle: '如果对上述任何问题的回答是肯定的，这些问题对自己工作、家庭事务或人际关系造成了多大困难？', choice: ['完全没有困难', '有一些困难', '非常大的困难', '极度困难'], answer: '' }
      ]
      that.questions = list
    },
    setChoice: function (indexi, index) {
      var that = this
      that.questions[index].answer = that.answer[indexi]
      if ((index === 8 || index === 9) && indexi > 0 && !depressionVar.popup[index]) {
        depressionVar.popup[index] = true
        var popup = that.popup
        if (index === 8) {
          popup.title = '注意'
          popup.desc = '如果出现自残或自杀的念头，应咨询专业人士，进行自杀指数的进一步评估。'
        } else {
          popup.title = '提示'
          popup.desc = '您的心理健康状况已经对自己的生活和社会功能造成了' + (indexi === 1 ? '轻微' : (indexi === 2 ? '中度' : '严重')) + '影响。'
        }
        popup.isTip = false
        popup.show = true
      } else if (that.curIndex < that.questionLen - 1) {
        that.nextClk()
      }
      MtaH5.clickStat('YDD_Tools_Depression' + (index + 1) + 'X', { 'value': indexi + 1 })
    },
    preClk: function () {
      var that = this
      var questionLen = that.questions.length
      if (that.curIndex === questionLen) {
        that.shareShow = true
        MtaH5.clickStat('ydd_tools_share')
      } else {
        that.curIndex--
        MtaH5.clickStat('ydd_tools_lastquestion')
      }
    },
    nextClk: function () {
      var that = this
      var questionLen = that.questions.length
      if (that.curIndex < questionLen && !that.questions[that.curIndex].answer) {
        that.popup.isTip = true
        that.popup.show = true
        if (depressionVar.timeout) {
          clearTimeout(depressionVar.timeout)
        }
        depressionVar.timeout = setTimeout(function () {
          that.popup.show = false
        }, 2000)
        return
      }
      if (that.curIndex === questionLen - 1) {
        $('#result').scrollTop(0)
        that.calcScore()
        MtaH5.clickStat('ydd_tools_finishtest')
      } else if (that.curIndex < questionLen - 1) {
        that.curIndex++
        MtaH5.clickStat('ydd_tools_nextquestion')
      } else { // 重新开始
        that.curIndex = 0
        baike.setCookie('baike_depression', '0')
        for (var i = 0, leni = that.questions.length; i < leni; i++) {
          that.questions[i].answer = ''
        }
        depressionVar.popup = {}
        MtaH5.clickStat('ydd_tools_restart')
      }
    },
    hideShare: function () {
      this.shareShow = false
    },
    knowDepression: function () {
      baike.goToUrl('/mobile/overview.html?name=抑郁症&ptag=ydd_tools_depressioncard')
    },
    calcScore: function (isFirst) { // 初始化
      var that = this
      var answers = []
      var unanswer = -1
      var score = 0
      var questionLen = that.questions.length
      var getScore = function (arr, flag) {
        answers = []
        unanswer = -1
        score = 0
        if (arr.length !== questionLen) return
        var scoreObj = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }
        for (var i = 0, leni = arr.length, itemi; i < leni; i++) {
          itemi = flag ? arr[i].answer : arr[i]
          if (itemi && scoreObj[itemi] > -1) {
            answers.push(itemi)
            if (i < leni - 1) score += scoreObj[itemi]
          } else {
            unanswer = i
            break
          }
        }
      }
      if (isFirst) { // 初始化，从cookie中取
        var answerStr = baike.getCookie('baike_depression')
        getScore((answerStr || '').split('_').filter(function (s) { return s && $.trim(s) }))
        if (answers.length === questionLen && unanswer === -1) {
          that.score = score
          that.curIndex = questionLen
        } else {
          if (answerStr) baike.setCookie('baike_depression', '0')
          that.curIndex = 0
        }
      } else {
        getScore(that.questions, true)
        if (unanswer > -1) {
          that.curIndex = unanswer
        } else if (answers.length === questionLen) {
          that.score = score
          that.curIndex = questionLen
          baike.setCookie('baike_depression', answers.join('_'))
        }
      }
    },
    hidePopup: function (e) {
      var $this = $(e.srcElement || e.target)
      var that = this
      if (!$this.hasClass('popup-desc')) {
        that.popup.show = false
      }
    },
    popupKnow: function () {
      var that = this
      if (that.curIndex < that.questionLen - 1) {
        that.nextClk()
      }
    }
  }
}

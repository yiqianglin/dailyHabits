/* global baike */
export default {
  data () {
    return {
      step: 1, // 当前第几步，
      inc_symps: [], // 命中的症状
      exc_symps: [], // 没有被命中的缓存
      revelantNum: 0, // 相关疾病
      rel_symptoms: [],
      isShow: false,
      isShowAskChoose: false,
      session: [],
      isShowAskInput: true,
      symptoms: [],
      key: '',
      inputVal: '',
      resultArr: {},
      chooseVal: []
    }
  },
  // 自定义在实例
  filters: {
    setkey: function (value) {
    }
  },
  activated () {
  },
  created: function () {
    // var that = this
    this.init()
    this.initSession()
    this.getTopSymptoms()
  },
  watch: {
    currentBranch: 'init'
  },
  methods: {
    init: function () {
      var that = this
      that.isShow = true
    },
    commaFilter: function (val) {
      return val.replace(/(.*)[，]$/, '$1')
    },
    initSession: function () {
      var that = this
      var session = []

      setTimeout(function () {
        session.push({
          type: 'answer',
          content: '欢迎体验差症状测试版，部分内容还在建设中，结果仅供参考'
        })
      }, 1000)

      setTimeout(function () {
        session.push({
          type: 'answer',
          content: '支持多选和输入你想搜的症状,点击“发送”开始搜索'
        })
      }, 2000)

      that.session = session
    },
    pushSession: function (obj) {
      var that = this
      that.session.push(obj)
    },
    setkey: function (value) {
      var key = this.key
      if (!value || !key) { return value }
      value = value.toString()
      var regex = new RegExp(key, 'i')
      return value.replace(regex, '<span class="key">' + key + '</span>')
    },
    edit: function (index) {
      var that = this
      var session = that.session
      that.session = session.splice(0, index)
    },
    // 查询热门症状
    getTopSymptoms: function () {
      var that = this
      baike.post('/mobile/getTopSymptoms', {}, function (o) {
        if (o.retcode === 0) {
          that.symptoms = o.symptoms
          console.log(o)
        }
      })
    },
    // 热门症状点击
    topSytmClick: function (value) {
      var that = this
      var symptoms = that.symptoms.filter(function (v, k) {
        return value !== v
      })
      that.symptoms = symptoms
      var regex = new RegExp(that.key + '$')
      var inputVal = that.inputVal.replace(regex, '') + value + '，'
      that.inputVal = inputVal
    },
    // 用户输入症状
    sytmInput: function () {
      var that = this
      var inputVal = this.inputVal
      !!inputVal && that.getSymptomSearchPredictions({ term: inputVal })
    },
    // 用户输入联动查询热门症状
    getSymptomSearchPredictions: function (params) {
      var that = this
      baike.post('/mobile/getSymptomSearchPredictions', params, function (o) {
        if (o.retcode === 0) {
          that.key = o.matchString
          that.symptoms = o.symptoms
        }
      })
    },
    // 用户点击发送症状
    sendSymptom: function () {
      var that = this
      that.inc_symps.push(that.inputVal.replace(/\uff0c$/g, ''))

      // 添加一次会话记录
      that.pushSession({
        type: 'ask',
        content: that.inputVal.replace(/(.*)[，]$/, '$1')
      })

      var params = {
        inc_symps: that.inc_symps,
        exc_symps: that.exc_symps,
        num_interactions: that.step,
        num_relevant: 0
      }
      that.getRelInfo(params)
    },
    getRelInfo: function (params) {
      var that = this
      baike.post('/mobile/getRelInfo', params, function (o) {
        if (o.retcode === 0) {
          // 缓存请求
          that.resultArr[that.step] = o
          that.doResult(o)
        }
      })
    },
    doResult: function (o) {
      var that = this
      var relSymptoms = o.rel_symptoms
      // var relDiseases = o.rel_diseases
      var hitSymptoms = o.hit_symptoms
      var numRelevant = o.num_relevant

      // 设置追问症状
      that.rel_symptoms = o.rel_symptoms

      // 输入没有关联到症状或者疾病展示提示语
      if ((hitSymptoms.length === 0 || (hitSymptoms.length > 0 && numRelevant === 0)) && !!that.inputVal) {
        that.pushSession({
          type: 'answer',
          content: '未检索到任何关键词，请输入或描述症状。如：头痛、腹泻'
        })
        return
      } else if (o.finish === 1 || (o.num_relevant < 5 && relSymptoms.length > 0)) {
        // 结束
        that.pushSession({
          type: 'reslist',
          content: '未检索到任何关键词，请输入或描述症状。如：头痛、腹泻'
        })
        return
      }

      var waiter = that.getWaiter()

      waiter().then(function () {
        // 显示loading
        that.pushSession({
          type: 'loading',
          keywork: that.commaFilter(o.hit_symptoms.join(',')),
          num_relevant: o.num_relevant,
          num_irrelevant: o.num_irrelevant
        })
        return waiter(2000)
      }).then(function () {
        // 移除loading
        that.session.pop()
        that.pushSession({
          type: 'loaded',
          num_relevant: o.num_relevant
        })
        return waiter()
      }).then(function () {
        that.pushSession({
          type: 'answer',
          content: '是否还有以下症状想补充？'
        })
        that.isShowAskInput = false
        that.showAskChoose()
        return waiter()
      })
    },
    getWaiter: function (time) {
      time = time || 1000
      return function () {
        return new Promise(function (resolve, reject) {
          setTimeout(resolve, time)
        })
      }
    },
    // 展示追问控件
    showAskChoose: function () {
      var that = this
      that.isShowAskChoose = true
    },
    // 追问症状选择事件
    chooseItemClick: function (isEmpty) {
      if (isEmpty) {
        this.chooseVal = []
      }
    },
    chooserClick: function () {
      this.chooseVal = []
    }
  }
}

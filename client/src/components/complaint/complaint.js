/* global baike */
var complaintVar = {
  startTime: new Date(),
  url: {
    '腰椎间盘突出症': {
      A: 'https://wj.qq.com/s/1798296/0311',
      B: 'https://wj.qq.com/s/1799089/b12a',
      C: 'https://wj.qq.com/s/1799092/8a61'
    },
    '哮喘': {
      A: 'https://wj.qq.com/s/1799098/4c09',
      B: 'https://wj.qq.com/s/1799100/f6c9',
      C: 'https://wj.qq.com/s/1799102/e485'
    },
    '乳腺癌': {
      A: 'https://wj.qq.com/s/1799105/a667',
      B: 'https://wj.qq.com/s/1799106/ba67',
      C: 'https://wj.qq.com/s/1799107/4d41'
    }
  }
}

export default {
  props: ['name', 'version'],
  data: function () {
    return {
      showAll: true
    }
  },
  created: function () {
    this.bindEvent()
  },
  methods: {
    toComplaint: function () {
      var endTime = new Date()
      var duration = (endTime.getTime() - complaintVar.startTime.getTime())
      var that = this
      var url = complaintVar.url[that.name][that.version]
      if (url) {
        baike.mtaReport('YDD_question_time|' + that.name + that.version + duration)
        setTimeout(function () {
          window.location.href = url
        }, 100)
      }
    },
    bindEvent: function () {
      // var that = this
      // var $window = $(window)
      // var timeout = ''
      // $window.on('scroll', function () {
      //  if (timeout) clearTimeout(timeout)
      //  timeout = setTimeout(function () {
      //    that.showAll = ($window.scrollTop() === 0)
      //  }, 100)
      // })
    }
  }
}

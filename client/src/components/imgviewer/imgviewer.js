/* global $ */
export default {
  props: ['dom', 'setimgviewer'],
  data: function () {
    return {
      show: false,
      showKey: '',
      images: []
    }
  },
  created: function () {

  },
  watch: {
    setimgviewer: function () {
      this.setImgviewer()
    }
  },
  methods: {
    setImgviewer: function () {
      var that = this
      var dom = (that.dom ? that.dom + ' ' : '')
      var $doms = $(dom + '.rounded img[title]')
      var arr = that.images || []
      for (var i = 0, leni = $doms.length; i < leni; i++) {
        var itemi = $doms.eq(i)
        var dst = itemi.attr('title')
        var key = arr.length
        if (dst) {
          arr.push({
            src: dst,
            key: key
          })
          itemi.attr('key', key)
        }
      }
      $(dom + '.rounded img[title]').off().on('click', function () {
        var val = $.trim($(this).attr('key') || '')
        if (val) {
          that.showImgviewer(val)
        }
      })
    },
    showImgviewer: function (key) {
      var that = this
      that.show = true
      that.showKey = key
    },
    hideImgviewer: function () {
      this.show = false
    }
  }
}

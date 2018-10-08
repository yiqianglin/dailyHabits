/* global baike */
export default {
  props: ['show', 'clickstat', 'notitle'],
  methods: {
    toDepressionTest: function () {
      var that = this
      var clickStat = that.clickstat
      if (clickStat) baike.mtaReport(clickStat)
      baike.goToUrl('/mobile/depression_test.html')
    }
  }
}

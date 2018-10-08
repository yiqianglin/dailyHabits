/* global $,baike, Raven */
// 创建一个新错误对象，并以原型链的方式 Error
function AjaxError (message) {
  this.name = 'AjaxError'
  this.message = message || 'Default Message'
  this.stack = (new Error()).stack
}
AjaxError.prototype = Object.create(Error.prototype)
AjaxError.prototype.constructor = AjaxError

let seq = Number(sessionStorage.getItem('globalSeq') || 0)
function getAccessParams (cmd, payload = {}, clientParam = {}) {
  var bkToken = baike.getCookie('bk_token')
  var header = {
    version: '2.0.3',
    flag: 0
  }
  var client = $.extend({
    platform: baike.isXcx() ? 0 : 1, // 客户端平台， 小程序=0  公众号=1  APP=2 QQ浏览器小程序=3
    os: baike.isIos() ? 1 : 0, // 系统版本:android = 0, ios = 1
    env: '', // 标识环境
    isTourist: '0', // 游客标识 0: 登录用户; 1: 游客
    adtag: baike.query('adtag'), // 渠道来源
    product: 0 // 所属产品 腾讯医典
  }, clientParam)
  seq++
  sessionStorage.setItem('globalSeq', seq)
  var params = {
    header,
    body: {
      seq,
      cmd,
      token: bkToken,
      client,
      payload
    }
  }
  return params
}
let ajax = {
  post (cmd, opt) {
    var bkToken = baike.getCookie('bk_token')
    var startTime = 0
    var finTime = 0
    var payload = opt.payload || {}
    var client = opt.client || {}
    $.ajax({
      type: 'POST',
      url: '/api/access/json?cmd=' + cmd,
      data: JSON.stringify(getAccessParams(cmd, payload, client)),
      dataType: 'json',
      timeout: opt.timeout || 6000,
      headers: {
        'content-type': 'application/json', // 默认值
        'Authorization': 'Bearer ' + (bkToken || '')
      },
      beforeSend: function (request, settings) {
        startTime = new Date().getTime()
      },
      success: function (res) {
        finTime = new Date().getTime()
        var data = res && res.body
        if (data) {
          if (data.retcode === 0 && data.bizcode === 0) {
            opt.callback && opt.callback(data.payload)
          } else {
            opt.callback && opt.callback(null, data)
          }
        }
      },
      error: function (xhr, errorType, error) {
        finTime = new Date().getTime()
        xhr.params = payload
        xhr.type = errorType
        xhr.timeing = finTime - startTime
        if ($.isFunction(opt.errcallback)) {
          opt.errcallback(errorType)
        }
        if (errorType === 'error') {
          window.Raven && Raven.captureException(new AjaxError(errorType + ':' + error + ' in ' + cmd), {
            extra: xhr,
            level: errorType === 'error' ? 'error' : 'warning'
          })
        }
      }
    })
  }
}

export default ajax

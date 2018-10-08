/* global $, MtaH5, Raven, wx, JsBridge, browser */
/* eslint no-extend-native: ["error", { "exceptions": ["Number"] }] */
(function (document, window) {
  console.log('weixin://preInjectJSBridge/start')
  var docEl = document.documentElement
  var event = 'orientationchange' in window ? 'orientationchange' : 'resize'
  var recalc = function () {
    var size = 750
    var zoom = docEl.clientWidth / size
    // if(zoom > 1) docEl.style.fontSize = '100px';
    // docEl.style.fontSize = 100 * zoom + 'px';
    if (zoom > 1) {
      docEl.style.fontSize = '100px'
    } else {
      docEl.style.fontSize = 100 * zoom + 'px'
    }
  }
  // 创建一个新错误对象，并以原型链的方式 Error
  function AjaxError (message) {
    this.name = 'AjaxError'
    this.message = message || 'Default Message'
    this.stack = (new Error()).stack
  }
  AjaxError.prototype = Object.create(Error.prototype)
  AjaxError.prototype.constructor = AjaxError
  var baike = window.baike ? window.baike : {}
  window.baike = baike
  baike.query = function (query, url) {
    // query = query.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]')
    query = query.replace(/[[]/, '\\[').replace(/[\]]/, '\\]')
    var expr = '[\\?&]' + query + '=([^&#]*)'
    var regex = new RegExp(expr)
    url = (url || window.location.href)
    var results = regex.exec(url)
    if (results !== null) {
      return decodeURIComponent(results[1].replace(/\+/g, ' '))
    } else {
      return ''
    }
  }

  function setLog (data) {
    if (baike.query('debug') === 'debug' && data.seq && data.cmd) {
      var log = window.sessionStorage.getItem('log') ? JSON.parse(window.sessionStorage.getItem('log')) : []
      if (log && log.length > 0) {
        log.push(data)
      } else {
        log = [data]
      }
      window.sessionStorage.setItem('log', JSON.stringify(log))
    }
  }
  baike.get = function (url, params, callback, sendReport, errcallback, timeout) {
    var startTime = 0
    var finTime = 0
    if (baike.query('debug') && typeof params === 'object') {
      params.debug = 'debug'
    }
    $.ajax({
      type: 'GET',
      url: url,
      data: params,
      dataType: 'json',
      timeout: timeout || 6000,
      headers: {
        'bk-uri': window.location.href,
        'adtag': baike.getAdtag(),
        'token': params.token || '',
        'platform': baike.isXcx() ? 'xcx' : 'h5'
      },
      beforeSend: function (request, settings) {
        startTime = window.globalStarttime || new Date().getTime()
      },
      success: function (res) {
        finTime = new Date().getTime()
        if (res.seq && res.cmd) {
          setLog({
            seq: res.seq,
            cmd: res.cmd,
            retcode: res.retcode
          })
        }
        if (res.retcode === 302) {
          baike.setCookie('bk_uri', window.location.href)
          if (res.redirect_uri === window.location.href) {
            window.location.reload()
          } else {
            window.location.href = res.redirect_uri
          }
        } else if ($.isFunction(callback)) {
          callback(res)
        }
        var api = url.split('/')[2]
        baike.reportSpeed(finTime - startTime, api)
        window.medTimer && window.medTimer.reportTime({
          starttime: startTime, // 开始时间，可不填，若不填则以performance.timing.navigationStart的时间为准
          endtime: finTime, // 结束时间，可不填，若不填则以API执行时的时间戳为准
          time: finTime - startTime, // 耗时，可不填，若不填则会在API内部自动计算
          action: url // 当前耗时的接口，可不填，若不填则显示`noActionDefine`，如果是静态资源耗时则显示`onLoadEvent`
        })
      },
      error: function (xhr, errorType, error) {
        finTime = new Date().getTime()
        xhr.params = params
        xhr.type = errorType
        xhr.timeing = finTime - startTime
        if ($.isFunction(errcallback)) {
          errcallback(errorType)
        }
        if (errorType === 'error') {
          window.Raven && Raven.captureException(new AjaxError(errorType + ':' + error + ' in ' + url), {
            extra: xhr,
            level: errorType === 'error' ? 'error' : 'warning'
          })
        }
      }
    })
  }

  baike.post = function (url, params, callback, sendReport, errcallback, timeout) {
    var startTime = 0
    var finTime = 0
    if (baike.query('debug') && typeof params === 'object') {
      params.debug = 'debug'
    }
    var originUrl = url // 上报时，不能改变url
    if (params && url.indexOf('/mobile/reportAction') === -1) { // ios qq浏览器  先屏蔽report接口  需要给所有post请求加上参数
      var whiteList = ['name', 'id', 'disease', 'type', 'activetype', 'offset', 'count', 'mode', 'docid', 'title', 'tag', 'query', 'topic', 'doctor_id',
        'follow', 'doctag', 'hospital_id', 'tab', 'docidlist'
      ]
      for (var i = 0, leni = whiteList.length, itemi, itemj; i < leni; i++) {
        itemi = whiteList[i]
        itemj = params[itemi]
        if (itemj || itemj === 0) {
          try {
            if (typeof itemj === 'object') {
              itemj = JSON.stringify(itemj)
            }
            url = baike.replaceParam(itemi, encodeURIComponent(itemj).substr(0, 200), url)
          } catch (e) { }
        }
      }
    }
    $.ajax({
      type: 'POST',
      url: url,
      data: params,
      dataType: 'json',
      timeout: timeout || 6000,
      headers: {
        'bk-uri': window.location.href,
        'adtag': baike.getAdtag(),
        'token': params.token || '',
        'platform': baike.isXcx() ? 'xcx' : 'h5'
      },
      beforeSend: function (request, settings) {
        startTime = window.globalStarttime || new Date().getTime()
      },
      success: function (res) {
        finTime = new Date().getTime()
        if (res.seq && res.cmd) {
          setLog({
            seq: res.seq,
            cmd: res.cmd,
            retcode: res.retcode
          })
        }
        if (res.retcode === 302) {
          baike.setCookie('bk_uri', window.location.href)
          if (res.redirect_uri === window.location.href) {
            window.location.reload()
          } else {
            window.location.href = res.redirect_uri
          }
        } else if ($.isFunction(callback)) {
          callback(res)
        }
        var api = originUrl.split('/')[2]
        baike.reportSpeed(finTime - startTime, api)
        window.medTimer && window.medTimer.reportTime({
          starttime: startTime, // 开始时间，可不填，若不填则以performance.timing.navigationStart的时间为准
          endtime: finTime, // 结束时间，可不填，若不填则以API执行时的时间戳为准
          time: finTime - startTime, // 耗时，可不填，若不填则会在API内部自动计算
          action: originUrl // 当前耗时的接口，可不填，若不填则显示`noActionDefine`，如果是静态资源耗时则显示`onLoadEvent`
        })
      },
      error: function (xhr, errorType, error) {
        finTime = new Date().getTime()
        xhr.params = params
        xhr.type = errorType
        xhr.timeing = finTime - startTime
        if ($.isFunction(errcallback)) {
          errcallback(errorType)
        }
        if (errorType === 'error') {
          window.Raven && Raven.captureException(new AjaxError(errorType + ':' + error + ' in ' + url), {
            extra: xhr,
            level: errorType === 'error' ? 'error' : 'warning'
          })
        }
      }
    })
  }
  $.fn.longPress = function (fn, delay) { // 长嗯
    var timeout = ''
    var $this = this
    for (var i = 0; i < $this.length; i++) {
      $this[i].addEventListener('touchstart', function (event) {
        timeout = setTimeout(fn, delay || 800) // 长按时间超过800ms，则执行传入的方法
      }, false)
      $this[i].addEventListener('touchmove', function (event) {
        clearTimeout(timeout) // 如果移动了位置，忽略
      }, false)
      $this[i].addEventListener('touchend', function (event) {
        clearTimeout(timeout) // 长按时间少于800ms，不会执行传入的方法
      }, false)
    }
  }
  baike.sendReport = function (page, takeTime, method, ret, api) {
    // 用图片ping请求的方式会导致#锚点后面的参数被截断，故改回ajax get请求
    var img = new window.Image()
    img.src = '/mobile/reportTimes?page=' + page + '&takeTime=' + takeTime + '&method=' + method + '&ret=' + ret

    img.onerror = function () {
      // console.log('error');
    }
    img.onload = function () {
      // console.log('success');
    }
  }

  var reportData = function (takeTime, api) {
    var performance = window.performance ||
      window.msPerformance ||
      window.webkitPerformance
    var data = {}
    if (typeof performance === 'undefined') return
    var timing = performance.timing
    var connectStart = timing.connectStart // http/tcp 开始建立连接时间
    var connectEnd = timing.connectEnd // 完成建立连接的时间
    var domainLookupStart = timing.domainLookupStart // dns 查询
    var domainLookupEnd = timing.domainLookupStart
    var responseStart = timing.responseStart // 请求开始
    var responseEnd = timing.responseEnd
    // var domComplete = timing.domComplete  // html文档解析完毕
    var domInteractive = timing.domInteractive // html dom树创建完成但资源还未加载
    var domLoading = timing.domLoading // 浏览器开始解析dom
    var fetchStart = timing.fetchStart // 浏览器准备好请求文档的时间
    // var domContentLoadedEventEnd = timing.domContentLoadedEventEnd // domContentLoaded
    // var loadEventEnd = timing.loadEventEnd // onload 结束

    var dnsLookTime = domainLookupEnd - domainLookupStart // DNS查询耗时
    var tcpTime = connectEnd - connectStart // TCP链接耗时
    var responseTime = responseEnd - responseStart // request请求耗时
    // var domRenderTime = domComplete - domInteractive// 解析dom树耗时
    var whiteScreen = domLoading - fetchStart // 白屏时间
    // var domReadyTime = domContentLoadedEventEnd - fetchStart // domready时间
    // var onloadTime = loadEventEnd - fetchStart // onload时间
    var activeTime = domInteractive - fetchStart // 可交互时间
    var flagData = {}

    for (var i = 0; i < baike.pageConfig.length; i++) {
      if (baike.pageConfig[i].method === api) {
        flagData = JSON.parse(`{"flag3":"${baike.pageConfig[i].pageId}"}`)
      }
    }
    if (typeof flagData.flag3 === 'undefined') return ''
    data = {
      '1': whiteScreen,
      '2': activeTime,
      '3': takeTime,
      '4': dnsLookTime,
      '5': tcpTime,
      '6': responseTime,
      'flag3': flagData.flag3
    }
    return data
  }
  // 测速上报地址 http://wang.oa.com/h5/#/rum/speed
  baike.reportSpeed = function (takeTime, method) {
    var point = reportData(takeTime, method)
    if (point) {
      var params = baike.objToStr(point)
      var flag1 = ''
      if (window.location.host === 'baike.sparta.html5.qq.com') {
        flag1 = baike.isXcx() ? 22022 : 21930
      } else if (window.location.host === 'h5.baike.qq.com') {
        flag1 = baike.isXcx() ? 21900 : 21865
      }
      var appid = baike.isXcx() ? 20315 : 20294

      var connection = baike.getNetworkType()
      var platform = baike.isIos() ? 'ios' : (baike.isAndroid() ? 'Android' : 'unkown')
      var app = baike.getPlatform()
      var data = {
        platform: platform,
        app: app,
        apn: connection,
        speedparams: encodeURIComponent(`flag1=${flag1}&flag2=1${params}`),
        uin: '553030872'
      }
      var paramsStr = baike.objToStr(data)
      var url = `https://report.huatuo.qq.com/report.cgi?appid=${appid}${paramsStr}`
      var img = new window.Image()
      img.src = url
    }
  }

  baike.objToStr = function (obj) {
    let str = ''
    for (var name in obj) {
      if (obj.hasOwnProperty(name)) {
        str += `&${name}=${obj[name]}`
      }
    }
    return str
  }
  baike.isFunction = function (fn) {
    return Object.prototype.toString.call(fn) === '[object Function]'
  }

  baike.getNetworkType = function () {
    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {}
    return connection.type || connection.effectiveType
  }

  baike.getCookie = function (name) {
    // 读取COOKIE
    var reg = new RegExp('(^| )' + name + '(?:=([^;]*))?(;|$)')
    var val = document.cookie.match(reg)
    if (!val || !val[2]) {
      return ''
    }
    var res = val[2]
    try {
      if (/(%[0-9A-F]{2}){2,}/.test(res)) { // utf8编码
        return decodeURIComponent(res)
      } else { // unicode编码
        return unescape(res)
      }
    } catch (e) {
      return unescape(res)
    }
  }
  baike.setCookie = function (name, value, expires, path, domain, secure) {
    // 写入COOKIES
    expires = (expires || 1440) // 默认一天
    // if (!value) {
    //   value = name
    //   name = 'adtag'
    // }
    var exp = new Date()
    expires = arguments[2] || null
    path = arguments[3] || '/'
    domain = arguments[4] || null
    secure = arguments[5] || false
    if (expires) {
      exp.setMinutes(exp.getMinutes() + parseInt(expires))
    }
    document.cookie = name + '=' + escape(value) + (expires ? ';expires=' + exp.toGMTString() : '') + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '')
  }
  baike.delCookie = function (name, path, domain, secure) {
    // 删除cookie
    var value = baike.getCookie(name)
    if (value != null) {
      var exp = new Date()
      exp.setMinutes(exp.getMinutes() - 1000)
      path = path || '/'
      document.cookie = name + '=;expires=' + exp.toGMTString() + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '')
    }
  }

  baike.hasClass = function (obj, cls) {
    return new RegExp('(\\s|^)' + cls + '(\\s|$)').test(obj.className)
  }

  baike.addClass = function (obj, cls) {
    if (!baike.hasClass(obj, cls)) obj.className += ' ' + cls
  }

  baike.removeClass = function (obj, cls) {
    if (baike.hasClass(obj, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
      obj.className = obj.className.replace(reg, ' ')
    }
  }

  baike.replaceParam = function (param, value, url, forceReplace) { // 替换参数，添加ptag等
    if (!value && !forceReplace) return url
    var urlArr = (url || window.location.href).split('#')
    url = urlArr[0]
    var reg = new RegExp('([\\?&]' + param + '=)[^&#]*')
    if (!url.match(reg)) {
      url = ((url.indexOf('?') === -1) ? (url + '?' + param + '=' + value) : (url + '&' + param + '=' + value))
    }
    if (forceReplace) {
      url = (url.replace(reg, '$1' + value))
    }
    if (urlArr.length > 1) url += '#' + urlArr.slice(1).join('#')
    return url
  }

  baike.setShare = (function () {
    var curShare = {
      title: '企鹅医典',
      desc: '企鹅医典致力于向广大网友提供权威可信的医学知识，并提供易于理解的科普解读',
      link: baike.replaceParam('ptag', '', baike.replaceParam('adtag', 'tx.wx.hh', window.location.href), true),
      imgUrl: 'http://s.pc.qq.com/tdf/ydd/common_logo.png'
    }
    return function (obj) {
      obj = obj || {}
      var shareConfig = {
        title: obj.title || curShare.title,
        desc: (obj.desc || curShare.desc).replace(/<\/?[^>]*>/g, '').replace(/\n|\t/g, ''),
        link: baike.replaceParam('ptag', '', obj.link || window.location.href, true),
        imgUrl: obj.imgUrl || curShare.imgUrl
      }
      if (window.wx) {
        var deepCopy = function (p, c) {
          c = c || {}
          for (var i in p) {
            if (typeof p[i] === 'object') {
              c[i] = (p[i].constructor === Array) ? [] : {}
              deepCopy(p[i], c[i])
            } else {
              c[i] = p[i]
            }
          }
          return c
        }
        var getPtag = function (ptag) {
          var name = baike.query('name')
          var docid = baike.query('docid')
          if (docid) {
            ptag += '|' + docid
          } else if (name) {
            ptag += '|' + name
          }
          return ptag
        }
        wx.ready(function () {
          // 分享给朋友
          var param = $.extend({
            success: function (res) {
              window.MtaH5 && MtaH5.clickShare('wechat_friend')
              baike.mtaReport(getPtag('wx_share_message'))
            },
            fail: function (res) {
              window.alert(JSON.stringify(res))
            }
          }, shareConfig)
          param.link = baike.replaceParam('adtag', 'tx.wx.hh', param.link, true)
          param.link = baike.replaceParam('ptag', '', param.link, true) // 去除所有的ptag参数，防止分享后会上报
          wx.onMenuShareAppMessage(deepCopy(param))
          param.link = baike.replaceParam('adtag', 'tx.wx.pyq', param.link, true)
          param.link = baike.replaceParam('ptag', '', param.link, true)
          param.success = function (res) {
            window.MtaH5 && MtaH5.clickShare('wechat_moments')
            baike.mtaReport(getPtag('wx_share_timeline'))
          }
          // 分享到朋友圈
          wx.onMenuShareTimeline(deepCopy(param))
          // 修改小程序的分享链接
          if (baike.isXcx()) {
            wx.miniProgram && wx.miniProgram.postMessage({
              data: {linkUrl: baike.replaceParam('adtag', '', param.link, true)}
            })
          }
        })
      }
      if (window.JsBridge) {
        try {
          JsBridge.setShareInfo({
            iconUrl: 'http://s.pc.qq.com/tdf/ydd/common_logo.png',
            jumpUrl: shareConfig.link,
            title: shareConfig.title,
            summary: shareConfig.desc,
            message: shareConfig.desc,
            allowShare: 1
          })
        } catch (e) {}
      }
      if (window.browser && window.browser.app && window.browser.app.setShareInfo) { // 自定义qq浏览器分享
        browser.app.setShareInfo({
          title: shareConfig.title,
          url: shareConfig.link,
          description: shareConfig.desc,
          img_url: shareConfig.imgUrl
        }, function (result) {
          if (result && result.code === 0) { // 分享成功
            window.MtaH5 && MtaH5.clickShare('qb')
            baike.mtaReport('qb_share')
          }
        })
      }
    }
  })()

  baike.isPhoneNum = function (phone) {
    return /^1[34578]\d{9}$/.test(phone)
  }

  baike.getUrl = function (url) {
    // 1.28 主页链接未更改，兼容旧版 - start
    if (/\/search\.html/.test(url)) {
      return url.replace('/search.html', '/search_new.html')
    }
    // 1.28 主页链接未更改，兼容旧版 - end
    var tag = baike.query('adtag')
    url = baike.replaceParam('adtag', tag, url)
    // HR版返回HR版首页
    if (tag === 'tx.wx.hr') url = url.replace('/enter.html', '/enter_hr.html')
    return url
  }

  baike.isWeixin = function () {
    var reg = /MicroMessenger/i
    return reg.test(navigator.userAgent)
  }
  baike.isXcx = function () {
    return window.__wxjs_environment === 'miniprogram'
  }
  baike.isUCBrowser = function () {
    var re = /UCBrowser/ig
    return re.test(navigator.userAgent)
  }

  baike.isQQBrowser = function () {
    var re = /MQQBrowser/ig
    return re.test(navigator.userAgent) && !baike.isMobileQQ() && !baike.isWeixin()
  }

  baike.isAndroid = function () {
    var re = /Android/ig
    return re.test(navigator.userAgent)
  }

  baike.isIos = function () {
    var re = /iPhone|iPad/ig
    return re.test(navigator.userAgent)
  }

  baike.isMobileQQ = function () {
    var re = /\s+qq/ig
    return re.test(navigator.userAgent)
  }
  baike.getPlatform = function () {
    var ua = navigator.userAgent
    if (/micromessenger/i.test(ua)) {
      return 'wx'
    }
    if (/qq\//i.test(ua) || (/qq/i.test(ua) && !/qqbrowser/i.test(ua))) {
      return 'qq'
    }
    if (/qqbrowser/i.test(ua)) {
      return 'qqbrowser'
    }
    if (/ucbrowser/i.test(ua)) {
      return 'ucbrowser'
    }
    return ''
  }

  baike.getPageName = function (url) {
    if (!url) return ''
    var reg = /\/([_a-zA-Z0-9]+)\.html/gi
    var match = reg.exec(url)
    if (match && match.length > 1) {
      return match[1]
    }
    return ''
  }

  /**
   * 唤起登录页
   */
  baike.toLogin = function () {
    // 手机登录
    if (!baike.isLogin()) {
      baike.post('/mobile/check_login', {}, function (o) { })
    }
  }
  baike.isLogin = function () {
    return baike.getCookie('is_login')
  }
  baike.checkLogin = function () {
    if (baike.isLogin()) {
      window.location.href = baike.getCookie('from_uri') || '/'
    }
  }

  baike.loginWithWx = function () {
    var that = this
    var url = '/mobile/do_wx_login'
    var bkUri = window.location.href
    window.MtaH5 && MtaH5.clickStat('ydd_wxlogin_clk')
    baike.post(url, {
      bk_uri: bkUri,
      scope: 'snsapi_userinfo'
    }, function (o) {
      if (o.retcode === 0) {
        console.log(o)
      } else {
        that.error = o.retmsg
      }
    })
  }

  baike.getAdtag = function () {
    var adtag = baike.query('adtag') || (window.sessionStorage ? window.sessionStorage.getItem('bk_adtag') : false) || baike.getCookie('bk_adtag') || ''
    return adtag
  }

  baike.setAdtag = function () {
    var adtag = baike.query('adtag')
    if (!adtag) return
    if (window.sessionStorage) {
      window.sessionStorage.setItem('bk_adtag', adtag)
    } else {
      baike.setCookie('bk_adtag', adtag)
    }
  }

  baike.dropload = function (target, config) {
    var options = {
      scrollArea: window || config.scrollArea,
      domUp: config.domUp || {
        domClass: 'dropload-up-custom',
        domRefresh: '<div class="dropload-refresh"><img src="http://s.pc.qq.com/tdf/baike/dropload/FST_01.png" alt="" /></div>',
        domUpdate: '<div class="dropload-update"><img src="http://s.pc.qq.com/tdf/baike/dropload/FST_02.png" alt="" /></div>',
        domLoad: '<div class="dropload-load"> <img src="http://s.pc.qq.com/tdf/baike/dropload/loop.gif" alt="" /></div>'
      },
      distance: config.distance || 50,
      loadUpFn: function (droploadPlugin) {
        $('.dropload-up-custom').css('opacity', 1)
        if ($.isFunction(config.loadUpFn)) {
          config.loadUpFn(droploadPlugin)
          // 每次数据加载完，必须重置
          // droploadPlugin.resetload()
        }
      },
      pullingFun: function (progress) {
        $('.dropload-up-custom').css('opacity', progress * 0.3)
        if ($.isFunction(config.pullingFun)) {
          config.pullingFun(progress)
        }
      }
    }
    var dropload = $(target).dropload(options)
    return dropload
  }

  baike.pageConfig = [{
    'method': 'getHomeActiveData',
    'point': 3,
    'page': 'enter',
    'pageId': 1
  },
  {
    'method': 'init_search',
    'point': 3,
    'page': 'search',
    'pageId': 2
  },
  {
    'method': 'getOverviewBaseinfo',
    'point': 3,
    'page': 'overview',
    'pageId': 3
  },
  {
    'method': 'getDiseaseTabList',
    'point': 3,
    'page': 'ddetail',
    'pageId': 4
  },
  {
    'method': 'getEmergencyData',
    'point': 3,
    'page': 'emergency',
    'pageId': 5
  },
  {
    'method': 'init_article',
    'point': 3,
    'page': 'article',
    'pageId': 6
  },
  {
    'method': 'getAuthInfo',
    'point': 3,
    'page': 'authority',
    'pageId': 7
  },
  {
    'method': 'init_doctor',
    'point': 3,
    'page': 'doctor',
    'pageId': 8
  },
  {
    'method': 'getHospitalInfo',
    'point': 3,
    'page': 'hospital',
    'pageId': 9
  },
  {
    'method': 'getTopicData',
    'point': 3,
    'page': 'topic',
    'pageId': 10
  },
  {
    'method': 'init_favorite',
    'point': 3,
    'page': 'favorite',
    'pageId': 11
  },
  {
    'method': 'init_focus',
    'point': 3,
    'page': 'focus',
    'pageId': 12
  },
  {
    'method': 'init_searcher',
    'point': 3,
    'page': 'search_new',
    'pageId': 16
  },
  {
    'method': 'getDiseaseAskDocs',
    'point': 3,
    'page': 'qa_list',
    'pageId': 17
  },
  {
    'method': 'getDiseaseFeed',
    'point': 3,
    'page': 'card',
    'pageId': 18
  },
  {
    'method': 'getDiseaseKnowGraphInfo',
    'point': 3,
    'page': 'tag_article',
    'pageId': 19
  },
  {
    'method': 'init_doctor',
    'point': 3,
    'page': 'doctor_video',
    'pageId': 20
  },
  {
    'method': 'getOverviewBaseinfo',
    'point': 3,
    'page': 'card',
    'pageId': 21
  },
  {
    'method': 'init_my',
    'point': 3,
    'page': 'my',
    'pageId': 22
  },
  {
    'method': 'init_mydoctor',
    'point': 3,
    'page': 'mydoctor',
    'pageId': 23
  },
  {
    'method': 'init_building',
    'point': 3,
    'page': 'building',
    'pageId': 24
  },
  /*
   {
     'method': 'reportAction',
     'point': 3,
     'page': 'healthwise',
     'pageId': 25
   } */
  {
    'method': 'getCommonDiseaseDataV2',
    'point': 3,
    'page': 'publicConcern',
    'pageId': 26
  },
  {
    'method': 'getDiseaseHospitalInfo',
    'point': 3,
    'page': 'hospital_info',
    'pageId': 27
  },
  {
    'method': 'getDiseaseRecruitInfo',
    'point': 3,
    'page': 'recruit',
    'pageId': 28
  },
  {
    'method': 'getHomeContentData',
    'point': 3,
    'page': 'health',
    'pageId': 29
  }
  ]
  baike.ptagReport = function () { // mta上报，属性key为ptag，值为ptag|index
    $('body').off('tap').on('tap', function (e) {
      e = e || window.event
      if (e) {
        var targetNode = e.srcElement || e.target
        var ptag = ''
        var tourl = ''
        while (!tourl && targetNode && targetNode.nodeName !== 'BODY' && targetNode.getAttribute) {
          tourl = targetNode.getAttribute('tourl') || ''
          ptag = targetNode.getAttribute('ptag') || ''
          if (!tourl) {
            targetNode = targetNode.parentNode
          }
        }
        if (tourl) {
          baike.goToUrl(baike.replaceParam('ptag', ptag, tourl))
        } else {
          ptag = ''
          targetNode = e.srcElement || e.target
          while (!ptag && targetNode && targetNode.nodeName !== 'BODY' && targetNode.getAttribute) {
            ptag = targetNode.getAttribute('ptag') || ''
            if (!ptag) {
              targetNode = targetNode.parentNode
            }
          }
          baike.mtaReport(ptag)
        }
      }
    })
  }
  // 从ua获取系统&版本信息
  baike.getSysInfo = function () {
    var ua = navigator.userAgent
    var pattern = new RegExp('\\((.| )+?\\)', 'igm')
    var sysInfo = ua.match(pattern)[0]
    return sysInfo
  }
  function MtaH5Report (tags, ptag) {
    var hrtag = tags[1]
    if (ptag[1]) {
      window.MtaH5 && MtaH5.clickStat(ptag[0], {
        'value': ptag[1]
      })
    } else {
      window.MtaH5 && MtaH5.clickStat(ptag[0])
    }
    if (hrtag) {
      window.MtaH5 && MtaH5.clickStat(hrtag)
    }
  }
  function reportNotAllowed (ptag) {
    // 只需要上报mta，不需要上报action的event,加入下面黑名单
    var reportBlackList = ['main_smallbn_show', 'list_topbn_show', 'main_bn_show', 'emergency_topbn_show', 'content_endbn_show', 'cardwitha_topbc_show', 'detail_endbn_show']
    return reportBlackList.indexOf(ptag[0]) > -1
  }
  baike.sendPV = function (to, from) {
    var clickpoint = (baike.sstore.getItem('clickpoint') === '1')
    var event = clickpoint ? (to.query.ptag || '') : ''
    // mta 上报
    var tags = event.split(',')
    var ptag = tags[0].split(/\||:/)
    MtaH5Report(tags, ptag)
    if (reportNotAllowed(ptag)) return
    // 用户行为上报
    var referrer = !from.name ? document.referrer : `${location.origin}${from.fullPath}` // 刷新时refer取值
    var curUrl = `${location.origin}${to.fullPath}` || ''
    try {
      referrer = encodeURI(decodeURI(referrer))
      curUrl = encodeURI(decodeURI(curUrl))
    } catch (e) { }
    var reportActionData = {
      referer: referrer || '',
      current: (event ? referrer : curUrl) || '',
      next: curUrl || '',
      event: !from.name ? '' : ptag[0], // 刷新时from.name为null
      value: !from.name ? '' : ptag[1],
      platform: baike.getPlatform()
    }
    baike.post('/mobile/reportAction', reportActionData)
    clickpoint && baike.sstore.setItem('clickpoint', '', 5)
  }
  baike.mtaReport = function (event, actionData, isUrl) { // isUrl表示是否是url的ptag上报
    if (event === 'undefined') event = ''
    if (!event && !isUrl && !actionData) return
    if (event === 'pv') {
      window.MtaH5 && MtaH5.pgv()
      event = ''
    }
    // mta 上报
    var tags = event.split(',')
    var ptag = tags[0].split(/\||:/)
    MtaH5Report(tags, ptag)
    if (reportNotAllowed(ptag)) return
    // 用户行为上报
    var referrer = (document.referrer || '')
    var curUrl = (window.location.href || '')
    try {
      referrer = encodeURI(decodeURI(referrer))
      curUrl = encodeURI(decodeURI(curUrl))
    } catch (e) { }
    var reportActionData = {
      referer: referrer || '',
      current: (isUrl && event ? referrer : curUrl) || '',
      next: curUrl || '',
      event: (referrer === curUrl && isUrl ? '' : ptag[0]) || '',
      value: (referrer === curUrl && isUrl ? '' : ptag[1]) || '',
      platform: baike.getPlatform()
    }
    if (actionData) reportActionData = $.extend(reportActionData, actionData)
    baike.post('/mobile/reportAction', reportActionData)
  }

  baike.goToUrl = function (url, isReplace) {
    if (!url) return
    var ptag = baike.query('ptag', url)
    baike.sstore.removeItem('back_searchInput') // 跳转搜索，不使用缓存
    if (ptag) { // qq浏览器 ios |竖线分割，会导致post请求无法传递参数
      ptag = ptag.replace(/\|/g, ':')
      url = baike.replaceParam('ptag', ptag, url, true)
    }
    var miniprogram = baike.query('miniprogram') // 参数需要传递下去
    var from = baike.query('from')
    var wxmp = baike.query('wxmp') // 公众号来源  cancer表示肿瘤
    if (miniprogram) {
      url = baike.replaceParam('miniprogram', miniprogram, url, true)
    }
    url = baike.replaceParam('from', from, url)
    url = baike.replaceParam('wxmp', wxmp, url)
    var cururl = baike.getUrl(url)
    if (/^(https?:\/\/)(communitytest\.sparta\.html5\.qq\.com|tanyi\.qq\.com)/.test(cururl)) { // 跳转到谈医
      var token = baike.getCookie('bk_token')
      if (token) {
        baike.setCookie('bk_token', token, 10, '/', 'qq.com')
      }
      baike.setCookie('baike_tanyi_uri', location.href, 10, '/', 'qq.com')
    }
    // var page = (cururl.match(/(\w+)\.html(\?|$)/) && cururl.match(/(\w+)\.html(\?|$)/)[1]) // 加入\D防止匹配到测试环境html5域名部分
    // var params = (cururl.split('?')[1]) || ''
    // var targetUrl = ''
    // if (params.indexOf('#') > -1) {
    //   var hash = params.split('#')[1]
    //   params = params.split('#')[0]
    // }
    // if (params) {
    //   var paramsArr = params.split('&')
    //   var temParams = []
    //   for (var i = 0; i < paramsArr.length; i++) {
    //     var key = paramsArr[i].split('=')[0]
    //     var val = encodeURIComponent(paramsArr[i].split('=')[1])
    //     temParams.push(key + '=' + val)
    //   }
    //   params = temParams.join('&')
    //   targetUrl = `/pages/${page}/${page}?${params}&from=miniprogram`
    // } else {
    //   targetUrl = `/pages/${page}/${page}?from=miniprogram`
    // }
    // if (hash) {
    //   targetUrl += '#' + hash
    // }
    // if (page && window.__wxjs_environment === 'miniprogram') {
    //   if (params || page == 'search_new' || hashChange) {
    //     wx.miniProgram.navigateTo({url: targetUrl})
    //   } else {
    //     wx.miniProgram.redirectTo({url: targetUrl})
    //   }
    // } else {
    if (baike.sstore) {
      baike.sstore.setItem('clickpoint', '1', 5) // clickpoint 表示页面跳转，到另外一个页面，是否上报点击。防止用户刷新而导致重复上报点击
    }
    // 配的url有的带域名，去掉域名h5.baike.qq.com,非医典域名直接跳转刷新
    var hasBaikeHost = /(.+baike.*\.qq\.com)/.test(cururl)
    if (hasBaikeHost) {
      cururl = cururl.replace(/(.+baike.*\.qq\.com)/, '')
    } else if (!hasBaikeHost && !/^\/mobile/.test(cururl)) {
      location.href = cururl
      return
    }
    // if (baike.isXcx()) {
    //   if (isReplace) {
    //     location.replace(cururl)
    //   } else {
    //     location.href = cururl
    //   }
    //   return
    // }
    if (isReplace) {
      // spa用router
      window.router.replace({
        path: cururl
      })
      return
    }
    // spa用router
    window.router.push({
      path: cururl
    })
  }
  // 节流
  baike.throttle = function (method, context, delay, opt) {
    opt = opt || {}
    var firstDo = opt.firstDo
    var param = opt.param
    if (firstDo) {
      if (method.tId) {
        clearTimeout(method.tId)
        method.tId = setTimeout(function () {
          method.tId = 0
          method.call(context, param)
        }, delay)
      } else { // 第一次，立即执行
        method.tId = 1
        method.call(context, param)
      }
    } else {
      clearTimeout(method.tId)
      method.tId = setTimeout(function () {
        method.call(context, param)
      }, delay)
    }
  }

  baike.getOverview = function (opt) { // isCgi是表示需要请求接口  name type
    var name = opt.name
    var type = opt.type
    var released = opt.released
    var getUrl = function (name, type, released) {
      var url = ''
      if (parseInt(released) === 0) {
        return '/mobile/building.html?name=' + name
      }
      type = parseInt(type)
      if ((name === '肺癌' || name === '乳腺癌') && type === 4 && baike.isToCard && baike.getPageName(location.href) !== 'home_cancer') {
        url = '/mobile/cancer.html?name=' + name
      } else if (name === '哮喘' || name === '腰椎间盘突出症') {
        var adtag = baike.query('adtag')
        url = '/mobile/card.html?name=' + name + '&mode=2' // 直接去C'版
        if (adtag) url += '&adtag=' + adtag
      } else {
        switch (type) {
          case 1:
            url = '/mobile/overview.html?name=' + name
            break
          case 2:
            url = '/mobile/overview_m.html?name=' + name
            break
          case 3:
            url = '/mobile/overview_zz.html?name=' + name
            break
          case 4:
            url = '/mobile/overview_zl.html?name=' + name + '&noredirect=1'
            break
          case 5:
            url = '/mobile/cancer.html?name=' + name
            break
          default:
            url = '/mobile/overview_pt.html?name=' + name
            break
        }
      }
      return url
    }
    if (!opt.cb) { // 有回调，证明需要调接口
      return getUrl(name, type, released)
    }
    // 需要请求cgi
    baike.post('/mobile/getDiseaseType', {
      disease: name
    }, function (o) {
      opt.cb(getUrl(name, o.type))
    })
  }
  // 统一返回方法、获取首页链接
  baike.getIndexUrl = function () {
    var url = '/mobile/home.html'
    if (baike.isXcx()) {
      var miniprogram = baike.query('miniprogram')
      if (miniprogram === 'xcx_cancer') url = '/mobile/home_cancer.html?miniprogram=xcx_cancer'
    }
    var wxmp = baike.query('wxmp')
    if (wxmp === 'cancer') {
      url = '/mobile/home_cancer.html?wxmp=cancer'
    }
    return url
  }
  baike.goBack = function (backUrl) {
    if (baike.query('adtag') === 'tx.qq.qqyd.yety') {
      baike.mtaReport('YDD_Hongbao_articleBack_clk')
    }
    // if (baike.getPageName(location.href) === 'tag_article') {
    //   baike.sstore.setItem('backurl', '', 60)
    // }
    if (window.history.length > 1) {
      // if (backUrl) {
      //   baike.goToUrl(backUrl, true)
      //   // window.location.replace(backUrl)
      //   return
      // }
      window.history.back()
    } else {
      baike.goToUrl(backUrl || baike.getIndexUrl())
    }
  }

  // 根据tid获取模板
  baike.resolveTpl = function (tpl) {
    if ($.isArray(tpl)) {
      return tpl.reduce((result, item) => {
        result.push(item[`tid${item.tid}`] || item)
        return result
      }, [])
    }
    return tpl[`tid${tpl.tid}`] || tpl
  }

  baike.redirectUrl = function (opt) { // 页面进入时，需要在没有打开之前，跳转到其他页面
    var pageName = opt.name
    var url = ''
    var name = ''
    var hash = ''
    var eid = ''
    switch (pageName) {
      case 'ddetail': // 肿瘤篇卡片页，没有综述详情页
        name = opt.query['name']
        if (name === '乳腺癌') {
          hash = window.location.hash.replace('#', '')
          eid = {
            'zhengzhuang': '180416192010-00008-00-0003',
            'bingyin': '180416192010-00008-00-0001',
            'jiuyi': '180416192010-00008-00-0002',
            'zhiliao': '180416192010-00008-00-0006',
            'richang': '180416192010-00008-00-0007',
            'yufang': '180416192010-00008-00-0009'
          }
          hash = eid[hash]
          url = '/mobile/overview_zl.html?noredirect=1&name=' + name + (hash ? '#' + hash : '')
        }
        break
      case 'overview':
      case 'overview_pt':
        name = opt.query['name']
        if (name === '哮喘' || name === '腰椎间盘突出症') {
          url = baike.getOverview({
            name: name
          })
        }
        break
      case 'overview_zl':
        name = opt.query['name']
        if (name === '肺癌' || name === '乳腺癌') {
          hash = window.location.hash.replace('#', '')
          eid = {
            '180613162333-00070-00-000303': '180614151925-00070-00-000000',
            '180613162333-00070-00-000200': '180614151925-00070-00-000002',
            '180613162333-00070-00-000305': '180614151925-00070-00-000001',
            '180613162333-00070-00-0005': '180614151925-00070-00-000100',
            '180613162333-00070-00-0006': '180614151925-00070-00-000102',
            '180613162333-00070-00-000202': '180614151925-00070-00-000002',
            '180416192010-00008-00-0003': '180622191644-00008-00-000201',
            '180416192010-00008-00-0001': '180622191644-00008-00-000301',
            '180416192010-00008-00-0002': '180622191644-00008-00-000103',
            '180416192010-00008-00-0006': '180622191644-00008-00-000100',
            '180416192010-00008-00-0007': '180622191644-00008-00-000102',
            '180416192010-00008-00-0009': '180622191644-00008-00-000301'
          }
          hash = eid[hash]
          if (baike.isToCard && opt.query['noredirect'] !== '1') {
            url = '/mobile/cancer.html?name=' + name + '#' + hash
          }
        }
        break
      case 'doctor':
        var doctorId = opt.query['doctor_id']
        if (doctorId === '10474') {
          url = '/mobile/patient.html?patient_id=' + doctorId
        }
        break
    }
    if (url) {
      var ptag = opt.query['ptag']
      if (ptag) url = baike.replaceParam('ptag', ptag, url)
      baike.goToUrl(url, true)
    }
  }
  function userLogInit () {
    setTimeout(() => {
      $('body').append('<div class="debug-info"><div class="log-content"></div><p><div class="btn-log-get">获取日志</div><div class="btn-log-clear">清空日志</div><div class="btn-log-send">发送日志</div></p></div>')
    }, 1000)
    $('body').on('click', '.btn-log-get', function () {
      var log = JSON.parse(window.sessionStorage.getItem('log'))
      for (var i = 0; i < log.length; i++) {
        $('.log-content').append(JSON.stringify(log[i]) + '<br/>')
      }
    })
    $('body').on('click', '.btn-log-send', function () {
      var log = window.sessionStorage.getItem('log')
      var data = {
        event: 'user_send_log',
        value: log
      }
      baike.post('/mobile/reportAction', data)
    })
    $('body').on('click', '.btn-log-clear', function () {
      $('.log-content').html('')
      // window.sessionStorage.setItem('log', '')
    })
  }

  var Store = function (storage) {
    this.storage = storage
  }

  Store.prototype.setItem = function (name, val, expires) {
    try {
      var storage = this.storage
      if (!storage || !$.isFunction(storage.setItem) || !$.isNumeric(expires)) return
      expires = expires || (24 * 60)
      expires = new Date(Date.now() + (expires * 60 * 1000))
      var item = {
        val: val,
        expires: expires
      }
      storage.setItem(name, JSON.stringify(item))
    } catch (e) { }
  }

  Store.prototype.removeItem = function (name) {
    try {
      var storage = this.storage
      if (!storage || !$.isFunction(storage.removeItem)) return
      storage.removeItem(name)
    } catch (e) { }
  }

  Store.prototype.getItem = function (name) {
    try {
      var storage = this.storage
      if (!storage || !$.isFunction(storage.getItem)) return null
      var item = storage.getItem(name)
      if (!item) return null
      item = JSON.parse(item)
      var expires = new Date(item.expires)
      if (expires < Date.now()) {
        storage.removeItem(name)
        return null
      }
      return item.val
    } catch (e) {
      return null
    }
  }

  Store.prototype.clearOverdue = function () {
    try {
      var storage = this.storage
      if (!storage || !$.isFunction(storage.removeItem)) return
      $.each(storage, function (name, item) {
        if (!item || !(typeof item === 'string' && item.indexOf('expires') !== -1)) return
        item = JSON.parse(item)
        if (item.expires === undefined) return
        var expires = new Date(item.expires)
        if (expires < Date.now()) {
          storage.removeItem(name)
        }
      })
    } catch (e) { }
  }

  try {
    baike.lstore = new Store(window.localStorage)
    baike.sstore = new Store(window.sessionStorage)
    baike.setAdtag()
    baike.ptagReport()
    if (baike.query('debug') === 'debug') {
      userLogInit()
    }

    // 外网肺癌的卡片版和目录树具备ABtest能力
    // var cookieKey = 'overview_card_cancer_ABC'
    // var cookieVal = baike.getCookie(cookieKey)
    // if (!(cookieVal > 0 && cookieVal < 1)) {
    //   cookieVal = Math.random()
    // }
    // baike.setCookie(cookieKey, cookieVal, 43200) // 14天
    // if (cookieVal > 0.333333) {
    //   baike.isToCard = true
    // }
    baike.isToCard = true
  } catch (e) { }
  if (window.addEventListener) {
    window.addEventListener(event, recalc, false)
    window.addEventListener('DOMContentLoaded', function () {
      recalc()
      baike.lstore.clearOverdue()
      baike.sstore.clearOverdue()
      baike.setShare && baike.setShare()
      baike.getPlatform() === 'wx' && baike.get('/mobile/get_wx_config', {
        url: location.href.split('#')[0]
      }, function (o) {
        window['wx'] && window['wx'].config({
          appId: o.appId || o.appid || '',
          timestamp: o.timestamp,
          nonceStr: o.nonceStr || o.noncestr,
          signature: o.signature,
          jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'onVoicePlayEnd',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard'
          ]
        })
      })
    }, false)
    window.onload = function () {
      window.Raven && Raven.setUserContext({
        login_type: baike.getCookie('is_login')
      })
      if (baike.isXcx()) {
        $('body').addClass('miniprogram')
        // setTimeout(() => {
        //   wx.miniProgram.postMessage({
        //     data: document.title
        //   })
        // }, 1000)
      }
      if (!baike.isXcx() && baike.isWeixin() && !baike.isLogin()) {
        baike.loginWithWx()
      }
    }
  }
})(document, window)

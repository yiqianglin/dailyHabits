'use strict';
 /* global Image, _user, _mtimerc */
/**
 * @author helvinliao
 * @date 20180416
 * @fileoverview 性能上报
 */
(function () {
  var MED_START = (new Date()).valueOf()
  function MakeRequest (delay) {
    this._elem = document.getElementsByName('MTIMER')  

    // this._start = window.performance.timing.navigationStart || 0
    this._config = {
      conf: {
        proj: '',
        mode: 'common',
        urltype: '',
        env: 'production',
        count: null
      },
      user: {
        user_id: ''
      },
      version: '1.0.0'
    }

    if (this._elem.length === 0) {
      for (var r = document.getElementsByTagName('script'), p = 0; p < r.length; p++) {
        if (typeof r[p].attributes.name !== 'undefined' && r[p].attributes.name.nodeValue === 'MTIMER') {
          this._elem = []
          this._elem.push(r[p])
          break
        }
      }
    }
    if (this._elem.length > 0) {
      (function () {
        typeof this._elem[0].attributes.proj !== 'undefined' && (this._config.conf.proj = this._elem[0].attributes.proj.nodeValue)
        typeof this._elem[0].attributes.mode !== 'undefined' && (this._config.conf.mode = this._elem[0].attributes.mode.nodeValue)
        typeof this._elem[0].attributes.urltype !== 'undefined' && (this._config.conf.urltype = this._elem[0].attributes.urltype.nodeValue)
        typeof this._elem[0].attributes.env !== 'undefined' && (this._config.conf.env = this._elem[0].attributes.env.nodeValue)
        typeof this._elem[0].attributes.count !== 'undefined' && (this._config.conf.count = this._elem[0].attributes.count.nodeValue)
      }.apply(this))
    }
    typeof _mtimerc === 'object' && (function () {
      for (var b in _mtimerc) {
        if (b === 'ignoreParams') {
          if (typeof _mtimerc[b] === 'string' && /\w(,?)\w+/.test(_mtimerc[b])) {
            var p = _mtimerc[b].split(',')
            _mtimerc.hasOwnProperty(b) && (this._config.conf[b] = p)
          }
        } else {
          _mtimerc.hasOwnProperty(b) && (this._config.conf[b] = _mtimerc[b])
        }
      }
    }.apply(this))
    typeof _user === 'object' && (function () {
      for (var b in _user) this._config.user.hasOwnProperty(b) && (this._config.user[b] = _user[b])
    }())
    this._config.conf.user = this._config.user
    this._config.conf.version = this._config.version
   // return this._config
  }

  MakeRequest.prototype = {
    constructor: MakeRequest,
    timer: null,
    _sendRequest: function (opt) {
      if (this._config.conf.proj) {
        var queryStr = this._formQueryStr(opt)
        var furl = '//baike.qq.com/common/reporter/time?' + queryStr
        if (this._config.conf.env !== 'production' || /sparta\.html5\.qq\.com$/.test(window.location.host)) {
          furl = '//common.sparta.html5.qq.com/reporter/time?' + queryStr
        }
        var r = new Image()
        r.src = furl
      }
    },
    _formQueryStr: function (opt) {
      var optArr = []
      var optStr = ''
      if (typeof opt === 'object') {
        for (var i in opt) {
          optArr.push(i + '=' + opt[i])
        }
      }
      if (optArr.length) {
        optStr = '&' + optArr.join('&')
      }
      return optStr
    }
  }

  function EventTarget () {
    this.handlers = {}
  }

  EventTarget.prototype = {

    constructor: EventTarget,
    addHandler: function (type, handler) {
      if (typeof this.handlers[type] === 'undefined') {
        this.handlers[type] = []
      }
      this.handlers[type].push(handler)
    },

    fire: function (event) {
      if (!event.target) {
        event.target = this
      }

      if (this.handlers[event.type] instanceof Array) {
        var handlers = this.handlers[event.type]
        for (var i = 0, len = handlers.length; i < len; i++) {
          handlers[i](event)
        }
      }
    },

    removeHandler: function (type, handler) {
      if (this.handlers[type] instanceof Array) {
        var handlers = this.handlers[type]

        for (var i = 0, len = handlers.length; i < len; i++) {
          if (handlers[i] === handler) {
            break
          }
        }

        handlers.splice(i, 1)
      }
    }

  }
  var mk = new MakeRequest()

  var eventObj = new EventTarget()

  function debounce (fn, delay) {
    var timer

    return function () {
      var context = this
      var args = arguments

      clearTimeout(timer)

      timer = setTimeout(function () {
        fn.apply(context, args)
      }, delay)
    }
  }

  function replaceUrl (str) {
    if (str) {
      str = str.replace(/</g, '&lt;')
      str = str.replace(/>/g, '&gt;')
      str = str.replace(/\n/g, '<br/>')
      str = encodeURIComponent(str)
    }
    return str
  }
  function MedTimer (config) {
    var defaultOptions = {
      mode: 'common',
      proj: '',
      urltype: '',
      env: 'production',
      count: null
    }
    var _this = this
    this.mk = mk
    this.reportCount = 0
    if (config.proj === '' || !config.proj) {
      return
    }
    if (config['mode'] !== 'smart') {
      _this.reportHandler = function () {
        if (config['mode'] === 'static') {
          if (_this.reportParams['action'] === 'onLoadEvent') {
            _this.mk._sendRequest(_this.reportParams)
           // eventObj.removeHandler('report', _this.reportHandler)
          }
        } else if (config['mode'] === 'common' || config['mode'] === '' || !config['mode']) {
          if (_this.reportParams['action'] !== 'onLoadEvent') {
            _this.mk._sendRequest(_this.reportParams)
           // eventObj.removeHandler('report', _this.reportHandler)
          }
        }
      }
    } else if (config['mode'] === 'smart') {
      if (!_this.count) {
        _this.reportHandler = debounce(function () {
          _this.mk._sendRequest(_this.reportParams)
        }, 5000)
      } else if (_this.count) {
        _this.reportHandler = function () {
          if (+_this.reportCount >= (+_this.count + 1)) {
            _this.mk._sendRequest(_this.reportParams)
          }
        }
      }
    }
    eventObj.addHandler('report', this.reportHandler)
    for (var i in defaultOptions) {
      if (defaultOptions.hasOwnProperty(i)) {
        _this[i] = config[i] || defaultOptions[i]
      }
    }

    _this.init()
  }

  MedTimer.prototype = {
    constructor: MedTimer,
    init: function () {
      var self = this
      var perf = window.performance || window.webkitPerformance || null
      var uri = window.location.protocol + '//' + window.location.host + window.location.pathname
      if (self.urltype === 'full') {
        uri = window.location.href
      }
      self.uri = uri
      if (self.mode !== 'common' && perf) {
        var timing = perf.timing
        // var navi = perf.navigation
        var timer = setInterval(function () {
          if (timing.loadEventEnd !== 0) {
            clearInterval(timer)
            var data = {
              proj: self.proj,
              // ua: window.navigator.userAgent,
              // firstimagetime: 0,
              // isdirty: 0,
              env: self.env,
              uri: self.uri,
              ispage: 1,
              action: 'onLoadEvent',
              time: timing.loadEventEnd - timing.navigationStart,
              starttime: timing.navigationStart,
              endtime: timing.loadEventEnd
            }
            self.reportTime(data)
          }
        }, 100)
      }
    },
    reportTime: function (params) {
      var _params = params
      var perf = window.performance || window.webkitPerformance || null
      // var mk = this.mk
      if (!_params.proj) {
        _params.proj = this.proj
      }
      if (!_params.env) {
        _params.env = this.env
      }
      if (!_params.uri) {
        _params.uri = this.uri
      }
      if (!_params.ispage) {
        _params.ispage = ''
      }
      _params.uri = replaceUrl(_params.uri)

      if (!_params.starttime) {
        _params.starttime = ((perf && perf.timing.navigationStart) ? perf.timing.navigationStart : null) || window.MED_START_TIME || MED_START || (new Date()).valueOf() || 0
      }
      if (!_params.endtime) {
        _params.endtime = (new Date()).valueOf()
      }
      if (!_params.time) {
        _params.time = _params.endtime - (_params.starttime || 0)
      }
      if (!_params.action) {
        _params.action = 'noActionDefine'
      }
      this.reportParams = _params
      if (+_params.ispage === 1) {
        this.reportCount ++
      }
      console.log(this.reportCount)
      eventObj.fire({type: 'report'})
      // mk._sendRequest(_params)
    }
  }
  var medTimer = new MedTimer(mk._config.conf)

  if (typeof module !== 'undefined' && typeof exports === 'object') {
    module.exports = medTimer
  } else {
    window.medTimer = medTimer
  }
})()

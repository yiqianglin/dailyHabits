/* global baike */
function _pageLoad () { // 滚动加载数据
  var data = {}
  var timeout = {}
  var curKey = ''
  return function (opt, params) { // offset  偏移   count 拉取数目  totalKey后台返回的总数目 shift上拉数据前置
    var key = opt.key + baike.query('VNK')
    var pageData = {
      page: 1,
      offset: 0, // 有些业务 pagesize是变化的
      loaded: false,
      loading: false,
      list: [],
      diseasetag: [],
      extraData: {}
    }
    curKey = key
    // 设置可以在初次加载时，从外部设置启始的offset和page的值
    pageData.offset = typeof opt.offsetNum !== 'undefined' ? opt.offsetNum : pageData.offset
    pageData.page = typeof opt.page !== 'undefined' ? opt.page : pageData.page

    if (opt.clear) {
      data[key] = pageData
    } else {
      if (data[key]) {
        pageData = data[key]
      } else {
        data[key] = pageData
      }
    }
    pageData.loaded = typeof opt.loaded !== 'undefined' ? opt.loaded : pageData.loaded
    pageData.diseasetag = [] // diseasetag ???

    if (opt.isSwitch && pageData.page > 1) {
      opt.cb(pageData)
      return
    }
    if (pageData.loading || pageData.loaded) {
      return
    }
    pageData.loading = true
    if (timeout[key]) {
      clearTimeout(timeout[key])
    }
    timeout[key] = setTimeout(function () {
      pageData.loading = false
    }, 500)
    var pageSize = opt.pageSize || 10
    var page = pageData.page
    params = params || {}
    params[opt.offset || 'offset'] = pageData.offset
    params[opt.count || 'count'] = pageSize
    baike.post(opt.url, params, function (json) {
      pageData.extraData = json
      pageData.loading = false
      clearTimeout(timeout[key])
      if (page === pageData.page) {
        if (json.retcode === 0) {
          pageData.page++
          var list = json[opt.retKey || 'list']
          pageData.diseasetag = json['diseasetag']
          if (list && list.length > 0) {
            pageData.offset += pageSize
            pageData.list = opt.shift ? list.concat(pageData.list) : pageData.list.concat(list)
            if (list.length < pageSize) {
              pageData.loaded = true
            }
          } else {
            pageData.loaded = true
          }
          if (pageData.offset >= json[opt.totalKey || 'count']) {
            pageData.loaded = true
          }
          if (json.tailflag === 0 || json.tailflag === 1) {
            pageData.loaded = json.tailflag
          }
        }
        if (curKey === key) {
          opt.cb(pageData)
        }
      }
    })
  }
}
function _pageLoadNew () { // 滚动加载数据
  return {
    timeout: {},
    curKey: '',
    init () {
      this.cache = Object.create(null)
    },
    getData (opt, params) { // offset  偏移   count 拉取数目  totalKey后台返回的总数目 shift上拉数据前置
      var that = this
      var key = opt.key
      var pageData = {
        page: 1,
        offset: 0, // 有些业务 pagesize是变化的
        loaded: false,
        loading: false,
        list: [],
        diseasetag: [],
        extraData: {}
      }
      that.curKey = key
      // 设置可以在初次加载时，从外部设置启始的offset和page的值
      pageData.offset = typeof opt.offsetNum !== 'undefined' ? opt.offsetNum : pageData.offset
      pageData.page = typeof opt.page !== 'undefined' ? opt.page : pageData.page

      if (opt.clear) {
        this.cache[key] = pageData
      } else {
        if (this.cache[key]) {
          pageData = this.cache[key]
        } else {
          this.cache[key] = pageData
        }
      }
      pageData.loaded = typeof opt.loaded !== 'undefined' ? opt.loaded : pageData.loaded
      if (opt.isSwitch && pageData.page > 1) {
        opt.cb(pageData)
        return
      }
      if (pageData.loading || pageData.loaded) {
        return
      }
      pageData.loading = true
      if (that.timeout[key]) {
        clearTimeout(that.timeout[key])
      }
      that.timeout[key] = setTimeout(function () {
        pageData.loading = false
      }, 500)
      var pageSize = opt.pageSize || 10
      var page = pageData.page
      params = params || {}
      params[opt.offset || 'offset'] = pageData.offset
      params[opt.count || 'count'] = pageSize
      baike.post(opt.url, params, function (json) {
        pageData.extraData = json
        pageData.loading = false
        clearTimeout(that.timeout[key])
        if (page === pageData.page) {
          if (json.retcode === 0) {
            pageData.page++
            var list = json[opt.retKey || 'list']
            pageData.diseasetag = json['diseasetag']
            if (list && list.length > 0) {
              pageData.offset += pageSize
              pageData.list = opt.shift ? list.concat(pageData.list) : pageData.list.concat(list)
              if (list.length < pageSize) {
                pageData.loaded = true
              }
            } else {
              pageData.loaded = true
            }
            if (pageData.offset >= json[opt.totalKey || 'count']) {
              pageData.loaded = true
            }
            if (json.tailflag === 0 || json.tailflag === 1) {
              pageData.loaded = json.tailflag
            }
          }
          if (that.curKey === key) {
            opt.cb(pageData)
          }
        }
      })
    }
  }
}
function _lockedReq () { // 请求需要锁定
  var timeout = {}
  var reqLocked = {}
  return function (opt, params) { // opt包含 key,url,callback, sendReport, errcallback,method
    if (opt) {
      var key = opt.key || opt.url // 如果有传，就用传入的，没有使用url区分
      if (reqLocked[key]) return
      reqLocked[key] = true
      timeout[key] = setTimeout(function () {
        reqLocked[key] = false
      }, 500)
      var cb = opt.callback
      opt.callback = function (json) {
        clearTimeout(timeout[key])
        reqLocked[key] = false
        cb && cb(json)
      }
      baike[opt.method || 'get'](opt.url, params, opt.callback, opt.sendReport, opt.errcallback)
    }
  }
}

export const pageLoad = _pageLoad()
export const pageLoadNew = _pageLoadNew()
export const lockedReq = _lockedReq()

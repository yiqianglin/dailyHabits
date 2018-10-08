/* global $, baike */
import { MemorizerGroup } from 'src/js/memoryLoader'

const memorizerIDGenerator = (method, url, options) => {
  return `${method}_${url}}`
}

const store = new MemorizerGroup(memorizerIDGenerator)

// 以页面 + 接口名 + 接口参数作为加载器id
const defaultIDGenerator = (url = '', options = {}, params = {}) => {
  var page = baike.getPageName(window.location.href)
  return `${page}_${url}_${JSON.stringify(params)}`
}

class LoadError extends Error {
  constructor (code, message) {
    super()
    // 错误码
    this.code = code
    // 错误消息
    this.message = message
    this.stack = (new Error()).stack
    this.name = this.constructor.name
  }
}

// 一个具有唯一标识的加载器
class Loader {
  constructor (id = '', url = '', options = {}, params) {
    // 加载器的唯一标识
    this.id = id
    // 请求url
    this.url = url
    // 请求参数
    this.params = params
    // 配置项
    this.options = {
      // 请求参数中offset对应的字段名
      offsetKey: options.offsetKey || 'offset',
      // 请求参数中count对应的字段名
      countKey: options.countKey || 'count',
      // 响应中数据列表对应的字段名
      listKey: options.listKey || 'list',
      // 响应中数据总数对应的字段名
      totalKey: options.totalKey || 'count',
      // 请求参数中加载位置offset对应的初始值
      offset: options.offset || 0,
      // 请求参数中加载数量count对应的初始值
      count: options.count || 10,
      // 是否自动根据tid提取相应的模板
      getTpl: options.getTpl || false,
      // 是否从列表头部加入数据,如feed流下拉刷新
      shift: options.shift || false,
      // 重置loader的标志
      resetSignal: options.resetSignal || baike.query('VNK')
    }
    // 是否全部数据加载完成
    this.loaded = false
    // 是否加载中
    this.loading = false
    // 数据列表
    this.list = []
    // 上一次加载的响应
    this.response = null
  }

  // 重置loader
  reset (options) {
    // 请求参数中加载位置offset对应的初始值
    this.options.offset = options.offset || 0
    // 请求参数中加载数量count对应的初始值
    this.options.count = options.count || 10
    // 重置loader的标志
    this.options.resetSignal = options.resetSignal || baike.query('VNK')
    // 是否全部数据加载完成
    this.loaded = false
    // 是否加载中
    this.loading = false
    // 数据列表
    this.list = []
    // 上一次加载的响应
    this.response = null
  }

  /**
   * 加载数据
   *
   * @param {*} [options={}] 配置项
   * @param {*} params 请求参数
   * @param {*} beforeHook 加载前钩子，返回布尔值
   * @returns 加载完成标记、数据列表以及完整的响应数据
   * @memberof Loader
   */
  load (options = {}, params, beforeHook) {
    // 请求路径、参数未定义
    if (!this.url) {
      return Promise.reject(new LoadError(100, '请求路径未定义'))
    }
    if (!this.params && !params) {
      return Promise.reject(new LoadError(101, '请求参数未定义'))
    }
    // 如果标志改变则重置loader
    if (options.resetSignal && this.options.resetSignal && this.options.resetSignal !== options.resetSignal) {
      this.reset(options)
    }
    // 加载前钩子，返回布尔值
    // 返回false则直接返回已有数据（如tab切换）
    // 返回true则继续加载，同时可以改变options参数（用于不额外存储list，但需要根据list动态变化的地方，如首次加载与后续加载数量不同）
    if ($.isFunction(beforeHook) && !beforeHook(this, options)) {
      return Promise.resolve({ loaded: this.loaded, list: this.list, response: this.response })
    }
    // 允许动态改变的配置项：shift、count
    options = $.extend({}, this.options, {
      shift: options.shift,
      count: options.count
    })
    var { offset, count, offsetKey, countKey, listKey, totalKey, getTpl, shift } = { ...options }
    // 合并offset、count至请求参数
    params = $.extend({}, this.params, {
      [offsetKey]: offset,
      [countKey]: count
    })
    // 全部数据加载完成直接返回，如拒绝滚动上拉导致的重复请求
    if (this.loaded) {
      return Promise.reject(new LoadError(200, '无需继续发送请求，全部数据加载完成'))
    }
    // 重复请求直接返回，如拒绝滚动上拉导致的重复请求
    if (this.loading) {
      return Promise.reject(new LoadError(201, '无需继续发送请求，数据加载中'))
    }
    // 设为加载中，防止重复发送请求
    this.loading = true
    // 数据列表标识异常
    if (!listKey) {
      return Promise.reject(new LoadError(102, '数据列表标识未定义'))
    }
    return store.load('post', this.url, {}, params)
      .then(({ data: o }) => {
        // 本次加载完成
        this.loading = false
        // 接口返回异常
        if (!o || o.retcode !== 0) {
          return Promise.reject(new LoadError(300, '接口返回异常，' + (o && o.message) || '无法获取响应'))
        }
        if (!o[listKey]) {
          return Promise.reject(new LoadError(301, '接口返回异常，无法获取数据列表'))
        }
        // 记录响应
        this.response = o
        // 根据配置的字段名获取响应的数据列表、总数
        var result = o[listKey]
        var total = o[totalKey]
        // 自动根据tid提取相应的模板
        if (getTpl) {
          result = baike.resolveTpl(result)
        }
        // 更新数据列表list以及记录加载位置offset
        if (result.length) {
          this.list = shift ? result.concat(this.list) : this.list.concat(result)
          this.options.offset += count
        }
        // 如果结束标记为0或结束标记为1，则使用结束标记判断全部数据加载是否完成
        // 否则根据返回数据长度、加载数量、加载位置、总数来判断
        this.loaded = (o.tailflag === 0 || o.tailflag === 1) ? !!o.tailflag : (!result.length || result.length < count || this.list.length >= total || this.options.offset >= total)
        // 返回加载完成标记、数据列表以及完整的响应数据
        return Promise.resolve({ loaded: this.loaded, list: this.list, response: this.response })
      }, error => {
        return Promise.reject(error)
      })
  }
}

// 一组以id区分的加载器
class LoaderGroup {
  constructor (idGenerator) {
    this.loaders = {}
    this.idGenerator = $.isFunction(idGenerator) ? idGenerator : defaultIDGenerator
  }

  /**
   *
   * 加载数据
   * @param {string} [url=''] 请求url
   * @param {obejct} [options={}] 加载器配置项（可以包括offset和count）
   * @param {obejct} [params={}] 请求参数（不包括offset和count）
   * @param {function} beforeHook 加载前钩子
   * @returns
   * @memberof LoaderGroup
   */
  load (url = '', options = {}, params, beforeHook) {
    // 请求路径、参数未定义
    if (!url) {
      return Promise.reject(new LoadError(100, '请求路径未定义'))
    }
    if (!params) {
      return Promise.reject(new LoadError(101, '请求参数未定义'))
    }
    var loader = this.getLoader(url, options, params)
    return loader.load(options, params, beforeHook)
  }

  // 获取唯一的加载器，配置项（可以包括offset和count）+接口参数（不包括offset和count）
  getLoader (url = '', options = {}, params = {}) {
    if (!url) {
      return null
    }
    var defaultLoaderID = this.idGenerator(url, options, params)
    var loaderID = options.loaderID || defaultLoaderID
    // 根据id获取加载器，没有则新建一个
    if (!this.loaders[loaderID]) {
      this.loaders[loaderID] = new Loader(loaderID, url, options, params)
    }
    return this.loaders[loaderID]
  }

  // 根据id获取加载器
  getLoaderByID (id) {
    return this.loaders[id]
  }
}

// 使用默认id生成器
const pageLoader = new LoaderGroup()

// 允许使用自定义的加载器
export { Loader, LoaderGroup }
// 默认使用的加载器
export default pageLoader

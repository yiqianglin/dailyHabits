/* global $, baike */

// 以页面 + 请求方法 + 接口名作为存储加载器id
const defaultIDGenerator = (method = 'post', url = '') => {
  var page = baike.getPageName(window.location.href)
  return `${page}_${method}_${url}}`
}

// 以参数作为数据仓库里数据的id
const defaultKeyGenerator = (params = {}) => {
  return `${JSON.stringify(params)}`
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

// 一个具有唯一标识的存储加载器
class Memorizer {
  constructor (id = '', method = 'post', url = '', options = {}) {
    // 存储加载器的唯一标识
    this.id = id
    // 请求url
    this.method = method
    // 请求url
    this.url = url
    // 配置项
    this.options = {
      // 响应中要存入仓库的数据对应的字段名，否则存储整个响应
      dataKey: options.dataKey || '',
      // 数据仓库里数据的唯一标识生成器
      keyGenerator: $.isFunction(options.keyGenerator) ? options.keyGenerator : defaultKeyGenerator
    }
    // 数据仓库
    this.store = {}
  }

  load (params, update = false) {
    // 请求路径、参数未定义
    if (!this.url) {
      return Promise.reject(new LoadError(100, '请求路径未定义'))
    }
    if (!params) {
      return Promise.reject(new LoadError(101, '请求参数未定义'))
    }
    var dataKey = this.options.dataKey
    var storeKey = this.options.keyGenerator(params)
    // 数据标识异常
    if (!storeKey) {
      return Promise.reject(new LoadError(102, '数据的唯一标识未定义'))
    }
    var request = baike[this.method]
    // 请求方法异常
    if (!$.isFunction(request)) {
      return Promise.reject(new LoadError(103, '请求方法未定义'))
    }
    return new Promise((resolve, reject) => {
      // 直接返回已有数据
      if (this.store[storeKey] && !update) {
        // 返回本次加载的数据以及数据仓库
        return resolve({ data: this.store[storeKey], store: this.store, cache: true })
      }
      request(this.url, params, o => {
        // 接口返回异常
        if (!o || o.retcode !== 0) {
          return reject(new LoadError(300, '接口返回异常，' + (o && o.message) || '无法获取响应'))
        }
        // 指定字段名则存储特定数据，否则存储整个响应
        this.store[storeKey] = dataKey ? o[dataKey] : o
        // 返回本次加载的数据以及数据仓库
        resolve({ data: this.store[storeKey], store: this.store, cache: false })
      })
    })
  }

  clear (key) {
    // 清空某一数据
    if ((typeof key === 'string' && key) || typeof key === 'number') {
      delete this.store[key]
      return
    }
    // 清空仓库
    this.store = {}
  }
}

// 一组以id区分的存储加载器
class MemorizerGroup {
  constructor (idGenerator) {
    this.memorizers = {}
    this.idGenerator = $.isFunction(idGenerator) ? idGenerator : defaultIDGenerator
  }

  /**
   *
   * 加载数据
   * @param {string} [url=''] 请求url
   * @param {obejct} [options={}] 存储加载器配置项（可以包括数据字段和数据id生成器）
   * @param {obejct} [params={}] 请求参数
   * @param {boolean} [update=false] 更新已有数据
   * @returns
   * @memberof MemorizerGroup
   */
  load (method = 'post', url = '', options = {}, params, update = false) {
    // 请求路径、参数未定义
    if (!url) {
      return Promise.reject(new LoadError(100, '请求路径未定义'))
    }
    if (!params) {
      return Promise.reject(new LoadError(101, '请求参数未定义'))
    }
    var memorizer = this.getLoder(method, url, options)
    return memorizer.load(params, update)
  }

  // 清空仓库
  clear (loaderID, storeKey) {
    var loader = this.getLoderByID(loaderID)
    if (loader) {
      loader.clear(storeKey)
    }
  }

  // 获取唯一的存储加载器
  getLoder (method = 'post', url = '', options = {}) {
    if (!url) {
      return null
    }
    var defaultMemorizerID = this.idGenerator(method, url, options)
    var memorizerID = options.loaderID || defaultMemorizerID
    // 根据id获取存储加载器，没有则新建一个
    if (!this.memorizers[memorizerID]) {
      this.memorizers[memorizerID] = new Memorizer(memorizerID, method, url, options)
    }
    return this.memorizers[memorizerID]
  }

  // 根据id获取存储加载器
  getLoderByID (id) {
    return this.memorizers[id]
  }
}

// 使用默认id生成器
const memoryLoder = new MemorizerGroup()

// 允许使用自定义的存储加载器
export { Memorizer, MemorizerGroup }
// 默认使用的存储加载器
export default memoryLoder

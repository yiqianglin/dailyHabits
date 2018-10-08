import Toast from './toast.vue'

// 默认配置
const defaultCfg = {
  // 挂载toast的容器
  container: 'body'
}

// toast实例
let instance = null
// toast全局配置
let config = {}

// 显示普通消息通知
function toastMsg (ops, type, duration) {
  // 挂载toast
  if (!instance.$el) {
    let vm = instance.$mount()
    document.querySelector(config.container).appendChild(vm.$el)
  }
  if (typeof ops === 'string') {
    instance.showMsg(ops, type, duration)
    return
  }
  instance.show(ops)
}

// 显示已添加XXX消息通知
function toastAdd (ops, type, duration) {
  // 挂载toast
  if (!instance.$el) {
    let vm = instance.$mount()
    document.querySelector(config.container).appendChild(vm.$el)
  }

  if (typeof ops === 'string') {
    instance.showAdd(ops, type, duration)
    return
  }
  instance.show(ops)
}

// 隐藏消息通知
function toastHide () {
  // 挂载toast
  if (!instance.$el) {
    let vm = instance.$mount()
    document.querySelector(config.container).appendChild(vm.$el)
  }

  instance.hide()
}

export default {
  install (Vue, cfg = {}) {
    // 合并配置
    Object.assign(config, defaultCfg, cfg)

    // 初始化实例
    const CONSTRUCTOR = Vue.extend(Toast)
    instance = instance || new CONSTRUCTOR()

    // Vue.prototype.$toast = { msg: toastMsg, add: toastAdd, hide: toastHide }
    return {
      toast: toastMsg,
      toastAdd: toastAdd,
      toastHide: toastHide
    }
  }
}

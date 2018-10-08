import toast from './toast'
import report from './report'

export default {
  install (Vue, cfg = {}) {
    let toastMethods = toast.install(Vue, cfg)

    Vue.prototype.$msg = { ...toastMethods }
    Vue.prototype.$report = report.install(Vue)
  }
}

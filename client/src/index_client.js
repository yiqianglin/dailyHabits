/* global Raven, baike,  MtaH5 */
import 'core-js/modules/es6.array.map'
import Vue from 'vue'
import App from './app.vue'
import { createRouter } from './routes'
import { createStore } from './store'
import Promise from 'es6-promise'
import 'core-js/modules/es6.array.find-index'
import Navigation from '@tencent/navigation'
import message from 'components/message'

function createApp () {
  const store = createStore()
  const router = createRouter()
  // sync(store, router)
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store }
}

const { app, router, store } = createApp()

Vue.use(Navigation, { router })
Vue.use(message, { container: '.routerView' })
Promise.polyfill()
window.router = router
Vue.config.productionTip = false

Vue.config.errorHandler = function (err, vm, info) {
  console.log('errorHandler', err)
  Raven.captureException(err)
}

// 使用服务器初始化状态填充store。
// 状态在SSR期间确定并在页面标记中内联。
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// 等到路由器在挂钩之前解决了所有异步问题
// 和异步组件......
router.onReady(() => {
  // 添加路由器挂钩以处理asyncData。
  // 解决初始路由后执行此操作，以便我们不会进行双重提取我们已有的数据
  // 使用router.beforeResolve（）使所有异步组件已解析。
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)
    if (!asyncDataHooks.length) {
      return next()
    }

    console.log('获取asyncData')
    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to })))
      .then(() => {
        console.log('获取asyncData结束')
        next()
      })
      .catch(next)
  })

  // actually mount to DOM
  app.$mount('#app')
})

router.afterEach((to, from) => {
  document.body.classList.remove('disscroll')
  document.body.style.top = ''
  baike.redirectUrl(to)
  // 切换路由，有toast提示立刻隐藏
  app.$msg && app.$msg.toastHide()
  // 隐藏搜索蒙层
  store.dispatch('hideMiniSearch')
  // 不需要分享的页面在路由配置设置notNeedShare,afterEach要先于业务中actived钩子中的分享逻辑先执行
  // 非分享自定义数据的页面处理
  baike.setShare({
    link: `${location.origin}${to.fullPath}`
  })
  if (to.meta.notNeedShare) {
    if (window.WeixinJSBridge) {
      window.WeixinJSBridge.call('hideOptionMenu')
    } else {
      document.addEventListener('WeixinJSBridgeReady', () => {
        window.WeixinJSBridge.call('hideOptionMenu')
      })
    }
  } else {
    // 非分享自定义数据的页面处理
    // baike.setShare({
    //   link: `${location.origin}${to.fullPath}`
    // })
    if (window.WeixinJSBridge) {
      window.WeixinJSBridge.call('showOptionMenu')
    } else {
      document.addEventListener('WeixinJSBridgeReady', () => {
        window.WeixinJSBridge.call('showOptionMenu')
      })
    }
    // window.WeixinJSBridge && window.WeixinJSBridge.call('showOptionMenu')
  }
  // pv上报不需要立即执行，属于性能优化
  Vue.nextTick(() => {
    baike.sendPV(to, from)
    // 新版上报
    app.$report.sendPV(to, from)
    // 如果刷新不上报mta
    from.name && window.MtaH5 && MtaH5.pgv()
    // 设置搜索组件
    store.dispatch('setAppSearcher')
  })
})

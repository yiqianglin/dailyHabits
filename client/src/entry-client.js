/* global Raven */
import 'core-js/modules/es6.array.map'
import Vue from 'vue'
import App from './app.vue'
import { createRouter } from './router'
import { createStore } from './store'
import Promise from 'es6-promise'
import 'core-js/modules/es6.array.find-index'
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

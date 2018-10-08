import Vue from 'vue'
import App from './app.vue'
import { createRouter } from './routes'
import { createStore } from './store'
const isDev = process.env.NODE_ENV !== 'production'

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

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
// 这个导出的函数将由`bundleRenderer`调用。
// 这是我们执行数据预取以确定的地方
// 在实际渲染之前我们的应用程序的状态。
// 由于数据提取是异步的，因此需要此功能
// 返回一个解析为app实例的Promise。
export default context => {
  return new Promise((resolve, reject) => {
    const s = isDev && Date.now()
    const { app, router, store } = createApp()

    const { url } = context
    const { fullPath } = router.resolve(url).route // 解析目标位置

    if (fullPath !== url) {
      return reject(new Error({ url: fullPath }))
    }

    // set router's location
    router.push(url)

    // wait until router has resolved possible async hooks
    // 等到路由器解决了可能的异步挂钩
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // no matched routes
      if (!matchedComponents.length) {
        return reject(new Error({ code: 404 }))
      }
      // Call fetchData hooks on components matched by the route.
      // A preFetch hook dispatches a store action and returns a Promise,
      // which is resolved when the action is complete and store state has been
      // updated.
      // 在路由匹配的组件上调用fetchData挂钩。
      // preFetch挂钩调度存储操作并返回Promise，
      // 当操作完成且存储状态已解决时解析
      // 更新。
      Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
        store,
        route: router.currentRoute
      }))).then(() => {
        isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
        // After all preFetch hooks are resolved, our store is now
        // filled with the state needed to render the app.
        // Expose the state on the render context, and let the request handler
        // inline the state in the HTML response. This allows the client-side
        // store to pick-up the server-side state without having to duplicate
        // the initial data fetching on the client.
        // 解决了所有preFetch挂钩之后，我们现在的store
        // 填充渲染应用程序所需的状态。
        // 在渲染上下文中公开状态，并让请求处理程序
        // 内联HTML响应中的状态。这允许客户端
        // 存储以获取服务器端状态而无需复制
        // 在客户端上获取初始数据。
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}

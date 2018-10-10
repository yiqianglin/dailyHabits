import Vue from 'vue'
import VueRouter from 'vue-router'
// import App from './app'
Vue.use(VueRouter)
// const enter = function(r){
//     console.log(r)
//     return require.ensure([], () => {
//         r(require('../page/enter/enter'))
//     }, 'enter')
// }

function netWorkErrorTo () {
  console.log('组件加载出错，刷新页面，获取最新代码')
  location.reload()  //报错，刷新
  return
  // return import(/* webpackChunkName: "home" */ './page/mobile/home/home.vue')
  //   .then((resolve) => {
  //     console.log('重定向到home组件', resolve)
  //     return resolve
  //   })
  //   .catch((error) => {
  //     console.log(error)
  //   })
}

const about = () =>
  import(/* webpackChunkName: "about" */ '../page/mobile/about/about.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const news = () =>
  import(/* webpackChunkName: "news" */ '../page/mobile/news/news.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

var scrollBehavior = async (to, from, savedPosition) => {
  if (savedPosition) {
    return savedPosition
  } else {
    if (from.meta.keepAlive) {
      from.meta.savedPosition = document.documentElement.scrollTop || document.body.scrollTop
    }
    // 搜索页带hash表示搜索词，不能用hash定位
    // if (to.hash) {
    //   return {
    //     selector: to.hash
    //   }
    // }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ x: 0, y: to.meta.savedPosition || 0 })
      }, 300)
    })
  }
}

export function createRouter () {
  return new VueRouter({
    mode: 'history',
    // base: __dirname,
    scrollBehavior,
    routes: [
      {
        name: 'about',
        path: '/mobile/about.html',
        component: about
      },
      {
        name: 'news',
        path: '/mobile/news_:id.html',
        component: news
      },
      // {
      //   path: '*',
      //   redirect: '/mobile/news_all.html'
      // }
    ]
  })
}

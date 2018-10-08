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
  return import(/* webpackChunkName: "home" */ './page/mobile/home/home.vue')
    .then((resolve) => {
      console.log('重定向到home组件', resolve)
      return resolve
    })
    .catch((error) => {
      console.log(error)
    })
}

const building = () =>
  import(/* webpackChunkName: "building" */ './page/mobile/building/building.vue')
    .then((resolve) => {
      return resolve
    })
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const buildingDoctorSearch = () =>
  import(/* webpackChunkName: "buildingDoctorSearch" */ './page/mobile/building-doctor-search/building.vue')
    .then((resolve) => {
      return resolve
    })
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const home = () =>
  import(/* webpackChunkName: "home" */ './page/mobile/home/home.vue')

const disease_list = () =>
  import(/* webpackChunkName: "disease_list" */ './page/mobile/disease_list/disease_list.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const cancer = () =>
  import(/* webpackChunkName: "cancer" */ './page/mobile/cancer/cancer.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const my = () =>
  import(/* webpackChunkName: "my" */ './page/mobile/my/my.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const about = () =>
  import(/* webpackChunkName: "about" */ './page/mobile/about/about.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const article = () =>
  import(/* webpackChunkName: "article" */ './page/mobile/article/article.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const audio = () =>
  import(/* webpackChunkName: "audio" */ './page/mobile/audio/audio.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const authority_csco = () =>
  import(/* webpackChunkName: "authority_csco" */ './page/mobile/authority_csco/authority_csco.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const authority_hw = () =>
  import(/* webpackChunkName: "authority_hw" */ './page/mobile/authority_hw/authority_hw.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const authority_wm = () =>
  import(/* webpackChunkName: "authority_wm" */ './page/mobile/authority_wm/authority_wm.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const authority = () =>
  import(/* webpackChunkName: "authority" */ './page/mobile/authority/authority.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const authority_policy = () =>
  import(/* webpackChunkName: "authority_policy" */ './page/mobile/authority/authority_policy.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const cancer_committee = () =>
  import(/* webpackChunkName: "cancer_committee" */ './page/mobile/cancer_committee/cancer_committee.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const card = () =>
  import(/* webpackChunkName: "card" */ './page/mobile/card/card.vue') // 还有问题
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const clinical_recruitment = () =>
  import(/* webpackChunkName: "clinical_recruitment" */ './page/mobile/clinical_recruitment/clinical_recruitment.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const clinical_recruitment_especially = () =>
  import(/* webpackChunkName: "clinical_recruitment_especially" */ './page/mobile/clinical_recruitment_especially/clinical_recruitment_especially.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const converse = () =>
  import(/* webpackChunkName: "converse" */ './page/mobile/converse/converse.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const ddetail = () =>
  import(/* webpackChunkName: "ddetail" */ './page/mobile/ddetail/ddetail.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const depart = () =>
  import(/* webpackChunkName: "depart" */ './page/mobile/depart/depart.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const depression_test = () =>
  import(/* webpackChunkName: "depression_test" */ './page/mobile/depression_test/depression_test.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const doctor_search_doctor = () =>
  import(/* webpackChunkName: "doctor_search_doctor" */ './page/mobile/doctor_search/doctor.vue') // 不知道怎么测
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const doctor_search_hospital = () =>
  import(/* webpackChunkName: "doctor_search_hospital" */ './page/mobile/doctor_search/hospital.vue') // 不知道怎么测
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const doctor_team = () =>
  import(/* webpackChunkName: "doctor_team" */ './page/mobile/doctor_team/doctor_team.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const doctor_video = () =>
  import(/* webpackChunkName: "doctor_video" */ './page/mobile/doctor_video/doctor_video.vue') // 不知道怎么测
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const doctor = () =>
  import(/* webpackChunkName: "doctor" */ './page/mobile/doctor/doctor.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const emerg_articles = () =>
  import(/* webpackChunkName: "emerg_articles" */ './page/mobile/emerg_articles/emerg_articles.vue') // 不知道怎么测
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const emergency = () =>
  import(/* webpackChunkName: "emergency" */ './page/mobile/emergency/emergency.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const enter_hr = () =>
  import(/* webpackChunkName: "enter_hr" */ './page/mobile/enter_hr/enter_hr.vue') // 只能在微信打开测
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

// enter 已经被nginx跳转，就不写了。
const favorite = () =>
  import(/* webpackChunkName: "favorite" */ './page/mobile/favorite/favorite.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const focus = () =>
  import(/* webpackChunkName: "focus" */ './page/mobile/focus/focus.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const home_cancer = () =>
  import(/* webpackChunkName: "home_cancer" */ './page/mobile/home_cancer/home_cancer.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const hospital_info = () =>
  import(/* webpackChunkName: "hospital_info" */ './page/mobile/hospital_info/hospital_info.vue') // 不知道怎么测
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const hospital = () =>
  import(/* webpackChunkName: "hospital" */ './page/mobile/hospital/hospital.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const mydoctor = () =>
  import(/* webpackChunkName: "mydoctor" */ './page/mobile/mydoctor/mydoctor.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const overview_m = () =>
  import(/* webpackChunkName: "overview_m" */ './page/mobile/overview_m/overview_m.vue') // 不知道怎么测
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const overview_pt = () =>
  import(/* webpackChunkName: "overview_pt" */ './page/mobile/overview_pt/overview_pt.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })
const overview_wm = () =>
  import(/* webpackChunkName: "overview_wm" */ './page/mobile/overview_wm/overview_wm.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

// overview_zl_old 貌似外网已经没有了
const overview_zl = () =>
  import(/* webpackChunkName: "overview_zl" */ './page/mobile/overview_zl/overview_zl.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const overview_zz = () =>
  import(/* webpackChunkName: "overview_zz" */ './page/mobile/overview_zz/overview_zz.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const overview = () =>
  import(/* webpackChunkName: "overview" */ './page/mobile/overview/overview.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const patient = () =>
  import(/* webpackChunkName: "patient" */ './page/mobile/patient/patient.vue') // 不知道怎么测
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const publicConcern = () =>
  import(/* webpackChunkName: "publicConcern" */ './page/mobile/publicConcern/publicConcern.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const qa_list = () =>
  import(/* webpackChunkName: "qa_list" */ './page/mobile/qa_list/qa_list.vue') // 不知道怎么测
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const recruit = () =>
  import(/* webpackChunkName: "recruit" */ './page/mobile/recruit/recruit.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const relation_map = () =>
  import(/* webpackChunkName: "relation_map" */ './page/mobile/relation_map/relation_map.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const search = () =>
  import(/* webpackChunkName: "search" */ './page/mobile/search/search.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const tag_article = () =>
  import(/* webpackChunkName: "tag_article" */ './page/mobile/tag_article/tag_article.vue') // 开发环境没数据，等测试环境
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const topic = () =>
  import(/* webpackChunkName: "topic" */ './page/mobile/topic/topic.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const user_agreement = () =>
  import(/* webpackChunkName: "user_agreement" */ './page/mobile/user/agreement/agreement.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const user_bind = () =>
  import(/* webpackChunkName: "user_bind" */ './page/mobile/user/bind/bind.vue') // 需要登录才能测
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const user_bindlist = () =>
  import(/* webpackChunkName: "user_bindlist" */ './page/mobile/user/bindlist/bindlist.vue') // 需要登录才能测
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const user_login_success = () =>
  import(/* webpackChunkName: "user_login_success" */ './page/mobile/user/login_success/login_success.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const user_login = () =>
  import(/* webpackChunkName: "user_login" */ './page/mobile/user/login/login.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const user_unbind = () =>
  import(/* webpackChunkName: "user_unbind" */ './page/mobile/user/unbind/unbind.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const babylon_ask_answer = () =>
  import(/* webpackChunkName: "babylon_ask_answer" */ './page/mobile/babylon/ask_answer/ask_answer.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const babylon_overview = () =>
  import(/* webpackChunkName: "babylon_overview" */ './page/mobile/babylon/overview/overview.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const clinical_recruitment_registration = () =>
  import(/* webpackChunkName: "clinical_recruitment_registration" */ './page/mobile/clinical_recruitment_registration/clinical_recruitment_registration.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const expenseCalculator = () =>
  import(/* webpackChunkName: "expenseCalculator" */ './page/mobile/expenseCalculator/expenseCalculator.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const video_compilation = () =>
  import(/* webpackChunkName: "video_compilation" */ './page/mobile/video_compilation/video_compilation.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const video_compilation_topic = () =>
  import(/* webpackChunkName: "video_compilation_topic" */ './page/mobile/video_compilation_topic/video_compilation_topic.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const note_explain = () =>
  import(/* webpackChunkName: "note_explain" */ './page/mobile/note_explain/note_explain.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const instrGuide = () =>
  import(/* webpackChunkName: "instrGuide" */ './page/mobile/instrGuide/instrGuide.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const active_topic = () =>
  import(/* webpackChunkName: "active_topic" */ './page/mobile/active_topic/active_topic.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const arvinlinTest = () =>
  import(/* webpackChunkName: "arvinlinTest" */ './page/mobile/arvinlin_test/arvinlin_test.vue')
    .catch((error, other) => {
      console.log(error)
      return netWorkErrorTo()
    })

const errorTest = () =>
  import(/* webpackChunkName: "errorTest" */ './page/mobile/errorTest/errorTest.vue')
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
    scrollBehavior,  // ddetail的hashchange冲突
    routes: [{
      path: '',
      redirect: '/mobile/home.html',
      meta: {
        needMtaReport: true,
        parentsStyle: {
          height: '100%',
          minHeight: '100%'
        }
      }
    },
    // 1.28 新版链接 - start
    {
      name: 'home',
      path: '/mobile/home.html',
      component: home
    },
    {
      name: 'disease_list',
      path: '/mobile/disease_list.html',
      component: disease_list
    },
    // {
    //   name: 'search',
    //   path: '/mobile/search.html',
    //   component: search
    // },
    // 1.28 新版链接 - end
    // 1.28 主页链接未更改，兼容旧版 - start
    {
      name: 'search_new',
      path: '/mobile/search_new.html',
      component: search
    },
    {
      name: 'search',
      path: '/mobile/search.html',
      component: home
    },
    // 1.28 主页链接未更改，兼容旧版 - end
    {
      name: 'cancer',
      path: '/mobile/cancer.html',
      component: cancer
    },
    // user的路由，暂时不做嵌套路由
    {
      name: 'user_agreement',
      path: '/mobile/user/agreement.html',
      component: user_agreement
    },
    {
      name: 'user_bind',
      path: '/mobile/user/bind.html',
      component: user_bind
    },
    {
      name: 'user_bindlist',
      path: '/mobile/user/bindlist.html',
      component: user_bindlist
    },
    {
      name: 'user_login_success',
      path: '/mobile/user/login_success.html',
      component: user_login_success,
      meta: {
        notNeedShare: true
      }
    },
    {
      name: 'user_login',
      path: '/mobile/user/login.html',
      component: user_login
    },
    {
      name: 'user_unbind',
      path: '/mobile/user/unbind.html',
      component: user_unbind
    },
  
    {
      name: 'about',
      path: '/mobile/about.html',
      component: about
    },
    {
      name: 'article',
      path: '/mobile/article.html',
      component: article
    },
    {
      name: 'audio',
      path: '/mobile/audio.html',
      component: audio
    },
    {
      name: 'authority_csco',
      path: '/mobile/authority_csco.html',
      component: authority_csco
    },
    {
      name: 'authority_hw',
      path: '/mobile/authority_hw.html',
      component: authority_hw
    },
    {
      name: 'authority_wm',
      path: '/mobile/authority_wm.html',
      component: authority_wm
    },
    {
      name: 'authority',
      path: '/mobile/authority.html',
      component: authority
    },
    {
      name: 'authority_policy',
      path: '/mobile/authority_policy.html',
      component: authority_policy
    },
    {
      name: 'buildingDoctorSearch',
      path: '/mobile/building-doctor-search.html',
      component: buildingDoctorSearch,
      meta: {
        notNeedShare: true
      }
    },
    {
      name: 'building',
      path: '/mobile/building.html',
      component: building,
      meta: {
        notNeedShare: true
      }
    },
    {
      name: 'cancer_committee',
      path: '/mobile/cancer_committee.html',
      component: cancer_committee
    },
    {
      name: 'card',
      path: '/mobile/card.html',
      component: card
    },
    {
      name: 'clinical_recruitment',
      path: '/mobile/clinical_recruitment.html',
      component: clinical_recruitment,
      meta: {
        keepAlive: true,
        positionRecord: true
      }
    },
    {
      name: 'clinical_recruitment_especially',
      path: '/mobile/clinical_recruitment_especially.html',
      component: clinical_recruitment_especially,
      meta: {
        keepAlive: true,
        positionRecord: true
      }
    },
    {
      name: 'converse',
      path: '/mobile/converse.html',
      component: converse,
      meta: {
        notNeedShare: true
      }
    },
    {
      name: 'ddetail',
      path: '/mobile/ddetail.html',
      component: ddetail
    },
    {
      name: 'depart',
      path: '/mobile/depart.html',
      component: depart
    },
    {
      name: 'depression_test',
      path: '/mobile/depression_test.html',
      component: depression_test
    },
    {
      name: 'doctor_search_hospital',
      path: '/mobile/doctor_search_hospital.html',
      component: buildingDoctorSearch,
      meta: {
        keepAlive: true
      }
    },
    {
      name: 'doctor_search_doctor',
      path: '/mobile/doctor_search_doctor.html',
      component: doctor_search_doctor,
      meta: {
        keepAlive: true
      }
    },
    {
      name: 'doctor_team',
      path: '/mobile/doctor_team.html',
      component: doctor_team
    },
    {
      name: 'doctor_video',
      path: '/mobile/doctor_video.html',
      component: doctor_video
    },
    {
      name: 'doctor',
      path: '/mobile/doctor.html',
      component: doctor
    },
    {
      name: 'emerg_articles',
      path: '/mobile/emerg_articles.html',
      component: emerg_articles,
      meta: {
        notNeedShare: true
      }
    },
    {
      name: 'emergency',
      path: '/mobile/emergency.html',
      component: emergency
    },
    {
      name: 'enter_hr',
      path: '/mobile/enter_hr.html',
      component: enter_hr
    },
    {
      name: 'favorite',
      path: '/mobile/favorite.html',
      component: favorite,
      meta: {
        notNeedShare: true
      }
    },
    {
      name: 'focus',
      path: '/mobile/focus.html',
      component: focus,
      meta: {
        notNeedShare: true
      }
    },
    {
      name: 'home_cancer',
      path: '/mobile/home_cancer.html',
      component: home_cancer
    },
    {
      name: 'hospital_info',
      path: '/mobile/hospital_info.html',
      component: hospital_info
    },
    {
      name: 'hospital',
      path: '/mobile/hospital.html',
      component: hospital
    },
    {
      name: 'my',
      path: '/mobile/my.html',
      component: my,
      meta: {
        notNeedShare: true
      }
    },
    {
      name: 'mydoctor',
      path: '/mobile/mydoctor.html',
      component: mydoctor,
      meta: {
        notNeedShare: true
      }
    },
    {
      name: 'overview_m',
      path: '/mobile/overview_m.html',
      component: overview_m
    },
    {
      name: 'overview_pt',
      path: '/mobile/overview_pt.html',
      component: overview_pt
    },
    {
      name: 'overview_wm',
      path: '/mobile/overview_wm.html',
      component: overview_wm
    },
    {
      name: 'overview_zl',
      path: '/mobile/overview_zl.html',
      component: overview_zl
    },
    {
      name: 'overview_zz',
      path: '/mobile/overview_zz.html',
      component: overview_zz
    },
    {
      name: 'overview',
      path: '/mobile/overview.html',
      component: overview
    },
    {
      name: 'patient',
      path: '/mobile/patient.html',
      component: patient
    },
    {
      name: 'publicConcern',
      path: '/mobile/publicConcern.html',
      component: publicConcern
    },
    {
      name: 'qa_list',
      path: '/mobile/qa_list.html',
      component: qa_list
    },
    {
      name: 'recruit',
      path: '/mobile/recruit.html',
      component: recruit
    },
    {
      name: 'relation_map',
      path: '/mobile/relation_map.html',
      component: relation_map
    },
    {
      name: 'tag_article',
      path: '/mobile/tag_article.html',
      component: tag_article
    },
    {
      name: 'topic',
      path: '/mobile/topic.html',
      component: topic
    },
    {
      name: 'babylon_ask_answer',
      path: '/mobile/babylon/ask_answer.html',
      component: babylon_ask_answer
    },
    {
      name: 'babylon_overview',
      path: '/mobile/babylon/overview.html',
      component: babylon_overview
    },
    {
      name: 'clinical_recruitment_registration',
      path: '/mobile/clinical_recruitment_registration.html',
      component: clinical_recruitment_registration,
      meta: {
        keepAlive: true
      }
    },
    {
      name: 'expenseCalculator',
      path: '/mobile/expenseCalculator.html',
      component: expenseCalculator
    },
    {
      name: 'video_compilation',
      path: '/mobile/video_compilation.html',
      component: video_compilation
    },
    {
      name: 'video_compilation_topic',
      path: '/mobile/video_compilation_topic.html',
      component: video_compilation_topic
    },
    {
      name: 'note_explain',
      path: '/mobile/note_explain.html',
      component: note_explain
    },
    {
      name: 'instrGuide',
      path: '/mobile/instrGuide.html',
      component: instrGuide
    },
    {
      name: 'active_topic',
      path: '/mobile/active_topic.html',
      component: active_topic
    },
    {
      name: 'errorTest',
      path: '/mobile/errorTest.html',
      component: errorTest
    },
    {
      name: 'arvinlinTest',
      path: '/mobile/arvinlinTest.html',
      component: arvinlinTest
    },
    // 页面404，重定向至首页
    {
      path: '*',
      redirect: '/mobile/home.html'
    }
    ]
  })
}

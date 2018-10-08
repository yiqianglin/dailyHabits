/* global baike */
import * as types from './mutation-types'

const searcherConfig = {
  'mini-searcher': [
    'active_topic',
    'article',
    'audio',
    'authority',
    'authority_policy',
    'authority_hw',
    'authority_wm',
    'authority_csco',
    'building',
    'cancer',
    'cancer_committee',
    'card',
    'clinical_recruitment',
    'clinical_recruitment_registration',
    'ddetail',
    'depart',
    'disease_list',
    'doctor',
    'doctor_team',
    'doctor_video',
    'emergency',
    'enter_hr',
    'expenseCalculator',
    'favorite',
    'focus',
    'home',
    'home_cancer',
    'hospital',
    'hospital_info',
    'mydoctor',
    'note_explain',
    'overview',
    'overview_m',
    'overview_pt',
    'overview_wm',
    'overview_zl',
    'overview_zl_old',
    'overview_zz',
    'patient',
    'publicConcern',
    'qa_list',
    'recruit',
    'tag_article',
    'topic',
    'video_compilation',
    'video_compilation_topic'
  ]
}

const actions = {
  // 设置搜索组件
  setAppSearcher ({ commit }) {
    const pageName = baike.getPageName(window.location.href)
    if (searcherConfig['mini-searcher'].indexOf(pageName) !== -1) {
      commit(types.app.SET_SEARCHER, 'mini-searcher')
    } else {
      commit(types.app.SET_SEARCHER, '')
    }
  },
  // 显示蒙层搜索
  showMiniSearch ({ dispatch }, ops) {
    dispatch(`appSearch/showMini`, ops)
  },
  // 隐藏蒙层搜索
  hideMiniSearch ({ dispatch }) {
    dispatch(`appSearch/hideMini`)
  }
}

export default actions

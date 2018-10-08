/* global $, baike */
import pageLoader from 'src/js/pageLoader'
import memoryLoader from 'src/js/memoryLoader'

import { appSearch as types } from '../../mutation-types'

let scrollTop = 0

const actions = {
  // 获取热门搜索词列表
  async fetchHotList ({ commit, state }, hotListType) {
    const type = hotListType === undefined ? state.hotListType : hotListType
    const options = {
      loaderID: 'app-search-hot',
      dataKey: 'diseases',
      keyGenerator: (params) => {
        return 'hotListType' + params.type
      }
    }
    const params = { type }
    const url = '/mobile/getHotDiseasesV2'
    const result = await memoryLoader.load('post', url, options, params)
      .then(({ data }) => {
        commit(types.SET_HOT_LIST, data)
        return Promise.resolve(data)
      }, error => Promise.reject(error))
    return result
  },

  // 更新热门搜索词列表
  updateHotList ({ commit, dispatch }) {
    const pageName = baike.getPageName(window.location.href)
    // GetHotDiseasesV2，热门搜索词的类型
    const type = pageName === 'home_cancer' ? 1 : 0
    return dispatch('fetchHotList', type).then(() => {
      commit(types.SET_HOT_LIST_TYPE, type)
    })
  },

  // 获取搜索历史词列表
  async fetchHistoryList ({ commit }) {
    const url = '/mobile/getSearchHistory'
    const result = await new Promise((resolve, reject) => {
      baike.post(url, {
        type: 2,
        count: 50
      }, o => {
        if (o.retcode === 0) {
          commit(types.SET_HISTORY_LIST, o.list)
          resolve(o)
        }
        reject(o)
      })
    })
    return result
  },

  // 更新搜索历史词列表
  updateHistoryList ({ commit, dispatch }, searchQuery) {
    return (searchQuery ? dispatch('setHistory', searchQuery) : Promise.resolve()).then(() => {
      dispatch('fetchHistoryList')
    })
  },

  // 设置搜索历史词
  setHistory ({ commit }, searchQuery) {
    const url = '/mobile/setSearchHistory'
    return new Promise((resolve, reject) => {
      baike.post(url, {
        name: searchQuery, type: 2
      }, o => {
        if (o.retcode === 0) {
          resolve(o)
        }
        reject(o)
      })
    })
  },

  // 清除搜索历史词
  clearHistory ({ commit }, { name, index }) {
    const url = '/mobile/clearHistoryEntitiesV2'
    return new Promise((resolve, reject) => {
      baike.post(url, {
        type: 2,
        name
      }, o => {
        if (o.retcode === 0) {
          commit(types.CLEAR_HISTORY, { name, index })
          resolve(o)
        }
        reject(o)
      })
    })
  },

  // 获取搜索历史词列表
  async fetchAssociateList ({ commit }, searchInput) {
    const url = '/mobile/sugSmartBox'
    const result = await new Promise((resolve, reject) => {
      baike.post(url, {
        query: searchInput,
        type: 0,
        histype: 2
      }, o => {
        if (o.retcode === 0) {
          commit(types.SET_ASSOCIATE_LIST, { searchInput, list: o.items, keywords: o.keywords })
          resolve(o)
        }
        reject(o)
      })
    })
    return result
  },

  // 获取综合更多关键词
  async fetchOverallTag ({ commit }, searchQuery) {
    const options = {
      loaderID: 'app-search-overall-tag',
      dataKey: 'tags',
      keyGenerator: (params) => {
        return params.query
      }
    }
    const params = { query: searchQuery }
    const url = '/mobile/getSearchKey'
    const result = await memoryLoader.load('post', url, options, params)
      .then(({ data }) => {
        return Promise.resolve(data)
      }, error => Promise.reject(error))
    return result
  },

  // 获取综合tab的数据
  async fetchOverallData ({ commit, dispatch }, { searchQuery, source }) {
    const options = {
      loaderID: 'app-search-overall-data',
      keyGenerator: (params) => {
        return params.query + params.source
      }
    }
    const params = {
      query: searchQuery,
      source,
      type: 0
    }
    const url = '/mobile/getSearchNew'
    dispatch('updateHistoryList', searchQuery)
    const result = await memoryLoader.load('post', url, options, params)
      .then(({ data }) => {
        return Promise.resolve(data)
      }, error => Promise.reject(error))
    return result
  },

  // 获取非综合tab的数据
  async fetchCommonData ({ commit, dispatch }, { searchQuery, source, type, tag, listKey, totalKey, offset, count, switchTab }) {
    const options = {
      listKey,
      totalKey,
      offset,
      count
    }
    const params = {
      query: searchQuery,
      source,
      type,
      tag
    }
    const url = '/mobile/getSearchNew'
    const result = await pageLoader.load(url, options, params, loader => !(switchTab && loader.list.length))
      .then((data) => {
        return Promise.resolve(data)
      }, error => Promise.reject(error))
    return result
  },

  // 显示搜索蒙层
  showMini ({ commit }, ops) {
    scrollTop = $(window).scrollTop()
    document.body.classList.add('disscroll')
    document.body.style.top = -scrollTop + 'px'
    $('.search-container.mini').show()
    $('#searchInput').focus()
    commit(types.SHOW_MINI, ops)
  },

  // 隐藏搜索蒙层
  hideMini ({ commit, state }) {
    if (!state.showMini) return
    document.body.classList.remove('disscroll')
    $(window).scrollTop(scrollTop)
    document.body.style.top = ''
    $('.search-container.mini').hide()
    commit(types.HIDE_MINI)
  }
}

export default actions

import { appSearch as types } from '../../mutation-types'

const mutations = {
  // 显示蒙层
  [types.SHOW_MINI] (state, ops) {
    state.showMini = true
    state.miniOps = { ...state.miniOps, ...ops }
  },
  // 隐藏蒙层
  [types.HIDE_MINI] (state) {
    state.showMini = false
    state.miniOps = {
      stag: '',
      source: 0
    }
  },
  // 设置热词
  [types.SET_HOT_LIST] (state, list) {
    state.hotList = list
  },
  // 设置热词类型
  [types.SET_HOT_LIST_TYPE] (state, type) {
    state.hotListType = type
  },
  // 设置历史词列表
  [types.SET_HISTORY_LIST] (state, list) {
    state.historyList = list
  },
  // 设置联想词
  [types.SET_ASSOCIATE_LIST] (state, { searchInput, list, keywords }) {
    state.associateMap = {
      ...state.associateMap,
      [searchInput]: { list, keywords }
    }
  },
  // 清除历史
  [types.CLEAR_HISTORY] (state, { name, index }) {
    if (name) {
      // 清除单个搜索历史
      state.historyList.splice(index, 1)
    } else {
      // 清除全部搜索历史
      state.historyList = []
    }
  }
}

export default mutations

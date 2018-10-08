
// 热门搜索
export const appHotList = (state) => {
  const list = state.hotList || []
  // 增加急救入口，待废弃
  return state.hotListType === 1 ? list : [{ name: '日常急救' }].concat(list)
}

// 联想词数据
export const getAssociateItem = (state, getters) => (searchInput) => {
  return state.associateMap[searchInput] || {}
}

// 联想词列表
export const getAssociateList = (state, getters) => (searchInput) => {
  return getters.getAssociateItem(searchInput).list || []
}

// 联想词高亮列表
export const getAssociateKeyword = (state, getters) => (searchInput) => {
  return getters.getAssociateItem(searchInput).keywords || []
}

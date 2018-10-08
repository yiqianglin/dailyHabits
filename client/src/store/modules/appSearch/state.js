
class State {
  constructor () {
    // 显示蒙层搜索
    this.showMini = false
    // 蒙层搜索配置
    this.miniOps = {
      stag: '',
      source: 0
    }
    // 热门搜索列表
    this.hotList = []
    // 热搜类型：0 - 全部，1 - 癌症
    this.hotListType = 0
    // 搜索历史列表
    this.historyList = []
    // 联想词列表
    this.associateMap = {}
  }
}

export default State

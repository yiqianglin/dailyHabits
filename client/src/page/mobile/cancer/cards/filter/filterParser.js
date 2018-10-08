
const unique = (array = [], getId) => {
  var ids = []
  var result = []
  array.forEach(item => {
    let id = getId ? getId(item) : item
    if (ids.indexOf(id) === -1) {
      ids.push(id)
      result.push(item)
    }
  })
  return result
}

export class FilterParser {
  constructor (id = '', tag0List = [], tag1List = [], titles = []) {
    // 筛选器id
    this.id = id
    // 滚轮型筛选列表，标签树中type为0的3级，如分期、分型
    this.tag0List = tag0List
    // 平铺型筛选列表，标签树中type为1的3级，如治疗方法（含其他治疗）
    this.tag1List = tag1List
    // 筛选器标题
    this.titles = titles
    // 筛选器选项
    this.filters = []
    // 筛选器描述
    this.filterBrief = null
    // 默认选中全部
    this.update()
  }

  // 更新筛选器，selections已选项 - 字符串数组
  update (selections = []) {
    // 滚轮型筛选列表
    var tags = this.tag1List
    // 不选、全部滚轮选择全部则重置平铺型筛选列表
    var resetTiled = !selections.slice(0, -1).join('').length || selections.slice(0, -1).every(t => /^全部/.test(t))
    // 任一项滚轮不选择全部则显示筛选器描述
    var showBreif = !selections.slice(0, -1).some(selected => selected && /^全部/.test(selected))
    // 更新后的筛选器
    var filters = []

    // 从滚轮型向下更新
    while (tags && tags.length) {
      let selected = selections[filters.length]
      let filtered = selected && !/^全部/.test(selected) ? tags.filter(tag => tag.label === selected) : tags
      // 更新筛选器标题
      if (!this.titles[filters.length]) {
        this.titles[filters.length] = tags.reduce((title, tag) => title || tag.relate_title, '')
      }
      filters.push({
        type: 1,
        value: null,
        activeIdx: -1,
        treetags: tags,
        label: this.titles[filters.length]
      })
      tags = (filtered.length ? filtered : tags).reduce((result, tag, index) => {
        return result.concat(tag.treetags || [])
      }, [])
    }

    // 平铺型筛选列表
    var tiledFilter = filters[filters.length - 1]
    if (tiledFilter) {
      tiledFilter.type = 0
      tiledFilter.treetags = resetTiled ? this.tag0List : tiledFilter.treetags
    }
    filters = this.getDisplay(filters, selections)
    this.filters = filters

    // 筛选器描述位于最后一级滚轮
    var briefDesc = showBreif && filters[filters.length - 2] && filters[filters.length - 2].value ? filters[filters.length - 2].value.desc : ''
    var briefInfo = briefDesc ? briefDesc.split('@_@') : []
    var filterBrief = briefInfo.length ? {
      docid: briefInfo[0] || '',
      h5url: briefInfo[1] || '',
      desc: briefInfo[2] || ''
    } : null
    this.filterBrief = filterBrief

    return { filters: this.filters, filterBrief: this.filterBrief }
  }
  // 获取去重筛选器
  getDisplay (filters, selections = []) {
    return filters.map((item, index) => {
      var filter = {
        ...item,
        tags: []
      }

      // 滚轮筛选器增加全部选项
      if (filter.type === 1) {
        filter.treetags = [{
          id: 'all-l' + (index + 1),
          label: '全部' + item.label
        }, ...item.treetags]
      }

      // 去除重名项
      filter.tags = unique(filter.treetags, t => t.label)

      // 修正筛选器值
      if (filter.type === 1 && selections[index]) {
        filter.activeIdx = filter.tags.findIndex(tag => {
          return tag.label === selections[index]
        })
        filter.value = filter.activeIdx > -1 ? filter.tags[filter.activeIdx] : filter.tags[0]
      } else if (filter.type === 0 && selections[index]) {
        filter.activeIdx = filter.tags.findIndex(tag => {
          return tag.label === selections[index]
        })
        filter.value = filter.activeIdx > -1 ? filter.tags[filter.activeIdx] : null
      }
      return filter
    })
  }
  // 获取 筛选器标题：筛选值id 映射表
  getFilterMap (preserveAll = false) {
    var allOnly = this.filters.every(filter => !(filter.type === 1 && !(filter.value ? /^全部/.test(filter.value.label) : true)))
    return this.filters.reduce((result, filter) => {
      if (allOnly && filter.type === 1) {
        result[filter.label] = ''
        return result
      }
      var ids = []
      var label = filter.value && !/^全部/.test(filter.value.label) ? filter.value.label : ''
      filter.treetags.forEach(tag => {
        var id = (filter.type === 1 ? tag.id : tag.relate_id) || tag.id
        var condition = preserveAll ? id && tag.label === label && ids.indexOf(id) === -1 : !/^全部/.test(tag.label) && id && !(label && tag.label !== label) && ids.indexOf(id) === -1
        if (condition) {
          ids.push(id)
        }
      })
      result[filter.label] = ids.join('|')
      return result
    }, {})
  }
  // 获取筛选器id
  getFilterID (type = 0) {
    var preserveAll = type === 2
    var filterIdMap = this.getFilterMap(preserveAll)
    var filterIds = Object.values(filterIdMap)
    // 拉取平铺筛选器的下级传 末级滚轮筛选器 + 平铺筛选器 - 0
    // 拉取文章列表页的兄弟标签和文章传 末级滚轮筛选器 - 1
    // 拉取滚轮筛选器传 倒数第二级滚轮 - 2
    var ids = type === 0 ? filterIds.slice(-2) : type === 1 ? filterIds.slice(-2, -1) : filterIds.slice(0, filterIds.length > 2 ? filterIds.length - 2 : 0)
    var tagids = ids.reduce((result, item) => {
      if (item) {
        result.push(item)
      }
      return result
    }, [])
    return tagids
  }
  // 获取选中筛选项的名称
  getFilterLabel (type = 0) {
    var labels = this.filters.map(filter => filter.value ? filter.value.label : '')
    return type === 0 ? labels : labels.slice(0, -1)
  }
}

export default {
  parser: {},
  init (id = 'common', tag0List = [], tag1List = [], titles = []) {
    if (!this.parser[id]) {
      this.parser[id] = new FilterParser(id, tag0List, tag1List, titles)
    }
    return this.parser[id]
  },
  set (id = '', filters = [], filterBrief) {
    if (!this.parser[id]) return
    this.parser[id].filters = filters
    this.parser[id].filterBrief = filterBrief
  },
  update (id, selections) {
    if (!this.parser[id]) return {}
    return this.parser[id].update(selections)
  },
  getFilterID (id, type = 0) {
    if (!this.parser[id]) return {}
    return this.parser[id].getFilterID(type)
  },
  getFilterLabel (id, type = 0) {
    if (!this.parser[id]) return []
    return this.parser[id].getFilterLabel(type)
  }
}

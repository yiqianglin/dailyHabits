/* global $, baike */
// import MultiSelect from 'vue-multiselect'
// import 'vue-multiselect/dist/vue-multiselect.min.css'
import { Popup, Picker } from 'mint-ui'

// import scrollPicker from 'components/scrollPicker/scrollPicker.vue'
import entry from '../entry/entry.vue'
import tag from '../tag/tag.vue'

import memoryLoader from 'src/js/memoryLoader'
import filterParser from './filterParser'

const parser = {
  // 获取 筛选器标题：筛选值id 映射表
  getFilterMap (filterList = []) {
    return filterList.reduce((result, item) => {
      var ids = []
      var label = ''
      if (item.type === 1 && item.value && !new RegExp(/^全部/).test(item.value.label)) {
        label = item.value.label
      } else if (item.type === 0 && item.tags[item.activeIdx]) {
        label = item.tags[item.activeIdx].label
      }
      item.treetags.forEach(tag => {
        var id = (item.type === 1 ? tag.id : tag.relate_id) || tag.id
        if (id && tag.label === label && ids.indexOf(id) === -1) {
          ids.push(id)
        }
      })
      result[item.label] = ids.join('|')
      return result
    }, {})
  },
  // 上级筛选路径：下级筛选项
  filterByPath: {},
  // 初始化筛选器
  initFilter (filters = [], treetags = []) {
    var filterL1 = filters
    var filterL2 = []
    var filterL3 = treetags

    // 筛选器标题
    var titleL1 = ''
    var titleL2 = ''
    var titleL3 = ''
    filterL1.forEach(itemL1 => {
      titleL1 = titleL1 || itemL1.relate_title
      itemL1.treetags.forEach(itemL2 => {
        titleL2 = titleL2 || itemL2.relate_title
        itemL2.treetags.forEach(itemL3 => {
          titleL3 = titleL3 || itemL3.relate_title
        })
      })
    })

    var filterByPath = {}
    filterL1.forEach(itemL1 => {
      var filterL3ofL1 = []
      itemL1.treetags.forEach(itemL2 => {
        filterL2.push(itemL2)

        // 允许L2改变L1
        // filterByPath[itemL2.label] = filterByPath[itemL2.label] || []
        // filterByPath[itemL2.label].push(itemL1)

        // 筛选器简介，选中一级+二级才有
        if (itemL2.desc) {
          let filterBrief = itemL2.desc.split('@_@')
          filterByPath['filterBrief/' + itemL1.label + '/' + itemL2.label] = {
            docid: filterBrief[0] || '',
            h5url: filterBrief[1] || '',
            desc: filterBrief[2] || ''
          }
        }

        // 一级+二级：三级
        filterByPath[itemL1.label + '/' + itemL2.label] = filterByPath[itemL1.label + '/' + itemL2.label] || []
        filterByPath[itemL1.label + '/' + itemL2.label] = filterByPath[itemL1.label + '/' + itemL2.label].concat(itemL2.treetags)
        // 全部一级+二级：三级
        filterByPath['全部' + titleL1 + '/' + itemL2.label] = filterByPath['全部' + titleL1 + '/' + itemL2.label] || []
        filterByPath['全部' + titleL1 + '/' + itemL2.label] = filterByPath['全部' + titleL1 + '/' + itemL2.label].concat(itemL2.treetags)
        filterL3ofL1 = filterL3ofL1.concat(itemL2.treetags)
      })
      // 一级：二级
      filterByPath[itemL1.label] = itemL1.treetags
      // 一级+全部二级：三级
      filterByPath[itemL1.label + '/' + '全部' + titleL2] = filterL3ofL1
    })

    // 允许L2改变L1
    // 全部二级：一级
    // filterByPath['全部' + titleL2] = filterL1

    // 全部一级：二级
    filterByPath['全部' + titleL1] = filterL2
    // 全部一级+全部二级：三级
    filterByPath['全部' + titleL1 + '/' + '全部' + titleL2] = filterL3
    this.filterByPath = filterByPath

    // 初始筛选器
    var filterList = []
    filterList.push({
      label: titleL1,
      type: 1,
      value: null,
      activeIdx: -1,
      treetags: filterL1
    })
    filterList.push({
      label: titleL2,
      type: 1,
      value: null,
      activeIdx: -1,
      treetags: filterL2
    })
    filterList.push({
      label: titleL3,
      type: 0,
      value: null,
      activeIdx: -1,
      treetags: filterL3
    })
    filterList = this.updateFilter(filterList)
    return filterList
  },
  // 根据上级筛选器的值更新下级
  updateFilter (filterList = []) {
    var filterByPath = this.filterByPath
    var filterL1 = filterList[0]
    var filterL2 = filterList[1]
    var filterL3 = filterList[2]
    var valL1 = filterL1.value ? filterL1.value.label : '全部' + filterL1.label
    var valL2 = filterL2.value ? filterL2.value.label : '全部' + filterL2.label
    var valL3 = filterL3.activeIdx > -1 ? filterL3.tags[filterL3.activeIdx] : null

    // 更新一级，无值则选择全部
    if (filterL1 && filterL1.treetags) {
      // 允许L2改变L1
      // filterL1.treetags = filterByPath[valL2]
      let found = filterL1.treetags.find((tag) => {
        return valL1 === tag.label
      })
      filterL1.value = found || {
        id: 'all-l1',
        label: '全部' + filterL1.label
      }
      valL1 = filterL1.value ? filterL1.value.label : '全部' + filterL1.label
    }

    // 更新二级，无值则选择全部
    if (filterL2 && filterL2.treetags) {
      filterL2.treetags = filterByPath[valL1]
      let found = filterL2.treetags.find((tag) => {
        return valL2 === tag.label
      })
      filterL2.value = found || {
        id: 'all-l2',
        label: '全部' + filterL2.label
      }
      valL2 = filterL2.value ? filterL2.value.label : '全部' + filterL2.label
    }

    // 更新三级，无值则改变二级为全部
    if (filterL3 && filterL3.treetags) {
      let found = filterByPath[valL1 + '/' + valL2]
      if (!found || !found.length) {
        filterL2.value = {
          id: 'all-l2',
          label: '全部' + filterL2.label
        }
        valL2 = filterL2.value.label
        found = filterByPath[valL1 + '/' + valL2]
      }
      filterL3.treetags = found
      filterL3.activeIdx = filterL3.treetags.findIndex((tag) => {
        return valL3 && valL3.label === tag.label
      })
    }

    // 更新筛选器简介
    var filterBrief = filterByPath['filterBrief/' + valL1 + '/' + valL2]
    var result = this.getDisplayFilter(filterList)
    return {
      filterBrief,
      filters: result
    }
  },
  // 展示用筛选器，去除重名项
  getDisplayFilter (filterList = []) {
    return filterList.map((item, index) => {
      var unique = []
      var filter = {
        ...item,
        tags: []
      }

      // 下拉筛选器增加全部选项
      if (filter.type === 1) {
        filter.treetags = [{
          id: 'all-l' + (index + 1),
          label: '全部' + item.label
        }, ...item.treetags]
      }

      // 去除重名项
      filter.treetags.forEach(tag => {
        if (unique.indexOf(tag.label) === -1) {
          unique.push(tag.label)
          filter.tags.push(tag)
        }
      })

      // 修正筛选器值
      if (item.type === 1 && filter.value) {
        filter.value = filter.tags.find(tag => {
          return tag.label === filter.value.label
        })
      } else if (item.type === 0 && filter.treetags[filter.activeIdx]) {
        filter.activeIdx = filter.tags.findIndex(tag => {
          return tag.label === filter.treetags[filter.activeIdx].label
        })
      }
      return filter
    })
  },
  // 获取标签树
  getTreeTags (treetags = [], showTags = false) {
    var entryList = []
    var filterList = []
    var result = treetags.reduce((result, item) => {
      if (item.type === 4) {
        entryList.push(item)
      } else if (item.type === 5) {
        filterList.push(item)
      } else if (item.type === 0) {
        result.push({
          ...item,
          activeIdx: -1,
          treetags: showTags ? item.treetags : []
        })
      }
      return result
    }, [])
    return {
      entryList,
      filterList,
      treetags: result
    }
  }
}

const togglePopup = (() => {
  let scrollTop = 0
  return (newVal, oldVal) => {
    if (newVal) {
      scrollTop = $(window).scrollTop()
      document.body.classList.add('disscroll')
      document.body.style.top = -scrollTop + 'px'
    } else {
      document.body.classList.remove('disscroll')
      $(window).scrollTop(scrollTop)
      document.body.style.top = ''
    }
  }
})()

export default {
  props: {
    options: {
      type: Object,
      default: function () {
        return {
          disease: '',
          card: null
        }
      }
    }
  },
  data () {
    return {
      disease: '',
      id: '',
      name: '',
      hint: '',
      filterBrief: null,
      treetags: [],
      entryList: [],
      filters: [],
      // toastShow: false,
      pickerShow: false,
      articleShow: false,
      article: null
    }
  },
  components: {
    // MultiSelect,
    // scrollPicker,
    entry,
    tag,
    Popup,
    Picker
  },
  computed: {
    filterSlots () {
      return this.filters.filter(f => f.type === 1).map(filter => {
        return {
          flex: 1,
          defaultIndex: filter.value ? filter.tags.map(tag => tag.label).indexOf(filter.value.label) : 0,
          values: filter.tags.map(tag => tag.label)
        }
      })
    }
  },
  watch: {
    articleShow: togglePopup,
    pickerShow: togglePopup
  },
  deactivated () {
    this.pageHideSetCache()
  },
  destroyed () {
    this.pageHideSetCache()
  },
  created () {
    var disease = (this.options && this.options.disease) || baike.query('name') || ''
    var card = (this.options && this.options.card) || {}
    // 卡片id
    var id = card.id || ''
    // 卡片名
    var name = card.label || ''
    // 提示文案
    var hint = card.desc || ''
    var {
      entryList,
      filterList,
      treetags
    } = parser.getTreeTags(card.treetags)
    var {
      filterBrief,
      filters
    } = filterParser.init(id, treetags, filterList)
    var cache = window.location.hash ? null : baike.sstore.getItem('cancer_filter' + id)
    this.disease = disease
    this.id = id
    this.name = name
    this.hint = hint
    // 筛选器简介文案
    this.filterBrief = cache ? cache.filterBrief : filterBrief
    this.treetags = cache && cache.treetags && cache.treetags.length ? cache.treetags : treetags
    this.entryList = entryList
    this.filters = cache && cache.filters && cache.filters.length ? cache.filters : filters
    filterParser.set(id, this.filters, this.filterBrief)
    // if (!(cache && cache.filters && cache.filters.length) && this.filters[2] && this.filters[2].treetags && this.filters[2].treetags.length) {
    //   // 默认展开治疗-治疗方法-手术
    //   this.selectTag(this.filters[2], 1, 0)
    // }
    if (!(cache && cache.filters && cache.filters.length) && this.filters.length && this.filters[this.filters.length - 1] && this.filters[this.filters.length - 1].treetags.length) {
      this.selectTag(this.filters[this.filters.length - 1], 1, 0)
    }
  },
  mounted () {
    this.bind()
  },
  methods: {
    filterLabel (options) {
      return options.label
    },
    // 点击标签型筛选器
    selectTag (cate, cateIndex, tagIdx) {
      this.cateIndex = cateIndex
      cate.activeIdx = cate.activeIdx === tagIdx ? -1 : tagIdx
      cate.value = cate.tags[cate.activeIdx] || null
      // var {
      //   filterBrief,
      //   filters
      // } = parser.updateFilter(this.filters)
      // this.filters = filters
      // this.filterBrief = filterBrief
      this.getTreeByFilter()
    },
    // 点击筛选器简介
    clickFilterBrief ({
      docid,
      h5url
    }) {
      if (docid) {
        baike.goToUrl(`/mobile/article.html?docid=${docid}&name=${this.disease}`)
      } else if (h5url) {
        baike.goToUrl(h5url)
      }
    },
    // 点击标签
    clickTag (cate, tagL1, tagL2) {
      if (tagL1.doc && tagL1.doc.docid) {
        baike.goToUrl(`/mobile/article.html?docid=${tagL1.doc.docid}&name=${this.disease}`)
      } else if (cate && tagL1) {
        var filters = filterParser.getFilterID(this.id, 1)
        var filterLabels = filterParser.getFilterLabel(this.id, 1).join('|')
        var filterSelected = filterParser.getFilterID(this.id, 2)
        if (tagL2) {
          baike.goToUrl(`/mobile/tag_article.html?name=${this.disease}&cate=${this.name}|${cate.label}|${tagL1.label}&filterSelected=${filterSelected}&filterLabel=${encodeURIComponent(filterLabels)}&filterTreeId=${this.id}&tag=${encodeURIComponent(tagL2.label)}&tagId=${tagL2.id}&parflag=1&type=5&filter=${encodeURIComponent(filters.join('|'))}&src=cancer`)
        } else {
          baike.goToUrl(`/mobile/tag_article.html?name=${this.disease}&cate=${this.name}|${cate.label}&filterSelected=${filterSelected}&filterLabel=${encodeURIComponent(filterLabels)}&filterTreeId=${this.id}&tag=${encodeURIComponent(tagL1.label)}&tagId=${tagL1.id}&parflag=1&type=5&filter=${encodeURIComponent(filters.join('|'))}&src=cancer`)
        }
      }
    },
    // 点击下拉型筛选器
    filterSelected (index, selectedOption, id) {
      // var {
      //   filterBrief,
      //   filters
      // } = parser.updateFilter(this.filters)
      var {
        filterBrief,
        filters
      } = filterParser.update(this.id, this.filters.map(f => {
        // if (f.type === 1) {
        //   return f.value ? f.value.label : '全部' + f.label
        // }
        return f.value ? f.value.label : '全部' + f.label
      }))
      this.filters = filters
      this.filterBrief = filterBrief
      this.getTreeByFilter()
    },
    // 获取筛选结果
    getTreeByFilter (option) {
      // 没有选中三级则不拉取
      // if (this.filters[2] && this.filters[2].activeIdx < 0) {
      //   this.treetags = []
      //   return
      // }
      if (this.filters.length && this.filters[this.filters.length - 1] && this.filters[this.filters.length - 1].activeIdx < 0) {
        this.treetags = []
        return
      }

      // 获取筛选器id
      var tagids = filterParser.getFilterID(this.id)

      // 拉取筛选结果
      var options = {
        loaderID: ['GetOverviewTreeV3ByTags', this.disease, this.id].join('_'),
        dataKey: 'treetags',
        keyGenerator: (params) => {
          return params.tagids.join('|')
        }
      }
      var params = {
        name: this.disease,
        id: this.id,
        tags: [],
        tagids
      }
      memoryLoader.load('get', '/mobile/GetOverviewTreeV3ByTags', options, params)
        .then(({ data }) => {
          var {
            treetags
          } = parser.getTreeTags(data, true)
          this.treetags = treetags
          if (!this.treetags.length || !this.treetags.reduce((result, tag) => result + tag.treetags.length, 0)) {
            // this.toastShow = true
            this.$msg.toast('无内容 请修改筛选条件', 'warn')
            // setTimeout(() => {
            //   this.toastShow = false
            // }, 1500)
          }
        }, error => {
          if (error && !(error.code >= 200 && error.code < 300)) {
            this.$msg.toast('数据加载失败，请重试', '', 1500, 'slide-up')
          }
        })
    },
    // 根据docid拉取文章数据
    getArticle (docid) {
      var options = {
        dataKey: 'data',
        keyGenerator: (params) => {
          return params.docid
        }
      }
      var params = { docid }
      return memoryLoader.load('get', '/mobile/init_article', options, params)
        .then(({ data }) => {
          this.article = data
        }, error => {
          if (error && !(error.code >= 200 && error.code < 300)) {
            this.$msg.toast('数据加载失败，请重试', '', 1500, 'slide-up')
          }
        })
    },
    // 显示滚轮筛选器
    showPicker (ptag) {
      if (typeof ptag === 'string') {
        baike.mtaReport(ptag)
      }
      this.pickerShow = !this.pickerShow
    },
    // 重置滚轮筛选器
    resetPicker () {
      baike.mtaReport('selectorpad_reset')
      var picker = this.$refs.picker
      if (!picker) return
      this.filters.forEach((filter, index) => {
        if (filter.tags && filter.tags[0]) {
          picker.setSlotValue(index, filter.tags[0].label)
        }
      })
      picker.slotValueChange()
      // this.$msg.toast('已恢复默认阶段', 'success')
    },
    // 改变滚轮筛选器
    changePicker (picker) {
      this.filters.forEach((filter, index) => {
        if (filter.type === 1) {
          filter.value = filter.tags.filter(tag => tag.label === picker.getSlotValue(index))[0] || filter.value
        }
      })
      this.filterSelected()
      this.$nextTick(() => {
        this.filters.forEach((filter, index) => {
          if (filter.type === 1 && picker.$children[index]) {
            picker.$children[index].doOnValueChange()
          }
        })
      })
    },
    // 显示筛选器关联文章
    showArticle () {
      if (this.articleShow) {
        this.articleShow = false
        return
      }
      if (this.filterBrief && this.filterBrief.docid) {
        this.getArticle(this.filterBrief.docid).then(() => {
          this.articleShow = true
        })
      }
    },
    bind () {
      window.addEventListener('pagehide', () => {
        this.pageHideSetCache()
      })
    },
    pageHideSetCache () {
      baike.sstore.setItem('cancer_filter' + this.id, {
        filterBrief: this.filterBrief,
        filters: this.filters,
        treetags: this.treetags
      }, 7 * 24 * 60)
    }
  }
}

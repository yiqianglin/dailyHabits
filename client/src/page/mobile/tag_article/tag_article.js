/* global $, baike */
import Vue from 'vue'
import { Popup, Picker } from 'mint-ui'
import 'src/libs/swiper/swiper.min.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import tmenu from 'components/tmenu/tmenu.vue'
import paper from 'components/paper/paper.vue'
import papertagMultiline from 'components/tagTabCommon/multiLine.vue'
import papertagMultilineOutter from 'components/tagTabCommon/multiLineOutter.vue'
import pageLoader from 'src/js/pageLoader'
import memoryLoader from 'src/js/memoryLoader'
import loading from 'components/loading/loading.vue'

import filterParser from '../cancer/cards/filter/filterParser'

Vue.use(VueAwesomeSwiper /* { default global options } */)

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
  data () {
    return {
      show: false,
      name: baike.query('name'), // 疾病
      cate: baike.query('cate'), // 父级标签
      tag: baike.query('tag'), // 选中标签
      tagId: baike.query('tagId'), // 选中标签对应的id
      docType: baike.query('docType'), // 文章类型, 默认获取文章+视频, 0: 全部, 8: 视频, 101:临床招募
      type: baike.query('type'), // 疾病类型，0: 普通页, 1: 精品页, 2: 母词条, 3: 症状, 4: 肿瘤页, 5: 新版肿瘤页
      src: baike.query('src') || baike.query('fromurl'), // 来源、入口页面：cancer、overview_zl
      filter: baike.query('filter'), // 标签过滤器
      filterLabel: baike.query('filterLabel'), // 标签过滤器名称
      filterSelected: baike.query('filterSelected'), // 已选滚轮
      parflag: baike.query('parflag') || 0, // 返回父节点
      filterTreeId: baike.query('filterTreeId'), // 标签树里含有筛选器的二级标签id
      filterList: [], // 筛选器
      filterLoading: false, // 筛选器加载中
      pickerBtnShow: false, // 是否显示滚轮筛选器按钮
      pickerShow: false, // 是否显示滚轮筛选器
      swiperOps: null,
      tagIndex: 0, // 一级标签索引
      tags: [], // 标签列表
      showIntroPanel: false, // 是否显示简介卡片
      showFixPaperTag: false // 是否显示吸顶二级标签列表
    }
  },
  components: {
    tmenu,
    paper,
    papertagMultiline,
    papertagMultilineOutter,
    loading,
    Popup,
    Picker
  },
  activated () {
    this.bind()
  },
  created () {
    this.init(false)
  },
  destroyed () {
    $(window).off('scroll', this.load)
  },
  deactivated () {
    $(window).off('scroll', this.load)
  },
  mounted () { },
  computed: {
    // 导航标题
    menuTitle () {
      let name = ''
      if (this.src === 'home_cancer') {
        // 入口：肿瘤篇底部tab
        // name - 取展示标签
        name = this.tag
      } else if (this.src === 'article_related_link' && this.tags[0]) {
        // 入口：文章关联内容链接
        // name - 取首标签名
        name = this.tags[0].name
      } else if (this.src === 'relation_map') {
        // 入口：知识图谱
        // name - 取父节点标签名
        name = this.name + '-' + this.cate.split('|')[0]
      } else {
        // 入口：疾病词条
        // name - 取疾病名 + 父级标签（单标签取首标签名）
        name = this.name + '-' + (this.tags.length === 1 ? this.tags[0].name : this.cate)
      }
      return name
    },
    // 滚轮的筛选列
    filterSlots () {
      return this.filterList.filter(f => f.type === 1).map(filter => {
        return {
          flex: 1,
          defaultIndex: filter.value ? filter.tags.map(tag => tag.label).indexOf(filter.value.label) : 0,
          values: filter.tags.map(tag => tag.label)
        }
      })
    }
  },
  watch: {
    showIntroPanel: togglePopup,
    pickerShow (newVal, oldVal) {
      togglePopup(newVal, oldVal)
      if (!newVal) {
        this.resetByFilter()
      }
    }
  },
  methods: {
    // 设置分享参数
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    init (stay = false) {
      // 获取标签列表
      let getTagList = null
      // 获取选中标签文章
      let getTagDocs = null

      if (this.src === 'home_cancer') {
        // 入口：肿瘤篇底部tab
        // 参数：
        // name - 展示标签
        // tag - 检索标签
        // docType - 对应GetDocsDataByTags的type，文章类型, 默认获取文章+视频, 1: 文章+视频, 8: 视频, 101:临床招募
        getTagList = Promise.resolve([{ name: this.name, tag: this.tag }])
        getTagDocs = this.getDocsDataByTags(this.tag, this.docType)
      } else if (this.src === 'article_related_link') {
        // 入口：文章关联内容链接
        // 参数：
        // name - 疾病名
        // tagId - 标签id
        getTagList = this.getInTagTreeNameById()
        getTagDocs = this.getDocsDataByTags(this.name + '|' + this.tagId)
      } else if (this.src === 'relation_map') {
        // 入口：知识图谱
        // 参数：
        // name - 疾病名
        // cate - 父节点的标签 | 中心节点的标签
        // tag - 选中节点的标签
        getTagList = this.getDiseaseKnowGraphInfo()
        getTagDocs = this.getDocsDataByTags(this.name + '|' + this.tag)
      } else if (this.src === 'cancer' && this.filterTreeId) {
        // 入口：卡片版肿瘤筛选器
        // 参数：
        // name - 疾病
        // cate - 父级标签
        // tag - 选中标签
        // tagId - 选中标签id
        // parflag - 返回父节点
        getTagList = this.getDiseaseAllDocsTags(this.parflag, this.filter)
        getTagDocs = this.tagId || this.tag ? this.getDocsDataByTags((this.filter || '') + ' ' + (this.tagId || this.tag)) : Promise.resolve({})
      } else {
        // 入口：疾病词条
        // 参数：
        // name - 疾病
        // cate - 父级标签
        // tag - 选中标签
        // tagId - 选中标签id
        // type - 对应GetDocsDataByTags的type，0: 普通页, 1: 精品页, 2: 母词条, 3: 症状, 4: 肿瘤页, 5: 新版肿瘤页
        // parflag - 返回父节点
        getTagList = this.getDiseaseAllDocsTags(this.parflag, this.filter)
        getTagDocs = this.tagId || this.tag ? this.getDocsDataByTags(this.name + '|' + (this.tagId || this.tag) + (this.filter ? '|' + this.filter : '')) : Promise.resolve({})
      }

      Promise.all([
        getTagList,
        getTagDocs
      ]).then(([tagList, { loaded, list, response }]) => {
        this.show = true
        // 初始化标签列表
        this.initTagList(tagList, response ? { tagId: this.tagId, tag: this.tag, docs: list, topdocs: baike.resolveTpl(response.topdocs), loaded } : null, stay)
        // 初始化swiper组件
        this.swiperOps = {
          direction: 'horizontal',
          autoplay: 0,
          initialSlide: this.tagIndex,
          autoHeight: true,
          noSwiping: true, // 卡片介绍，禁止滚动
          onInit: (swiper) => {
            this.swiper = swiper
          },
          onTransitionEnd: (swiper) => {
            if (swiper.activeIndex !== this.tagIndex) {
              baike.mtaReport(swiper.activeIndex > this.tagIndex ? 'articlelist_rightsilde' : 'articlelist_leftsilde')
              // 切换后拉取对应标签的文章
              this.clickTag(swiper.activeIndex)
            }
          }
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'tag_article_page',
          ispage: 1
        })
      }, error => {
        if (error && !(error.code >= 200 && error.code < 300)) {
          this.$msg.toast('数据加载失败，请重试', '', 1500, 'slide-up')
        }
      })
    },
    // 根据id获取标签名
    getInTagTreeNameById () {
      const options = {
        dataKey: 'tag',
        keyGenerator: (params) => {
          return params.disease + params.id
        }
      }
      const params = { disease: this.name, id: this.tagId }
      const url = '/mobile/GetInTagTreeNameById'
      return memoryLoader.load('post', url, options, params)
        .then(({ data }) => {
          // 只有单个标签
          return Promise.resolve([{ name: data, tag: this.tagId }])
        }, error => Promise.reject(error))
    },
    // 获取知识图谱节点
    getDiseaseKnowGraphInfo () {
      const options = {
        dataKey: 'trunks',
        keyGenerator: (params) => {
          return params.name + params.tag
        }
      }
      const tag = this.cate.split('|').pop()
      const params = { name: this.name, tag }
      const url = '/mobile/getDiseaseKnowGraphInfo'
      return memoryLoader.load('post', url, options, params)
        .then(({ data, store }) => {
          // 断言：同级标签返回相同结果
          data.forEach(tag => {
            store[this.name + tag.name] = data
          })
          // 标签列表为选择节点 + 兄弟节点
          return Promise.resolve([{ name: tag }].concat(data))
        }, error => Promise.reject(error))
    },
    // 根据id或标签名获取同级标签列表
    getDiseaseAllDocsTags (parflag = 1, filter = '') {
      const options = {
        keyGenerator: (params) => {
          return params.name + params.title + params.tag + params.type + params.tagslist.join('|')
        }
      }
      const params = { name: this.name, title: this.cate, tag: this.tag, type: this.type, parflag, tagslist: [filter] }
      const url = '/mobile/getDiseaseAllDocsTags'
      return memoryLoader.load('post', url, options, params)
        .then(({ data, store }) => {
          let tags = data.partags && data.partags.length ? data.partags : data.tags
          // 断言：同级标签返回相同结果
          tags.forEach(tag => {
            store[params.name + params.title + tag.name + params.type + params.tagslist.join('|')] = data
          })
          return Promise.resolve(tags)
        }, error => Promise.reject(error))
    },
    /**
     * 根据标签获取文章
     *
     * @param {*} name 标签，以 | 分隔
     * @param {number} [type=1] 文章类型
     * @param {number} [parflag=0] 获取父节点
     * @param {number} [loadType=0] 加载行为：1 - 点击标签，2 - 上拉
     * @returns
     */
    getDocsDataByTags (name, type = 0, loadType = 1) {
      const options = {
        listKey: 'docs',
        totalKey: 'count',
        getTpl: true,
        resetSignal: baike.query('VNK')
      }
      const params = {
        name,
        type,
        doctopflag: 1
      }
      const url = this.src === 'cancer' && this.filterTreeId ? '/mobile/saGetDocsDataByTags' : '/mobile/getDocsDataByTags'
      return pageLoader.load(url, options, params, (loader, ops) => {
        // 首次拉取10篇，后续15篇
        ops.count = loader.list.length ? 15 : 10
        // tab切换直接返回已有数据
        return !(loadType === 1 && (loader.list.length || loader.loaded))
      })
    },
    // 初始化标签列表
    initTagList (tags = [], initTag, stay = false) {
      let tagL1Index = -1
      this.tags = tags.map((tagL1, tagL1Idx) => {
        let tagL2Index = -1
        let children = (tagL1.tags || []).map((tagL2, tagL2Idx) => {
          // 卡片版肿瘤页，一级二级标签都要相同
          let equalL2 = initTag && (initTag.tagId ? (tagL2.tag === initTag.tagId) : (tagL2.tag === initTag.tag || tagL2.name === initTag.tag))
          tagL2Index = equalL2 ? tagL2Idx : tagL2Index
          tagL1Index = equalL2 ? tagL1Idx : tagL1Index
          return {
            name: tagL2.name,
            tag: tagL2.tag || tagL2.name,
            treeinfo: tagL2.treeinfo,
            topdocs: equalL2 ? initTag.topdocs : []
          }
        })
        let equalL1 = initTag && (tagL1.tag === initTag.tagId || tagL1.tag === initTag.tag || tagL1.name === initTag.tag)
        // 有二级标签但拉取的是父标签的数据则不展示
        let showInitData = (equalL1 && !children.length) || (children.length && tagL2Index > -1)
        tagL1Index = equalL1 ? tagL1Idx : tagL1Index
        return {
          name: tagL1.name,
          tag: tagL1.tag || tagL1.name,
          treeinfo: tagL1.treeinfo,
          // 标签简介
          intro: equalL1 ? tagL1.treeinfo : tagL2Index > -1 ? children[tagL2Index].treeinfo : null,
          docs: showInitData ? initTag.docs : [],
          topdocs: showInitData ? initTag.topdocs : [],
          loaded: showInitData ? initTag.loaded : false,
          tagIndex: Math.max(tagL2Index, 0),
          // 子节点
          children
        }
      })
      tagL1Index = Math.max(tagL1Index, 0)
      // 更新当前标签索引，拉取标签文章
      this.clickTag(tagL1Index)

      // 卡片版肿瘤，多个二级标签，单文章不跳转
      let stayOnlevel4 = this.tags[this.tagIndex] && this.tags[this.tagIndex].children.length > 1 && this.name && this.tag && this.cate.split('|').length > 1
      // 卡片或目录树，单文章跳转
      if (!stay && initTag && (initTag.docs.length + initTag.topdocs.length) === 1 && ['overview_zl', 'cancer'].indexOf(this.src) !== -1 && !stayOnlevel4) {
        var { docid, diseases, paraid } = initTag.docs[0] || initTag.topdocs[0]
        if (docid) {
          var name = (diseases && diseases[0] && diseases[0].name) || ''
          var ptag = baike.query('ptag')
          baike.goToUrl(`/mobile/article.html?docid=${docid}&ptag=${ptag}&name=${name}${paraid ? '#' + paraid : ''}`, true)
        }
      }
    },
    // 根据索引拉取对应标签的文章
    getDocsDataByTagIndex (tagL1Idx, loadType = 1) {
      let tagL1 = this.tags[tagL1Idx]
      if (!tagL1) return Promise.reject(new Error('tag 不存在'))
      let tagL2Idx = tagL1.tagIndex
      let tagL2 = tagL1.children[tagL2Idx]
      let tag = tagL2 || tagL1
      let name = ''
      let type = 0
      if (this.src === 'home_cancer') {
        // 入口：肿瘤篇底部tab
        // 参数：
        // name - 取检索标签tag
        // type - 取文章类型docType
        name = tag.tag
        type = this.docType
      } else if (this.src === 'article_related_link') {
        // 入口：文章关联内容链接
        // 参数：
        // name - 取疾病名 + 标签Id
        name = this.name + '|' + tag.tag
      } else if (this.src === 'relation_map') {
        // 入口：知识图谱
        // 参数：
        // name - 取疾病名 + 标签
        name = this.name + '|' + tag.tag
      } else if (this.src === 'cancer' && this.filterTreeId) {
        // 入口：卡片版肿瘤筛选器
        // 参数：
        // name - 取标签 + 末级滚轮筛选器
        name = (this.filter || '') + ' ' + tag.tag
      } else {
        // 入口：疾病词条
        // 参数：
        // name - 取疾病名 + 标签
        name = this.name + '|' + tag.tag + (this.filter ? '|' + this.filter : '')
      }

      // tab切换重置数据，下拉不重置
      if (loadType === 1) {
        tagL1.intro = null
        tagL1.topdocs = []
        tagL1.docs = []
        tagL1.loaded = false
      }
      return this.getDocsDataByTags(name, type, loadType).then(data => {
        let { list, loaded, response: { topdocs } } = data
        // 设置当前标签的必读精选文章
        tag.topdocs = topdocs && topdocs.length ? baike.resolveTpl(topdocs) : tag.topdocs
        // 设置要展示的标签简介、必读精选、延展阅读、加载完成标记
        tagL1.intro = tag.treeinfo
        tagL1.topdocs = tag.topdocs
        tagL1.docs = list
        tagL1.loaded = loaded
        return Promise.resolve(data)
      }, error => {
        if (error && !(error.code >= 200 && error.code < 300)) {
          return Promise.reject(error)
        }
      })
    },
    // 点击一级标签
    clickTag (tagL1Idx, tagL2Idx) {
      let tagL1 = this.tags[tagL1Idx]
      if (!tagL1) return
      tagL2Idx = typeof tagL2Idx === 'number' ? tagL2Idx : tagL1.tagIndex
      let tagL2 = tagL1.children[tagL2Idx]
      let tag = tagL2 || tagL1
      if (tagL2) {
        // 更新二级标签
        tagL1.tagIndex = tagL2Idx
      }
      if (this.tagIndex !== tagL1Idx) {
        // 切换一级标签：返回顶部、更新url
        this.$nextTick(() => {
          $(window).scrollTop(0)
          this.scrollToTag(tagL1Idx)
        })
      }
      this.updateUrl(tagL1Idx, tag.name, tag.tag)
      this.tagIndex = tagL1Idx
      // 拉取选中标签的文章
      this.getDocsDataByTagIndex(tagL1Idx, 1)
      if (this.src === 'cancer' && this.filterTreeId) {
        this.getDiseaseFilterBySelected(tag.tag)
      }
    },
    // 点击二级标签
    clickTagL2 (index) {
      this.clickTag(this.tagIndex, index)
    },
    // 调整一级标签位置和切换swiper
    scrollToTag (index) {
      var listElem = $('.tag-list')
      var tagsElem = $('.tag-list li')
      var barElem = $('.tmenu')
      if (!listElem.length || !tagsElem.length || !barElem.length) return

      var indexLeft = Math.min(Math.max(index, 0), tagsElem.length - 1)
      var diff = (barElem[0].offsetWidth - tagsElem[indexLeft].offsetWidth) / 2
      listElem[0].scrollLeft = tagsElem[indexLeft].offsetLeft < diff ? 0 : tagsElem[indexLeft].offsetLeft - diff

      // 切换swiper
      if (this.swiper && this.swiper.activeIndex !== index) {
        this.swiper && this.swiper.slideTo(index, 0)
      }
    },
    // 同步url和分享数据
    updateUrl (index = 0, tag = '', tagId = '') {
      var url = window.location.href
      var preTag = baike.query('tag')
      var preTagId = baike.query('tagId')
      this.tag = tag || this.tag
      this.tagId = tagId || this.tagId
      if (this.src === 'home_cancer' || this.src === 'article_related_link') {
        url = url.replace(/\bptag=([^&#]*)/, 'ptag=')
      } else if (this.src === 'relation_map') {
        // 入口：知识图谱
        // 参数：
        // name - 疾病名
        // cate - 父节点的标签 | 中心节点的标签
        // tag - 选中节点的标签
        url = url.replace(/\bptag=([^&#]*)/, 'ptag=').replace(/\btag=([^&#]*)/, `tag=${encodeURIComponent(tag)}`)
      } else {
        // 入口：疾病词条
        // 参数：
        // name - 疾病
        // cate - 父级标签
        // tag - 选中标签
        // tagId - 选中标签id
        url = url.replace(/\bptag=([^&#]*)/, 'ptag=')
        url = preTag ? url.replace(/\btag=([^&#]*)/, `tag=${encodeURIComponent(tag)}`) : url + `&tag=${encodeURIComponent(tag)}`
        url = preTagId ? url.replace(/\btagId=([^&#]*)/, `tagId=${encodeURIComponent(tagId)}`) : url
      }

      window.history.replaceState({}, document.title, url)
      // 重置分享数据
      this.setShare({
        link: url
      })
      baike.mtaReport('pv')
    },
    // 下拉加载
    load (event) {
      if (!this.show) return
      var scrollTop = $(window).scrollTop()
      var scrollHeight = $('body').height()
      var windowHeight = $(window).height()
      if (scrollTop >= scrollHeight - windowHeight) {
        this.getDocsDataByTagIndex(this.tagIndex, 2)
      }
    },
    // 事件绑定：下拉加载
    bind () {
      var $window = $(window)
      $window.on('scroll', this.load)
    },
    // 介绍面板，点击展开按钮，或者收起
    introPanelChange () {
      $(window).scrollTop(0)
      this.showIntroPanel = !this.showIntroPanel
    },
    // 设置吸顶标签的显示
    fixedStatusOnChange (status) {
      this.showFixPaperTag = status
    },
    // 顶部导航回调：显示主搜
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.name })
      }
    },
    // 根据标签获取筛选器
    getDiseaseFilterBySelected (tagId) {
      const options = {
        dataKey: 'treetags',
        keyGenerator: (params) => {
          return params.name + params.id + params.tagids.join('_') + Date.now()
        }
      }
      const params = { name: this.name, id: this.filterTreeId, tagids: [this.filterSelected, tagId] }
      const url = '/mobile/getDiseaseFilterBySelected'
      this.filterLoading = true
      return memoryLoader.load('post', url, options, params)
        .then(({ data }) => {
          this.pickerBtnShow = data && data.length
          if (!this.pickerBtnShow) return
          let filterList = data
          let labels = this.filterList.map(f => f.label)
          let selected = this.filterList.map(f => {
            return f.value ? f.value.label : '全部' + f.label
          })
          if (!this.filterList || !this.filterList.length) {
            selected = this.filterLabel.split('|')
          }
          this.filterParser = filterParser.init(params.name + params.id + this.filter + tagId, [], filterList, labels)
          this.filterParser.update(selected)
          this.filterList = this.filterParser.filters
          this.filterLoading = false
          this.$nextTick(() => {
            var picker = this.$refs.picker
            if (picker) {
              selected.forEach((f, index) => {
                picker.setSlotValue(index, f)
              })
              picker.slotValueChange()
            }
          })
        })
    },
    // 根据筛选结果重置
    resetByFilter () {
      var filter = this.filterParser.getFilterID(1).join('|')
      if (filter === this.filter) return
      $(window).scrollTop(0)
      this.filter = filter
      this.filterLabel = this.filterParser.getFilterLabel(1).join('|')
      this.filterSelected = this.filterParser.getFilterID(2).join('|')
      // var url = window.location.href.replace(/\bfilter=([^&#]*)/, `filter=${encodeURIComponent(this.filter)}`).replace(/\bfilterLabel=([^&#]*)/, `filterLabel=${encodeURIComponent(this.filterLabel)}`)
      // window.history.replaceState({}, document.title, url)
      // // 重置分享数据
      // this.setShare({
      //   link: url
      // })
      this.init(true)
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
      // baike.mtaReport('selectorpad_reset')
      var picker = this.$refs.picker
      if (!picker) return
      this.filterList.forEach((filter, index) => {
        if (filter.tags && filter.tags[0]) {
          picker.setSlotValue(index, filter.tags[0].label)
        }
      })
      picker.slotValueChange()
    },
    // 改变滚轮筛选器
    changePicker (picker) {
      this.filterList.forEach((filter, index) => {
        if (filter.type === 1) {
          filter.value = filter.tags.filter(tag => tag.label === picker.getSlotValue(index))[0] || filter.value
        }
      })
      var {
        filters
      } = this.filterParser.update(this.filterList.map(f => {
        return f.value ? f.value.label : '全部' + f.label
      }))
      this.filterList = filters
      this.$nextTick(() => {
        this.filterList.forEach((filter, index) => {
          if (filter.type === 1 && picker.$children[index]) {
            picker.$children[index].doOnValueChange()
          }
        })
      })
    }
  }
}

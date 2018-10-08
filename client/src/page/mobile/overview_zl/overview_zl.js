/* global $, baike */
import tmenu from 'components/tmenu/tmenu.vue'
import paper from 'components/paper/paper.vue'
import papertag from 'components/_overview_zl_doclist/papertag.vue'
import loading from 'components/loading/loading.vue'
import {lockedReq} from 'src/js/specialReq.js'

export default {
  data () {
    return {
      name: '',
      cate: '',
      curTag: '',
      isShow: false,
      baseinfo: '', // 顶部疾病基本信息
      activeList: [], // 运营区
      trees: [], // 标签树，文章多的时候，展示的标签树文章
      followed: 0, // 是否已经关注
      wmdcount: 0, // 展示webmd一共的文章数
      pullUpStyle: '',
      lastEid1: '', // cookie记录标签树上次阅读位置
      lastEid2: '',
      lastEid3: '',
      cdocid: '',
      hash: '',
      isShowFilter: false, // 过滤器展现
      filterData: [],
      filterDataSelected: [], // 选择的数据
      docsList: [ // 文章少的时候显示，对应tab选择的文章列表
      ],
      tags: [], // 文章tabs
      tagSelectedIndex: 0,
      treeid: '',
      showType: 0, // 1展示标签树，2展现tab文章, 0则为空
      showTypeTemp: 0,
      hasSetFold: false, // 标签树是否定位过一次啊，定位过就不再定位
      toastShow: false, // 无命中文章，显示toast
      from: baike.query('from'),
      tagUp: false, // tabs上下箭头显示
      showArrow: true // tabs是否显示多行
    }
  },
  computed: {
    hasFilter () {
      if (!this.filterDataSelected.length) {
        return false
      } else {
        var hasFlag = this.filterDataSelected.find((item) => {
          return item.tags.length > 0
        }) || false
        return hasFlag
      }
    }
  },
  components: {
    tmenu,
    paper,
    papertag,
    loading
  },
  watch: {
    isShowFilter: 'disableScroll',
    tags (val) {
      var that = this
      that.$nextTick(function () {
        var tagUl = $('#tagUl').get(0)
        if (tagUl) {
          that.showArrow = tagUl.scrollWidth > tagUl.clientWidth
        }
      })
    }
  },
  activated () {
    // 单页缓存分享数据重置
    this.setShare(this.shareCache)
  },
  created: function () {
    var that = this
    that.name = baike.query('name') || ''
    that.cate = baike.query('cate') || ''
    that.curTag = baike.query('tag') || ''
    that.hash = location.hash.replace('#', '') || ''
    // sessionStorage判断，是否记录了过滤器数据和tab数据
    var sessionFiterDataSelected = window.sessionStorage.getItem(`overview_zl_filterDataSelected_${that.name}`)
    var sessionTabSelected = window.sessionStorage.getItem(`overview_zl_tabSelected_${that.name}`)
    var tempIndex = 0
    if (sessionFiterDataSelected) {
      try {
        this.filterDataSelected = JSON.parse(sessionFiterDataSelected)
      } catch (e) {
        console.log('JSON parse error')
      }
    }
    if (sessionTabSelected) {
      try {
        tempIndex = JSON.parse(sessionTabSelected).index
      } catch (e) {
        console.log('JSON parse error')
      }
    }
    that.getOverviewBaseinfo()
    that.getOverviewActiveData()
    that.getOverviewFilter(null, function () {
      that.tagclick(tempIndex)
    })
  },
  mounted: function () {
    this.bindEvent()
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    toAd: function (h5url, index, text) {
      if (h5url) {
        var that = this
        var reportKey = that.rkey && that.rkey.ad
        var ptag = ''
        if (reportKey) {
          ptag = reportKey + '|' + text + (index + 1)
        }
        baike.goToUrl(baike.replaceParam('ptag', ptag, h5url))
      }
    },
    getOverviewBaseinfo: function () {
      var that = this
      baike.get('/mobile/getOverviewBaseinfo', { name: that.name, type: 4 }, function (o) {
        if (o.retcode === 0) {
          var baseinfo = o.baseinfo
          if (baseinfo && baseinfo.length > 0) {
            var list = []
            baseinfo.forEach(function (item) {
              list.push(item['tid' + item.tid] || item)
            })
            that.name = list[0].name || that.name
            that.baseinfo = list
          }
          // that.related = o.related || []
          that.followed = o.follow
          that.isShow = true
          that.wmdcount = o.wmdcount
          // baike.setTitle('企鹅医典·' + that.name)
          // 微信JSSDK开发
          that.setShare({
            title: '企鹅医典·' + that.name,
            desc: that.baseinfo[0].definition || '传递健康与信赖'
          })
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'overview_zl_page',
          ispage: 1
        })
      }, true)
    },
    getOverviewActiveData: function () {
      var that = this
      baike.post('/mobile/getActiveData', { name: that.name, activetype: 7 }, function (o) {
        if (o.retcode === 0) {
          that.activeList = o.activelist
        }
      })
    },
    getOverviewTree (data, cb) {
      var that = this
      baike.get('/mobile/getOverviewTreeV2', { name: this.name, tags: data || [] }, (o) => {
        if (o.retcode === 0) {
          this.showTypeTemp = o.type
          if (o.docs.length === 0 && o.first.length === 0) {
            this.toastShow = true
            setTimeout(() => {
              this.toastShow = false
            }, 1500)
            return
          }
          this.trees = o.first
          this.tags = o.tags
          this.treeid = o.treeid
          if (o.docs.length) {
            var tmplist = []
            o.docs.forEach((item) => {
              if (item && item['tid' + item.tid]) {
                tmplist.push(item['tid' + item.tid])
              } else {
                tmplist.push(item)
              }
            })
            this.docsList = tmplist
          }
          this.showType = o.type
          if (o.type === 1 && !this.hasSetFold) {
            this.setFold(this.hash)
            this.hasSetFold = true
          }
          // 当docs或者first有数据，则要保存过滤器的选择，以免返回的时候没有过滤器状态
          window.sessionStorage.setItem(`overview_zl_filterDataSelected_${that.name}`, JSON.stringify(this.filterDataSelected))
          cb && cb()
        }
      })
    },
    getOverviewFilter (data, cb) {
      baike.post('/mobile/getOverviewFilter', { name: this.name, tags: data || [] }, (o) => {
        if (o.retcode === 0) {
          if (o.tagslist.length) {
            this.resetFilterDataSelected(o.tagslist)
            // 1.25 肺癌不显示
            if (this.name !== '肺癌') {
              this.filterData = o.tagslist
            }
            this.getOverviewTree(this.generateFormatFilterData(), cb)
          } else {
            console.log('筛选器内容为空')
            this.getOverviewTree(this.generateFormatFilterData(), cb)
          }
        }
      })
    },
    getDocsDataByTags () {
      var params = {
        offset: 0,
        count: 1000
      }
      var filterData = this.generateFormatFilterData().join('|')
      if (filterData) {
        params.name = `${this.treeid}|${filterData}|${this.tags[this.tagSelectedIndex]}`
      } else {
        params.name = `${this.treeid}|${this.tags[this.tagSelectedIndex]}`
      }
      baike.post('/mobile/getDocsDataByTags', params, (o) => {
        if (o.retcode === 0) {
          if (o.docs.length) {
            var tmplist = []
            o.docs.forEach((item) => {
              if (item && item['tid' + item.tid]) {
                tmplist.push(item['tid' + item.tid])
              } else {
                tmplist.push(item)
              }
            })
          }
          this.docsList = tmplist
        }
      })
    },
    followClick: function () {
      var that = this
      lockedReq({
        method: 'post',
        url: that.followed ? '/mobile/del_follow' : '/mobile/add_follow',
        callback: function (o) {
          if (o.retcode === 0) {
            if (!that.followed) {
              // MtaH5.clickStat('ydd_content_follow')
              that.$msg.toastAdd('focus')
            } else {
              // MtaH5.clickStat('ydd_content_unfollow')
            }
            that.followed = !that.followed
          }
        }
      }, { disease: that.name })
    },
    slideFirst: function (findex, id) { // 页面定位
      var that = this
      var curTree = that.trees[findex]
      baike.mtaReport((curTree.foldflag ? 'Tier1closeX:' : 'Tier1OpenX:') + id)
      curTree.foldflag = !curTree.foldflag
      var thirdNum = 0
      var second = curTree.second
      for (var i = 0, leni = second.length, itemi; i < leni; i++) {
        itemi = second[i]
        if (itemi.third && itemi.third.length > 0) {
          thirdNum += itemi.third.length
        }
      }
      if (thirdNum + second.length < 15) {
        for (let i = 0, leni = second.length; i < leni; i++) {
          second[i].foldflag = 1
        }
      }
    },
    slideSecond: function (findex, seindex, id) {
      if (this.trees[findex].second[seindex].foldflag) {
        baike.mtaReport('Tier2closeX:' + id)
      } else {
        baike.mtaReport('Tier2OpenX:' + id)
      }
      this.trees[findex].second[seindex].foldflag = !this.trees[findex].second[seindex].foldflag
    },
    toNewCard: function () { // 顶部运营位点击更多精选
      baike.goToUrl('/mobile/card.html?name=' + this.name + '&mode=3&ptag=onco_listcancer_more_clk')
    },
    hotListClick (type, params, index) {
      if (type === 3 || type === 1) {
        const { h5url } = params
        baike.goToUrl(baike.replaceParam('ptag', 'onco_listcancer_enterhotzonex:' + (index + 1), h5url, true))
      } else {
        const { docid } = params
        baike.goToUrl(`/mobile/article.html?docid=${docid}&name=${this.name}&ptag=HotZoneClkX:${index + 1}`)
      }
    },
    toActive: function (type, docid, h5url, index) {
      baike.mtaReport('HotZoneClkX:' + (index + 1))
      if (type === 1) {
        baike.goToUrl(h5url)
      } else {
        baike.goToUrl(`/mobile/article.html?docid=${docid}&name=${this.name}&ptag=HotZoneClkX:${index + 1}`)
      }
    },
    toArticle: function (docid, eid1, eid2, eid3) {
      eid1 = eid1 || ''
      eid2 = eid2 || ''
      eid3 = eid3 || ''
      // var curDom = (eid3 || eid2 || eid1)
      var curHeight = $('html').scrollTop()
      window.sessionStorage.setItem('curEid', JSON.stringify({ eid1: eid1, eid2: eid2, eid3: eid3, cdocid: docid, curHeight: curHeight }))
      baike.mtaReport('ArticleClkX:' + docid)
      baike.goToUrl(`/mobile/article.html?docid=${docid}&name=${this.name}`)
    },
    toTagArticle: function (cate, cate1, tag, eid1, eid2, eid3) {
      var filters = this.generateFormatFilterData()
      var filter = encodeURIComponent((filters || []).join('|'))
      var cates = tag !== '' ? cate + '|' + cate1 : cate
      tag = tag !== '' ? tag : cate1
      this.lastEid1 = eid1 || ''
      this.lastEid2 = eid2 || ''
      this.lastEid3 = eid3 || ''
      var ptag = 'Tier3ClkX:' + (eid3 || eid2 || eid1)
      // var curDom = (eid3 || eid2 || eid1)
      var curHeight = $('html').scrollTop()
      window.sessionStorage.setItem('curEid', JSON.stringify({ eid1: eid1, eid2: eid2, eid3: eid3, curHeight: curHeight }))
      baike.goToUrl(`/mobile/tag_article.html?name=${this.name}&cate=${cates}&tag=${tag}&type=4&ptag=${ptag}&filter=${filter}&src=overview_zl&tagId=${eid3 || eid2 || eid1 || ''}`)
    },
    toWebmd: function () {
      baike.goToUrl('/mobile/authority_wm.html?ptag=onco_listcancer_webmdentry&name=' + this.name)
    },
    toCommittee () {
      baike.goToUrl('/mobile/cancer_committee.html?ptag=onco_listcancer_commissionentry&name=' + this.name)
    },
    toDoctor (doctorId, clickable) {
      if (clickable === 0 || !doctorId) return
      baike.goToUrl('/mobile/doctor.html?doctor_id=' + doctorId)
    },
    setFold (foldId) { // 根据hash，或者sessionstorage设置打开的目录
      var that = this
      var curHeight = ''
      try {
        var curEid = window.sessionStorage.getItem('curEid') ? JSON.parse(window.sessionStorage.getItem('curEid')) : ''
        if (curEid) {
          that.lastEid1 = curEid.eid1 || ''
          that.lastEid2 = curEid.eid2 || ''
          that.lastEid3 = curEid.eid3 || ''
          that.cdocid = curEid.cdocid || ''
          // curHeight = curEid.curHeight
          // foldId = that.lastEid2 || that.lastEid1
        }
      } catch (e) {

      }
      if (!foldId) {
        curHeight = curEid.curHeight
        foldId = that.lastEid2 || that.lastEid1
      }
      if (foldId) {
        var trees = that.trees
        for (var i = 0, leni = trees.length, itemi, isIn = false; i < leni; i++) {
          itemi = trees[i]
          if (itemi.id === foldId) {
            isIn = true
            that.slideFirst(i, foldId)
          } else {
            if (itemi.second && itemi.second.length > 0) {
              for (var j = 0, lenj = itemi.second.length, itemj; j < lenj; j++) {
                itemj = itemi.second[j]
                if (itemj.id === foldId) { // 如果是2级目录，则只展开该2级目录，其它平行的2级目录不展开
                  isIn = true
                  itemi.foldflag = 1
                  itemj.foldflag = 1
                  break
                }
              }
            }
          }
          if (isIn) break
        }
        that.$nextTick(() => {
          var _curHeight = curHeight || ($('#' + foldId).length > 0 && ($('#' + foldId).offset().top - $('.tmenu').height()))
          _curHeight && $(window).scrollTop(_curHeight)
        })
      }
    },
    bindEvent: function () {
      var that = this
      // var $container = $('#main')
      var isFirst = true
      window.addEventListener('pageshow', function (event) {
        if (isFirst) {
          isFirst = false
          return
        }
        that.hasSetFold = true
        that.setFold()
      })
    },
    disableScroll: function (newVal, oldVal) {
      var that = this
      that.stopScroll = false
      if (newVal) {
        that.scrollTop = $(window).scrollTop()
        document.body.classList.add('disscroll')
        document.body.style.top = -that.scrollTop + 'px'
      } else {
        document.body.classList.remove('disscroll')
        // document.body.scrollTop = that.scrollTop
        $(window).scrollTop(that.scrollTop)
        document.body.style.top = ''
        that.stopScroll = true
      }
    },
    toggleFilter () { // 遮罩层弹出后，是否要关闭
      if (this.showTypeTemp === 0) {
        this.toastShow = true
        setTimeout(() => {
          this.toastShow = false
        }, 1500)
        return
      }
      this.isShowFilter = !this.isShowFilter
    },
    showFilter () { // 显示filter，即使showType为空，也可以展示筛选面板
      this.isShowFilter = true
    },
    judgeItemStatus (indexP, itemName) { // 根据index来判断是否选中
      if (this.filterDataSelected[indexP].singleflag === 1) {
        return this.filterDataSelected[indexP].tags[0] && this.filterDataSelected[indexP].tags[0].name === itemName
      } else {
        return !!this.filterDataSelected[indexP].tags.filter((item) => {
          return item.name === itemName
        }).length
      }
    },
    filterItemClick (indexP, filterItemS) { // 过滤器点击，记录选择项
      var that = this
      var inSelectedFlag = this.filterDataSelected[indexP].tags.filter((item, index) => {
        if (item.name === filterItemS.name) {
          this.filterDataSelected[indexP].tags.splice(index, 1)
          return true
        }
        return false
      }).length
      if (this.filterData[indexP].singleflag === 1) { // 如果是单选
        if (!inSelectedFlag) {
          this.filterDataSelected[indexP].tags = [filterItemS]
        }
      } else {
        if (!inSelectedFlag) {
          this.filterDataSelected[indexP].tags = this.filterDataSelected[indexP].tags.concat(filterItemS).sort((a, b) => {
            return a.name - b.name
          })
        }
      }
      // 点击了filter，要清除tab的记录，并重置当前tab
      window.sessionStorage.removeItem(`overview_zl_tabSelected_${that.name}`)
      that.tagSelectedIndex = 0
      var formatData = this.generateFormatFilterData()
      this.getOverviewFilter(formatData)
    },
    generateFormatFilterData () { // 生成对应筛选提交的数据
      var resultList = []
      this.filterDataSelected.forEach((item) => {
        if (item.tags.length !== 0) {
          var tempList = []
          item.tags.forEach((item) => {
            tempList.push(item.name)
          })
          resultList.push(tempList.join('|'))
        }
      })
      return resultList
    },
    resetFilterDataSelected (newData) { // 重新拉取配置后，如果原本选中项，在新配置中还存在，则继续保持选中，否则，清除
      var resultList = [] // 最后结果
      newData.forEach((newItem, newIndex) => {
        var matchItem = null
        var hasTitle = this.filterDataSelected.find((selectedItem, selectedIndex) => {
          matchItem = selectedItem
          return newItem.title === selectedItem.title
        })
        if (hasTitle) { // 如果有这个父选项，则要遍历一遍tags，否则直接赋值新的
          let temp = JSON.parse(JSON.stringify(newItem))
          temp.tags = []
          matchItem.tags.forEach((selectedSItem, selectedSIndex) => {
            var hasItem = newItem.tags.find((newSItem, newSIndex) => {
              return selectedSItem.name === newSItem.name
            })
            if (hasItem) {
              temp.tags.push(selectedSItem)
            }
          })
          resultList.push(temp)
        } else {
          let temp = JSON.parse(JSON.stringify(newItem))
          temp.tags = []
          resultList.push(temp)
        }
      })
      this.filterDataSelected = resultList
    },
    filterSumbit () {
      this.getOverviewTree(this.generateFormatFilterData(), () => {
        this.isShowFilter = false
      })
    },
    filterCancel () {
      this.filterDataSelected.forEach((item) => {
        item.tags = []
      })
      this.getOverviewTree(this.generateFormatFilterData())
    },
    tagclick (index) {
      var that = this
      if (that.tagSelectedIndex === index) { // 重复点击取消
        return
      } else {
        that.tagSelectedIndex = index
      }
      // var tagUp = that.tagUp
      that.tagUp = false
      // if (tagUp) { // 需要移动位置
      that.$nextTick(function () {
        var $tagUl = $('#tagUl')
        try {
          $tagUl.scrollLeft($tagUl.find('li').eq(index).position().left + $tagUl.scrollLeft() - 30)
        } catch (e) { }
      })
      // }
      // 需要记住tab的选择，和位置，防止用户返回丢失
      window.sessionStorage.setItem(`overview_zl_tabSelected_${that.name}`, JSON.stringify({ index: index, title: this.tags[index] }))
      this.getDocsDataByTags()
    },
    clickArrow () {
      var that = this
      that.tagUp = !that.tagUp
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.name })
      }
    }
  }
}

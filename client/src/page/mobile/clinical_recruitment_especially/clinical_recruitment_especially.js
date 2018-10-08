/* global $, baike */
import tmenu from 'components/tmenu/tmenu.vue'
import fixedEntranceBtn from 'components/clinicalRecruitmentEspecially/fixedEntranceBtn.vue'
import selectPanel from 'components/clinicalRecruitmentEspecially/selectPanel.vue'
import confirmDialog from 'components/clinicalRecruitmentEspecially/confirmDialog.vue'
import communicationPanel from 'components/clinicalRecruitmentEspecially/communication.vue'
import 'components/paper/paper.scss'
import search from 'components/search/search.vue'
import { pageLoad } from 'src/js/specialReq.js'
import picker from 'components/clinicalRecruitmentEspecially/picker/picker.vue'

var util = {
  resolveDocList: function (docs) {
    var result = docs.map(function (doc) {
      if (doc && doc['tid' + doc.tid]) {
        return doc['tid' + doc.tid]
      } else {
        return doc
      }
    })
    return result
  }
}

var pickerData = [
  {
    name: '乳腺癌',
    city: ['请选择', '北京', '杭州', '上海', '南京', '郑州', '福州', '广州', '常州', '哈尔滨', '长春', '成都', '济南', '长沙', '沈阳', '蚌埠', '武汉', '石家庄', '大连', '西安', '南宁', '天津', '扬州', '郑州', '青岛', '徐州', '临沂', '滨州', '合肥', '衡水', '重庆', '昆明', '南昌', '沧州', '遵义'],
    tradeName: ['请选择', '靶向治疗', '免疫治疗', '化疗']
  },
  {
    name: '肺癌',
    city: ['请选择', '广州', '厦门', '上海', '郑州', '常州', '南京', '长沙', '海口', '南通', '郴州', '汕头', '沧州', '西安', '昆明', '安庆', '萍乡', '漳州', '天津', '合肥', '北京', '柳州', '南昌', '临沂', '沈阳', '包头', '南宁', '杭州', '乌鲁木齐', '哈尔滨', '扬州', '襄阳', '遵义', '泰州', '苏州', '海口', '蚌埠', '成都', '长春', '重庆', '武汉', '石家庄', '温州', '台州', '邢台', '新乡', '济宁', '济南', '威海', '徐州', '厦门', '齐齐哈尔', '无锡', '连云港', '韶关', '东莞', '泸州', '衡阳', '常州', '兰州', '新乡', '贵阳', '深圳', '十堰', '宜宾', '泸州', '荆州', '武威'],
    tradeName: ['请选择', '靶向治疗', '免疫治疗']
  }
]

export default {
  data () {
    return {
      queryDisease: baike.query('name'),
      queryDrugName: baike.query('drugName'),
      category: 'disease', // disease drug 当前页面分类
      filterShow: false,
      filterData: [],
      filterSelected: 0,
      feedsContent: { // 根据疾病拉取的内内容列表
        data: [],
        loaded: false,
        isEmpty: false
      },
      otherContent: { // 其他相关内容
        data: [],
        loaded: false,
        isEmpty: false
      },
      scrollTop: 0,
      // 应用搜索
      showAppSearch: false,
      confirmIsShow: false, // 招募通道协议对话框
      dialogAchieveEnd: false, // 协议是否滚动底部了
      registrationRepeatIsShow: false, // 重复报名确认框
      communicationIsShow: false, // 微信加群面板
      selectPanelIsShow: false, // 填写个人信息、微信加群 选择面板
      tradeNamePickerIsShow: false,
      cityPickerIsShow: false,
      cityPickerData: {
        name: '城市选择',
        slot: [
          {
            flex: 1,
            values: baike.query('name') === '乳腺癌' ? pickerData[0].city : pickerData[1].city,
            defaultIndex: 0,
            currentValue: '请选择'
          }
        ]
      },
      tradeNamePickerData: {
        name: '治疗类型',
        slot: [
          {
            flex: 1,
            values: baike.query('name') === '乳腺癌' ? pickerData[0].tradeName : pickerData[1].tradeName,
            defaultIndex: 0,
            currentValue: '请选择'
          }
        ]
      }
    }
  },
  components: {
    tmenu,
    fixedEntranceBtn,
    confirmDialog,
    communicationPanel,
    selectPanel,
    search,
    picker
  },
  computed: {
    showMask: function () {
      return this.filterShow || this.cityPickerIsShow || this.tradeNamePickerIsShow
    },
    mapSelected: function () {
      if (this.filterSelected === 0) {
        return '全部'
      } else {
        return this.filterData[this.filterSelected - 1]['name']
      }
    },
    stag () {
      return (this.filterData && this.filterData[this.filterSelected - 1] && this.filterData[this.filterSelected - 1].name) || ''
    }
  },
  filters: {
    pickerShow (val, str) {
      return val === '请选择' ? str : val
    }
  },
  watch: {
    showMask: 'disableScroll',
    registrationRepeatIsShow: 'disableScroll',
    communicationIsShow: 'disableScroll',
    selectPanelIsShow: 'disableScroll',
    confirmIsShow (val, oval) {
      this.disableScroll(val)
      if (val) {
        this.$nextTick(() => {
          var confirmMain = this.$refs.confirm_main
          var confirmMainInner = this.$refs.confirm_main_inner
          var that = this
          if ($(confirmMain).scrollTop() + $(confirmMain).height() > $(confirmMainInner).height() - 30) {
            that.dialogAchieveEnd = true
          }
          confirmMain.addEventListener('scroll', (e) => {
            if ($(confirmMain).scrollTop() + $(confirmMain).height() > $(confirmMainInner).height() - 30) {
              that.dialogAchieveEnd = true
            }
          }, false)
        })
      }
    }
  },
  created: function () {
    if (this.queryDrugName) {
      this.category = 'drug'
      this.drugInit()
    } else {
      this.diseaseInit()
    }
  },
  activated () {
    this.dialogAchieveEnd = false
    if (this.filterData.length) {
      this.bind()
    }
  },
  destroyed () {
    $(window).off('scroll')
  },
  deactivated () {
    $(window).off('scroll')
  },
  mounted: function () {
  },
  methods: {
    drugInit: function () {
      this.getPageData({
        offsetNum: 0,
        page: 1,
        loaded: false,
        clear: true,
        pageSize: 10000
      }, null, 1)
    },
    diseaseInit: function () {
      this.getRecruitTags((data) => {
        data.list.forEach((item, index) => {
          if (item.name === this.queryDisease) {
            this.filterSelected = index + 1
          }
        })
        this.getPageData()
        this.bind()
      })
    },
    filterTabClick: function (num) {
      this.filterShow = !this.filterShow
    },
    clickMask: function () {
      this.filterShow = false
    },
    // filterSelect: function (index) {
    //   this.filterSelected = index
    //   this.resetContentData()
    //   this.getPageData({
    //     offsetNum: 0,
    //     page: 1,
    //     loaded: false,
    //     clear: true
    //   })
    //   this.filterShow = false
    //   baike.mtaReport('chooser_click')
    // },
    filterSelect () {
      this.resetContentData()
      this.getPageData({
        offsetNum: 0,
        page: 1,
        loaded: false,
        clear: true
      })
    },
    resetContentData () {
      this.feedsContent.data = []
      this.feedsContent.loaded = false
      // this.feedsContent.isEmpty = false
    },

    // 获取招募feeds流
    getPageData: function (params, droploadPlugin, searchType) { // type: 0 疾病分类  1 药品
      var that = this
      // mapselected
      var temp = that.mapSelected
      if (that.category === 'disease') {
        if (this.cityPickerData.slot[0].currentValue !== '请选择') {
          temp += `|${this.cityPickerData.slot[0].currentValue}`
        }
        if (this.tradeNamePickerData.slot[0].currentValue !== '请选择') {
          temp += `|${this.tradeNamePickerData.slot[0].currentValue}`
        }
      }
      pageLoad({
        key: that.category === 'disease' ? 'diseaseDocs' : 'drugDocs',
        url: '/mobile/getDocsDataByTags',
        retKey: 'docs',
        pageSize: (params && params.pageSize) || 12,
        shift: params && params.shift,
        page: params && params.page,
        loaded: params && params.loaded,
        clear: params && params.clear,
        cb: function (pageData) {
          var list = util.resolveDocList(pageData.list)
          if (list && list.length) {
            list.forEach(function (item) {
              item.readflag = item.readflag || false
            })
            that.feedsContent.isEmpty = false
          } else {
            that.feedsContent.isEmpty = true
            // 相关内容为空，则拉取相关内容接口
            that.getOhterDocs(
              {
                offsetNum: 0,
                page: 1,
                loaded: false,
                clear: true,
                pageSize: 10000
              }, null, 0
            )
          }
          that.feedsContent.data = list
          that.feedsContent.loaded = pageData.loaded
          if (droploadPlugin) {
            droploadPlugin.resetload()
          }
        }
      }, {
        type: 101,
        name: that.category === 'disease' ? temp : that.queryDrugName,
        mode: droploadPlugin ? 0 : 1
      })
    },
    getOhterDocs (params, droploadPlugin, searchType) {
      var that = this
      var temp = that.mapSelected
      if (that.category === 'disease') {
        if (this.cityPickerData.slot[0].currentValue !== '请选择') {
          temp += `|${this.cityPickerData.slot[0].currentValue}`
        }
      }
      pageLoad({
        key: that.category === 'disease' ? 'diseaseDocs' : 'drugDocs',
        url: '/mobile/getDocsDataByTags',
        retKey: 'docs',
        pageSize: (params && params.pageSize) || 12,
        shift: params && params.shift,
        page: params && params.page,
        loaded: params && params.loaded,
        clear: params && params.clear,
        cb: function (pageData) {
          var list = util.resolveDocList(pageData.list)
          if (list && list.length) {
            list.forEach(function (item) {
              item.readflag = item.readflag || false
            })
            that.otherContent.isEmpty = false
          } else {
            that.otherContent.isEmpty = true
          }
          that.otherContent.data = list
          that.otherContent.loaded = pageData.loaded
          if (droploadPlugin) {
            droploadPlugin.resetload()
          }
        }
      }, {
        type: 101,
        name: that.category === 'disease' ? temp : that.queryDrugName,
        mode: droploadPlugin ? 0 : 1
      })
    },
    getRecruitTags: function (cb) {
      var that = this
      baike.post('/mobile/getRecruitTags', {}, function (data) {
        that.filterData = data.list
        cb && cb(data)
      }, function (data) {
        console.log('error', data)
      })
    },

    toArticle: function (article, index, type) {
      console.log(article.title, article.docid)
      if (article && article.docid) {
        var ptag = `trialarticle_click:${article.title}`
        baike.goToUrl(`/mobile/article.html?ptag=${ptag}&docid=${article.docid}`)
      }
    },

    fixedEntranceBtnClick () { // 点击“招募通道”
      baike.mtaReport('trialtool_click')
      this.confirmIsShow = true
    },

    sureBtnClick () { // 条约面板确认
      if (!this.dialogAchieveEnd) {
        return
      }
      this.confirmIsShow = false
      this.$nextTick(() => {
        this.selectPanelIsShow = true
      })
      baike.mtaReport('trialtool_notice2')
    },

    selectPanelClose () { // 选择面板关闭
      this.selectPanelIsShow = false
    },

    selectionClick (type) { // 选择面板点击
      this.selectPanelIsShow = false
      this.$nextTick(() => {
        if (type === 1) {
          this.getRecruitUserInfo()
        } else {
          this.communicationIsShow = true
        }
      })
    },

    cancelBtnClick () { // 条约面板关闭
      this.confirmIsShow = false
      baike.mtaReport('trialtool_back')
    },

    // 获取临床招募用户信息
    getRecruitUserInfo () {
      baike.post('/mobile/getRecruitUserInfo', {}, (data) => {
        this.confirmIsShow = false
        // data.flag=1
        if (data.flag === 1) {
          this.$nextTick(() => {
            this.registrationRepeatIsShow = true
          })
        } else {
          this.$nextTick(() => {
            // this.$router.push({name: 'clinical_recruitment_registration'})
            baike.goToUrl('/mobile/clinical_recruitment_registration.html')
          })
        }
      })
    },
    registrationRepeatSure () {
      this.registrationRepeatIsShow = false
      this.$nextTick(() => {
        // this.$router.push({name: 'clinical_recruitment_registration'})
        baike.goToUrl('/mobile/clinical_recruitment_registration.html')
      })
    },
    registrationRepeatClose () {
      this.registrationRepeatIsShow = false
    },
    communicationClose () {
      this.communicationIsShow = false
    },
    load (event) {
      var that = this
      var scrollTop = $(window).scrollTop()
      var scrollHeight = $('body').height()
      var windowHeight = $(window).height()
      if (scrollTop >= scrollHeight - windowHeight) {
        that.getPageData()
      }
    },
    bind: function () {
      // var $health = $('#clinical_recruitment')
      // window.removeEventListener('scroll', this.load)
      // window.addEventListener('scroll', this.load)
      $(window).off('scroll')
      $(window).on('scroll', this.load)
      // function load (event) {
      //   var scrollTop = $(window).scrollTop()
      //   var scrollHeight = $('body').height()
      //   var windowHeight = $(window).height()
      //   if (scrollTop >= scrollHeight - windowHeight) {
      //     that.getPageData()
      //   }
      // }

      // that.droploadPlugin = baike.dropload('#content-wrp', {
      //   loadUpFn: function (droploadPlugin) {
      //     that.getPageData({
      //       shift: true,
      //       loaded: false,
      //     }, droploadPlugin)
      //   }
      // })
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.showAppSearch = true
      }
    },
    searchCb (action) {
      if (action === 'cancel') {
        this.showAppSearch = false
      }
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
    goAllBtnClick () {
      // this.$router.push({name: 'clinical_recruitment'})
      // this.queryDisease = ''
      // this.queryDrugName = ''
      // this.category = 'disease'
      // this.diseaseInit()
      baike.goToUrl('/mobile/clinical_recruitment.html')
    },
    // v2.0.1
    docSelectorClick (type) {
      if (type === 1) {
        this.tradeNamePickerIsShow = true
      } else {
        this.cityPickerIsShow = true
      }
    },
    tradeNamePickerCancel () {
      this.tradeNamePickerIsShow = false
    },
    tradeNamePickerConfirm (data) {
      // 判断是否修改了
      if (this.tradeNamePickerData.slot[0].currentValue !== data[0]) {
        this.tradeNamePickerData.slot[0].currentValue = data[0]
        this.tradeNamePickerData.slot[0].values.forEach((item, index) => {
          if (item === data[0]) {
            this.tradeNamePickerData.slot[0].defaultIndex = index
          }
        })
        this.tradeNamePickerIsShow = false
        this.filterSelect()
      } else {
        this.tradeNamePickerIsShow = false
      }
    },
    cityPickerCancel () {
      this.cityPickerIsShow = false
    },
    cityPickerConfirm (data) {
      // 判断是否修改了
      if (this.cityPickerData.slot[0].currentValue !== data[0]) {
        this.cityPickerData.slot[0].currentValue = data[0]
        this.cityPickerData.slot[0].values.forEach((item, index) => {
          if (item === data[0]) {
            this.cityPickerData.slot[0].defaultIndex = index
          }
        })
        this.cityPickerIsShow = false
        this.filterSelect()
      } else {
        this.cityPickerIsShow = false
      }
    }
  }
}

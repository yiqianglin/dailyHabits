/* global $, baike */
import tmenu from 'components/tmenu/tmenu.vue'
import fixedEntranceBtn from 'components/clinicalRecruitment/fixedEntranceBtn.vue'
import selectPanel from 'components/clinicalRecruitment/selectPanel.vue'
import confirmDialog from 'components/clinicalRecruitment/confirmDialog.vue'
import communicationPanel from 'components/clinicalRecruitment/communication.vue'
import 'components/paper/paper.scss'
import { pageLoad } from 'src/js/specialReq.js'

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
      scrollTop: 0,
      confirmIsShow: false, // 招募通道协议对话框
      dialogAchieveEnd: false, // 协议是否滚动底部了
      registrationRepeatIsShow: false, // 重复报名确认框
      communicationIsShow: false, // 微信加群面板
      selectPanelIsShow: false // 填写个人信息、微信加群 选择面板
    }
  },
  components: {
    tmenu,
    fixedEntranceBtn,
    confirmDialog,
    communicationPanel,
    selectPanel
  },
  computed: {
    showMask: function () {
      return this.filterShow !== false
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
  watch: {
    showMask: 'disableScroll',
    // showMask: function() {
    //   if (this.showMask) {
    //     this.disableScroll();
    //   } else {
    //     this.recoverScroll();
    //   }
    // }
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
    this.bind()
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
    filterSelect: function (index) {
      this.filterSelected = index
      this.resetContentData()
      this.getPageData({
        offsetNum: 0,
        page: 1,
        loaded: false,
        clear: true
      })
      this.filterShow = false
      baike.mtaReport('chooser_click')
    },
    resetContentData () {
      this.feedsContent.data = []
      this.feedsContent.loaded = false
      this.feedsContent.isEmpty = false
    },

    // 获取招募feeds流
    getPageData: function (params, droploadPlugin, searchType) { // type: 0 疾病分类  1 药品
      var that = this
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
          } else {
            that.feedsContent.isEmpty = true
          }
          that.feedsContent.data = list
          that.feedsContent.loaded = pageData.loaded
          if (droploadPlugin) {
            droploadPlugin.resetload()
          }
        }
      }, {
        type: 101,
        name: that.category === 'disease' ? that.mapSelected : that.queryDrugName,
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
        this.$store.dispatch('showMiniSearch', { stag: this.stag })
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
    }
  }
}

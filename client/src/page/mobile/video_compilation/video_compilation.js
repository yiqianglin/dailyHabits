/* global $, baike, Raven */
import tmenu from 'components/tmenu/tmenu.vue'
import videoUl from 'components/video_ul/video_ul.vue'
import loading from 'components/loading/loading.vue'
import filters from 'src/js/filters'
export default {
  data () {
    return {
      fixAlphaTab: null, // 顶部悬浮
      shouldPreventTouch: false,
      recommendVideoList: null,
      recommendDoctorList: null,
      hotDiseasesList: null,
      videoSetDiseaseList: null,
      show: false,
      name: '医典视频'
    }
  },
  components: {
    tmenu,
    videoUl,
    loading
  },
  created: function () {
    this.getRecommendVideoData()
      .then(() => {
        this.show = true
      })
    this.getRecommendDoctorData()
      .then(() => {
        this.show = true
      })
    this.getHotDiseases()
      .then(() => {
        this.show = true
      })
    this.getVideoSetDiseaseList()
      .then(() => {
        this.show = true
      })
  },
  activated () {
    window.addEventListener('scroll', this.scrollToTop)
  },
  destroyed () {
    window.removeEventListener('scroll', this.scrollToTop)
  },
  deactivated () {
    window.removeEventListener('scroll', this.scrollToTop)
  },
  mounted: function () {
    this.initEvents()
  },
  watch: {
  },
  computed: {

  },
  filters: {
    formatTime: filters.formatTime
  },
  methods: {
    _getActiveData ({ type }) { // 获取Active数据
      return new Promise((resolve, reject) => {
        baike.post('/mobile/getActiveData', {
          activetype: type
        }, (data) => {
          if (data.retcode === 0) {
            resolve(data)
          } else {
            reject(data)
          }
        })
      })
    },
    _getHotDiseasesV2 ({ type }) { // 获取常见疾病数据
      return new Promise((resolve, reject) => {
        baike.post('/mobile/getHotDiseasesV2', {
          type
        }, (data) => {
          if (data.retcode === 0) {
            resolve(data)
          } else {
            reject(data)
          }
        })
      })
    },
    _getVideoSetDiseaseList () { // 获取视频疾病列表
      return new Promise((resolve, reject) => {
        baike.post('/mobile/getVideoSetDiseaseList', {}, (data) => {
          if (data.retcode === 0) {
            resolve(data)
          } else {
            reject(data)
          }
        })
      })
    },
    async getRecommendVideoData () {
      try {
        const data = await this._getActiveData({ type: 13 })
        // console.log('await getCityName:', data)
        if (data.retcode === 0) {
          var tempList = data.activelist
          var list = []
          tempList.forEach((item, index) => {
            list.push(item.docinfo[`tid${item.docinfo.tid}`])
          })
          this.recommendVideoList = list
        }
        return data
      } catch (err) {
        Raven.captureException(err)
      }
    },
    async getRecommendDoctorData () {
      try {
        const data = await this._getActiveData({ type: 15 })
        if (data.retcode === 0) {
          this.recommendDoctorList = data.activelist
        }
        return data
      } catch (err) {
        Raven.captureException(err)
      }
    },
    async getHotDiseases () {
      try {
        const data = await this._getHotDiseasesV2({ type: 2 })
        if (data.retcode === 0) {
          this.hotDiseasesList = data.diseases
        }
        return data
      } catch (err) {
        Raven.captureException(err)
      }
    },
    async getVideoSetDiseaseList () {
      try {
        const data = await this._getVideoSetDiseaseList()
        if (data.retcode === 0) {
          console.log(data)
          this.videoSetDiseaseList = data.list
        }
        return data
      } catch (err) {
        Raven.captureException(err)
      }
    },
    goCommonDiseaseVideo (item) { // 跳转到对应专题视频
      baike.goToUrl('/mobile/video_compilation_topic.html?name=' + item.name + '&type=' + item.type + '&video_type=1&ptag=videocollection_commdisease')
    },
    goDiseaseVideo (item) { // 跳转到对应专题视频
      baike.goToUrl('/mobile/video_compilation_topic.html?name=' + item.name + '&type=' + item.type + '&video_type=1&ptag=videocollection_disease')
    },
    toDoctor (item) { // 跳转到对应专家页面
      baike.goToUrl('/mobile/doctor.html?doctor_id=' + item.id + '&src=video_compilation&ptag=videocollection_bannerdoctX:' + item.id)
    },
    goVideoArticle (item, index) { // 跳转到精选视频
      baike.goToUrl('/mobile/article.html?docid=' + item.docid + '&ptag=videocollection_bannervideoX:' + item.docid)
    },
    initEvents () {
      window.addEventListener('scroll', this.scrollToTop)
    },
    quickToList (e) {
      e.stopPropagation()
      e.preventDefault()
      var touch = e.changedTouches[0]
      var elem = document.elementFromPoint(
        touch.pageX - window.pageXOffset,
        touch.pageY - this.getScrollTopOfBody()
      )
      elem && elem.click()
    },
    scrollTopAlpha (e) { // 点击触发
      var that = this
      var elem = e.target

      e.preventDefault()
      e.stopPropagation()
      const tmenuHeight = $('.tmenu').height()
      that.setScrollTopOfBody(
        $('#alpha-' + (elem.textContent === '#' ? '' : elem.textContent)).offset().top - tmenuHeight + 1
      )
    },
    scrollToTop: function (e) { // 滚动监听
      const tmenuHeight = $('.tmenu').height()
      var that = this
      var scroll = that.getScrollTopOfBody()
      var $tabs = $('.list-block-alpha')
      for (var i = 0; i < $tabs.length; i++) {
        var offAlphaTop = $tabs.eq(i).offset().top
        if (offAlphaTop <= (scroll + tmenuHeight)) {
          that.fixAlphaTab = $tabs[i].innerHTML
        } else if (i === 0 && offAlphaTop > scroll) {
          that.fixAlphaTab = null
        }
      }
    },
    getScrollTopOfBody: function () {
      var scrollTop
      if (typeof window.pageYOffset !== 'undefined') {
        // pageYOffset指的是滚动条顶部到网页顶部的距离
        scrollTop = window.pageYOffset
      } else if (
        typeof document.compatMode !== 'undefined' &&
        document.compatMode !== 'BackCompat'
      ) {
        scrollTop = document.documentElement.scrollTop
      } else if (typeof document.body !== 'undefined') {
        scrollTop = document.body.scrollTop
      }
      return scrollTop
    },
    setScrollTopOfBody: function (scrollTop) {
      $(window).scrollTop(scrollTop)
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { source: 8 })
      }
    }
  }
}

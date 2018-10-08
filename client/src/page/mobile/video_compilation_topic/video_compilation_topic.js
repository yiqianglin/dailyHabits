/* global $,baike, Raven */
import Vue from 'vue'
import tmenu from 'components/tmenu/tmenu.vue'
import videoUl from 'components/video_ul/video_ul.vue'
import 'src/libs/swiper/swiper.min.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import loading from 'components/loading/loading.vue'
Vue.use(VueAwesomeSwiper /* { default global options } */)
export default {
  data () {
    return {
      name: baike.query('name'),
      type: baike.query('type'),
      stage: baike.query('stage'), // 时间轴选项
      childset: baike.query('childset'), // 时间轴下面的选项
      video_type: baike.query('video_type'), // 0: 默认(视频集>名家之声), 1: 名家之声, 2: 视频集
      show: false,
      // doctorList: [
      //   { name: '吴一龙', hospital: '广东省人民医院', img: require('src/assets/images/mobile/video_compilation/pic.jpg') },
      //   { name: '吴二龙', hospital: '广东省人民医院水电费所说的', img: require('src/assets/images/mobile/video_compilation/pic.jpg') },
      //   { name: '吴一龙是的发生的水电费', hospital: '广东省人民医院', img: require('src/assets/images/mobile/video_compilation/pic.jpg') },
      //   { name: '吴一龙', hospital: '广东省人民医院', img: require('src/assets/images/mobile/video_compilation/pic.jpg') },
      //   { name: '吴一龙', hospital: '广东省人民医院', img: require('src/assets/images/mobile/video_compilation/pic.jpg') }
      // ],
      doctorCollapse: false, // 专家列表是否展开（超过两个）
      doctorList: null,
      videoList: null,
      videoChildren: [],
      curIndex: 0, // 当前被选中的时间轴
      stepList: [],
      stepFixed: false,
      configflag: 1,
      swiperOps: {}
    }
  },
  components: {
    tmenu,
    videoUl,
    loading
  },
  created: function () {
    this.getVideoSetDiseaseInfo(this.name)
      .then(() => {
        this.show = true
      })
    this.bindEvent()
  },
  computed: {
    children () {
      return this.videoChildren && this.videoChildren[this.curIndex] && this.videoChildren[this.curIndex].children
    }
  },
  methods: {
    _getVideoSetDiseaseInfo (disease) { // 获取视频疾病列表
      return new Promise((resolve, reject) => {
        baike.post('/mobile/getVideoSetDiseaseInfo', {
          disease,
          offset: 0,
          count: 1000,
          type: this.video_type || 0
        }, (data) => {
          if (data.retcode === 0) {
            resolve(data)
          } else {
            reject(data)
          }
        })
      })
    },
    async getVideoSetDiseaseInfo (disease) {
      try {
        let data = await this._getVideoSetDiseaseInfo(disease)
        if (data.retcode === 0) {
          this.doctorList = data.doctors
          this.videoList = data.docs
          this.configflag = data.configflag
          let children = data.children
          if (children && children.length) {
            this.videoChildren = children
            if (this.stage) {
              for (let i = 0, leni = children.length; i < leni; i++) {
                if (children[i].title === this.stage) {
                  this.curIndex = i
                  break
                }
              }
              setTimeout(() => {
                this.scrollToCurrentTag()
              }, 100)
            }
            if (this.childset) { // 需要滚动到对应的tab
              this.$nextTick(() => {
                let children = this.children
                if (children && children.length) {
                  for (let i = 0, leni = children.length; i < leni; i++) {
                    if (children[i].title === this.childset) {
                      let $dom = $('.video-list .video-item').eq(i)
                      if ($dom.length) {
                        setTimeout(() => {
                          $(window).scrollTop($dom.offset().top - $('.tmenu').height() / 0.88 * (0.72 + 0.88 - 0.2))
                        }, 100)
                      }
                      break
                    }
                  }
                }
              })
            }
            if (children.length > 1) {
              this.initSwiper()
            }
          }
        }
        return data
      } catch (err) {
        Raven.captureException(err)
      }
    },
    doctorCollapseClick () {
      this.doctorCollapse = !this.doctorCollapse
      if (this.doctorCollapse) { // 已经展开情况下
        baike.mtaReport('disvideopage_doctoropen')
      } else {
        baike.mtaReport('disvideopage_doctorclose')
      }
    },
    goDiseasePage () {
      baike.goToUrl(
        baike.getOverview({ name: this.name, type: this.type }) + '&ptag=disvideopage_diseaseentry'
      )
    },
    toDoctor (item) { // 跳转到对应专家页面
      baike.goToUrl('/mobile/doctor.html?doctor_id=' + item.doctorId + '&src=video_compilation_topic&ptag=disvideopage_doctorentry')
    },
    goVideoArticle (item, index) { // 跳转到精选视频
      baike.goToUrl('/mobile/article.html?docid=' + item.docid + '&name=' + this.name)
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { source: 8 })
      }
    },
    scrollToCurrentTag () {
      let $tagUl = $('#stepWrap ul')
      if (!$tagUl || !$tagUl.length) {
        return
      }
      let offset = $tagUl.find('li').eq(this.curIndex).offset()
      let st = $tagUl.scrollLeft()
      let pageWidth = $(window).width()
      let scrollLeft = 0
      if (offset.left < offset.width / 2) {
        scrollLeft = st + offset.left - offset.width / 2
        $tagUl.scrollLeft(scrollLeft)
      } else {
        if (pageWidth - offset.left > 0) {
          if (pageWidth - offset.left < 1.5 * offset.width) scrollLeft = st + offset.width + offset.left - pageWidth + offset.width / 2
        } else {
          scrollLeft = st + offset.width + offset.left - pageWidth + offset.width / 2
        }
        if (scrollLeft > 0) $tagUl.scrollLeft(scrollLeft)
      }
      if (this.swiper && this.swiper.activeIndex !== this.curIndex) {
        this.swiper.slideTo(this.curIndex)
      }
    },
    stepClk (index) {
      this.curIndex = index
      this.scrollToCurrentTag()
    },
    bindEvent () {
      let setFixed = () => {
        if (this.videoChildren && this.videoChildren.length > 1) { // 有时间轴，需要吸顶
          let st = $(window).scrollTop()
          let $dom = $('.video-list')
          if ($dom.length) {
            let offset = $dom.offset()
            this.stepFixed = (st > offset.top - 80)
          }
        }
      }
      $(window).on('scroll', () => {
        setFixed()
      })
    },
    initSwiper () {
      var that = this
      that.swiperOps = {
        direction: 'horizontal',
        autoplay: 0,
        initialSlide: that.curIndex,
        autoHeight: true,
        onInit: function (swiper) {
          that.swiper = swiper
        },
        onTransitionEnd: function (swiper) {
          if (swiper.activeIndex !== that.curIndex) {
            that.stepClk(swiper.activeIndex)
          }
        },
        onSlideChangeEnd: function (swiper) {

        }
      }
    }
  }
}

/* global baike */
import { mapGetters } from 'vuex'
import { ActiveBanner } from 'components/activity/activity'
import health from './health/health.vue'

import filters from 'src/js/filters'

export default {
  data () {
    return {
      // 顶部运营位
      activeOps: null,
      // 搜索热词
      // hotList: [],
      // 重点板块
      keystoneList: [],
      // 疾病科室
      departList: [],
      // 名家视频
      videoList: []
    }
  },
  components: {
    ActiveBanner,
    health
  },
  computed: {
    ...mapGetters('appSearch', {
      hotList: 'appHotList'
    })
  },
  filters: {
    formatTime: filters.formatTime
  },
  created () {
    // 顶部运营位
    this.getActiveData(1)
    // 重点板块
    this.getActiveData(11)
    // 疾病科室
    this.getActiveData(12)
    // 名家视频
    this.getActiveData(13)
  },
  activated () {
    // 获取热词
    this.$store.dispatch('appSearch/updateHotList')
  },
  mounted: function () {
    this.bind()
  },
  watch: {},
  methods: {
    getActiveData (type = 1) {
      baike.post('/mobile/getActiveData', {
        activetype: type,
        name: ''
      }, o => {
        if (o.retcode !== 0) return
        if (type === 1) {
          // 顶部轮播图
          this.activeOps = {
            list: o.activelist,
            area: 'list_top'
          }
          window.medTimer && window.medTimer.reportTime({
            action: 'home_page',
            ispage: 1
          })
        } else if (type === 11) {
          // 重点板块
          this.keystoneList = o.activelist.map(item => {
            var page = baike.getPageName(item.h5url)
            var src = page === 'home_cancer' ? (/\.html\?/.test(item.h5url) ? '&' : '?') + 'src=home' : ''
            return {
              ...item,
              h5url: item.h5url + src
            }
          })
        } else if (type === 12) {
          // 疾病科室
          this.departList = o.activelist
        } else if (type === 13) {
          // 名家视频
          this.videoList = o.activelist
        }
      })
    },
    toMy () {
      baike.goToUrl('/mobile/my.html?ptag=yd_mainpage_personal')
    },
    toSearch () {
      baike.mtaReport('yd_mainpage_search')
      this.$store.dispatch('showMiniSearch')
    },
    toOverview ({
      name,
      type
    }) {
      // 增加急救入口，待废弃
      if (name === '日常急救') {
        baike.goToUrl('/mobile/emergency.html')
        return
      }
      var url = baike.getOverview({
        name,
        type
      })
      baike.goToUrl(`${url}&ptag=yd_mainpage_hotsearch`)
    },
    toActive ({
      h5url,
      text
    }) {
      if (h5url) {
        baike.goToUrl(h5url + (/\.html\?/.test(h5url) ? '&' : '?') + `ptag=yd_mainpage_bannerX:${text}`)
      }
    },
    toDiseaseList ({
      text
    }) {
      baike.goToUrl('/mobile/disease_list.html' + (text ? `?depart=${text}&ptag=yd_mainpage_departX:${text}` : '?ptag=yd_mainpage_alldisease'))
    },
    toMoreVideo () {
      baike.goToUrl(`/mobile/video_compilation.html?ptag=yd_mainpage_morevideo`)
    },
    toVideo ({
      docid
    }) {
      if (docid) {
        baike.goToUrl(`/mobile/article.html?docid=${docid}&ptag=yd_mainpage_videoX:${docid}`)
      }
    },
    bind: function () { }
  }
}

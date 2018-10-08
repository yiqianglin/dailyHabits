/* global baike */
import tmenu from 'components/tmenu/tmenu.vue'

export default {
  data () {
    return {
      isShow: false,
      diseaseList: [],
      isXcx: baike.isXcx() || false
    }
  },
  components: {
    tmenu
  },
  activated () {
  },
  created: function () {
    this.initSearch()
  },
  mounted: function () {
    // this.imgLoad();
  },
  methods: {
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch')
      }
    },
    initSearch () {
      var url = '/mobile/getCommonDiseaseDataV2'
      baike.get(url, {}, (o) => {
        if (Number(o.retcode) === 0) {
          this.isShow = true
          this.diseaseList = this.resolveList(o.mostVisited)
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'publicConcern_page',
          ispage: 1
        })
      }, true)
    },
    resolveList (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].released === 0) { list[i].building = 1 } else { list[i].building = 0 }
      }
      return list
    },
    // 列表右侧点击跳转事件
    toOverview: function (name, type, ptag) {
      // var url = '/mobile/overview_pt.html?name=' + name
      if (baike.query('adtag') === 'tx.wx.hr') {
        ptag = 'ydd_hr_diseasex|' + name
      } else {
        ptag += '|' + name
      }
      baike.goToUrl(baike.getOverview({ name: name, type: type }) + '&ptag=' + ptag)
    },
    toBuilding: function (name) {
      baike.goToUrl('/mobile/building.html?name=' + name)
    }
  }
}

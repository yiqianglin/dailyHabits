/* global baike */
import tmenu from 'components/tmenu/tmenu.vue'
import search from 'components/search/search.vue'

export default {
  data () {
    return {
      introExpanded: false,
      // 应用搜索
      showAppSearch: false,
      members: [{
        title: '理事长',
        type: 0,
        style: 0,
        collapse: false,
        clamp: 0,
        list: [],
        ulClass: 'cairman'
      }, {
        title: '副理事长',
        titleDesc: '排名按照姓氏首字母顺序',
        type: 1,
        style: 0,
        collapse: false,
        clamp: 0,
        list: [],
        ulClass: 'viceChairman'
      }, {
        title: '秘书长',
        titleDesc: '排名按照姓氏首字母顺序',
        type: 1,
        style: 0,
        collapse: false,
        clamp: 0,
        list: [],
        ulClass: 'viceChairman'
      }, {
        title: '副秘书长',
        titleDesc: '排名按照姓氏首字母顺序',
        type: 3,
        style: 2,
        collapse: true,
        clamp: 10,
        list: [],
        diseaseObj: {},
        ulClass: 'viceChairSecretaryGeneral'
      }]
    }
  },
  components: {
    tmenu,
    search
  },
  mounted: function () {
  },
  activated () {
    // 单页缓存分享信息重写
    this.setShare(this.shareCache)
  },
  created: function () {
    var that = this
    that.setShare({ title: 'CSCO主页-企鹅医典', desc: '我国最专业的临床肿瘤学术团体' })
    that.getData()
      .then((data) => {
        data.info.forEach((item, index) => {
          // if (index > 2) return
          that.members.push({})
          that.members[index].list = data.info[index].doctors
        })
        // that.members[0].list = data.info[0].doctors
        // that.members[1].list = data.info[1].doctors
        // that.members[2].list = data.info[2].doctors
      })
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: 'CSCO' })
      }
    },
    async getData (params) {
      const url = '/mobile/getTumourAuditInfo'
      const result = await new Promise((resolve, reject) => {
        baike.get(
          url,
          {
            name: 'CSCO'
          },
          data => {
            if (data.retcode === 0) {
              resolve(data)
            } else {
              reject(data)
            }
          }
        )
      })
      return result
    },
    toDoctor: function (item, expert) {
      if (!item.clickable) return
      baike.goToUrl(`/mobile/doctor.html?doctor_id=${item.doctor_id}` + (expert ? '&src=cancer' : '') + '&ptag=onco_listcancercommission_doctorx:' + item.name)
    }
  }
}

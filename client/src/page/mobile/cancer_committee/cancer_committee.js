/* global $, baike */
import tmenu from 'components/tmenu/tmenu.vue'

export default {
  data () {
    return {
      name: $.trim(baike.query('name')),
      type: +$.trim(baike.query('type')), // type 为 1 表示权威
      // style: 0-大头像 1-小头像 2-无头像
      // type: 0-院士 1-主任委员 2-副主任委员 3-编委
      members: [{
        title: '中国科学院/工程院院士',
        type: 0,
        style: 0,
        collapse: false,
        clamp: 0,
        list: [],
        ulClass: 'academician'
      }, {
        title: '学科主任委员',
        type: 1,
        style: 0,
        collapse: !!name,
        clamp: name ? 4 : 0,
        list: [],
        ulClass: 'editor'
      }, {
        title: '学科副主任委员',
        type: 2,
        style: 1,
        collapse: true,
        clamp: name ? 4 : 6,
        list: [],
        ulClass: 'editor'
      }, {
        title: '编委',
        titleDesc: '排名按照姓氏首字母顺序',
        type: 3,
        style: 2,
        collapse: true,
        clamp: 10,
        list: [],
        diseaseObj: {},
        ulClass: 'editor-member'
      }],
      webmdNum: 0,
      webmdDisease: 0
    }
  },
  components: {
    tmenu
  },
  activated () {
    // 单页缓存分享信息重写
    this.setShare(this.shareCache)
  },
  created: function () {
    var that = this
    that.init()
    that.getHospitalRelated()
  },
  mounted: function () {
  },
  computed: {},
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    init: function () {
      var that = this
      baike.get('/mobile/getTumourAuditInfo', { name: that.type === 1 ? '权威' : (that.name || '全部') }, function (o) {
        if (o.retcode === 0) {
          that.initPageInfo(o.info)
          that.setShare({
            title: that.type === 1 ? '企鹅医典·专家委员会' : '企鹅医典·' + that.name + '编审委员会'
          })
          window.medTimer && window.medTimer.reportTime({
            action: 'cancer_committee_page',
            ispage: 1
          })
        }
      })
    },
    initPageInfo: function (members) {
      var that = this
      var diseaseObj = {}
      for (var i = 0, leni = members.length, itemi, itemj, disease; i < leni; i++) {
        itemi = members[i]
        itemj = that.members.filter(item => item.type === itemi.type)[0]
        if (itemj) {
          disease = itemi.disease
          if (itemi.type === 3 && !that.name && disease) {
            if (!diseaseObj[disease]) diseaseObj[disease] = []
            if (itemi.doctors && itemi.doctors.length > 0) diseaseObj[disease] = diseaseObj[disease].concat(itemi.doctors)
            itemj.diseaseObj = diseaseObj
          }
          if (itemi.doctors && itemi.doctors.length > 0) itemj.list = itemj.list.concat(itemi.doctors)
        }
      }
    },
    getHospitalRelated: function () {
      var that = this
      var name = that.name
      baike.post('/mobile/getHospitalRelated', { hospital_id: 1000, doctag: '', disease: name, offset: '', count: '' }, function (json) {
        if (json.retcode === 0) {
          that.webmdDisease = json.diseasenum
          if (name) {
            var disease = json.disease && json.disease[0]
            if (disease && disease.name === name) {
              that.webmdNum = disease.count
            }
          } else {
            that.webmdNum = json.docnum
          }
        }
      })
    },
    toDoctor: function (item, expert) {
      if (!item.clickable) return
      baike.goToUrl(`/mobile/doctor.html?doctor_id=${item.doctor_id}` + (expert ? '&src=cancer' : '') + '&ptag=onco_listcancercommission_doctorx:' + item.name)
    },
    toCancer: function (name) {
      baike.goToUrl(`/mobile/cancer_committee.html?name=${name}`)
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch', { stag: this.name })
      }
    }
  }
}

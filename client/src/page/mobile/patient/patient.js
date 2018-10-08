/* global baike */
import tmenu from 'components/tmenu/tmenu.vue'
import { lockedReq } from 'src/js/specialReq.js'

export default {
  data () {
    return {
      follow: 0,
      introExpanded: false,
      name: '',
      patient_id: baike.query('patient_id'),
      paperList: [],
      followingnum: 0,
      op_md_introd: '',
      hand: '',
      show: false
    }
  },
  components: {
    tmenu
  },
  activated () {
    // 点赞数返回时要更新
    this.getPatientRelated()
  },
  created: function () {
    this.init()
  },
  mounted: function () {
    var that = this
    that.bind()
  },
  computed: {

  },
  methods: {
    init: function () {
      var that = this
      var url = '/mobile/init_doctor'
      baike.get(url, {
        doctor_id: that.patient_id
      }, function (o) {
        if (o.retcode === 0) {
          if (o.followingnum > 0) that.followingnum = o.followingnum
          that.follow = o.follow
          if (o.name) that.name = o.name
          if (o.op_md_introd) that.op_md_introd = o.op_md_introd
          if (o.hand) that.hand = o.hand
          that.show = true
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'patient_page',
          ispage: 1
        })
      }, true)
    },
    toArticle: function (index) {
      var that = this
      var article = that.paperList[index]
      baike.goToUrl(`/mobile/article.html?docid=${article.docid}&name=${((article.diseases && article.diseases[0] && article.diseases[0].name) || '')}`)
    },
    fClick: function () {
      var that = this
      var url = '/mobile/setFollowingDoctor'
      var follow = that.follow
      lockedReq({
        url: url,
        method: 'post',
        callback: function (o) {
          if (o.retcode === 0) {
            if (follow === 0) {
              that.$msg.toastAdd('follow')
              that.follow = 1
            } else {
              that.follow = 0
            }
          }
        }
      }, {
        doctor_id: that.patient_id,
        follow: follow === 0 ? 1 : 0
      })
    },
    // 帮助点击
    hClick: function (index) {
      var that = this
      var item = that.paperList[index]
      var addHUrl = '/mobile/add_help'
      var delHUrl = '/mobile/del_help'
      lockedReq({
        url: item.helpful === 1 ? delHUrl : addHUrl,
        key: 'add_del_helpful',
        method: 'post',
        callback: function (o) {
          if (o.retcode === 0) {
            item.helpfulcount = o.helpfulCount
            item.helpful = (item.helpful === 1 ? 0 : 1)
          }
        }
      }, {
        docid: item.docid
      })
    },
    getPatientRelated: function () {
      var that = this
      baike.get('/mobile/getPatientRelated', {
        patient_id: that.patient_id,
        offset: 0,
        count: 50
      }, function (json) {
        if (json.retcode === 0) {
          var list = json.doclist
          if (list && list.length) {
            var tmplist = []
            list.forEach(item => {
              tmplist.push(item['tid' + item.tid] || item)
            })
            that.paperList = tmplist
          }
        }
      })
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch')
      }
    },
    bind: function () {

    }
  }
}

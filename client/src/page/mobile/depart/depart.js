/* global $, baike */
import tmenu from 'components/tmenu/tmenu.vue'
import paper from 'components/paper/paper.vue'
import { pageLoad } from 'src/js/specialReq.js'

var util = {
  resolveDocs: function (docs) {
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
      hospital_id: baike.query('hospital_id'),
      depart_id: baike.query('depart_id'),
      hospitalBg: '',
      hospitalLogo: '',
      departName: '',
      hospitalName: '',
      qualification: [],
      feature: '',
      intro: '',
      doctors: [],
      tags: [],
      tagIndex: -1,

      // ui
      show: false,
      doctorClamp: 6,
      collapse: false
    }
  },
  components: {
    tmenu,
    paper
  },
  activated () {
    // 单页缓存分享数据重置
    this.setShare(this.shareCache)
    window.addEventListener('scroll', this.load)
  },
  destroyed () {
    window.removeEventListener('scroll', this.load)
  },
  deactivated () {
    window.removeEventListener('scroll', this.load)
  },
  created: function () {
    var that = this
    that.init()
  },
  mounted: function () {
    this.bind()
  },
  methods: {
    init: function () {
      var that = this
      baike.get('/mobile/getDepartInfo', {
        hospital_id: this.hospital_id,
        depart_id: this.depart_id
      }, function (o) {
        if (o.retcode === 0) {
          that.departName = o.name
          that.hospitalName = o.hospital_name
          that.hospitalBg = o.op_bgpic
          that.hospitalLogo = o.op_logo
          that.qualification = o.qualification
          that.feature = o.special
          that.intro = o.intro
          that.doctors = o.main_dr
          that.collapse = that.doctors.length > that.doctorClamp || that.feature
          that.tags = (o.doctag || []).map(item => {
            return {
              name: item,
              docs: [],
              loaded: false
            }
          })
          that.tagIndex = that.tags.length ? 0 : -1
          that.getDepartRelated(that.tagIndex)
          that.show = true

          that.setShare({
            title: `分享好科室: ${that.hospitalName} ${that.departName} - 企鹅医典`,
            desc: o.intro.replace(/<\/?[^>]*>/g, '') || '',
            imgUrl: that.hospitalLogo
          })
          window.medTimer && window.medTimer.reportTime({
            action: 'depart_page',
            ispage: 1
          })
        }
      }, true)
    },
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    toHospital: function () {
      baike.goToUrl('/mobile/hospital.html?hospital_id=' + baike.query('hospital_id'))
    },
    toDoctor: function (doctor) {
      if (doctor && doctor.doctor_id) {
        baike.goToUrl('/mobile/doctor.html?doctor_id=' + doctor.doctor_id)
      }
    },
    toggleDocotrs: function () {
      this.collapse = !this.collapse
    },
    getDepartRelated: function (index, isSwitch, pageSize) {
      var that = this
      var tag = that.tags[index]
      if (!tag) return
      var name = tag.name
      isSwitch = isSwitch || false
      pageSize = pageSize || 10
      pageLoad({
        key: 'getDepartRelated_' + name,
        url: 'getDepartRelated',
        isSwitch: isSwitch,
        pageSize: pageSize,
        retKey: 'doclist',
        totalKey: 'docnum',
        cb: function (pageData) {
          var docs = pageData.list
          if (docs && docs.length > 0) {
            var list = util.resolveDocs(docs)
            tag.docs = list
          }
          tag.loaded = pageData.loaded
        }
      }, {
        doctag: name,
        hospital_id: this.hospital_id,
        depart_id: this.depart_id
      })
    },
    // scrollToTag: function (index) {
    //   var listElem = $('.tag-list')
    //   var tagsElem = $('.tag-list li')
    //   var barElem = $('.top-nav')
    //   if (!listElem.length || !tagsElem.length || !barElem.length) return
    //
    //   var indexLeft = Math.min(Math.max(index, 0), tagsElem.length - 1)
    //   var diff = (barElem[0].offsetWidth - tagsElem[indexLeft].offsetWidth) / 2
    //   listElem[0].scrollLeft = tagsElem[indexLeft].offsetLeft < diff ? 0 : tagsElem[indexLeft].offsetLeft - diff
    // },
    clickTag: function (index, report) {
      var that = this
      if (index !== that.tagIndex) {
        that.tagIndex = index
        // that.scrollToTag(index)
        if (!that.tags[index].docs.length) {
          that.getDepartRelated(index, true)
        }
      }
    },
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch')
      }
    },
    load (event) {
      var that = this
      var scrollTop = $(window).scrollTop()
      var scrollHeight = $('body').height()
      var windowHeight = $(window).height()
      if (scrollTop >= scrollHeight - windowHeight) {
        that.getDepartRelated(that.tagIndex, false)
      }
    },
    bind: function () {
      window.addEventListener('scroll', this.load)
    }
  }
}

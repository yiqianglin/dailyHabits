/* global $, baike */
import tmenu from 'components/tmenu/tmenu.vue'
import paper from 'components/paper/paper.vue'
import loading from 'components/loading/loading.vue'
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
      type: baike.query('type'),
      hospitalId: baike.query('hospital_id'),
      bgImg: '',
      logo: '',
      name: '',
      alias: [],
      typeTags: [],
      address: '',
      tel: '',
      intro: '',
      departDesc: '',
      coreCentre: '',
      qrcode: '',
      website: '',
      doctorList: [],
      caseList: [],
      departList: [],
      tags: [],
      tagIndex: -1,
      // ui
      show: false,
      collapse: true,
      doctorCollapse: true,
      caseCollapse: true
    }
  },
  components: {
    tmenu,
    paper,
    loading
  },
  activated () {
    window.addEventListener('scroll', this.load)
    this.setShare(this.shareCache)
  },
  destroyed () {
    window.removeEventListener('scroll', this.load)
  },
  deactivated () {
    window.removeEventListener('scroll', this.load)
  },
  created: function () {
    var that = this
    if (that.hospitalId === '10176') {
      baike.goToUrl(`/mobile/authority_csco.html${baike.query('ptag') ? '?ptag=' + baike.query('ptag') : ''}`, true)
      return
    }
    that.init()
  },
  mounted: function () {
    this.bind()
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    init: function () {
      var that = this
      var url = '/mobile/getHospitalInfo'
      baike.get(url, {
        hospital_id: that.hospitalId,
        disease: baike.query('name')
      }, function (o) {
        if (o.retcode === 0) {
          that.bgImg = o.op_bgpic
          that.logo = o.op_logo
          that.name = o.name
          that.alias = o.op_vt_name_alias || []
          that.typeTags = o.vt_typeinfo || []
          that.address = o.address
          that.tel = o.tel
          that.intro = o.v_intro
          that.coreCentre = o.v_corecentre
          that.departDesc = o.v_coredep_desc
          if (that.type === 'card') {
            that.doctorList = (o.doctors || []).map(item => {
              item.collapse = true
              item.titles = [item.main_depart, item.doctitle].filter(text => !!text).join(',')
              return item
            })
          }
          that.departList = o.depart || []
          that.caseList = o.teachinfo || []
          that.qrcode = o.qrcode
          that.website = o.website
          that.tags = (o.doctag || []).map(item => {
            return {
              name: item,
              docs: [],
              loaded: false
            }
          })
          that.tagIndex = that.tags.length ? 0 : -1
          that.getHospitalRelated(that.tagIndex)
          that.show = true
          that.setShare({
            title: '分享好医院:' + that.name + '-企鹅医典',
            desc: o.intro,
            imgUrl: that.logo
          })
          window.medTimer && window.medTimer.reportTime({
            action: 'hospital_page',
            ispage: 1
          })
        }
      }, true)
    },
    toDepart: function (item) {
      if (item.clickable && item.hospital_id && item.depart_id) {
        baike.goToUrl(`depart.html?hospital_id=${item.hospital_id}&depart_id=${item.depart_id}`)
      }
    },
    toDoctor: function (doctorId) {
      if (doctorId) {
        baike.goToUrl('/mobile/doctor.html?doctor_id=' + doctorId)
      }
    },
    toCase: function (item) {
      if (item.h5url) {
        baike.goToUrl(baike.replaceParam('ptag', 'hospitalhome_teachresourcetab_clk', item.h5url))
      }
    },
    getHospitalRelated: function (index, isSwitch, pageSize) {
      var that = this
      var tag = that.tags[index]
      if (!tag) return
      var name = tag.name
      isSwitch = isSwitch || false
      pageSize = pageSize || 10
      pageLoad({
        key: 'getHospitalRelated_' + name,
        url: 'getHospitalRelated',
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
        hospital_id: that.hospitalId
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
          that.getHospitalRelated(index, true)
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
        that.getHospitalRelated(that.tagIndex, false)
      }
    },
    bind: function () {
      window.addEventListener('scroll', this.load)

      // function load (event) {
      //   var scrollTop = $(window).scrollTop()
      //   var scrollHeight = $('body').height()
      //   var windowHeight = $(window).height()
      //   if (scrollTop >= scrollHeight - windowHeight) {
      //     that.getHospitalRelated(that.tagIndex, false)
      //   }
      // }
    }
  }
}

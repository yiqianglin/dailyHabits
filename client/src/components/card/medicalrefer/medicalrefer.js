/* global $, baike */
export default {
  props: ['isshow'],
  data: function () {
    return {
      name: baike.query('name'),
      activeList: [],
      hospitalList: [],
      recruitList: [],
      helpList: [],
      iconTip: {
        isShow: false,
        top: 0,
        left: 0,
        tip: ''
      },
      referGlobalVar: {
        data: {}
      }
    }
  },
  computed: {

  },
  watch: {
    isshow: function () {
      var that = this
      if (!that.referGlobalVar.isInit) {
        that.referGlobalVar.isInit = true
        that.getActiveData()
        that.getDocsDataByTags()
        that.getDiseaseHospitalInfo()
        that.getDiseaseHelpInfo()
        that.bindEvent()
      }
    }
  },
  created: function () {
  },
  mounted: function () {
    var that = this
    if (that.isshow && !that.referGlobalVar.isInit) {
      that.referGlobalVar.isInit = true
      that.getActiveData()
      that.getDocsDataByTags()
      that.getDiseaseHospitalInfo()
      that.getDiseaseHelpInfo()
      that.bindEvent()
    }
  },
  activated () {
    this.bindEvent()
  },
  deactivated () {
    $(window).off('scroll', this.handleScrollFn)
  },
  destroyed () {
    $(window).off('scroll', this.handleScrollFn)
  },
  methods: {
    getDiseaseHospitalInfo: function (offset) {
      var that = this
      if (!that.name) return
      baike.post('/mobile/getDiseaseHospitalInfo', { name: that.name, offset: offset || 0, count: 3 }, function (json) {
        if (json.retcode === 0) {
          if (json.note) {
            that.referGlobalVar.data.hospitalNote = json.note
          }
          that.referGlobalVar.data.hospitalCount = json.count
          var hospital = json.hospital
          if (hospital && hospital.length > 0) {
            that.hospitalList = that.hospitalList.concat(hospital)
          }
        }
      })
    },
    getDiseaseRecruitInfo: function (cb) {
      var that = this
      if (!that.name) {
        return
      }
      if (that.referGlobalVar.data.recruitNote) {
        cb && cb(that.referGlobalVar.data.recruitNote)
        return
      }
      baike.post('/mobile/getDiseaseRecruitInfo', { name: that.name }, function (json) {
        if (json.retcode === 0) {
          if (json.note) {
            that.referGlobalVar.data.recruitNote = json.note
            cb && cb(json.note)
          }
        }
      })
    },
    getDiseaseHelpInfo: function () {
      var that = this
      if (!that.name) {
        return
      }
      baike.post('/mobile/getDiseaseHelpInfo', { name: that.name }, function (json) {
        if (json.retcode === 0) {
          that.helpList = json.help
        }
      })
    },
    getActiveData: function () {
      var that = this
      if (!that.name) return
      baike.post('/mobile/getActiveData', { activetype: 4, name: '就医参考_' + that.name }, function (json) {
        if (json.retcode === 0) {
          if (json.activelist && json.activelist.length > 0) {
            that.activeList = json.activelist
            console.log(that.activeList)
          }
        }
      })
    },
    getDocsDataByTags: function () {
      var that = this
      if (!that.name) return
      baike.post('/mobile/getDocsDataByTags', { name: that.name + '|临床招募', type: 101, offset: 0, count: 3 }, function (json) {
        var needMoreHospital = true
        if (json.retcode === 0) {
          var docs = json.docs
          if (docs && docs.length > 0) {
            that.recruitList = docs
            needMoreHospital = false
          }
        }
        if (needMoreHospital) {
          that.getDiseaseHospitalInfo(3)
        }
      })
    },
    getTidArr: function (arr) {
      var list = []
      if (arr && arr.length > 0) {
        arr.forEach(function (item) {
          if (item && item['tid' + item.tid]) {
            list.push(item['tid' + item.tid])
          } else {
            list.push(item)
          }
        })
      }
      return list
    },
    showTip: function (e, src) {
      var that = this
      var offset = $(e.srcElement || e.target).offset()
      if (offset) {
        var setDom = function (tip) {
          if (that.iconTip.isShow) {
            that.iconTip.isShow = false
          } else if (tip) {
            that.iconTip.tip = tip
            var h = offset.height
            var w = offset.width
            that.iconTip.top = offset.top + h + 10 - $(window).scrollTop()
            var zoom = (src === 'recruit' ? 0.8 : 0.36) / w
            that.iconTip.left = offset.left * zoom + (src === 'recruit' ? 0.4 : 0.18) - 1.68// 4.17为标签与宽度的距离比
            that.iconTip.isShow = true
          }
        }
        if (src === 'hospital') {
          setDom(that.referGlobalVar.data.hospitalNote)
        } else if (src === 'recruit') {
          that.getDiseaseRecruitInfo(setDom)
        }
      }
    },
    handleScrollFn () {
      var that = this
      that.iconTip.isShow = false
    },
    bindEvent: function () {
      $(window).on('scroll', this.handleScrollFn)
    },
    hideTip: function (e) {
      var that = this
      if (!$(e.srcElement || e.target).hasClass('icon|statement')) {
        that.iconTip.isShow = false
      }
    },
    toRecruit: function () {
      var that = this
      if (that.name) {
        baike.goToUrl('/mobile/recruit.html?name=' + that.name)
      }
    },
    toHospitalInfo: function () {
      var that = this
      if (that.name) {
        baike.goToUrl('/mobile/hospital_info.html?name=' + that.name + '&count=' + (that.referGlobalVar.data.hospitalCount || 0))
      }
    },
    toHospital: function (hospitalId) {
      if (!hospitalId) return
      var that = this
      baike.goToUrl('/mobile/hospital.html?type=card&hospital_id=' + hospitalId + '&name=' + that.name)
    },
    toArticle: function (docid) {
      if (!docid) return
      var that = this
      baike.goToUrl('/mobile/article.html?docid=' + docid + '&src=recruit&name=' + that.name)
    },
    toActive: function (h5url, index) {
      baike.mtaReport('allarticle_guide_helpX|' + index)
      setTimeout(() => {
        baike.goToUrl(h5url)
      }, 10)
    },
    changename: function (name) {
      var that = this
      that.name = name
      that.hospitalList = []
      that.getActiveData()
      that.getDocsDataByTags()
      that.getDiseaseHospitalInfo()
      that.getDiseaseHelpInfo()
    },
    isThree: function (arr) {
      var isThree = false
      if (arr && arr.length > 0) {
        for (var i = 0, leni = arr.length, itemi; i < leni; i++) {
          itemi = arr[i]
          if (itemi && itemi.svalue === '三甲') {
            isThree = true
            break
          }
        }
      }
      return isThree
    }
  }
}

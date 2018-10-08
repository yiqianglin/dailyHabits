/* global baike */
import { ActiveBanner } from 'components/activity/activity'
import { pageLoad } from 'src/js/specialReq.js'
import paper from 'components/paper/paper.vue'
import loading from 'components/loading/loading.vue'

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
      show: false,
      cancerList: [],
      activeOps: null,
      tags: [],
      tagIndex: -1,
      authorityList: [],
      paperList: [],
      loaded: false,
      src: baike.query('src'),
      activeTopicOps: null
    }
  },
  components: {
    ActiveBanner,
    paper,
    loading
  },
  activated () {
    // 单页缓存分享数据重置
    this.setShare(this.shareCache)
  },
  created: function () {
    var that = this
    that.init()
    // baike.setTitle('企鹅医典·肿瘤篇')
  },
  mounted: function () { },
  computed: {},
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    init: function () {
      var that = this
      var getTumourTags = function () {
        baike.get('/mobile/getTumourTags', {}, function (o) {
          if (o.retcode === 0) {
            that.tags = (o.list || []).map(item => {
              return {
                name: item.name,
                tag: item.tag,
                type: item.type,
                docs: [],
                loaded: false
              }
            })
            that.tagIndex = that.tags.length ? 0 : -1
            that.getDocsDataByTags(that.tagIndex)
            that.show = true
          }
        })
      }
      var getTumourAuthInfo = function () {
        baike.get('/mobile/getTumourAuthInfo', {}, function (o) {
          if (o.retcode === 0) {
            that.authorityList = o.hospitals
            that.show = true
          }
        })
      }
      var getTumourDiseases = function () {
        baike.get('/mobile/getTumourDiseases', {}, function (o) {
          if (o.retcode === 0) {
            that.cancerList = o.list
            that.show = true
          }
          window.medTimer && window.medTimer.reportTime({
            action: 'home_cancer_page',
            ispage: 1
          })
        })
      }

      getTumourDiseases()
      getTumourAuthInfo()
      getTumourTags()
      that.getActiveData(9)
      that.getActiveData(21)
      // 获取热词
      this.$store.dispatch('appSearch/updateHotList')

      that.setShare({
        title: '企鹅医典肿瘤篇',
        desc: '了解，是征服癌症的第一步'
      })
    },
    // 运营位
    getActiveData (type) {
      baike.post('/mobile/getActiveData', {
        activetype: type,
        name: ''
      }, o => {
        if (o.retcode === 0) {
          switch (type) {
            case 9:
              this.activeOps = {
                list: o.activelist,
                area: 'home_cancer'
              }
              break
            case 21:
              this.activeTopicOps = {
                list: o.activelist,
                area: 'home_cancer'
              }
              break
          }
        }
      })
    },
    toTopic (item) {
      baike.goToUrl('/mobile/active_topic.html')
    },
    toSearch: function () {
      this.$store.dispatch('showMiniSearch')
    },
    toBack: function () {
      baike.goBack()
    },
    toMy: function () {
      baike.goToUrl('/mobile/my.html')
    },
    toCommittee: function () {
      baike.goToUrl('/mobile/cancer_committee.html')
    },
    toWebmd: function () {
      baike.goToUrl('/mobile/authority_wm.html')
    },
    toCancer: function (item) {
      var name = item.name
      baike.goToUrl(`${baike.getOverview({ name: name, type: item.type, released: item.released })}&ptag=onco_cancerentry:${name}`)
    },
    toAuthority: function (item) {
      if (item.hospital_id === 27) {
        baike.goToUrl(`/mobile/authority.html?ptag=onco_organization:${item.name}`)
      } else if (item.hospital_id === 47) {
        baike.goToUrl(`/mobile/authority_hw.html?ptag=onco_organization:${item.name}`)
      } else if (item.hospital_id === 1000) {
        baike.goToUrl(`/mobile/authority_wm.html?ptag=onco_organization:${item.name}`)
      } else {
        baike.goToUrl(`/mobile/hospital.html?hospital_id=${item.hospital_id}&ptag=onco_organization:${item.name}`)
      }
    },
    toMore: function () {
      baike.goToUrl('/mobile/disease_list.html?depart=肿瘤科&lib=cancer&ptag=onco_otherdesease_entry')
    },
    viewAll: function () {
      let tag = this.tags[this.tagIndex]
      if (!tag) return
      if (tag.name === '临床招募') {
        baike.goToUrl('/mobile/clinical_recruitment.html?ptag=onco_allarticle')
        return
      }
      baike.goToUrl(`/mobile/tag_article.html?name=${tag.name}&tag=${tag.tag}&docType=${tag.type}&src=home_cancer&ptag=onco_allarticle`)
    },
    getDocsDataByTags: function (index, isSwitch, pageSize) {
      var that = this
      var tag = that.tags[index]
      if (!tag) return
      var name = tag.tag
      var type = tag.type
      isSwitch = isSwitch || false
      pageSize = pageSize || (tag.docs.length ? 15 : 3)
      pageLoad({
        key: 'getDocsDataByTags_' + name,
        url: 'getDocsDataByTags',
        isSwitch: isSwitch,
        pageSize: pageSize,
        retKey: 'docs',
        cb: function (pageData) {
          var docs = pageData.list
          if (docs && docs.length > 0) {
            var list = util.resolveDocs(docs)
            tag.docs = list
          }
          tag.loaded = pageData.loaded
          that.paperList = tag.docs || []
          that.loaded = tag.loaded
        }
      }, {
        name: name,
        type: type
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
        var tag = that.tags[index]
        if (!tag.docs.length) {
          that.getDocsDataByTags(index, true)
        } else {
          that.paperList = tag.docs
          that.loaded = tag.loaded
        }
      }
    }
  }
}

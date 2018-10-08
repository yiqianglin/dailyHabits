/* global baike */
import author from './author.vue'
import tag from './tag.vue'
import papertagMultiLine from 'components/tagTabCommon/multiLine.vue'

import filters from 'src/js/filters'

export default {
  props: ['name', 'paperlist', 'activelist', 'toplist', 'loading', 'loaded', 'rkey', 'noempty', 'noloading', 'threeImgWidth', 'showMode', 'ishotqa', 'drid', 'doctorid', 'listqa', 'listvideo'],
  filters: {
    formatTime: filters.formatTime
  },
  components: {
    author,
    papertagMultiLine,
    tag
  },
  data: function () {
    return {}
  },
  mounted: function () { },
  methods: {
    toActive: function (type, docid, h5url, index, text) {
      var that = this
      var reportKey = that.rkey && that.rkey.ad
      var ptag = ''
      if (reportKey) {
        ptag = reportKey + '|' + text + (index + 1)
      }
      if (h5url) {
        baike.goToUrl(baike.replaceParam('ptag', ptag, h5url))
      } else if (docid) {
        baike.goToUrl(`/mobile/article.html?docid=${docid}&name=${that.name}&ptag=${ptag}`)
      }
    },
    toTopic: function (h5url) {
      if (h5url) {
        baike.goToUrl(baike.replaceParam('ptag', 'recommend_topiccon_clk', h5url))
      }
    },
    toArticle: function (article, index, type) {
      var that = this
      var ptag = ''
      baike.mtaReport('ydd_content_recoartix:' + (index + 1))
      if (article && article.docid) {
        var name = (article.diseases && article.diseases[0] && article.diseases[0].name) || ''
        var paraid = article.paraid ? `#${article.paraid}` : ''
        var reportKey = that.rkey && that.rkey.article
        if (reportKey) {
          ptag = reportKey + ':' + (baike.query('name') + (index + 1))
        }
        ptag = type === 'qa' && that.rkey && that.rkey.qa ? that.rkey.qa + '|' + article.docid : ptag
        ptag = article.url ? 'ydd_bcautopic_doc' : ptag
        // article.readflag = 1
        var pageName = baike.getPageName(window.location.href)
        var vType = pageName === 'doctor' || pageName === 'doctor_video' ? 1 : pageName === 'hospital' ? 2 : 0
        baike.goToUrl(`/mobile/article.html?ptag=${ptag}&docid=${article.docid}&name=${name}${paraid}&vType=${vType}`)
      }
    },
    toTag: function (cate, tag) {
      var that = this
      var ptag = that.rkey && that.rkey.tag ? that.rkey.tag + '|' + tag : ''
      baike.goToUrl('/mobile/tag_article.html?name=' + baike.query('name') + '&cate=' + cate + (tag ? '&tag=' + tag : '') + (ptag ? '&ptag=' + ptag : ''))
    },
    toQaList (item, index) {
      var tag = item.hometags[index]
      if (tag) {
        baike.goToUrl(`/mobile/qa_list.html?name=${tag}`)
      }
    },
    toSearch: function () {
      var ptag = this.rkey && this.rkey.search ? this.rkey.search : ''
      // baike.goToUrl('/mobile/search.html?ptag=' + (ptag || '') + '&stag=' + baike.query('name'))
      if (ptag) {
        baike.mtaReport(ptag)
      }
      this.$store.dispatch('showMiniSearch', { stag: this.name || '' })
    },
    toDoctor: function (doctor) {
      var that = this
      var ptag = that.rkey && that.rkey.doctor ? that.rkey.doctor + '|' + doctor.name : ''
      if (doctor && doctor.doctor_id) {
        baike.goToUrl('/mobile/doctor.html?doctor_id=' + doctor.doctor_id + (ptag ? '&ptag=' + ptag : ''))
      }
    },
    toOverview: function (name, type) {
      var url = ''
      var that = this
      var ptag = that.rkey && that.rkey.disease ? that.rkey.disease + '|' + name : ''
      url = baike.getOverview({
        name: name,
        type: type
      })
      baike.goToUrl(ptag ? `${url}&ptag=${ptag}` : url)
    },
    fClick: function (expert) {
      var that = this
      var url = '/mobile/setFollowingDoctor'
      var doctorId = expert.doctor_id
      expert.fClickable = expert.fClickable === undefined ? 1 : expert.fClickable
      if (expert.fClickable === 1) {
        expert.fClickable = 0
        if (expert.follow === 0) {
          baike.post(url, {
            doctor_id: doctorId,
            follow: 1
          }, function (o) {
            if (o.retcode === 0) {
              that.$msg.toast('已添加到“我的医生”', 'success')
              expert.follow = 1
              expert.fClickable = 1
            }
          })
        } else {
          baike.post(url, {
            doctor_id: doctorId,
            follow: 0
          }, function (o) {
            if (o.retcode === 0) {
              expert.follow = 0
              expert.fClickable = 1
            }
          })
        }
      }
    },
    focusHealthTag: function (tag) {
      tag.focus = !tag.focus
    },
    ignore: function (type, item) {
      var that = this
      var params = null
      var ptag = ''
      switch (type) {
        case 'tag':
          params = {
            type: 0,
            disease: baike.query('name'),
            tag: item.name || '',
            flag: item.notInterested ? 1 : 0
          }
          ptag = that.rkey && that.rkey.ignoreTag
          break
        case 'emergency':
          params = {
            type: 1,
            disease: '',
            tag: item.name || '',
            flag: item.notInterested ? 1 : 0
          }
          ptag = that.rkey && that.rkey.ignoreEmergency
          break
        case 'disease':
          params = {
            type: 2,
            disease: '',
            tag: item.name || '',
            flag: item.notInterested ? 1 : 0
          }
          ptag = that.rkey && that.rkey.ignoreDisease
          break
        default:
          params = null
          ptag = ''
      }
      if (!params) return
      baike.mtaReport(ptag)
      baike.post('/mobile/ignoreDiseaseTag', params, function (o) {
        if (o.retcode === 0) {
          item.notInterested = !item.notInterested
        }
      })
    }
  }
}

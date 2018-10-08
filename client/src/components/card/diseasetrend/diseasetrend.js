/* global $, baike */
import Vue from 'vue'
import 'src/libs/swiper/swiper.min.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import paper from 'components/paper/paper.vue'
import topicdocsC from 'components/topicdocs_c/topicdocs_c.vue'
import { lockedReq, pageLoad } from 'src/js/specialReq.js'
Vue.use(VueAwesomeSwiper /* { default global options } */)

var diseasetrendVar = {
  paperBanner: [],
  isInit: {},
  hotAsk: '',
  complaint: {
    '腰椎间盘突出症': {
      A: 'https://wj.qq.com/s/1798296/0311',
      B: 'https://wj.qq.com/s/1799089/b12a',
      C: 'https://wj.qq.com/s/1799092/8a61'
    },
    '哮喘': {
      A: 'https://wj.qq.com/s/1799098/4c09',
      B: 'https://wj.qq.com/s/1799100/f6c9',
      C: 'https://wj.qq.com/s/1799102/e485'
    },
    '乳腺癌': {
      A: 'https://wj.qq.com/s/1799105/a667',
      B: 'https://wj.qq.com/s/1799106/ba67',
      C: 'https://wj.qq.com/s/1799107/4d41'
    }
  }
}

export default {
  props: ['isshow'],
  data: function () {
    return {
      baseInfo: {},
      followed: false,
      name: baike.query('name'),
      paperList: [],
      paperListDis: [],
      activeList: [],
      newActiveList: [],
      otherActiveList: [],
      topList: [],
      tabList: [],
      allDiseasetag: [],
      loaded: false,
      lastMode: 1,
      lastNum: null,
      pullout: null,
      showMode: baike.query('mode') ? Number(baike.query('mode')) : 1,
      firstGuide: false,
      version: '',
      reportKey: {},
      topic: [],
      // closeTipsActionList: null,
      curIndex: 0
    }
  },
  components: {
    paper,
    topicdocsC
  },
  created: function () {
    var that = this
    that.getOverviewTopic()
    that.getDocsDataByTags(true)
    that.getActiveData(null, that.showMode === 0 || that.showMode === 2 ? 6 : 4)
    // baike.setTitle('企鹅医典·' + that.name)
    that.version = (that.name + (that.showMode === 0 ? 'C' : (that.showMode === 2 ? 'C1' : 'B')))
    if (that.showMode === 3) {
      that.getActiveData(null, 8)
    }
  },
  computed: {
    alias: function () {
      var alias = ''
      var opAlias = this.baseInfo.op_alias
      if (opAlias) {
        alias = opAlias.join('，')
      }
      return alias.replace(/(.*)[，]$/, '$1')
    }
    // showBubbleTips: function () {
    //   var flag = Boolean(this.closeTipsActionList !== null && !this.closeTipsActionList.cardPageCategory)
    //   if (flag) {
    //     setTimeout(function (that) {
    //       that.closeBubbleTips(true)
    //     }, 4000, this)
    //   }
    //   return flag
    // }
  },
  mounted: function () {
  },
  destroyed () {
    $(window).off('scroll', this.handleScrollFn)
  },
  deactivated () {
    $(window).off('scroll', this.handleScrollFn)
  },
  activated () {
    // 返回更新关注数据
    this.getOverviewBaseinfo()
    this.bindEvent()
    // 单页缓存分享信息重写
    this.setShare(this.shareCache)
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    getOverviewBaseinfo: function () {
      var that = this
      if (!that.name) return
      baike.get('/mobile/getOverviewBaseinfo', {
        name: that.name,
        type: 1
      }, function (o) {
        var baseinfo = o.baseinfo
        var baseInfo = {}
        if (baseinfo && baseinfo.length > 0) {
          var list = []
          baseinfo.forEach(function (item) {
            list.push(item['tid' + item.tid] || item)
          })
          baseinfo = list
          var tabList = []
          if (baseinfo[1] && baseinfo[1].list) tabList = baseinfo[1].list
          baseInfo = baseinfo[0]
          tabList = (baseInfo['op_quickoverview'] ? [{
            'name': '图解',
            icon: require('src/assets/images/mobile/card/icon_tujie.png'),
            pinyin: 'tujie'
          }] : []).concat([{
            'name': baseInfo['op_tname'],
            icon: baseInfo['op_tname_icon'],
            pinyin: 'gaishu'
          }], tabList)
          that.baseInfo = baseInfo
          that.tabList = tabList
          if (baseInfo.name && baseInfo.name !== that.name) {
            that.name = baseInfo.name
            that.getDocsDataByTags(true)
            that.getActiveData()
            // baike.setTitle('企鹅医典·' + that.name)
            that.$emit('changename', that.name)
          }
        }
        that.followed = o.follow

        // 微信JSSDK开发
        that.setShare({
          title: '企鹅医典·' + that.name,
          desc: baseInfo.definition || '传递健康与信赖'
        })
        window.medTimer && window.medTimer.reportTime({
          action: 'card_page',
          ispage: 1
        })
      }, true)
    },
    getOverviewTopic: function () {
      var that = this
      baike.get('/mobile/getOverviewTopic', { name: that.name, type: 1 }, function (o) {
        if (o.retcode === 0) {
          var topic = o.topic
          topic.forEach((item) => {
            item.name = item.title
          })
          if (topic && topic.length > 0) {
            if (topic && topic[0].topic === '热门文章' && (that.showMode === 2 || that.showMode === 3)) {
              topic.shift()
            }
            // topic tab 增加疾病动态
            topic.unshift({
              count: 0,
              list: [],
              readflag: 1,
              title: '疾病动态',
              topic: '疾病动态',
              name: '疾病动态'
            })
            that.topic = topic
          }
        }
      })
    },
    randomNumBoth: function (Min, Max) {
      var that = this
      var Range = Max - Min
      var Rand = Math.random()
      var num = Min + Math.round(Rand * Range) // 四舍五入
      if (that.lastNum === num) {
        return that.randomNumBoth(Min, Max)
      } else {
        that.lastNum = num
        return num
      }
    },
    getDocsDataByTags: function (isFirst, pullUp) {
      var that = this
      if (!that.name) return
      if (that.loaded === 1 && pullUp) {
        $('.dropload-load').html('<p class="no-more-tips">已经没有更多内容</p>')
        $('.dropload-up-custom').addClass('no-more')
        setTimeout(function () {
          pullUp.resetload()
        }, 1000)
      }
      var pageSize = (isFirst ? 24 : 12)
      pageLoad({
        key: 'getDiseaseFeed_' + that.name,
        url: '/mobile/getDiseaseFeed',
        retKey: 'docs',
        pageSize: pageSize,
        cb: function (pageData) {
          var list = pageData.list
          var diseasetag = pageData.diseasetag
          var i = 0
          if (list && list.length === 24 && pullUp) {
            $('.dropload-load').html('<p class="no-more-tips">已经没有更多内容</p>')
            $('.dropload-up-custom').addClass('no-more')
            setTimeout(function () {
              pullUp.resetload()
            }, 1000)
          }
          if (!isFirst) baike.mtaReport('feeds_loading_illX|' + baike.query('name'))
          for (i = 0; i < diseasetag.length; i++) {
            for (var j = 0; j < diseasetag[i]['tag'].length; j++) {
              diseasetag[i]['tag'][j].notInterested = false
            }
          }
          that.allDiseasetag = that.allDiseasetag.concat(diseasetag)
          if (list && list.length > 0) {
            var tmplist = []
            var random = null
            list.forEach(function (item) {
              if (item && item['tid' + item.tid]) {
                tmplist.push(item['tid' + item.tid])
              } else {
                tmplist.push(item)
              }
            })
            if (pullUp) {
              if (list.length > that.paperList.length) {
                var splitArr = tmplist.slice(list.length - pageSize)

                tmplist = splitArr.concat(tmplist.splice(list.length - pageSize, pageSize))

                if (!that.pullout) {
                  that.pullout = setTimeout(function () {
                    random = that.randomNumBoth(0, that.newActiveList.length - 1)
                    that.topList = [that.newActiveList[random]]
                    pullUp.resetload()
                    that.pullout = null
                  }, 500)
                }
              }
              if (that.loaded && !that.pullout) {
                that.pullout = setTimeout(function () {
                  random = that.randomNumBoth(0, that.newActiveList.length - 1)
                  that.topList = [that.newActiveList[random]]
                  pullUp.resetload()
                  that.pullout = null
                }, 500)
              }
              if (that.lastMode === 1) {
                pageData.loaded = false
              }
              //   pageData.loaded = false
            } else {
              if (that.lastMode === 0) {
                pageData.loaded = false
              }
            }
            if (diseasetrendVar.hotAsk) {
              tmplist.splice(12, 0, diseasetrendVar.hotAsk)
            }
            if (diseasetrendVar.paperBanner[0]) tmplist.splice(13, 0, diseasetrendVar.paperBanner[0])
            // if (diseasetrendVar.paperBanner[1]) tmplist.splice(6, 0, diseasetrendVar.paperBanner[1])

            if ($.isArray(that.allDiseasetag) && that.allDiseasetag.length > 2) {
              var every = 36
              var dot = Math.floor(tmplist.length / every)
              for (i = 0; i < dot; i += 1) {
                (function (ii) {
                  console.log(that.allDiseasetag[ii], ((ii + 1) * every) + ii)
                  var tagItem = that.allDiseasetag[ii * 3 + 2]
                  if (tagItem) {
                    tagItem.isTag = true
                    baike.mtaReport('feeds_tag_show|' + baike.query('name'))
                    $.each(tagItem, (index, item) => {
                      if (item.searchtitle) {
                        tagItem.searchtitle = item.searchtitle
                      }
                    })
                    tmplist.splice(((ii + 1) * every) + ii, 0, tagItem)
                  }
                })(i)
              }
            }
            that.paperList = tmplist
            pageSize === 24 && that.getActiveData(true)
          }
          that.loaded = pageData.loaded
          if (that.loaded && !that.pullout) {
            that.pullout = setTimeout(function () {
              if (pullUp) {
                random = that.randomNumBoth(0, that.newActiveList.length - 1)
                that.topList = [that.newActiveList[random]]
                pullUp.resetload()
              }
              that.pullout = null
            }, 500)
          }
          // 下拉刷新去掉前五条置顶文章放在列表最后
          if (pullUp && that.otherActiveList.length > 0) {
            // that.paperList.slice(5).push(that.otherActiveList.join(','))\
            // that.topList = []
            // for (var i = that.otherActiveList.length - 1; i >= 0; i--) {
            //   that.otherActiveList[i].isHot = true
            // }
            // console.log(that.paperList)
            // that.paperList = that.paperList.concat(that.otherActiveList)
          }
          that.lastMode = pullUp ? 0 : 1
          //  console.log(that.paperList)
          if (pageData && pullUp) {
            // pullUp.resetload()
          }
        }
      }, {
        name: that.name,
        mode: pullUp ? 0 : 1
      })
    },
    navToDDetail: function (name, pinyin) {
      var that = this
      var ptag = ((that.showMode === 0 || that.showMode === 2) && name) ? 'card_iconX|' + name : ''
      var docId = that.baseInfo.op_quickoverview
      var url = `/mobile/ddetail.html?ptag=${ptag}&name=` + that.name
      url += docId ? ('&doc_id=' + docId) : ''
      url += '#' + (pinyin || 'gaishu')
      baike.goToUrl(url)
    },
    ignoreDiseaseTagReq: function (tag) {
      var that = this
      baike.post('/mobile/ignoreDiseaseTagReq', {
        disease: that.name,
        tag: tag || ''
      }, function (json) {
        if (json.retcode === 0) {

        }
      })
    },
    getActiveData: function (isPaperList, activetype) {
      var that = this
      if (!that.name) return
      baike.post('/mobile/getActiveData', {
        activetype: activetype || 4,
        name: activetype === 8 ? that.name : (((isPaperList || activetype === 6) ? '' : '头部_') + that.name + (isPaperList ? '_文章列表' : ''))
      }, function (json) {
        if (json.retcode === 0) {
          var activelist = json.activelist
          if (activelist && activelist.length > 0) {
            if (isPaperList && activetype !== 6 && activetype !== 8) {
              activelist.forEach(function (item) {
                item.isAd = true
              })
              diseasetrendVar.paperBanner = activelist.slice(0, 1)
              // if (diseasetrendVar.paperBanner[0]) that.paperList.splice(13, 0, diseasetrendVar.paperBanner[0])
              // if (diseasetrendVar.paperBanner[1]) {
              //   // 链接是问卷的
              //   var complaint = diseasetrendVar.paperBanner[1]
              //   var complaintUrl = diseasetrendVar.complaint[that.name] && diseasetrendVar.complaint[that.name][that.showMode === 0 ? 'C' : 'B']
              //   if (complaintUrl) complaint.h5url = complaintUrl
              //   that.paperList.splice(6, 0, diseasetrendVar.paperBanner[1])
              // }
            } else if (activetype === 8 && activelist.length > 0) {
              that.otherActiveList = activelist.slice(0, 5)
              that.topList = that.otherActiveList.concat(that.topList)
              // }
            } else {
              that.activeList = activelist
            }
          }
          if (activetype === 6) {
            that.newActiveList = activelist
            that.topList = that.newActiveList.length > 0 ? [that.newActiveList[that.randomNumBoth(0, that.newActiveList.length - 1)]] : []
            if (that.newActiveList[0]) {
              diseasetrendVar.hotAsk = that.newActiveList[0]
              diseasetrendVar.hotAsk.isHot = true

              if (that.paperList.length) {
                that.paperList.splice(12, 0, diseasetrendVar.hotAsk)
              }
            }
          }
        }
      })
    },
    tabClick: function (tab) {
      var that = this
      if (that.tab === tab) return // 重复点击
      this.$emit('tabclick', tab)
    },
    topictabclick: function (index) {
      console.log('aaaa')
      this.curIndex = index
    },
    toDoctor: function (doctorId) {
      if (doctorId) {
        baike.goToUrl('/mobile/doctor.html?doctor_id=' + doctorId)
      }
    },
    toRecommend (item) {
      var h5url = item.h5url
      if (h5url) {
        var pageName = baike.getPageName(h5url)
        var ptag = (pageName === 'audio' ? 'ydd_brestcancer_autopic' : 'onco_listcancermore_bannerX:' + pageName)
        baike.goToUrl(baike.replaceParam('ptag', ptag, h5url, true))
      }
    },
    followClick: function () {
      var that = this
      lockedReq({
        method: 'post',
        url: that.followed ? '/mobile/del_follow' : '/mobile/add_follow',
        callback: function (o) {
          if (o.retcode === 0) {
            if (!that.followed) {
              that.$msg.toastAdd('focus')
            }
            that.followed = !that.followed
          }
        }
      }, {
        disease: that.name
      })
    },
    handleScrollFn () {
      var $window = $(window)
      var that = this
      var pageHeight = $window.height()
      var st = $window.scrollTop()
      if (that.isshow && $('.loading').length > 0 && st > $('.loading').offset().top - pageHeight - 100) {
        if (that.curIndex === 0) {
          baike.throttle(that.getDocsDataByTags, that, 200)
        }
      }
    },
    bindEvent: function () {
      var that = this
      $(window).on('scroll', this.handleScrollFn)
      // var isFirst = true
      // $window.on('scroll', function () {
      //   var st = $window.scrollTop()
      //   if (that.isshow && $('.loading').length > 0 && st > $('.loading').offset().top - pageHeight - 100) {
      //     if (isFirst) { // 首次加载文章，需要插入一个banner
      //       isFirst = false
      //       // that.getActiveData(true)
      //     }
      //     if (that.curIndex === 0) {
      //       baike.throttle(that.getDocsDataByTags, that, 200)
      //     }
      //   }
      // })
      that.$emit('trendmounted')
    },
    showGuide: function () {
      this.firstGuide = true
    },
    hideGuide: function () {
      this.firstGuide = false
      baike.setCookie('firstGuide', true, 100000)
    }
  }
}

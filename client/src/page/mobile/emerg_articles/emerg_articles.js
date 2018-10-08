/* global $, baike */
import tmenu from 'components/tmenu/tmenu.vue'

var enterGlobalVar = {
  page: 1,
  pageSize: 10,
  timeout: 0,
  timeoutScroll: 0
}
export default {
  data () {
    return {
      name: '',
      isShow: false,
      moveHeight: 0,
      pageHeight: $(window).height(),
      isTouched: false,
      paperList: [],
      isShowContent: true,
      loading: false,
      loaded: false
      //  showConsultant: false,
      //   experts: [],

    }
  },
  components: {
    tmenu
  },
  computed: {
    availableToWithdraw: function () {
      return Number(this.reward) > 0
    }
  },
  activated () {
  },
  created: function () {
    var that = this
    that.init()
  },
  mounted: function () {
  },
  watch: {

    isShowPop: function () {
      if (this.isShowPop) {
        $('body,html').css('overflow', 'hidden')
      } else {
        $('body,html').css('overflow', '')
      }
    }
  },
  methods: {
    init: function () {
      var that = this

      that.getEmerDocsData()
    },

    getEmerDocsData: function () {
      var that = this
      if (that.loaded || that.loading) {
        return
      }
      if (enterGlobalVar.timeout) {
        clearTimeout(enterGlobalVar.timeout)
      }
      enterGlobalVar.timeout = setTimeout(function () {
        that.loading = false
      }, 500)
      that.loading = true
      var page = enterGlobalVar.page
      var pageSize = enterGlobalVar.pageSize
      baike.post('/mobile/getEmerDocsData', {
        offset: (page - 1) * pageSize,
        count: pageSize
      }, function (json) {
        that.loading = false
        clearTimeout(enterGlobalVar.timeout)
        if (page === enterGlobalVar.page) {
          if (json.retcode === 0) {
            enterGlobalVar.page++
            var docs = json.docs || []
            if (docs.length > 0) {
              that.paperList = that.paperList.concat(docs.map(function (s) {
                if (s && s['tid' + s.tid]) {
                  return s['tid' + s.tid]
                }
              }))
            }
            if (docs.length < pageSize) {
              that.loaded = true
            }
            if (page === 1 && !that.loaded) { // 需要滚动加载
              $('#paper').off().on('scroll', function () {
                if (that.loading || that.loaded) return
                if (enterGlobalVar.timeoutScroll) {
                  clearTimeout(enterGlobalVar.timeoutScroll)
                }
                enterGlobalVar.timeoutScroll = setTimeout(function () {
                  var st = $('#paper').scrollTop()
                  if (st > 0 && st > ($('#paperUl').height() - that.pageHeight - $('.searcher-box').height())) {
                    that.getEmerDocsData()
                  }
                }, 200)
              })
            }
          }
        }
      })
    },
    // fClick: function(expert) {
    //     var that = this;
    //     var url = '/mobile/setFollowingDoctor';
    //     var doctor_id = expert.doctor_id;
    //     expert.fClickable = expert.fClickable === undefined ? 1 : expert.fClickable;
    //     if (expert.fClickable == 1) {
    //         expert.fClickable = 0;
    //         if (expert.follow == 0) {
    //             baike.post(url, {
    //                 doctor_id: doctor_id,
    //                 follow: 1
    //             }, function(o) {
    //                 if (o.retcode == 0) {
    //                     toast.show('expert', '.search-nav');
    //                     expert.follow = 1;
    //                     expert.fClickable = 1;
    //                     MtaH5.clickStat("ydd_dochome_follow");
    //                 }
    //             });
    //         } else {
    //             baike.post(url, {
    //                 doctor_id: doctor_id,
    //                 follow: 0
    //             }, function(o) {
    //                 if (o.retcode == 0) {
    //                     expert.follow = 0;
    //                     expert.fClickable = 1;
    //                     MtaH5.clickStat("ydd_dochome_followcancel");
    //                 }
    //             });
    //         }
    //     }
    // },
    toArticle: function (index) {
      var that = this
      var article = that.paperList[index]
      if (article) {
        window.location.href = '/mobile/article.html?type=hot&docid=' + article.docid + '&ptag=YDD_Emergency_MoreArti_ArtiX|' + (index + 1) + '&name=' + ((article.diseases && article.diseases[0] && article.diseases[0].name) || '')
      }
    }
    // goToWithdraw:function(){
    //     if (this.availableToWithdraw) {
    //         location.href = '/mobile/hongbao/hb_withdraw.html';
    //     }

    // },
    // goToEnter:function(){

    //         location.href = '/mobile/enter.html';

    // },
  }
}

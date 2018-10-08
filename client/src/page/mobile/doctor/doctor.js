/* global $, baike */
import tmenu from 'components/tmenu/tmenu.vue'
import paper from 'components/paper/paper.vue'
import loading from 'components/loading/loading.vue'

export default {
  data () {
    return {
      weight: 0,
      doctorself: '',
      editordiseases: [], // 权威医生主页 XX癌编审委员会委员
      followingnum: '',
      pv: '',
      curTab: 0,
      curDocs: [],
      curLoaded: false,
      fixTab: false,
      searcherShow: false,
      docByTabs: [],
      hand: '',
      name: '',
      main_depart: '',
      depart: [],
      doctitle: '',
      op_vt_teachtitle: '',
      hospital_name: '',
      hospital_shortname: '',
      hospital_id: '',
      hospital_clickable: 0,
      auth_hand: '',
      diseases_desc: '',
      follow: 0,
      fClickable: 1,
      op_md_moretitle: '',
      op_md_introd: '',
      v_md_moretitle: '',
      v_md_introd: '',
      op_clinictimepic: [],
      tlist: [],
      op_vt_diseases_tag: [],
      extraDiseases: [],
      // ui
      isShow: false,
      introExpanded: false,
      upper: 5,
      isShowMenu: !document.referrer,
      urlSrc: baike.query('src') || '',
      doctorId: baike.query('doctor_id') || '',
      showCheckDoctorExpressway: false, // 查医生
      expresswayUrl: '', // 查医生url
      isFromSearch: baike.query('fromDoctorSearch') // 是否来自查医生
    }
  },
  components: {
    tmenu,
    paper,
    loading
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
    that.getDoctorHdf()
  },
  mounted: function () {
    var that = this
    that.bind()
  },
  computed: {
    specialDoctor: function () {
      var that = this
      return (that.editordiseases && that.editordiseases.length > 0) // || that.weight == 2
    },
    cancerDoctor: function () { // 董家鸿 韩济生 刘新垣
      var doctorId = this.doctorId
      return doctorId === '10657' || doctorId === '10656' || doctorId === '10658'
    },
    inDoctorSearchBlackListFlag () { // 查医生过滤（需求人：aluwang）
      let balckList = ['10110', '10111', '10112', '10113', '10114', '10115', '10116', '10117', '10119', '10120', '10121', '10122', '10123', '10124', '10125', '10126', '10127', '10130', '10133', '10135', '10136', '10580', '10617', '10621', '10623', '10625', '10759', '10786', '10801', '10802', '10803', '10804', '10805', '10806', '10807', '10808', '10809', '10810', '10811', '10812', '10813', '10814', '10815', '10816', '10817', '10818', '10819', '10820', '10821', '10822', '10823', '10824', '10825', '10826', '10827', '10828', '10829', '10830', '10831', '10832', '10833', '10834', '10835', '10836', '10837', '10838', '10839', '10840', '10841', '10842', '10843', '10844', '10845', '10846', '10847', '10848', '10849', '10850', '10851', '10852', '10853', '10854', '10855', '10856', '10857', '10858', '10859', '10860', '10861', '10862', '10863', '10864', '10865', '10866', '10867', '10868', '10869', '10870', '10871', '10872', '10873', '10874', '10875', '10876', '10877', '10878', '10879', '10880', '10881', '10882', '10883', '10884', '10885', '10886', '10887', '10888', '10890', '10891', '10892', '10894', '10895', '10896', '10897', '10898', '10899', '10900', '10901', '10902', '10903', '10907', '10908', '10909', '10910', '10911', '10912', '10913', '10914', '10915', '10916', '10917', '10918', '10919', '10920', '10921', '10922', '10923', '10925', '10926', '10927', '10928', '10930', '10931', '10932', '10933', '10934', '10935', '10936', '10937', '10938', '10939', '10940', '10941', '10942', '10943', '10944', '10945', '10946', '10947', '10948', '10949', '10950', '10951', '10952', '10953', '10954', '10955', '10956', '10957', '10958', '10959', '10960', '10961', '10962', '10963', '10964', '10965', '10966', '10967', '10968', '10969', '10970', '10971', '10972', '10973', '10974', '10975', '10976', '10977', '10978', '10979', '10980', '10981', '10982', '10983', '10984', '10985', '10986', '10987', '10988', '10989', '10990', '10991', '10992', '10993', '10994', '10995', '10996', '10997', '10998', '10999', '11000', '11001', '11002', '11003', '11004', '11005', '11006', '11007', '11008', '11009', '11010', '11011', '11012', '11013', '11014', '11015', '11016', '11017', '11018', '11019', '11020', '11021', '11022', '11023', '11024', '11025', '11026', '11027', '11028', '11029', '11030', '11036', '11037', '11038', '11039', '11040', '11041', '11042', '11043', '11044', '11045', '11046', '11047', '11048', '11049', '11050', '11051', '11052', '11053', '11054', '11055', '11056', '11057', '11058', '11059', '11060', '11061', '11062', '11063', '11064', '11065', '11066', '11067', '11069', '11070', '11071', '11072', '11073', '11074', '11075', '11076', '11078', '11079', '11080', '11081', '11082', '11083', '11084', '11085', '11086', '11087', '11088', '11089', '11090', '11091', '11092', '11093', '11094', '11095', '11096', '11097', '11098', '11099', '11100', '11101', '11102', '11103', '11104', '11105', '11106', '11107', '11108', '11109', '11110', '11111', '11112', '11113', '11114', '11115', '11116', '11117', '11118', '11119', '11120', '11121', '11122', '11123', '11124', '11125', '11126', '11127', '11128', '11129', '11130', '11131', '11132', '11133', '11134', '11135', '11136', '11137', '11138', '11139', '11140', '11141', '11142', '11143', '11144', '11145', '11146', '11147', '11148', '11149', '11150', '11151', '11152', '11153', '11154', '11155', '11156', '11157', '11159', '11160', '11162', '11163', '11165', '11166', '11167', '11171', '11172', '11173']
      return balckList.filter((item) => {
        return item === this.doctorId
      }).length
    }
  },
  methods: {
    init: function () {
      var that = this
      var url = '/mobile/init_doctor'
      baike.get(url, {
        doctor_id: that.doctorId
      }, function (o) {
        if (o.retcode === 0) {
          that.weight = o.weight
          if (that.weight) {
            that.followingnum = o.followingnum
            that.pv = o.pv
            that.doctorself = o.doctorself === that.doctorId
          }
          var doctag = o.doctag || []
          if (new RegExp(/video_compilation/).test(that.urlSrc)) { // 如果是从视频聚合页过来，则默认展示视频讲解tab，并放在左侧第一个
            var flag = false
            var videoIndex = 0
            doctag.forEach((item, index) => {
              if (item === '视频讲解') {
                flag = true
                videoIndex = index
              }
            })
            if (flag && videoIndex !== 0) {
              doctag[videoIndex] = doctag[0]
              doctag[0] = '视频讲解'
            }
          }
          for (var i = 0; i < doctag.length; i++) {
            var item = {
              title: doctag[i],
              list: [],
              loaded: false,
              loading: false,
              page: 1,
              pageSize: 10
            }
            that.docByTabs.push(item)
            that.getDoctorRelated(i)
          }
          that.hand = o.hand
          that.auth_hand = o.auth_hand
          that.name = o.name
          that.main_depart = o.main_depart
          that.depart = o.depart
          that.doctitle = o.doctitle
          that.op_vt_teachtitle = o.op_vt_teachtitle
          that.hospital_name = o.hospital_name
          that.hospital_shortname = o.hospital_shortname || ''
          that.hospital_id = o.hospital_id
          that.hospital_clickable = o.hospital_clickable
          that.diseases_desc = o.diseases_desc
          that.editordiseases = o.editordiseases
          that.follow = o.follow
          that.fClickable = 1
          that.op_md_moretitle = o.op_md_moretitle
          that.op_md_introd = o.op_md_introd
          that.v_md_moretitle = o.v_md_moretitle
          that.v_md_introd = o.v_md_introd
          that.op_clinictimepic = o.op_clinictimepic
          that.op_vt_diseases_tag = o.op_vt_diseases_tag
          that.tlist = o.tlist || []
          that.extraDiseases = o.overviewdiseases || []
          // 所属科室、擅长领域、专业资质为空则默认展开
          that.introExpanded = !((that.depart && that.depart.length) || (that.op_vt_diseases_tag && that.op_vt_diseases_tag.length) || that.v_md_moretitle)
          that.isShow = true
          that.setShare({
            title: '分享好医生:' + that.name + that.doctitle + '-企鹅医典',
            desc: that.diseases_desc,
            imgUrl: that.hand
          })
        }
        window.medTimer && window.medTimer.reportTime({
          action: 'doctor_page',
          ispage: 1
        })
      }, true)
    },
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    getDoctorRelated: function (index) {
      var that = this
      var tab = that.docByTabs[index]
      if (!tab || tab.loading) return
      tab.loading = true
      baike.mtaReport('ydd_aritcle_load')
      var page = tab.page
      var pageSize = tab.pageSize
      var doctag = tab.title
      var doctorId = that.doctorId
      baike.post('/mobile/getDoctorRelated', {
        doctor_id: doctorId,
        doctag: doctag,
        offset: (page - 1) * pageSize,
        count: pageSize
      }, function (o) {
        tab.loading = false
        if (o.retcode === 0) {
          tab.page++
          var docs = o.doclist || []
          if (docs.length > 0) {
            var temp = docs.map(function (doc) {
              if (doc && doc['tid' + doc.tid]) {
                return doc['tid' + doc.tid]
              }
            })
            tab.list = tab.list.concat(temp.filter(function (item, index) {
              return !!item
            }))
          }
          tab.loaded = docs.length < pageSize
          that.clickDocTab(that.curTab)
        }
      })
    },
    getDoctorHdf: function () {
      var that = this
      baike.get('/mobile/doctorHdf', {
        doctorid: this.doctorId
      }, function (o) {
        if (o.retcode === 0) {
          if (o.url) {
            that.showCheckDoctorExpressway = true
            that.expresswayUrl = o.url
          }
        }
      })
    },
    toHospital: function (hospitalId) {
      var that = this
      if (that.hospital_clickable === 1 && hospitalId) {
        baike.goToUrl(`/mobile/hospital.html?hospital_id=${hospitalId}&ptag=${that.specialDoctor ? 'docpage_hosp' : 'ydd_dochome_hospital'}`)
      }
    },
    toDepart: function (item) {
      if (item.clickable === 1 && item.depart_id) {
        var that = this
        baike.goToUrl(`/mobile/depart.html?hospital_id=${that.hospital_id}&depart_id=${item.depart_id}&ptag=${'docpage_deptentry:' + item.name}`)
      }
    },
    toCancer: function () {
      var that = this
      var editordiseases = that.editordiseases
      baike.goToUrl(editordiseases.length > 1 ? '/mobile/cancer_committee.html?ptag=docpage_commt' : `/mobile/cancer_committee.html?name=${editordiseases[0]}&ptag=docpage_commt`)
    },
    toArticle: function (index) {
      var that = this
      var tab = that.docByTabs[that.curTab]
      var article = tab && tab.list[index]
      if (article) {
        baike.goToUrl('/mobile/article.html?docid=' + article.docid + '&name=' + ((article.op_keyword && article.op_keyword[0]) || '') + '&type=' + that.name + (that.specialDoctor ? '&ptag=docpage_articleclick' : ('&ptag=ydd_dochome_articalx:' + (index + 1))))
      }
    },
    toOverview: function (name, type) {
      baike.goToUrl(baike.getOverview({
        name: name,
        type: type
      }))
    },
    fClick: function () {
      var that = this
      var url = '/mobile/setFollowingDoctor'
      if (that.fClickable === 1) {
        that.fClickable = 0
        if (that.follow === 0) {
          baike.post(url, {
            doctor_id: that.doctorId,
            follow: 1
          }, function (o) {
            if (o.retcode === 0) {
              that.$msg.toastAdd('follow')
              that.follow = 1
              that.fClickable = 1
            }
          })
        } else {
          baike.post(url, {
            doctor_id: that.doctorId,
            follow: 0
          }, function (o) {
            if (o.retcode === 0) {
              that.follow = 0
              that.fClickable = 1
            }
          })
        }
      }
    },
    introClick: function () {
      var that = this
      that.introExpanded = !that.introExpanded
    },
    clickDocTab: function (index, report) {
      var that = this
      if (index in that.docByTabs) {
        that.curTab = index
        that.curDocs = that.docByTabs[index].list || []
        that.curLoaded = that.docByTabs[index].loaded || false
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
      var doclist = $('.doclist')
      var doclistTop = doclist.length ? doclist[0].offsetTop : 0
      var docTabs = $('.docTabs')
      var docTabsHeight = docTabs.length && !that.fixTab ? docTabs[0].offsetHeight : 0
      that.fixTab = doclistTop - docTabsHeight < scrollTop

      var tab = that.docByTabs[that.curTab]
      if (!tab) return
      if (tab.loaded) {
        // window.removeEventListener('scroll', load);
        return
      }
      if (tab.loading) return

      var scrollHeight = $('body').height()
      var windowHeight = $(window).height()
      if (scrollTop >= scrollHeight - windowHeight) {
        that.getDoctorRelated(that.curTab)
      }
    },
    bind: function () {
      window.addEventListener('scroll', this.load)
    }
  }
}

/* global $, baike, location */
import weui from 'src/libs/weui/weui.min.js'
import {lockedReq} from 'src/js/specialReq.js'
import 'src/libs/weui/weui.min.css'

export default {
  data () {
    return {
      loading: {
        show: false,
        tip: '数据加载中'
      },
      askList: [{
        type: 1, // 问 1 答 2  结果 3
        list: ['请选择问诊人']
      }],
      gender: '',
      age: '',
      inputVal: '',
      isInput: false,
      isRating: false,
      starText: ['很不满意，迫待改进', '不满意，需要提升', '一般，有待提升', '还可以，需要加强', '满意，继续加油'],
      star: 0,
      multiChecked: [],
      singleChecked: '',
      paddingBottom: 0,
      retryNum: 0, // 重试次数
      distress: {eid: '', text: '', value: '', show: false, phoneValue: ''},
      name: '', // 疾病名
      overview: {},
      isWelcome: true,
      ageSel: '' // 1 大于15岁  2 小于16岁
    }
  },
  activated () {
    // 单页缓存分享信息重写
    this.setShare(this.shareCache)
  },
  created: function () {
    this.setTitle('Tencent-Babylon')
    this.setShare({
      title: 'Tencent-Babylon',
      desc: '输入症状，得到诊断结果'
    })
  },
  mounted: function () {
  },
  computed: {
    selectedList () {
      var that = this
      return (that.askList[that.askList.length - 1].selectedList || [])
    },
    // singleList() {
    //   var that = this
    //   return (that.askList[that.askList.length - 1].singleList || [])
    // },
    // multiList() {
    //   var that = this
    //   return (that.askList[that.askList.length - 1].multiList || [])
    // },
    btnName () {
      var that = this
      var btnName = ''
      if (that.selectedList.length === 1) {
        btnName = that.selectedList[0]
      }
      return btnName
    },
    overviewData () {
      return this.name && this.overview[this.name]
    }
  },
  watch: {
    singleChecked: function (val) {
      if (val) {
        this.multiChecked = []
      }
    },
    multiChecked: function (val) {
      if (val && val.length) {
        this.singleChecked = ''
      }
    },
    name: function (val) {
      if (val && !this.overview[val]) {
        this.getOverview(val)
      }
    },
    ageSel: function (val) {
      this.askList.push({
        type: 1, // 问 1 答 2  结果 3
        list: ['您好，我将根据您的症状描述，帮助您找到可能的致病因素。', '请告诉我您的性别。']
      })
    }
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    submitInput () {
      var that = this
      that.inputVal = $.trim(that.inputVal)
      if (!that.inputVal) {
        return
      }
      that.isInput = false
      that.askList.push({ type: 2, list: [that.inputVal] })
      that.interactConversation({
        type: 0,
        vec_input: that.inputVal
      })
    },
    setInput () {
      var that = this
      that.isInput = true
      that.inputVal = ''
      that.$nextTick(() => {
        window.weui && weui.searchBar('#searchBar')
      })
      that.setPaddingBottom()
    },
    createConversation () {
      var that = this
      var loading = that.loading
      loading.tip = '创建会话中'
      loading.show = true
      baike.get('/mobile/createConversation', { gender: that.gender, age: that.age }, function (json) {
        loading.show = false
        if (json.retcode === 0 && json.ret === 0) {
          that.retryNum = 0
          var vecEinfo = json.vec_einfo
          if (vecEinfo && vecEinfo.length > 0) {
            if (vecEinfo[0].value) that.askList.push({ type: 1, list: vecEinfo[0].value.split('<__ SPLIT_MESSAGE __>') })
            that.setInput()
          }
        } else {
          setTimeout(function () {
            weui.alert(that.retryNum > 2 ? '多次重试失败，请刷新页面' : '创建失败，重新创建', function () {
              if (that.retryNum > 2) {
                location.reload()
                return
              }
              that.retryNum++
              that.createConversation()
            }, {
              className: 'ft32'
            })
          }, 400)
        }
      }, null, null, 20000)
    },
    interactConversation (opt) {
      var that = this
      var loading = that.loading
      loading.tip = '数据加载中'
      loading.show = true
      baike.post('/mobile/interactConversation', { type: opt.type, vec_input: opt.vec_input }, function (json) {
        loading.show = false
        var retry = function (opt) {
          setTimeout(function () {
            weui.dialog({
              content: '数据加载失败，重新尝试或重建会话',
              className: 'ft32',
              buttons: [{
                label: '重新尝试',
                type: 'default',
                onClick: function () {
                  that.interactConversation(opt)
                }
              }, {
                label: '重建会话',
                type: 'primary',
                onClick: function () {
                  that.askList = that.askList.slice(0, 5)
                  that.createConversation()
                }
              }]
            })
          }, 400)
        }
        if (json.retcode === 0) {
          var ret = json.ret
          var distress = that.distress
          distress.show = false
          if (ret > -1) {
            var vecEinfo = json.vec_einfo
            if (vecEinfo && vecEinfo.length > 0) {
              var list = []
              var selectedList = []
              vecEinfo.forEach(item => {
                if (item.value) {
                  list = list.concat(item.value.split('<__ SPLIT_MESSAGE __>'))
                }
                var itemVec = item.vec_seinfo
                if (itemVec && itemVec.length > 0) {
                  var item120 = itemVec.filter(itemi => itemi.type === 2)[0]
                  if (item120) { // 呼叫120
                    distress.phoneValue = item120.value
                    distress.value = '问诊另一个问题'
                    distress.show = true
                    var otherItem = itemVec.filter(itemi => itemi.type !== 2)[0]
                    if (otherItem) {
                      distress.eid = otherItem.eid
                      distress.value = otherItem.value
                    }
                  } else {
                    selectedList = item.vec_seinfo.sort((a, b) => b.type - a.type)
                  }
                }
              })
              that.askList.push({
                type: 1,
                list: list,
                selectedList: selectedList,
                hide: ret === 3 // 评价不显示回复
              })
              that.multiChecked = []
              that.singleChecked = ''
              // if (singleList.length > 1) {  // 多个单选
              //   that.singleChecked = singleList[0].eid
              //   // var pickerList = []
              //   // singleList.forEach(item => {
              //   //   pickerList.push({
              //   //     label: item.value,
              //   //     value: item.eid
              //   //   })
              //   // })
              //   // window.weui && weui.picker(pickerList, {
              //   //   className: 'ft32',
              //   //   container: 'body',
              //   //   onConfirm: function (result) {
              //   //     var item = result[0];
              //   //     that.askList.push({
              //   //       type: 2,
              //   //       list: [item.label]
              //   //     })
              //   //     that.interactConversation({
              //   //       type: 1,
              //   //       vec_input: item.value
              //   //     })
              //   //   }
              //   // })
              // }
              if (selectedList.length === 0 && !distress.show) { // 没有选择项，就需要让用户输入
                that.setInput()
              } else {
                that.setPaddingBottom()
              }
            } else {
              that.setInput()
            }
            switch (ret) {
              case 1:// 需要获取结果
                weui.alert('再确认继续之前 - 有一些致病原因可能看起来比较惊人，但是记住这仅仅是一个可能性而已。医生或者医疗 专家可以帮你判断这个是不是真的很严重。', function () {
                  that.getDiagnosis(selectedList)
                }, {
                  className: 'ft32'
                })
                break
              case 2: // 会话结束,不出报告
                that.createConversation()
                break
              case 3: // 评价
                that.isRating = true
                that.star = 0
                break
              default:
                break
            }
            if (ret !== 1) {
              that.$nextTick(() => {
                that.$nextTick(() => {
                  $(window).scrollTop($('#ask_answer').height())
                })
              })
            }
          } else {
            retry(opt)
          }
        } else {
          retry(opt)
        }
      }, null, null, 20000)
    },
    getDiagnosis (selectedList) { // selectedList需要透传，
      var that = this
      // if (that.vec_conditions && that.vec_conditions.length > 0) {
      //   that.showResult = true
      //   return
      // }
      var loading = that.loading
      loading.tip = '结果加载中'
      loading.show = true
      baike.get('/mobile/getDiagnosis', {}, function (json) {
        loading.show = false
        var ret = json.ret
        if (json.retcode === 0 && ret > -1) {
          that.retryNum = 0
          var vecConditions = json.vec_conditions
          if (vecConditions && vecConditions.length > 0) {
            that.askList.push({
              type: 3,
              vec_conditions: vecConditions,
              triage: json.triage,
              selectedList: selectedList
            })
            vecConditions.forEach(itemi => {
              if (itemi.extras && itemi.extras.length) {
                that.overview[itemi.name] = itemi.extras
              }
            })
            that.$nextTick(() => {
              that.$nextTick(() => {
                $(window).scrollTop($('#ask_answer').height())
              })
            })
            // that.vec_conditions = vec_conditions
            // that.showResult = true
          }
          if (ret > 0) {
            setTimeout(function () {
              weui.dialog({
                content: '问诊新问题？',
                className: 'ft32',
                buttons: [{
                  label: '取消',
                  type: 'default',
                  onClick: function () {

                  }
                }, {
                  label: '确定',
                  type: 'primary',
                  onClick: function () {
                    // that.askList = that.askList.slice(0, 4)
                    that.createConversation()
                  }
                }]
              })
            }, 400)
          } else if (json.warn_flag === 1) {
            weui.alert(json.warn_text, function () {
            }, {
              className: 'ft32'
            })
          }
        } else {
          setTimeout(function () {
            weui.alert(that.retryNum > 2 ? '多次重试失败，请刷新页面' : '获取异常，重新获取', function () {
              if (that.retryNum > 2) {
                location.reload()
                return
              }
              that.retryNum++
              that.getDiagnosis()
            }, {
              className: 'ft32'
            })
          }, 400)
        }
      }, null, null, 20000)
    },
    getOverview (name) {
      return
      var that = this
      var loading = that.loading
      loading.tip = '数据加载中'
      loading.show = true
    },
    setGender (gender) {
      var that = this
      that.gender = gender
      that.askList.push({ type: 2, list: [gender === 'male' ? '男' : '女'] }, { type: 1, list: ['请输入出生年月日。'] })
      that.setDate()
    },
    setDate () {
      var that = this
      window.weui && weui.datePicker({
        start: that.ageSel === 2 ? that.getDiffDate(16) : 1910,
        end: that.getDiffDate(that.ageSel === 2 ? 0 : 16),
        defaultValue: [that.ageSel === 2 ? 2010 : 1990, 5, 5],
        onChange: function (result) {
          console.log(result)
        },
        onConfirm: function (result) {
          that.askList.push({ type: 2, list: [`${result[0]}年${result[1]}月${result[2]}日`] })
          result = result.map(item => {
            if (item < 10) item = '0' + item
            return item
          })
          that.age = result.reverse().join('-')
          that.createConversation()
        },
        id: 'datePicker',
        className: 'ft32'
      })
    },
    multiClk () {
      var that = this
      var multiChecked = that.multiChecked
      if (multiChecked.length > 0) {
        var multiVal = []
        multiChecked.forEach(item => {
          multiVal.push(that.selectedList.filter(itemi => itemi.eid === item)[0].value)
        })
        that.askList.push({
          type: 2,
          list: [multiVal.join('、')]
        })
        that.interactConversation({
          type: 1,
          vec_input: multiChecked.join(',')
        })
      }
    },
    singleClk () {
      var that = this
      var singleChecked = that.singleChecked
      if (singleChecked) {
        var value = that.selectedList.filter(itemi => itemi.eid === singleChecked)[0].value
        that.askList.push({
          type: 2,
          list: [value]
        })
        that.interactConversation({
          type: 1,
          vec_input: singleChecked
        })
      }
    },
    selectClk () {
      var that = this
      if (!that.multiChecked.length && !that.singleChecked) {
        weui.alert('请选择选项', function () {

        }, {
          className: 'ft32'
        })
        return
      }
      if (that.multiChecked.length) {
        that.multiClk()
      } else {
        that.singleClk()
      }
    },
    getAge (strBirthday) {
      var returnAge
      var strBirthdayArr = strBirthday.split('.')
      var birthYear = strBirthdayArr[0]
      var birthMonth = strBirthdayArr[1]
      var birthDay = strBirthdayArr[2]

      var d = new Date()
      var nowYear = d.getYear()
      var nowMonth = d.getMonth() + 1
      var nowDay = d.getDate()

      if (nowYear === birthYear) {
        returnAge = 0// 同年 则为0岁
      } else {
        var ageDiff = nowYear - birthYear // 年之差
        if (ageDiff > 0) {
          if (nowMonth === birthMonth) {
            var dayDiff = nowDay - birthDay// 日之差
            if (dayDiff < 0) {
              returnAge = ageDiff - 1
            } else {
              returnAge = ageDiff
            }
          } else {
            var monthDiff = nowMonth - birthMonth// 月之差
            if (monthDiff < 0) {
              returnAge = ageDiff - 1
            } else {
              returnAge = ageDiff
            }
          }
        } else {
          returnAge = -1// 返回-1 表示出生日期输入错误 晚于今天
        }
      }

      return returnAge// 返回周岁年龄
    },
    getDiffDate (diff) { // 获取16周岁前的年月日
      var d = new Date()
      var nowYear = d.getFullYear()
      var nowMonth = d.getMonth() + 1
      var nowDay = d.getDate()
      return `${nowYear - diff}-${nowMonth}-${nowDay}`
    },
    btnClk (eid, value) {
      var that = this
      if (eid) {
        that.askList.push({
          type: 2,
          list: [value]
        })
        that.interactConversation({
          type: 1,
          vec_input: eid
        })
      }
    },
    setPaddingBottom () {
      var that = this
      that.$nextTick(() => {
        that.paddingBottom = $('#fixBottom').height()
      })
    },
    getActiveNum (stars) {
      // if (label === '不太可能') {
      //   return ['active', '', '', '']
      // } else if (label === '中等可能') {
      //   return ['active', 'active', '', '']
      // } else if (label === '比较可能') {
      //   return ['active', 'active', 'active', '']
      // } else {
      //   return ['active', 'active', '', '']
      // }
      var list = ['', '', '', '']
      for (var i = 0; i < stars; i++) {
        list[i] = 'active'
      }
      return list
    },
    showRecord () {
      this.showResult = false
      this.$nextTick(() => {
        $(window).scrollTop($('#ask_answer').height())
      })
    },
    clickStar: function (index) {
      var that = this
      that.star = index + 1
    },
    caseRating () {
      var that = this
      if (!(that.star > 0)) {
        return
      }
      var rating = function () {
        var loading = that.loading
        loading.tip = '正在评分中'
        loading.show = true
        lockedReq({
          url: '/mobile/caseRating',
          callback (json) {
            loading.show = false
            if (json.retcode === 0 && json.ret > -1) { // 评分成功，重建会话
              that.isRating = false
              that.askList.push({
                type: 2,
                list: ['诊断评分：' + that.star + '分']
              })
              setTimeout(function () {
                weui.dialog({
                  content: '评分成功，问诊新问题？',
                  className: 'ft32',
                  buttons: [{
                    label: '取消',
                    type: 'default',
                    onClick: function () {

                    }
                  }, {
                    label: '确定',
                    type: 'primary',
                    onClick: function () {
                      // that.askList = that.askList.slice(0, 4)
                      that.createConversation()
                    }
                  }]
                })
              }, 400)
              // weui.toast('操作成功', {
              //     duration: 2000,
              //     className: 'ft32',
              //     callback: function(){
              //       that.createConversation();
              //     }
              // });
            } else {
              setTimeout(function () {
                weui.alert('评分异常，重新评分', function () {
                  that.caseRating()
                }, {
                  className: 'ft32'
                })
              }, 400)
            }
          }
        }, {rating: that.star, sid: (that.btnName && that.btnName.eid) || ''})
      }
      baike.throttle(rating, null, 500)
    },
    setTitle (title) {
      document.title = title
      var iframe = $("<iframe style='display:none;' src='/favicon.ico'></iframe>")
      iframe.on('load', function () {
        setTimeout(function () {
          iframe.off('load').remove()
        }, 0)
      }).appendTo($('body'))
    },
    showPossible () {
      weui.alert('可能原因是根据用户输入的症状和风险因素有关的情况得出的。<br/><br/>呈现给用户的报告是根据输入的症状和风险因素的匹配程度以及条件的共同程度。然而， 顺序并不是特定用户有或没有患病的可能性的指示。<br/><br/>请记住，结果仅供参考，不能代替医疗建议或诊断。', function () {
      }, {
        className: 'ft32'
      })
    },
    specialContinue () { // 继续
      let that = this
      let distress = that.distress
      distress.show = false
      let continueFunc = function () {
        if (!distress.eid) {
          that.createConversation()
          return
        }
        that.btnClk(distress.eid, distress.value)
      }
      if (distress.text) {
        weui.alert(distress.text, function () {
          continueFunc()
        }, {
          className: 'ft32'
        })
      } else {
        continueFunc()
      }
    }
  }
}

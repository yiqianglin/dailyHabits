/* global $, baike */
import MultiSelect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import tmenu from 'components/tmenu/tmenu.vue'
import confirmDialog from 'components/clinicalRecruitment/confirmDialog.vue'
import fixedEntranceBtn from 'components/clinicalRecruitment/fixedEntranceBtn.vue'

export default {
  data () {
    return {
      options: ['肺癌', '结直肠癌', '乳腺癌', '宫颈癌', '膀胱癌'],
      value: '肺癌',
      formData: {
        phone: {
          reg: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
          data: null,
          errmsg: '请输入正确的电话号码（中国大陆）'
        },
        name: {
          reg: /^[\u4e00-\u9fa5A-Za-z0-9-_]+$/,
          data: null,
          errmsg: '请输入真实姓名'
        }
      },
      dialogAchieveEnd: false, // 协议是否滚动底部了
      confirmIsShow: false, // 确认框展示
      toast: {
        isShow: false,
        msg: '请输入正确信息'
      }
    }
  },
  computed: {
    judgeName () {
      if (this.formData.name.data === null) return ''
      return this.formData.name.reg.test(this.formData.name.data) ? '' : this.formData.name.errmsg
    },
    judgePhone () {
      if (this.formData.phone.data === null) return ''
      return this.formData.phone.reg.test(this.formData.phone.data) ? '' : this.formData.phone.errmsg
    }
  },
  components: {
    tmenu,
    MultiSelect,
    confirmDialog,
    fixedEntranceBtn
  },
  watch: {
    confirmIsShow (val, oval) {
      if (val) {
        this.$nextTick(() => {
          var confirmMain = this.$refs.confirm_main
          var confirmMainInner = this.$refs.confirm_main_inner
          var that = this
          confirmMain.addEventListener('scroll', (e) => {
            if ($(confirmMain).scrollTop() + $(confirmMain).height() > $(confirmMainInner).height() - 30) {
              that.dialogAchieveEnd = true
            }
          }, false)
        })
      }
    },
    'toast.isShow' (val) {
      if (val === true) {
        setTimeout(() => {
          this.toast.isShow = false
        }, 1500)
      }
    }
  },
  filters: {
  },
  created () {

  },
  activated () {
    // alert(window.screen.height)
    // alert(document.body.clientHeight)
    $(window).scrollTop()
  },
  mounted () {
  },
  methods: {
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch')
      }
    },
    judgeFormData () {
      if (!this.formData.name.reg.test(this.formData.name.data)) {
        return false
      }
      if (!this.formData.phone.reg.test(this.formData.phone.data)) {
        return false
      }
      return true
    },
    setRecruitUserInfo (successCallback, errorCallback) {
      baike.post('/mobile/setRecruitUserInfo', {
        name: this.formData.name.data,
        disease: this.value,
        phone: this.formData.phone.data
      }, (data) => {
        // data.retcode = 1
        if (data.retcode === 0) {
          successCallback && successCallback()
        } else {
          errorCallback && errorCallback()
        }
      })
    },
    submit () {
      if (this.judgeFormData() === false) {
        if (this.formData.name.data === null) this.formData.name.data = ''
        if (this.formData.phone.data === null) this.formData.phone.data = ''
        this.toast.msg = '请输入正确信息'
        this.toast.isShow = true
        return false
      } else {
        this.setRecruitUserInfo(() => {
          baike.mtaReport('trialtool_personalsubmit')
          this.$msg.toast('提交成功', 'success')
          setTimeout(() => {
            // this.$router.replace({name: 'clinical_recruitment'}) 华为mate8有问题
            this.$router.go(-1)
            // baike.goToUrl('/mobile/clinical_recruitment.html')
          }, 500)
        }, () => {
          this.toast.msg = '网络繁忙，请稍后再试'
          this.toast.isShow = true
        })
      }
    }
  }
}

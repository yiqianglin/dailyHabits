export default {
  name: 'filterPanel',
  props: {
    type: {
      type: Number,
      default: 0 // 0: 左侧返回 右侧重置或关闭   1：左侧重置  右侧关闭  中间title有备注
    },
    isShow: {
      type: Boolean,
      default: false,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    remark: { // title底下的注解
      type: String,
      default: ''
    },
    showBackBtn: {
      type: Boolean,
      default: false
    },
    showClosekBtn: {
      type: Boolean,
      default: false
    },
    showResetBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  mounted () {},
  methods: {
    sureBtnClick () {
      this.$emit('onSure')
    },
    backBtnClick () {
      this.$emit('onBack')
    },
    closeBtnClick () {
      this.$emit('onClose')
    },
    resetBtnClick () {
      this.$emit('onReset')
    }
  }
}

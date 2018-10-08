export default {
  name: 'confirmDialog',
  props: {
    isShow: {
      type: Boolean,
      default: false,
      required: true
    },
    widthNum: {
      type: Number,
      default: 6.62
    },
    heightNum: {
      type: Number,
      default: 0
    },
    positonSite: {
      // 定位
      type: Array,
      default () {
        return [0, 0, 0, 0]
      }
    }
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    closeConfirm () {
      this.$emit('onaClose')
    },
    cancelBtnClick () {
      console.log('onCancel in son')
      this.$emit('onCancel')
    },
    sureBtnClick () {
      console.log('sure in son')
      this.$emit('onSure')
    }
  }
}

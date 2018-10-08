export default {
  name: 'VueSvgCircle',
  props: {
    // 圆的大小
    width: {
      type: Number,
      default: 60
    },
    // 圆环的宽度
    strokeWidth: {
      type: Number,
      default: 5
    },
    // 背景圆环颜色
    bgColor: {
      type: String,
      default: '#F0F0F0'
    },
    // 进度条颜色
    progressColor: {
      type: String,
      default: '#20A0FF'
    },
    // 进度
    progress: {
      type: Number,
      default: 30
    },
    showArticle: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      s1: 0,
      s2: 0
    }
  },
  mounted () {
    // let a = parseInt(this.width)
    // let b = parseInt(this.strokeWidth)
    // let r = Math.round((a - b) / 2)
    // let percent = this.progress / 100
    // let perimeter = Math.PI * 2 * r
    // this.s1 = perimeter * percent + ' ' + perimeter * (1 - percent)
  },
  watch: {
    progress: {
      handler () {
        let a = parseInt(this.width)
        let b = parseInt(this.strokeWidth)
        let r = Math.round((a - b) / 2)
        let percent = this.progress / 100
        let perimeter = Math.PI * 2 * r
        this.s1 = perimeter * percent + ' ' + perimeter * (1 - percent)
      },
      immediate: true
    }
  }
}

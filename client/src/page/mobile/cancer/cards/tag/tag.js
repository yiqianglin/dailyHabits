export default {
  props: {
    options: {
      type: Object,
      default: function () {
        return {
          type: 0,
          maxLength: 20,
          tags: []
        }
      }
    }
  },
  data () {
    var type = (this.options && this.options.type) || 0
    var maxLength = (this.options && this.options.maxLength) || 20
    // var tags = (this.options && this.options.tags) || []
    return {
      // 运营区
      type,
      maxLength
      // tags
    }
  },
  computed: {
    tags () {
      return (this.options && this.options.tags) || []
    },
    activeIdx () {
      return this.options && this.options.activeIdx > -1 ? this.options.activeIdx : -1
    }
  },
  created () {
  },
  methods: {
    clickTag (tag, tagIdx) {
      this.$emit('clk', tag, tagIdx)
    }
  }
}

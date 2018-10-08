
export default {
  props: {
    options: {
      type: Object,
      default: function () {
        return {
          minLength: 100,
          list: []
        }
      }
    }
  },
  data () {
    return {
      textLength: 0
    }
  },
  created () {
  },
  computed: {
    minLength () {
      return (this.options && this.options.minLength) || 100
    },
    list () {
      var list = (this.options && this.options.list) || []
      this.textLength = list.map(m => m.text).join('').length
      return list
    }
  },
  watch: {
  },
  mounted () {
  },
  methods: {
  }
}

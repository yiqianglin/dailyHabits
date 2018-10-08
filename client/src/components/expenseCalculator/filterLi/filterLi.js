export default {
  name: 'filterLi',
  props: {
    unable: {
      type: Boolean,
      default: false
    },
    dataLabel: {
      type: String,
      default: ''
    },
    dataValue: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  mounted () {},
  methods: {
    optionsClick () {
      this.$emit('optionsClick', {name: this.dataLabel})
    }
  }
}

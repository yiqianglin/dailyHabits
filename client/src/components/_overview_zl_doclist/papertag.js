export default {
  props: ['tags', 'index', 'expand', 'fixed'],
  computed: {
  },
  methods: {
    tagClick: function (index) {
      this.$emit('tagclick', index, this.fixed)
    }
  }
}

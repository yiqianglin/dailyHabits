export default {
  props: ['dialogTitle', 'dialogContent', 'isShowPop', 'cancelBtnText', 'confirmBtnText'],
  components: {

  },
  data: function () {
    return {
    }
  },
  mounted: function () {
    console.log(this.dialogTitle)
  },
  methods: {
    cancelDialog: function () {
      this.$emit('closepop')
    },
    confirmDialog: function () {
      this.$emit('confirmpop')
    }
  }
}

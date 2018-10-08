/* global $ */

// 选项是否为空
const isEmpty = (opt) => {
  if (opt === 0) return false
  if ($.isArray(opt) && opt.length === 0) return true
  return !opt
}

export default {
  name: 'scrollPicker',
  props: {
    // 选择器标题
    title: {
      type: String,
      default: ''
    },
    // 选择器数据
    columns: {
      type: Array,
      required: true
    },
    // 选中项的key
    columnSelected: {
      type: String,
      default: 'selected'
    },
    // 选项key
    columnOption: {
      type: String,
      default: 'options'
    },
    // 列标题key
    columnTitle: {
      type: String,
      default: ''
    },
    // 自定义列标题
    customColumnTitle: {
      type: Function,
      default (option, label) {
        if (isEmpty(option)) return ''
        return label ? option[label] : option
      }
    },
    // 选项标题key
    optionTitle: {
      type: String,
      default: ''
    },
    // 自定义选项标题
    customOptionTitle: {
      type: Function,
      default (option, label) {
        if (isEmpty(option)) return ''
        return label ? option[label] : option
      }
    }
  },
  data () {
    return {}
  },
  computed: {
  },
  watch: {
  },
  mounted () {
  },
  methods: {
    // 点击重置按钮
    resetBtnClick () {
      this.$emit('on-reset')
    },
    // 获取列标题
    getColumnTitle (column) {
      if (isEmpty(column)) return ''
      let label = this.customColumnTitle(column, this.columnTitle)
      return label
    },
    // 获取选项标题
    getOptionTitle (option) {
      if (isEmpty(option)) return ''
      let label = this.customOptionTitle(option, this.optionTitle)
      return label
    },
    // 选择某一项
    onOptionSelect (col, colIdx, opt, optIdx) {
      col.value = opt
      this.$emit('on-select', { col, colIdx, opt, optIdx })
    }
  }
}

import { Picker, Popup } from 'mint-ui'

export default {
  name: 'picker',
  props: {
    isShow: {
      type: Boolean,
      default: false,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    showBackBtn: {
      type: Boolean,
      default: false
    },
    data: { // slot
      type: Array,
      required: true
    },
    resetAfterSelectParentSlots: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      slot: this.data,
      lastStapValue: []
    }
  },
  computed: {
    isShowModel: {
      get () {
        return this.isShow
      },
      set (val) {
        if (!val) {
          this.$emit('onCancel')
        }
      }
    }
  },
  watch: {
    isShow () {
      for (var i = 0; i < this.data.length; i++) {
        this.$refs.pickerView.setSlotValue(i, this.data[i].currentValue)
      }
    },
    data: {
      handler (val, oval) {
        this.slot = val
      },
      deep: true
    }
  },
  components: {
    mtPicker: Picker,
    mtPopup: Popup
  },
  created () {
  },
  mounted () {
  },
  methods: {
    cancel () {
      this.$emit('onCancel')
    },
    slotSelected (picker, values) {
      if (this.resetAfterSelectParentSlots === false) {
        this.$emit('onChange', picker, values)
      } else {
        if (this.lastStapValue !== null) {
          // 判断上一次的值和现在的值，父级不同的，修改子级为默认值
          let currentValue = values
          let lastStapValue = this.lastStapValue
          let diffIndex = null
          currentValue.forEach((item, index) => {
            if (currentValue[index] !== lastStapValue[index]) {
              diffIndex = index
            }
          })
          if (diffIndex !== null) {
            for (var i = 0; i < this.data.length; i++) {
              if (i > diffIndex) {
                picker.setSlotValue(i, this.data[i].values[0])
              }
            }
          }
        }
        this.lastStapValue = [...values]
        this.$emit('onChange', picker, values)
      }
    },
    confirm () {
      let values = this.$refs.pickerView.values
      let valueIndex = 0
      this.data.forEach((dataItem, dataIndex) => {
        values.forEach((currentItem) => {
          dataItem.values.filter((item, index) => {
            if (item === currentItem) {
              valueIndex = index
            }
          })
        })
      })
      this.$emit('onConfirm', values, valueIndex)
    }
  }
}

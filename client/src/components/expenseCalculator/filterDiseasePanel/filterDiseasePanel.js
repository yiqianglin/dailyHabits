import { mapState } from 'vuex'
import filterPanel from 'components/expenseCalculator/filterPanel/filterPanel.vue'

export default {
  name: 'filterDiseasePanel',
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
    showClosekBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      data: state => state.expenseCalculator.diseasePanelData
    })
  },
  components: {
    filterPanel
  },
  mounted () {},
  methods: {
    diseasePanelOnBack () {
      this.$emit('diseasePanelOnBack')
    },
    diseasePanelOnClose () {
      this.$emit('diseasePanelOnClose')
    },
    diseaseSelectionClick (item) {
      if (!item.selectable) return
      this.$emit('diseaseSelectionClick', item)
    }
  }
}

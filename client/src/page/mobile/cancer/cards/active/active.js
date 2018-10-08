/* global baike */

import { ActiveMarquee, ActiveBroadcast } from 'components/activity/activity'

export default {
  props: {
    options: {
      type: Object,
      default: function () {
        return {
          disease: '',
          list: []
        }
      }
    }
  },
  data () {
    var disease = (this.options && this.options.disease) || baike.query('name') || ''
    var list = (this.options && this.options.list) || []
    return {
      disease,
      list
    }
  },
  components: {
    ActiveMarquee,
    ActiveBroadcast
  },
  computed: {
  },
  created () {
  },
  methods: {
    // 运营区点击某一项
    toActive ({ type, docid, h5url, topic }, index) {
      if (h5url && (type === 3 || type === 1)) {
        baike.goToUrl(h5url + (/\.html\?/.test(h5url) ? '&' : '?') + `ptag=onco_cardcancer_bannerX:${topic}`)
      } else if (docid) {
        baike.goToUrl(`/mobile/article.html?docid=${docid}&name=${this.disease}&ptag=onco_cardcancer_bannerX:${topic}`)
      }
    }
  }
}

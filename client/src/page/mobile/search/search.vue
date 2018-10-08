<template>
  <full :options="{initKey: searchKey, stag: stag, source: source}" @init="afterInit" @change-url="changeUrl" />
</template>

<script>
/* global baike */
import full from 'components/search/full.vue'

export default {
  components: {
    full
  },
  data () {
    return {
      stag: baike.query('stag'),
      searchKey: baike.query('search'),
      source: baike.query('source')
    }
  },
  activated () {
    // 单页缓存分享数据重置
    this.setShare(this.shareCache)
  },
  created () {
  },
  methods: {
    setShare (opt) {
      if (!opt) return
      baike.setShare && baike.setShare(opt)
      this.shareCache = opt
    },
    afterInit () {
      window.medTimer && window.medTimer.reportTime({
        action: 'search_new_page',
        ispage: 1
      })
    },
    changeUrl (url) {
      this.setShare({link: url})
    }
  }
}
</script>

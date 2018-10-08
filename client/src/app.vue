<template>
  <div class="routerView" ontouchstart="">
    <navigation max="10">
      <router-view/>
    </navigation>
    <keep-alive>
      <component :is="searcher" />
    </keep-alive>
    <div v-show="reloadShow" class="reload" @click="reload()"/>
  </div>
</template>

<script>
/* global $ */
import { mapState } from 'vuex'
import './assets/style/reset.scss'
import './assets/style/global.scss'
import 'src/js/common'
export default {
  components: {
    'mini-searcher': () => import('components/search/mini.vue')
  },
  data () {
    return {
      routerList: [],
      transitionName: 'fade',
      reloadShow: false
    }
  },
  computed: {
    navType () {
      return this.$route.meta.navType || 0
    },
    ...mapState({
      searcher: 'searcher'
    })
  },
  watch: {

  },
  mounted () {
    this.bind()
  },
  methods: {
    reload () {
      location.reload(true)
    },
    bind () {
      $('body').longPress(() => {
        this.reloadShow = true
      }, 3000)
    }
  }
}
</script>

<style lang="scss">
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity 0 ease;
}
.router-fade-enter,
.router-fade-leave-to {
  opacity: 0;
}

html {
  min-height: 100%;
  display: flex;
}
body {
  flex: 1;
  display: flex;
}
.routerView {
  flex: 1;
  display: flex;
}
</style>

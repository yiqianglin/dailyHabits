<template>
  <div class="routerView" ontouchstart="">
    <app-nav />
    <transition :name="transitionName">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </transition>
    <bottom-nav/>
    <div v-show="reloadShow" class="reload" @click="reload()"/>
  </div>
</template>

<script>
/* global $ */
import { mapState } from 'vuex'
import './assets/style/reset.scss'
import './assets/style/global.scss'
import 'src/js/common'
import appNav from 'components/appNav/appNav.vue'
export default {
  name: 'App',
  components: {
  },
  components: {
    appNav
  },
  data () {
    return {
      routerList: [],
      transitionName: 'fade',
      reloadShow: false
    }
  },
  computed: {
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
  flex-direction: column;
}
</style>

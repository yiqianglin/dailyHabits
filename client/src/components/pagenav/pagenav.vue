<template id="tpl_pagenav">
  <transition name="fade">
    <!-- <div class="pagenav" v-show="isShow">
        <div v-for="(tab, index) in tabs" class="tab" :class="[tab.id, {active: tabIndex === index}]" @click="clickTab(index)"><i class="icon"></i><p class="name">{{tab.name}}</p></div>
      </div> -->
    <div v-show="isShow" class="pagenav">
      <div v-for="(tab, index) in tabs" :key="index" :class="[tab.id, {active: tabIndex === index}]" class="tab" @click="clickTab(index)">
        <img v-show="tab.loading" :src="require('src/assets/images/mobile/common/nav-loading.png')" class="loading" ><img v-show="!tab.loading" :src="tabIndex === index ? tab.active : tab.inactive" class="img" ><p class="name">{{ tab.name }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
import pagenav from './pagenav'
export default pagenav
</script>

<style lang="scss" scoped src="./pagenav.scss" />

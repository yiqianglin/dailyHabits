<template id="tpl_bmenu">
  <transition name="fade">
    <div v-show="isShow" :class="{iphonex:isIphonex}" class="bmenu">
      <div :class="{ active : tab === 'trend'}" class="tab trend" ptag="illnews_tab_clk" @click="tabClick('trend')"><i class="icon"/><span class="name">疾病动态</span></div>
      <div :class="{ active : tab === 'allpaper' || tab === 'refer'}" class="tab allpaper" ptag="allarticle_tab_clk" @click="tabClick('allpaper')"><i class="icon"/><span class="name">疾病标签</span></div>
      <!-- <div class="tab refer" @click="tabClick('refer')" :class="{ active : tab === 'refer'}"><i class="icon"></i>就医参考</div> -->
    </div>
  </transition>
</template>

<script>
import bmenu from './bmenu'
export default bmenu
</script>

<style lang="scss" src="./bmenu.scss" />

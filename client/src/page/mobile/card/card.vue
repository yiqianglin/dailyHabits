<template>
  <div v-cloak class="container">
    <div v-cloak id="card" :style="{paddingBottom:isIphonex?'1.8rem':''}" class="card">
      <tmenu :name="name" :issearchbar="true" @callback="tmenuCb" />
      <diseasetrend v-show="tab==='trend'" ref="diseasetrend" key="trend" :isshow="tab==='trend'" @trendmounted="bindDropload()" @changename="changename" />
      <allarticle v-show="tab==='allpaper'" ref="allarticle" key="allpaper" @changename="changename" />
      <medicalrefer v-show="tab==='refer'" key="refer" :isshow="tab==='refer'" @changename="changename" />
      <template v-if="showMode!==3">
        <bmenu :tab="tab" @tabclick="tabclick" @isiphonex="isiphonex" />
      </template>
      <div v-cloak v-show="showGuideTips" class="guide-mask" @touchstart.prevent.stop="closeGuideTips" @click.prevent.stop="closeGuideTips">
        <div class="top-point">
          <div class="arrow arrow-down" />
          <div class="hand"><img :src="require('src/assets/images/mobile/card/hand.png')" class="hand-up"></div>
          <div class="text">下拉，发现更多</div>
        </div>
        <div class="bottom-point">
          <div class="text">点击，全面了解</div>
          <div class="hand"><img :src="require('src/assets/images/mobile/card/hand.png')" class="hand-down"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card from './card'
export default card
</script>

<style lang="scss" scoped>
@import "./card.scss";
</style>

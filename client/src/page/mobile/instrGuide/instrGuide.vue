<template>
  <div :class="'fontsize-size-'+sliderValue" class="container">
    <tmenu :nosearch="true" name="说明书" />
    <div class="instr-adjust-fontsize" @click="showAdjustFs">
      <div class="instr-adjust-title">Aa字体大小</div>
      <div :class="[{'arrow-down-icon-rotated':adjustVisible}]" class="arrow-down-icon" />
    </div>
    <div v-show="adjustVisible" ref="adjustWrap" class="instr-adjust-fontsize-cont">
      <div v-if="showSlider" :class="'adjust-slider-active'+sliderValue" style="" class="adjust-font-size-slider">
        <VueSlideBar v-model="sliderValue" :data="slider.data" :range="slider.range" :line-height="slider.lineHeight" :label-styles="{ color: '#1066FD', backgroundColor: '#4a4a4a' }" :process-style="{ backgroundColor: '#d8d8d8' }" @callbackRange="callbackRange">
          <template slot="tooltip" slot-scope="tooltip">
          <div class="adjust-slider-tooltip" /> </template>
        </VueSlideBar>
      </div>
    </div>
    <div class="instr-adjust-content">
      <accordion v-if="sections && sections.length" accordion>
        <accordion-item v-for="(item,index) in sections" :title="item.title" :key="index" :id="'J_anchor'+index" :open="item.open || false">
        <div class="instr-adjust-cont-txt md" v-html="item.content" /> </accordion-item>
      </accordion>
    </div>
  </div>
</template>
<script>
import InstrGuide from './instrGuide.js'
export default InstrGuide
</script>
<style lang="scss" scoped>
@import "./instrGuide.scss";
</style>

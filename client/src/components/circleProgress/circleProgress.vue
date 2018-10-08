<template>
  <div :style="{width:width+'px',height:width+'px'}" class="svg-circle-wrap">
    <svg :width="width" :height="width" viewbox="0 0 60 60" class="svg-circle" preserveAspectRatio="xMidYMid meet">
      <circle
        :cx="width/2" :cy="width/2"
        :r="(width-strokeWidth)/2"
        :stroke-width="strokeWidth"
        :stroke="progressColor"
        :stroke-dasharray="s1"
        fill="rgba(255,255,255,0.2)"/>
      <circle
        :cx="width/2" :cy="width/2"
        :r="(width-strokeWidth)/2"
        :stroke-width="strokeWidth"
        :stroke="bgColor"
        fill="none"
        stroke-opacity="0.3"/>
    </svg>
    <div v-if="showArticle" class="svg-num">{{ progress }}%</div>
  </div>
</template>

<script>
import circleProgress from './circleProgress'
export default circleProgress
</script>

<style lang="scss" scoped src="./circleProgress.scss" />

<template>
  <!-- 跑马灯 -->
  <div class="marquee">
    <div class="marquee-container">
      <div :style="textLength ? 'animation-duration: ' + textLength / 15 * 10 + 's;' : ''" :class="{rolling: textLength > minLength}" class="marquee-wrapper">
        <span v-for="(item, index) in list" :key="index" class="marquee-slide">{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import marquee from './marquee'
export default marquee
</script>

<style lang="scss" scoped src="./marquee.scss" />

<template id="tpl_depressiontest">
  <div v-show="show"
       v-cloak :style="{padding:notitle?'.32rem .24rem 0 .24rem':''}" class="depressiontest">
    <p v-if="!notitle" class="depressiontest-title">小工具</p>
    <div class="depressiontest-card" @click="toDepressionTest">
      <div class="depressiontest-img">
        <img src="https://s.pc.qq.com/tdf/baike/depression-img.png">
      </div>
      <div class="depression-info">
        <p class="depression-desc1">测测你的抑郁指数</p>
        <p class="depression-desc2">回答几个问题，看看你是否被抑郁所困扰</p>
      </div>
    </div>
  </div>
</template>

<script>
import depressiontest from './depressiontest'
export default depressiontest
</script>

<style lang="scss" scoped src="./depressiontest.scss" />

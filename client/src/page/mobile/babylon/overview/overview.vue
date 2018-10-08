<template>
  <div class="contianer">
    <div
      v-cloak
      id="overview"
      class="overview">
      <div class="card">
        <div class="disease">
          <div class="title">病毒性脑膜炎<div class="more">更多</div></div>
          <div class="desc red">这通常需要到急诊科就诊</div>
          <div class="desc">这通常需要到急诊科就诊</div>
        </div>
        <div class="reason">
          <div class="title">为什么这可能是一个潜在的原因</div>
          <div class="desc">为什么这可能是一个潜在的原因</div>
          <div class="list">
            <div class="item">发热</div>
            <div class="item">发热头痛</div>
            <div class="item">发热</div>
            <div class="item">发热</div>
            <div class="item">发热头痛</div>
            <div class="item">发热头痛</div>
            <div class="item">发热头痛</div>
            <div class="item">发热头痛</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="help-list">
          <div class="item">急救部门如何提供帮助？</div>
          <div class="item">急救部门如何提供帮助？</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import overview from './overview'
export default overview
</script>

<style lang="scss" scoped>
  @import './overview.scss'
</style>

<template>
  <div v-cloak class="container">
    <div v-cloak id="building">
      <tmenu :name="name" :issearchbar="true" @callback="tmenuCb" />
      <div class="content">
        <img :src="require('src/assets/images/mobile/building/building.png')">
        <p class="t1">权威肿瘤医院、专家医生收录中，旨在为你提供全面安心的就医信息</p>
        <!-- <p class="t2">此词条内容编写即将完成，</p>
        <p class="t2">我们会在“我的关注”和“服务通知”中通知您</p>
        <div :class="follow ? 'follow followed' : 'follow'" :ptag="follow ? 'ydd_content_unfollown' : 'ydd_content_follown'" @click="fClick">{{ follow == 1 ? '已关注' : '+关注' }}</div> -->
      </div>
      <search :options="{mini: true, pass: true, show: showAppSearch}" @callback="searchCb" />
    </div>
  </div>
</template>

<script>
import building from './building'
export default building
</script>

<style lang="scss" scoped>
@import "./building.scss";
</style>

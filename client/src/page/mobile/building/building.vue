<template>
  <div v-cloak class="container">
    <div v-cloak id="building">
      <tmenu :name="name" :issearchbar="true" @callback="tmenuCb" />
      <div class="content">
        <img :src="require('src/assets/images/mobile/building/building.png')">
        <p class="t1">近百位海内外医学专家正在努力编写中...</p>
        <p class="t2">此词条内容编写即将完成，</p>
        <p class="t2">我们会在“我的关注”和“服务通知”中通知您</p>
        <div :class="follow ? 'follow followed' : 'follow'" :ptag="follow ? 'ydd_content_unfollown' : 'ydd_content_follown'" @click="fClick">{{ follow == 1 ? '已关注' : '+关注' }}</div>
      </div>
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

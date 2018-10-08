<template>
  <div v-cloak id="main" class="container">
    <tmenu name="关于"/>
    <div class="list-body">
      <div class="banner">
        <div class="t1">企鹅医典·传递健康与信赖</div>
        <div class="t2">深圳市腾讯计算机系统有限公司</div>
      </div>
      <div class="desc">
        <div class="t1">产品介绍</div>
        <div class="t2">企鹅医典致力于向广大网友提供权威可信的医学知识，并提供易于理解的科普解读。</div>
      </div>
    </div>
  </div>
</template>

<script>
import tmenu from 'components/tmenu/tmenu.vue'
export default {
  components: {
    tmenu
  },
  activated () {
  }
}
</script>

<style lang="scss" scoped>
  @import './about.scss'
</style>

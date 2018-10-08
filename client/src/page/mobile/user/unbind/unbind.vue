<template>
  <div v-cloak class="container">
    <div v-cloak id="main">
      <div class="logo"/>
      <p class="phone">{{ desc }}</p>
      <a href="javascript:;" class="btn-unbind" @click="unbind">解除绑定</a>
      <div :class="{ show : isShowAlert}" class="alert">
        <i class="icon"/>
        <p class="msg">解绑成功</p>
      </div>
    </div>
  </div>
</template>

<script>
import unbind from './unbind'
export default unbind
</script>

<style lang="scss" scoped>
  @import './unbind.scss'
</style>

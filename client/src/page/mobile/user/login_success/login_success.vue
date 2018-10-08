<template>
  <div v-cloak class="container">
    <div v-cloak id="main">
      <div class="avatar">
        <img v-if="!!avatar" :src="avatar" alt="">
      </div>
      <p class="name">{{ name }}</p>
      <p class="status">登录成功</p>
      <p class="desc">绑定手机号会让您的账号更安全，关注收藏信息永不丢失<br >完成绑定后，可通过手机号验证登录</p>
      <a href="javascript:;" class="btn-bind" @click="toBind">绑定手机号</a>
      <a href="javascript:;" class="btn-jump" @click="jump">跳过</a>
    </div>
  </div>
</template>

<script>
import loginSuccess from './login_success'
export default loginSuccess
</script>

<style lang="scss" scoped>
  @import './login_success.scss'
</style>

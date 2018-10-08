<template>
  <div v-cloak class="container">
    <div v-cloak id="main">
      <div class="logo">
        <img :src="require('src/assets/images/mobile/user/login/logo.png')" class="icon" alt="企鹅医典">
        <p class="logo-desc">绑定手机号会让您的账号更安全，关注收藏信息永不丢失<br >完成绑定后，可通过手机号验证登录</p>
      </div>
      <div class="form">
        <div class="input">
          <input v-model="phone" type="tel" maxlength="11" placeholder="请输入手机号">
        </div>
        <div class="input">
          <input v-model="smscode" type="tel" maxlength="6" placeholder="请输入验证码">
          <a :class="{ disable : smsLocked}" href="javascript:;" class="btn-code" @click="sendSmsCode"> {{ btnSmsDesc }}</a>
        </div>
        <div class="message">
          <span class="error">{{ error }}</span>
          <span class="info">{{ info }}</span>
        </div>
        <a href="javascript:;" ptag="ydd_binding_clk" class="btn-login" @click="bind">立即绑定</a>
      </div>
      <div :class="{ show : isShowAlert}" class="alert">
        <i class="icon"/>
        <p class="msg">{{ alertmsg }}</p>
      </div>
      <div v-show="isShowBox" class="box">
        <p class="msg">该手机号已注册，请用手机号码登录后再绑定</p>
        <div class="buttons" style="overflow: hidden">
          <a href="javascript:;" class="btn btn-ok" @click="phoneLogin">手机号登录</a>
          <a href="javascript:;" class="btn btn-cancel" @click="hideBox">知道了</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bind from './bind'
export default bind
</script>

<style lang="scss" scoped>
  @import './bind.scss'
</style>

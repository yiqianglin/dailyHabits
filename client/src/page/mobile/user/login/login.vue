<template>
  <div v-cloak class="container">
    <div v-cloak id="main">
      <tmenu :isback="true" :nosearch="true" name="登录" nomy="true"/>
      <div class="logo">
        <img :src="require('src/assets/images/mobile/user/login/logo.png')" class="icon" alt="企鹅医典">
        <p class="logo-desc">推荐手机号登录方式</p>
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
        <a href="javascript:;" class="btn-login" @click="login">立即登录</a>
        <p class="login-desc">点击立即登录表示同意 <a target="_blank" href="/mobile/user/agreement.html">软件许可及服务协议</a></p>
      </div>
      <div class="other">
        <p class="other-desc">使用其他账号登录</p>
        <div class="items">
          <div :class="platform == 'qq' ? 'hide' : ''" @click="loginWithWx">
            <i class="icon wx"/>
            <span class="desc">微信</span>
          </div>
          <div :class="platform == 'wx' ? 'hide' : ''" @click="loginWithQq">
            <i class="icon qq"/>
            <span class="desc">QQ</span>
          </div>
        </div>
      </div>
      <div :class="{ show : isShowAlert}" class="alert">
        <i class="icon"/>
        <p class="msg">验证码已发送</p>
      </div>
    </div>
  </div>
</template>

<script>
import login from './login'
export default login
</script>

<style lang="scss" scoped>
  @import './login.scss'
</style>

<template>
  <div v-cloak id="main" class="container">
    <tmenu :nomore="isCancer" :nomy="true" :nosearch="true" name="个人中心" />
    <loading :show="!isShow"/>
    <div v-show="isShow">
      <div class="banner" @click="toBindList">
        <div class="avatar">
          <img :src="avatar" alt="">
          <img v-if="doctor_id" :src="require('src/assets/images/mobile/doctor/expert.png')" class="expert">
        </div>
        <p class="name">{{ name }}</p>
        <div v-if="!is_login" class="login-bg" />
        <div v-if="!is_login" class="login">
          <p class="t1">登录企鹅医典</p>
          <p class="t2">小程序网页多端同步您的关注与收藏等</p>
          <a href="javascript:;" class="btn-login" ptag="ydd_my_login_clk" @click="login();">立即登录</a>
        </div>
      </div>
      <div v-if="doctor_id" class="item homepage" @click="itemClick('homepage')">
        <i class="icon" /> 我的主页
        <i class="arrow" />
      </div>
      <div class="item focus" @click="itemClick('focus')">
        <i class="icon" /> 我的关注
        <i v-if="isFollowUpdate" class="circle" />
        <i class="arrow" />
      </div>
      <div class="item favorite" @click="itemClick('favorite')">
        <i class="icon" /> 我的收藏
        <i class="arrow" />
      </div>
      <div class="item space doctor" @click="itemClick('doctor')">
        <i class="icon" /> 关注的人
        <i v-if="doctorUpdate" class="circle" />
        <i class="arrow" />
      </div>
      <!-- <div class="item space activity" v-show="isShowActivity" @click="itemClick('activity')">
                <i class="icon"></i>
                热门活动
                <i class="arrow"></i>
            </div> -->
      <div class="item suggest" @click="itemClick('suggest')">
        <i class="icon" /> 反馈建议
        <i class="arrow" />
      </div>
      <div class="item space history" @click="itemClick('history')">
        <i class="icon" /> 反馈历史
        <i v-if="isHistoryUpdate" class="circle" />
        <i class="arrow" />
      </div>
      <div class="item space about" @click="itemClick('about')">
        <i class="icon" /> 关于
        <i class="arrow" />
      </div>
      <template v-if="!isXcx&&!isWx">
        <div v-if="!!is_login" class="item space logout" @click="itemClick('logout')">退出登录</div>
      </template>
    </div>
    <!-- <pagenav v-if="!isCancer" type="0"/> -->
  </div>
</template>

<script>
import my from './my'
export default my
</script>

<style lang="scss" scoped>
@import "./my.scss";
</style>

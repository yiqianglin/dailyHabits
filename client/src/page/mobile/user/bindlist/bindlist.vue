<template>
  <div v-cloak class="container">
    <div v-cloak v-if="!!isShow" id="main">
      <tmenu :isback="true" :nosearch="true" name="帐号信息" nomy="true"/>

      <ul>
        <li :class="platform == 'qq' ? 'hide' : ''">
          <i class="icon wx"/>
          <span class="type">微信</span>
          <span v-if="loginType === 'wx'" class="val">{{ thirdParty.wx.nickname }}</span>
          <template v-if="loginType != 'wx'">
            <span v-if="thirdParty.wx == ''" ptag="Biding_notice_show" class="btn-bind" @click="bind('wx')">绑定</span>
            <template v-if="thirdParty.wx != ''">
              <span class="val">{{ thirdParty.wx.nickname }}</span>
              <span class="arrow"/>
              <a href="javascript:;" class="btn-link" @click="unbind('wx')"/>
            </template>
          </template>
        </li>
        <li :class="platform == 'wx' ? 'hide' : ''">
          <i class="icon qq"/>
          <span class="type">QQ</span>
          <span v-if="loginType === 'qq'" class="val">{{ thirdParty.qq.nickname }}</span>
          <template v-if="loginType != 'qq'">
            <span v-if="thirdParty.qq == ''" ptag="Biding_notice_show" class="btn-bind" @click="bind('qq')">绑定</span>
            <template v-if="thirdParty.qq != ''">
              <span class="val">{{ thirdParty.qq.nickname }}</span>
              <span class="arrow"/>
              <a href="javascript:;" class="btn-link" @click="unbind('qq')"/>
            </template>
          </template>
        </li>
        <li>
          <i class="icon phone"/>
          <span class="type">手机号</span>
          <span v-if="loginType === 'phone'" class="val">{{ phone }}</span>
          <template v-if="loginType != 'phone'">
            <span v-if="!phone" ptag="Biding_notice_show" class="btn-bind" @click="bind('phone')">绑定</span>
            <span v-if="!!phone" class="val">{{ phone }}</span>
            <!--<span v-if="!!phone" class="arrow"></span>-->
            <!--<a href="javascript:;" v-if="!!phone" @click="unbind('phone')"  class="btn-link"></a>-->
          </template>
        </li>
      </ul>
      <popdialog :is-show-pop="popDialog.isShowPop" :cancel-btn-text="popDialog.cancelBtnText" :confirm-btn-text="popDialog.confirmBtnText" :dialog-title="popDialog.dialogTitle" :dialog-content="popDialog.dialogContent" @closepop="closePop" @confirmpop="confirmPop"/>
    </div>
  </div>
</template>

<script>
import bindlist from './bindlist'
export default bindlist
</script>

<style lang="scss" scoped>
  @import './bindlist.scss'
</style>

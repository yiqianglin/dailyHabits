<template>
  <div v-cloak class="container">
    <div v-cloak v-show="show" id="patient" class="patient">
      <tmenu name="患者主页" @callback="tmenuCb" />
      <div class="patient-info">
        <p class="title">患友倾情分享 为大家助力</p>
        <div class="info">
          <div class="img">
            <img :src="hand">
          </div>
          <div class="detail">
            <div class="name">{{ name }}
              <span>患友</span>
              <div :class="{followed: follow}" class="follow" @click="fClick">{{ follow == 1 ? '已关注' : '＋关注' }}</div>
            </div>
            <div class="fans">粉丝: {{ followingnum }}</div>
          </div>
        </div>
        <div class="disease">
          <p class="item-title">疾病信息</p>
          <p class="item-desc">浸润性导管癌 / 前哨淋巴结活检 / T2M0N0 / 右乳全切 / 背阔肌+假体重建 / 左乳缩乳整形 / 化疗方案TCH*6 / 靶向治疗1年</p>
        </div>
        <div v-if="op_md_introd" class="intro">
          <p class="item-title">简介</p>
          <div :class="{'clamp1':!introExpanded}" class="item-desc md" v-html="op_md_introd" />
          <div class="footer" @click="introExpanded=!introExpanded">
            <img :src="introExpanded ? require('src/assets/images/mobile/patient/arrow-up.png') : require('src/assets/images/mobile/patient/arrow-down.png')">
            <a class="btn-link" />
          </div>
        </div>
      </div>
      <div v-if="paperList&&paperList.length>0" class="paper-list">
        <p class="list-title">个人动态</p>
        <div v-for="(item,index) in paperList" :key="item.title" class="item" @click="toArticle(index)">
          <p class="title">{{ item.title }}</p>
          <div class="thumb">
            <i :class="{helped:item.helpful}" class="icon" @click.stop="hClick(index)" />
            <span>{{ item.helpfulcount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import patient from './patient'
export default patient
</script>

<style lang="scss" scoped>
@import "./patient.scss";
</style>

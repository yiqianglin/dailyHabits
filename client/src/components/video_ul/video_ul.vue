<template>
  <ul v-if="list&&list.length" class="video-ul">
    <li v-for="(item, index) in list" :key="index" :class="{active:curindex===index}" class="video-li">
      <div class="top">
        <a href="javascript:;" class="btn-link" @click="goVideoArticle(item, index)"/>
        <img :src="item.image" class="video-img" alt="">
        <div class="time">{{ (item.duration) | formatTime }}</div>
      </div>
      <div class="bottom">
        <div class="video-title ellipsis">{{ item.title }}</div>
        <div class="video-title-bottom">
          <span v-if="item.op_doctor && item.op_doctor.name" class="video-author">{{ item.op_doctor.name }}</span>
          <span v-else-if="item.op_hospital && item.op_hospital.hpid===1000" class="video-author">{{ item.op_hospital.name }}</span>
          <ul v-if="showdisease&&item.diseases&&item.diseases.length" class="video-tag-ul">
            <li v-for="(diseaseItem, diseaseIndex) in item.diseases" :key="diseaseIndex" class="video-tag-li">{{ diseaseItem.name }}</li>
          </ul>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import videoUl from './video_ul'
export default videoUl
</script>

<style lang="scss" scoped src="./video_ul.scss" />

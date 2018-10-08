<template>
  <div v-cloak class="container">
    <div v-cloak id="doctor_video" class="doctor_video">
      <tmenu :name="name" :stag="name" @callback="tmenuCb" />
      <div v-if="doctor" class="doctor">
        <div v-if="doctorLogo" class="img">
          <img :src="doctorLogo">
        </div>
        <div class="info">
          <div class="name">名家之声：{{ doctor }}</div>
          <!-- <div class="desc" v-if="doctorInfo.text">{{doctorInfo.text}}</div> -->
        </div>
        <a class="btn-link" href="javascript:void(0)" @click="toDoctor()" />
      </div>
      <paper :paperlist="paperList" :rkey="{article:'expertvideo_videoX'}" :loaded="loaded" :noempty="true" />
    </div>
  </div>
</template>

<script>
import doctorVideo from './doctor_video'
export default doctorVideo
</script>

<style lang="scss" scoped>
@import "./doctor_video.scss";
</style>

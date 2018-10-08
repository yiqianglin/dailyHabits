<template id="tpl_doctor">
  <div :tourl="doctorinfo.url" class="doctor" @click="toDoctor(doctorinfo.drid)">
    <div class="doctor-avatar">
      <img :src="doctorinfo.icon || '../res/images/mobile/mydoctor/avatar.png'" >
    </div>
    <div class="doctor-info">
      <div class="doctor-name">{{ doctorinfo.name }}</div>
      <div class="doctor-title ellipsis">{{ doctorinfo.desc || ((doctorinfo.hospital?doctorinfo.hospital+' ':'')+doctorinfo.position) }}</div>
    </div>
    <div v-if="showfollow" :class="doctorinfo.follow==1?'followed':''" class="follow-btn"
         @click.stop="followDoctor(doctorinfo.drid)">{{ doctorinfo.follow==0?'关注':'已关注' }}</div>
  </div>
</template>

<script>
import doctor from './doctor'
export default doctor
</script>

<style lang="scss" scoped src="./doctor.scss" />

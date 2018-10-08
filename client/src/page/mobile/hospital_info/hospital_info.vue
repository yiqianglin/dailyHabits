<template>
  <div v-cloak class="container">
    <div v-cloak id="main">
      <tmenu :name="name" :issearchbar="true" @callback="tmenuCb" />
      <p class="main-title">就医信息</p>
      <div class="hp-wrap">
        <p class="hp-desc">国内医疗本病的权威的医院和专家（排名不分先后）</p>
        <div v-for="(item,index) in list" :key="index" class="hp-list">
          <a href="javascript:void(0);" @click="toHospital(item.hospital_id)">
            <div class="hp-logo">
              <img :src="item.op_logo" class="hp-image">
            </div>
            <div class="hp-info">
              <p class="hp-title">
                <span v-if="isThree(item.vt_typeinfo)" class="name-tag">三甲</span>
                <span class="name-desc">{{ item.name }}</span>
              </p>
              <p class="hp-doctor">{{ item.doctor_list.join('、') }}</p>
              <p class="hp-address">{{ item.address }}</p>
              <p class="hp-tel">{{ item.tel }}</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hospitalInfo from './hospital_info'
export default hospitalInfo
</script>

<style lang="scss" scoped>
@import "./hospital_info.scss";
</style>

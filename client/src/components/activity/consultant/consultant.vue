<template id="tpl_activity">
  <div class="consultant">
    <div class="header">最新顾问专家</div>
    <div class="wrapper">
      <ul class="experts">
        <template v-for="(item, index) in list">
          <li :key="index">
            <div class="expert" @click="toDoctor(item, index)">
              <div class="personal">
                <img :src="item.hand || require('src/assets/images/mobile/mydoctor/avatar.png')" class="avatar" >
                <div class="info">
                  <p class="name">{{ item.name }}<img :src="require('src/assets/images/mobile/common/expert.png')" ></p>
                  <p class="title">
                    {{ item.op_vt_teachtitle.length ? item.doctitle + ' | ' + item.op_vt_teachtitle.join('，') : item.doctitle }}
                  </p>
                </div>
              </div>
              <p class="depart">{{ item.main_depart }}<span class="circle"/>{{ item.hospital_shortname }}</p>
              <p class="goodat">{{ item.diseases_desc }}</p>
              <div :class="['follow', {followed: item.follow}]" :ptag="item.follow===0?'ydd_dochome_follow':'ydd_dochome_followcancel'"
                   @click.stop="fClick(item)">{{ item.follow == 1 ? '已关注' : '＋关注' }}</div>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import consultant from './consultant'
export default consultant
</script>

<style lang="scss" scoped src="./consultant.scss" />

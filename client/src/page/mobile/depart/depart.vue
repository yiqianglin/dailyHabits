<template>
  <div v-cloak class="container">
    <div v-cloak v-show="show" id="hospital">
      <tmenu name="科室主页" @callback="tmenuCb" />
      <div class="profile">
        <div :class="{masked: !!hospitalBg}" :style="{backgroundImage: hospitalBg ? 'url(' + hospitalBg + ')' : ''}" class="profile-info">
          <div class="info-detail">
            <p class="depart-name ellipsis">{{ departName }}</p>
            <p class="hospital ellipsis" @click="toHospital"><img v-if="hospitalLogo" :src="hospitalLogo" class="logo">{{ hospitalName }}</p>
            <div class="tag-list">
              <p>
                <span v-for="item in qualification" v-if="item" :key="item" class="type">{{ item }}</span>
              </p>
            </div>
          </div>
        </div>
        <div v-if="feature" class="profile-feature">
          <p class="header-title">科室特色</p>
          <div class="content md" v-html="feature" />
        </div>
        <div v-if="doctors && doctors.length" class="profile-doctor">
          <p class="header-title">骨干团队</p>
          <div class="doctor-list">
            <div v-for="item in (collapse ? doctors.slice(0, doctorClamp) : doctors)" :key="item.name" class="doctor-item" @click="toDoctor(item)">
              <img v-if="item.hand" :src="item.hand" class="avatar">
              <div class="info">
                <p class="name ellipsis">{{ item.name }}</p>
                <p class="doctor-title ellipsis">{{ item.op_vt_teachtitle.length ? item.doctitle + ' ' + item.op_vt_teachtitle.join('，') : item.doctitle }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="feature" v-show="!collapse" class="profile-intro">
          <p class="header-title">科室简介</p>
          <div class="content md" v-html="intro" />
        </div>
        <p v-if="doctors.length > doctorClamp || feature" :class="{expand: !collapse}" class="load-more-arrow" @click="toggleDocotrs" />
      </div>
      <div v-if="tagIndex > -1" class="depart-article">
        <div class="tags">
          <ul class="tag-list">
            <li v-for="(tag, index) in tags" :key="tag.name" :class="{active: tagIndex === index}">
              <span>{{ tag.name }}</span>
              <a :ptag="'onco_tabclick:' + tag.name" href="javascript:;" class="btn-link" @click="clickTag(index, true)" />
            </li>
          </ul>
        </div>
        <paper :paperlist="tags[tagIndex].docs" :loaded="tags[tagIndex].loaded" />
      </div>
    </div>
  </div>
</template>

<script>
import depart from './depart'
export default depart
</script>

<style lang="scss" scoped>
@import "./depart.scss";
</style>

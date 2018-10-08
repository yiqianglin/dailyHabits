<template>
  <div v-cloak class="container">
    <div v-cloak id="hospital">
      <tmenu name="医院主页" @callback="tmenuCb" />
      <loading :show="!show"/>
      <template v-show="show">
        <div class="profile">
          <div :class="{masked: !!bgImg, nologo: !logo}" :style="{backgroundImage: bgImg ? 'url('+bgImg+')' : ''}" class="profile-info">
            <div class="info-detail">
              <img v-if="logo" :src="logo" class="logo">
              <p class="name ellipsis">{{ name }}</p>
              <p class="alias ellipsis">{{ alias.length ? '（' + alias.join('，') + '）' : ' ' }}</p>
              <div class="tag-list">
                <span v-for="item in typeTags" v-if="item.svalue" :key="item.svalue" class="tag">{{ item.svalue }}</span>
              </div>
              <p class="loc-tel">
                <span class="loc" ptag="ydd_hospitalhome_adress">
                  <img :src="require('src/assets/images/mobile/hospital/location.png')"> {{ address }}
                </span>
                <span class="tel" ptag="ydd_hospitalhome_call">
                  <img :src="require('src/assets/images/mobile/hospital/tel.png')">
                  <a :href="'tel:' + tel" class="btn-link" />
                </span>
              </p>
            </div>
          </div>
          <div v-if="intro" :class="{collapse: collapse}" class="profile-section profile-intro">
            <p class="header-title">简介</p>
            <div class="content md" v-html="intro" />
          </div>
          <div v-if="departDesc" v-show="!collapse" class="profile-section">
            <p class="header-title">国家重点科室</p>
            <div class="content md" v-html="intro" />
          </div>
          <div v-if="coreCentre" v-show="!collapse" class="profile-section">
            <p class="header-title">重点诊治中心</p>
            <div class="content md" v-html="intro" />
          </div>
          <p :class="{collapse: collapse}" class="load-more-arrow" @click="collapse = !collapse" />
          <div v-if="type === 'card' && doctorList && doctorList.length" class="profile-section profile-doctors">
            <p class="header-title">疾病相关医生</p>
            <ul>
              <li v-for="(item, itemIndex) in doctorList.slice(0, doctorCollapse ? 5 : doctorList.length)" :key="itemIndex" @click="toDoctor(item.doctor_id)">
                <img v-if="item.hand" :src="item.hand">
                <div :id="'doctor-tags-' + itemIndex" :class="{collapse: !item.collapse}" class="doctor">
                  <p :class="{only: !item.op_vt_diseases_tag.length}" class="name">{{ item.name }}
                    <span>{{ item.titles }}</span>
                  </p>
                  <p v-if="item.op_vt_diseases_tag.length" :id="'doctor-tags-' + itemIndex" class="desc">
                    <span class="fix-text">擅长:</span>
                    <span v-for="(op_vt_diseases_tag, index) in item.op_vt_diseases_tag" :key="index">{{ op_vt_diseases_tag }}</span>
                  </p>
                  <p v-if="item.op_vt_diseases_tag.join('').length > 46" :class="{collapse: item.collapse}" class="load-more-arrow" @click.stop="item.collapse = !item.collapse" />
                </div>
              </li>
            </ul>
            <p v-if="doctorList.length > 5" :class="{collapse: doctorCollapse}" class="load-more-arrow" @click="doctorCollapse = !doctorCollapse" />
          </div>
          <div v-if="departList && departList.length" class="profile-section profile-depart">
            <p class="header-title">内容共建科室</p>
            <div class="depart-list">
              <div v-for="item in departList" :key="item.name" class="depart-item ellipsis" @click="toDepart(item)">{{ item.name }}</div>
            </div>
          </div>
          <div v-if="caseList && caseList.length" class="profile-section profile-case">
            <p class="header-title">患教材料</p>
            <div :class="{collapse: caseCollapse}" class="case-list">
              <div v-for="item in (caseCollapse ? caseList.slice(0, 4) : caseList)" :key="item.title" class="case-item ellipsis" @click="toCase(item)">{{ item.title }}</div>
            </div>
            <p v-if="caseList.length > 4" :class="{collapse: caseCollapse}" class="load-more-arrow" @click="caseCollapse = !caseCollapse" />
          </div>
        </div>
        <div v-if="tagIndex > -1" class="hospital-article">
          <div class="tags">
            <ul class="tag-list">
              <li v-for="(tag, index) in tags" :key="tag.name" :class="{active: tagIndex === index}">
                <span>{{ tag.name }}</span>
                <a href="javascript:;" class="btn-link" @click="clickTag(index, true)" />
              </li>
            </ul>
          </div>
          <paper :paperlist="tags[tagIndex].docs" :loaded="tags[tagIndex].loaded" :rkey="{article: 'ydd_hospitalhome_articalx'}" />
        </div>
        <div class="links">
          <img v-if="qrcode" :src="qrcode">
          <p>{{ name }}</p>
          <p class="website">{{ website }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import hospital from './hospital'
export default hospital
</script>

<style lang="scss" scoped>
@import "./hospital.scss";
</style>

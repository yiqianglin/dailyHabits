<template>
  <div v-cloak class="container">
    <tmenu :name="name" :issearchbar="true" @callback="tmenuCb" />
    <loading :show="!show"/>
    <div v-cloak v-show="show" id="video_compilation">
      <div v-show="fixAlphaTab" id="fixAlphaTab" class="list-block-tab-alpha">{{ fixAlphaTab }}</div>
      <div class="section section_cancer">
        <p class="section-title">医典精选</p>
        <video-ul :list="recommendVideoList" :showdisease="true"/>
      </div>

      <div class="section section_expert">
        <p class="section-title">推荐专家</p>
        <ul class="expert-ul">
          <li v-for="(item, index) in recommendDoctorList" :key="index" class="expert-li" @click="toDoctor(item)">
            <div class="expert-item">
              <img :src="item.image" class="expert-img" alt="">
              <p class="expert-name">{{ item.author }}</p>
              <p class="expert-hospital">{{ item.text }}</p>
              <p class="expert-field">擅长：{{ item.diseases[0] }}</p>
              <a href="javascript:;" class="btn-link" />
            </div>
          </li>
        </ul>
      </div>

      <div class="section section_familiar_disease">
        <p class="section-title">常见疾病</p>
        <ul class="disease-ul">
          <li v-for="(item, index) in hotDiseasesList" :key="index" class="disease-li" @click="goCommonDiseaseVideo(item)">{{ item.name }}</li>
          <!-- <li class="disease-li">腰椎间盘突出</li>
          <li class="disease-li">肾结石</li>
          <li class="disease-li">帕金森综合征</li>
          <li class="disease-li">我的名字很长的病种</li>
          <li class="disease-li">流感</li>
          <li class="disease-li">失眠</li>
          <li class="disease-li">肺结核</li>
          <li class="disease-li">肺结核</li> -->
        </ul>
      </div>

      <div id="alpha-list" class="alpha-list">
        <div v-for="item in videoSetDiseaseList" :key="item.name" class="list-block">
          <div :id="'alpha-'+ (item.name === '#' ? '' : item.name)" :style="{visibility: fixAlphaTab === item.name ? 'hidden' : ''}" class="list-block-alpha">{{ item.name }}</div>
          <ul class="list-ul">
            <li v-for="diseaseItem in item.diseases" :key="diseaseItem.name" class="list-li">
              <div class="name">{{ diseaseItem.name }}</div>
              <a href="javascript:;" class="btn-link" @click="goDiseaseVideo(diseaseItem)" />
              <div class="right">
                <span class="num">{{ diseaseItem.num }}个视频</span>
                <ul v-if="diseaseItem.image.length" class="pic-ul">
                  <template v-for="(imgItem, imgIndex) in diseaseItem.image">
                    <li v-if="imgItem" :key="imgIndex" class="pic-li">
                      <img v-if="imgItem" :src="imgItem" alt="" class="video-pic">
                    </li>
                  </template>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <!--右侧悬浮-->
        <div class="list-right-alpha" @touchmove="quickToList">
          <ul>
            <template v-for="item in videoSetDiseaseList">
              <li :key="item.name" :class="{'on':fixAlphaTab === item.name}">
                <a :href="!shouldPreventTouch ? 'javascript:;' : '#alpha-'+ (item.name === '#' ? '' : item.name)" class="right-alpha" @click="scrollTopAlpha">{{ item.name }}</a>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import videoCompilation from './video_compilation'
export default videoCompilation
</script>

<style lang="scss" scoped>
@import "./video_compilation.scss";
</style>

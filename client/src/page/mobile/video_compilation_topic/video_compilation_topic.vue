<template>
  <div v-cloak class="container">
    <div id="video_compilation_topic">
      <tmenu :name="name + '视频合集'" :issearchbar="true" :zindex="100" @callback="tmenuCb"/>
      <loading :show="!show"/>
      <div v-show="show" :style="{paddingTop:stepFixed?'1.6rem':''}" class="section section_video">
        <p class="section-title">
          <span class="title">{{ name }}视频合集</span>
          <span v-if="configflag!==1" class="disease-page-btn" @click="goDiseasePage">
            疾病主页
            <a href="javascript:;" class="btn-link" />
          </span>
        </p>
        <template v-if="video_type!=='2'&&doctorList&&doctorList.length">
          <ul :class="{'is-collapsed': doctorCollapse}" :style="{marginBottom:doctorList.length > 2?'':'.4rem'}" class="doctor-ul">
            <li v-for="(item, index) in doctorList" :key="index" class="doctor-li" @click="toDoctor(item)">
              <img :src="item.avatarUrl || require('src/assets/images/mobile/mydoctor/avatar.png')" alt="" class="doctor-img">
              <span class="doctor-name">{{ item.name }}</span>
              <span class="doctor-hospital">{{ item.hospital }}</span>
            </li>
          </ul>
          <div v-if="doctorList.length > 2" class="collapse-btn" @click="doctorCollapseClick">
            {{ doctorCollapse ? '点击收起' : '点击展开' }}
            <a href="javascript:;" class="btn-link" />
          </div>
        </template>
        <template v-if="videoChildren&&videoChildren.length>1">
          <div id="stepWrap" :class="{fixed:stepFixed}" class="step-wrap">
            <ul>
              <li v-for="(item,index) in videoChildren" :key="item.title" :class="{active:index===curIndex}" @click="stepClk(index)">
                <div class="title">{{ item.title }}</div>
                <div class="story-indicator">
                  <div v-if="index>0" class="left-line"/>
                  <div class="circle"/>
                  <div v-if="index<videoChildren.length-1" class="right-line"/>
                </div>
              </li>
            </ul>
          </div>
          <swiper :options="swiperOps">
            <swiper-slide v-for="(block,blockIndex) in videoChildren" :key="blockIndex">
              <div class="video-list">
                <div v-for="item in block.children" :key="item.title" :style="{paddingTop:!item.title?'.4rem':''}" class="video-item">
                  <div v-if="item.title" class="title">{{ item.title }}</div>
                  <video-ul :list="item.docs" :disease="name"/>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </template>
        <div v-else-if="children&&children.length" class="video-list">
          <div v-for="item in children" :key="item.title" :style="{paddingTop:(!item.title&&videoChildren&&videoChildren.length>1)?'.4rem':''}" class="video-item">
            <div v-if="item.title" class="title">{{ item.title }}</div>
            <video-ul :list="item.docs" :disease="name"/>
          </div>
        </div>
        <video-ul v-else :list="videoList" :disease="name"/>
      </div>
    </div>
  </div>
</template>

<script>
import videoCompilation from './video_compilation_topic'
export default videoCompilation
</script>

<style lang="scss" scoped>
@import "./video_compilation_topic.scss";
</style>

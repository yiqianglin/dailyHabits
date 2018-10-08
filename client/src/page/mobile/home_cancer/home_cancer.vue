<template>
  <div v-cloak class="container">
    <loading :show="!show" top="0"/>
    <div v-cloak v-show="show" id="main">
      <div class="cancer-wrapper">
        <div class="cancer-nav">
          <span v-if="src === 'home'" class="back" @click="toBack" />
          <input class="search" placeholder="搜索肿瘤知识" @click.prevent="toSearch">
          <span class="my" @click="toMy" />
        </div>
        <active-banner v-if="activeOps" :options="activeOps" class="cancer-activity" />
        <!-- <div class="cancer-brand">
          <div class="committee" @click="toCommittee" ptag="onco_yd_entry"></div>
          <div class="webmd" @click="toWebmd" ptag="onco_webmd_entry"></div>
        </div> -->
        <!-- <div class="cancer-authority">
          <div class="img">
            <img v-for="item in authorityList" v-if="item.logo" :src="item.logo" @click="toAuthority(item)" />
          </div>
          <p>由16家国内权威三甲医院医生和国际知名机构共同编写<br/>经企鹅医典专家委员会审核</p>
        </div> -->
        <div class="cancer-committee" @click="toCommittee()">
          两院院士, 肿瘤领域权威专家, 头部医疗机构编撰<br> 精选全球领先的医疗科普网站
          <img :src="require('src/assets/images/mobile/home_cancer/webmd.png')">优质内容
          <!-- <img :src="require('src/assets/images/mobile/home_cancer/tmec.png')"> -->
        </div>
        <div :class="{more:cancerList.length>5}" class="cancer-list">
          <div v-for="(item,index) in cancerList" :key="index" class="cancer-item" @click="toCancer(item)">
            <div class="info">
              <p class="name">{{ item.name }}</p>
              <p v-if="item.ename" class="desc">{{ item.ename }}</p>
            </div>
            <img v-if="item.icon" :src="item.icon">
          </div>
        </div>
        <div class="disease-more" @click="toMore()">其它疾病</div>
      </div>
      <active-banner v-if="activeTopicOps" :options="activeTopicOps" class="cancer-activity-topic" />
      <div v-if="tagIndex > -1" class="cancer-doc">
        <div class="tags">
          <ul class="tag-list">
            <li v-for="(tag, index) in tags" :key="index" :class="{active: tagIndex === index}">
              <span>{{ tag.name }}</span>
              <a :ptag="'onco_tabclick:' + tag.name" href="javascript:;" class="btn-link" @click="clickTag(index, true)" />
            </li>
          </ul>
        </div>
        <paper :paperlist="paperList" :loaded="loaded" :noloading="true" :rkey="{article: 'onco_articleclick'}" />
        <p v-show="!loaded && paperList.length" class="view-all" @click="viewAll">查看全部</p>
      </div>
      <!-- <div class="cancer-authority">
        <p>企鹅医典内容由以下权威机构参与编写审核</p>
        <div class="img">
          <img v-for="item in authorityList" v-if="item.logo" :src="item.logo" @click="toAuthority(item)" />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import homeCancer from './home_cancer'
export default homeCancer
</script>

<style lang="scss" scoped>
@import "./home_cancer.scss";
</style>

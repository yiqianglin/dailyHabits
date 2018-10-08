<template>
  <div class="container">
    <div class="cancer-nav">
      <span class="back" @click="toBack" />
      <input class="search" placeholder="搜索肿瘤知识" @click.prevent="toSearch">
      <span class="my" @click="toMy" />
    </div>
    <div v-if="activeOps && activeOps.list && activeOps.list.length" class="cancer-activity">
      <active-banner :options="activeOps" />
    </div>
    <div class="video-list">
      <div v-for="(item, index) in videoList" :key="index" class="video-item" @click="toArticle(item, 'onco_cancer_videoX')">
        <div class="video-cover">
          <img v-if="item.image" :src="item.image">
          <span v-if="index" class="video-duration">{{ item.duration | formatTime }}</span>
          <img v-else :src="require('src/assets/images/mobile/cancer/play.png')" class="video-play">
        </div>
        <div class="video-info">
          <p class="title ellipsis">{{ item.title }}</p>
          <p v-if="!index" class="desc">{{ item.text }}</p>
          <!-- <p class="name ellipsis">{{ item.author }}
            <span v-for="disease in item.diseases" :key="disease" class="disease">{{ disease }}</span>
          </p> -->
        </div>
        <a href="javascript:" class="btn-link" />
      </div>
    </div>
    <div class="cancer-block">
      <p class="block-header">倾听心声</p>
      <div class="story-list">
        <div v-for="(item, index) in storyList" :key="index" class="story-item" @click="toArticle(item, 'onco_cancer_mainarticleX')">
          <div :style="item.image ? 'background-image: url(' + item.image + ')' : ''" class="header">
            <p class="title">
              <span>{{ item.title }}</span>
            </p>
          </div>
          <template v-if="!index">
            <div class="content">
              <div class="md" v-html="item.md_text.replace(/。<\/p>/g, '…</p>')" />
            </div>
            <div class="more" @click.stop="toArticle(item, 'onco_cancermainarticle_readmoreX')">阅读更多</div>
          </template>
        </div>
      </div>
    </div>
    <div class="cancer-block">
      <p class="block-header">医典精选</p>
      <div class="doc-list">
        <paper :paperlist="showAllDoc ? docList : docList.slice(0, 3)" :rkey="{article:'onco_cancer_listarticleX'}" />
        <p v-if="docList.length > 3 && !showAllDoc" class="more" @click="showAllDoc = true">查看更多
          <a href="javascript:" class="btn-link" />
        </p>
      </div>
    </div>
    <div class="cancer-list">
      <div v-for="(item,index) in cancerList" :key="index" class="cancer-item" @click="toCancer(item, 'onco_cancer_cancerentry')">
        <div class="info">
          <p class="name">{{ item.text }}</p>
          <p v-if="item.desc" class="desc">{{ item.desc }}</p>
        </div>
        <img v-if="item.image" :src="item.image">
      </div>
    </div>
  </div>
</template>
<script>
import activeTopic from './active_topic'
export default activeTopic
</script>
<style lang="scss" scoped src="./active_topic.scss"></style>

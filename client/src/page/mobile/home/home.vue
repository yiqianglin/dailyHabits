<template>
  <div class="container">
    <div class="home-header">
      <!-- 顶部运营位 -->
      <active-banner v-if="activeOps" :options="activeOps" />
      <span class="icon-my" @click="toMy" />
      <div class="home-search">
        <div class="search-btn" @click="toSearch">
          <span>搜疾病／症状／文章</span>
        </div>
        <!-- 搜索热词 -->
        <p class="search-hot ellipsis">
          <span v-for="(item, index) in hotList.slice(0, 3)" :key="index" @click="toOverview(item)">{{ item.name }}</span>
        </p>
      </div>
    </div>
    <!-- 重点板块 -->
    <div v-if="keystoneList && keystoneList.length" class="keystone-list">
      <div v-for="(item, index) in keystoneList" :key="index" :style="item.image ? 'background-image: url(' + item.image + ')' : ''" class="keystone-item" @click="toActive(item)">
        <!-- <img v-if="item.image" :src="item.image"> -->
        <p class="title ellipsis">{{ item.text }}</p>
        <p class="desc ellipsis">{{ item.desc }}</p>
        <a href="javascript:" class="btn-link" />
      </div>
    </div>
    <!-- 疾病科室 -->
    <div class="home-disease">
      <div class="disease-depart">
        <div v-if="departList && departList.length" class="depart-list">
          <div v-for="(item, index) in departList" :key="index" class="depart-item" @click="toDiseaseList(item)">
            <img v-if="item.image" :src="item.image">
            <p class="title ellipsis">{{ item.text }}</p>
            <a href="javascript:" class="btn-link" />
          </div>
        </div>
      </div>
      <p class="disease-all" @click="toDiseaseList">全部疾病
        <a href="javascript:" class="btn-link" />
      </p>
    </div>
    <!-- 名家视频 -->
    <div v-if="videoList && videoList.length" class="doctor-video">
      <div class="wrapper">
        <div class="video-list">
          <div v-for="(item, index) in videoList" :key="index" class="video-item" @click="toVideo(item)">
            <div class="video-cover">
              <img v-if="item.image" :src="item.image">
              <span class="video-duration">{{ item.duration | formatTime }}</span>
            </div>
            <div class="video-info">
              <p class="title ellipsis">{{ item.text }}</p>
              <p class="name ellipsis">{{ item.author }}
                <span v-for="disease in item.diseases" :key="disease" class="disease">{{ disease }}</span>
              </p>
            </div>
            <a href="javascript:" class="btn-link" />
          </div>
        </div>
      </div>
      <p class="more" @click="toMoreVideo">更多视频
        <a href="javascript:" class="btn-link" />
      </p>
    </div>
    <!-- 内容展示区域 -->
    <div class="home-content">
      <health />
    </div>
  </div>
</template>

<script>
import home from './home'
export default home
</script>

<style lang="scss" scoped src="./home.scss"></style>

<template>
  <div id="health" class="container health">
    <div v-if="tabs && tabs.length" :class="{fixed: fixTab}" class="crumb">
      <ul class="crumb-tabs">
        <li v-for="(tab, index) in tabs" :key="index" :class="{active: tabIndex === index}" :ptag="'yd_mainpage_tabX:' + tab.title">
          <span>{{ tab.title }}
            <i v-if="!tab.readflag" class="update" />
          </span>
          <a href="javascript:;" class="btn-link" @click="clickTab(index)" />
        </li>
      </ul>
      <div class="crumb-search" @click="toSearch" />
    </div>
    <!-- <papertag-multiline-outter v-if="currentTab &&currentTab.tags&&currentTab.tags.length" :tags="currentTab.tags" :index="currentTab.tagIndex" :fixed-status-from-parent="showFixPaperTag" :parent-dom="'.health'" :top-minus-dom="'.crumb'" @tagclick="clickTag" /> -->
    <div :class="{'with-fix-tab': fixTab}" class="main-content">
      <!-- <template v-if="activeOps && activeOps.activeType === 'banner'">
        <active-banner v-show="tabIndex === 0" :options="activeOps" />
      </template>
      <template v-if="activeOps && activeOps.activeType === 'consultant'">
        <active-consultant v-show="tabIndex === 0" :options="activeOps" />
      </template> -->
      <!-- <swiper v-show="show" :options="swiperOps" class="health-swiper">
        <template v-for="(tab, index) in tabs">
          <swiper-slide :key="index">
            <div :class="{'tab-qa': tab.type === 1}" class="content-block">
              <papertag-multiline v-if="tab.tags&&tab.tags.length" :tags="tab.tags" :index="tab.tagIndex" :parent-dom="'.tab-qa'" :top-minus-dom="'.crumb'" @tagclick="clickTag" @fixedStatusOnChange="fixedStatusOnChange" />
              <paper :paperlist="tab.data" :loaded="tab.loaded" :ishotqa="tab.type === 1" :listqa="tab.type === 1" :rkey="reportKey" />
            </div>
          </swiper-slide>
        </template>
      </swiper> -->
      <div v-for="(tab, index) in tabs" v-show="tabIndex === index" :key="index" class="content-block">
        <!-- <papertag-multiline v-if="tab.tags&&tab.tags.length" :tags="tab.tags" :index="tab.tagIndex" :parent-dom="'.content-block-' + index" :top-minus-dom="'.crumb'" @tagclick="clickTag" @fixedStatusOnChange="fixedStatusOnChange" /> -->
        <paper :paperlist="tab.data" :loaded="tab.loaded" :ishotqa="tab.type === 1" :listqa="tab.type === 1" :rkey="reportKey" />
      </div>
    </div>
    <!-- <div v-show="showInterest" class="interest">
      <div class="mask" />
      <div class="wrapper">
        <div class="header">
          <span class="close" @click="closeInterest" />
          <p class="title">请选择感兴趣的健康分类</p>
          <p class="desc">您将在推荐板块阅读到这些内容</p>
        </div>
        <div class="content">
          <div class="predefined">
            <div v-for="item in predefined" :key="item" class="predefined-item">
              <input :value="item" v-model="interested" type="checkbox">
              <span class="label">
              <span v-show="interested.indexOf(item) === -1" class="add">+</span><img v-show="interested.indexOf(item) !== -1" :src="require('src/assets/images/mobile/health/tick.png')" class="tick">{{ item }}</span>
            </div>
          </div>
          <p>
          <span :class="{cancel: interestInAll}" class="focus-all" @click="interestIn(0)">{{ interestInAll ? '取消全选' : '全选' }}</span><input :disabled="interested.length <= 0" class="focus-selected" type="submit" value="关注所选" @click.prevent="interestIn(1)"></p>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import health from './health'
export default health
</script>

<style lang="scss" scoped>
@import "./health.scss";
</style>

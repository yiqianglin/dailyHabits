<template>
  <div v-cloak class="container">
    <tmenu :nosearch="true" name="找医生" @callback="tmenuCb" />
    <!--顶部筛选-->
    <div class="filter-wrp">
      <div class="filter-top">
        <div :class="{'active': isShowFilterPanel}" class="location-wrp" @click="locationFilterBtnClick">
          <span class="location-selected">{{ location === '全部' ? '城市' : location }}</span>
        </div>
        <div class="search-wrp-top" @click="searchBtnClick">
          <div class="search-bar">
            <span>搜医生</span>
          </div>
        </div>
      </div>
      <div :class="{'show': isShowFilterPanel}" class="filter-bottom">
        <ul class="filter-ul">
          <li v-for="(item, index) in locationData" :key="index" :class="{'selected': index === locationSelectedIndex}" class="filter-li" @click="filterLiClick(index)">
            {{ item }}
            <a href="javascript:;" class="btn-link" />
          </li>
        </ul>
      </div>
    </div>
    <!--搜索列表-->
    <div id="content-wrp" class="content-wrp">
      <div class="remark">
        以下内容排名不分先后
      </div>
      <!-- <paper :paperlist="feedsContent.data" :loaded="feedsContent.loaded" :rkey="'sss'"></paper>
            -->

      <div id="paper" class="paper">
        <div v-for="(item, index) in hospitalResult" :key="index" class="content-item-wrp" @click="hospitalItemClick(item)">
          <div class="img">
            <img v-if="item.logo" :src="item.logo" alt="">
          </div>
          <div class="detail">
            <span class="name">{{ item.name }}</span>
            <ul class="tag-ul">
              <li v-for="(item_tag, index_tag) in item.vt_typeinfo" :key="index_tag" class="tag-li">{{ item_tag.svalue }}</li>
            </ul>
            <p v-if="item.search_desc" class="desc">{{ item.search_desc }}</p>
          </div>
        </div>
        <!-- <div class="content-item-wrp">
          <div class="img">
            <img src="https://baike-med-1256891581.file.myqcloud.com/2018030/cb944bd0-1de5-11e8-ab39-b5cd33858281_0.png" alt="">
          </div>
          <div class="detail">
            <span class="name">复旦大学附属肿瘤医院</span>
            <ul class="tag-ul">
              <li class="tag-li">肿瘤性医院</li>
              <li class="tag-li">三甲</li>
              <li class="tag-li">医保</li>
            </ul>
          </div>
        </div>
        <div class="content-item-wrp">
          <div class="img">
            <img src="https://baike-med-1256891581.file.myqcloud.com/2018030/cb944bd0-1de5-11e8-ab39-b5cd33858281_0.png" alt="">
          </div>
          <div class="detail">
            <span class="name">复旦大学附属肿瘤医院</span>
            <ul class="tag-ul">
              <li class="tag-li">肿瘤性医院</li>
              <li class="tag-li">三甲</li>
              <li class="tag-li">医保</li>
            </ul>
          </div>
        </div>
        <div class="content-item-wrp">
          <div class="img">
            <img src="https://baike-med-1256891581.file.myqcloud.com/2018030/cb944bd0-1de5-11e8-ab39-b5cd33858281_0.png" alt="">
          </div>
          <div class="detail">
            <span class="name">复旦大学附属肿瘤医院</span>
            <ul class="tag-ul">
              <li class="tag-li">肿瘤性医院</li>
              <li class="tag-li">三甲</li>
              <li class="tag-li">医保</li>
            </ul>
          </div>
        </div> -->
        <!-- <p v-if="!feedsContent.isEmpty" class="loading">
          <span v-show="!feedsContent.loaded" class="dotting">
            <i/>
            <i/>
            <i/>
        </span>{{ feedsContent.loaded?'已经到底了':'正在加载更多' }}</p>
        <div v-if="feedsContent.isEmpty" class="paper-empty">{{ feedsContent.loaded?'暂时没有符合的临床试验':'数据加载中...' }}</div> -->
      </div>
    </div>
    <transition name="fadeIn">
      <div v-if="isShowMask" class="mask" @click="maskClick" />
    </transition>

    <transition name="fade" mode="out-in">
      <div v-if="isShowSearchPanel" class="search-wrp">
        <!-- 搜索框 -->
        <div class="search-bar">
          <div class="search-input-wrapper">
            <i class="search-icon" />
            <form action="javascript:void(0);">
              <input id="searchInput" v-model="doctorSearchPanelData.searchInput" placeholder="搜医生" type="search">
            </form>
            <img v-show="doctorSearchPanelData.searchInput" :src="require('src/assets/images/mobile/search_new/del.png')" class="del-img" @click="cleanSearchInput">
          </div>
          <span v-show="!doctorSearchPanelData.searchAble" class="cancel" @click="cancelSearchPanel">取消</span>
        </div>
        <!--结果-->
        <div v-show="doctorSearchPanelData.searchInput && doctorSearchPanelData.resultList.length > 0" class="search-smartbox">
          <ul class="search-plain-list">
            <li v-for="(item, index) in doctorSearchPanelData.resultList" :key="index" class="item search-common-item">
              <div class="name ellipsis" v-html="highLight(item.doctor_name, item.hospital_name, item.depart_name)" />
              <a href="javascript:;" class="btn-link" @click="searchItemSelect(item.doctor_id)" />
            </li>
          </ul>
        </div>
        <div v-show="!doctorSearchPanelData.searchInput" class="empty-search">
          <p class="empty-search-remark">请输入医生信息</p>
        </div>
        <div v-show="doctorSearchPanelData.searchInput && doctorSearchPanelData.resultList.length === 0 && !doctorSearchPanelData.isSearching" class="empty-result-list">
          <p class="empty-result-list-remark">暂无该医生相关信息</p>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import hospital from './hospital'
export default hospital
</script>

<style lang="scss" scoped>
@import "./hospital.scss";
</style>

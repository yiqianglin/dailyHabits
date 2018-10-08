<template>
  <div v-show="pageShow" v-cloak :class="{'filter-city': mode === 'ask'}" class="container">
    <tmenu :name="mode === 'ask' ? '问医生' : '找医生'" @callback="tmenuCb" />
    <!--顶部筛选-->
    <div :class="{ask: mode === 'ask'}" class="filter-wrp">
      <div class="filter-top">
        <template v-if="mode === 'ask'">
          <div class="location-wrp" @click="locationFilterBtnClick">
            <span class="location-selected">{{ locationPanelData.selected === '全部城市' ? '城市' : locationPanelData.selected }}</span>
          </div>
        </template>
        <template v-else>
          <div class="hospital-info-wrp" @click="goToHospital">
            <div v-if="hospitalInfo.op_logo" class="img">
              <img :src="hospitalInfo.op_logo" alt="">
            </div>
            <div class="hospital-detail">
              <div class="name">{{ hospitalInfo.name }}</div>
              <ul class="tag-ul">
                <li v-for="(item, index) in hospitalInfo.vt_typeinfo" v-if="item.skey !== 'ownerrank'" :key="index" class="tag-li">{{ item.svalue }}</li>
              </ul>
            </div>
          </div>
          <div class="filter-detail-wrp">
            <span :class="{'active': filterPanelActiveType === 1}" class="filter-item department" @click="filterClick(1)">
              <span class="filter-item-inner">{{ departmentSelected }}</span>
            </span>
            <span :class="{'active': filterPanelActiveType === 2}" class="filter-item type" @click="filterClick(2)">
              <span class="filter-item-inner">{{ doctitleSelected }}</span>
            </span>
          </div>
        </template>
      </div>
      <div v-if="isShowFilterPanel && filterPanelActiveType === 1" :class="{'show': isShowFilterPanel && filterPanelActiveType === 1}" class="filter-bottom">
        <ul class="filter-ul">
          <li v-for="(item, index) in departmentList" :key="index" :class="{ 'selected': item === departmentSelected }" class="filter-li" @click="filterOptionClick(1, item, index)">
            {{ item }}
            <a href="javascript:;" class="btn-link" />
          </li>
        </ul>
      </div>
      <div v-if="isShowFilterPanel && filterPanelActiveType === 2" :class="{'show': isShowFilterPanel && filterPanelActiveType === 2}" class="filter-bottom">
        <ul class="filter-ul">
          <li v-for="(item, index) in doctitleList" :key="index" :class="{ 'selected': item === doctitleSelected }" class="filter-li" @click="filterOptionClick(2, item, index)">
            {{ item }}
            <a href="javascript:;" class="btn-link" />
          </li>
        </ul>
      </div>
    </div>
    <!--搜索列表-->
    <div id="content-wrp" class="content-wrp">
      <div class="remark">
        以下{{ disease }}编委会成员可提供咨询
      </div>
      <div id="paper" class="paper">
        <div v-for="(item, index) in (mode === 'ask' ? consultantList : doctorSearchListByFilter)" :key="index" class="content-item-wrp" @click="goToDoctor(item.doctor_id)">
          <div class="img">
            <img :src="item.hand || require('src/assets/images/mobile/mydoctor/avatar.png')" alt="">
          </div>
          <div class="detail">
            <div class="top">
              <p class="info">
                <span class="name">{{ item.name }}</span>
                <span class="positional-title">{{ item.doctitle }}</span>
                <span class="department">{{ item.main_depart }}</span>
              </p>
              <div v-if="item.hdfUrl || consultantIds.indexOf(item.doctor_id) !== -1" class="consultable">可咨询</div>
            </div>
            <div class="middle">擅长:
              <span class="territory">{{ territory(item.op_vt_diseases_tag) }}</span>
            </div>
            <div class="bottom">
              <span class="hospital">{{ item.hospital }}</span>
            </div>
          </div>
        </div>
        <!-- <p v-if="!feedsContent.isEmpty" class="loading">
          <span v-show="!feedsContent.loaded" class="dotting">
            <i/>
            <i/>
            <i/>
        </span>{{ feedsContent.loaded?'已经到底了':'正在加载更多' }}</p>
        <div v-if="feedsContent.isEmpty" class="paper-empty">{{ feedsContent.loaded?'暂时没有符合的临床试验':'数据加载中...' }}</div> -->
      </div>
      <div v-if="!(mode === 'ask' ? consultantList : doctorSearchListByFilter).length" class="empty">暂无医生</div>
    </div>
    <div v-if="isShowMask" class="mask" @click="maskClick" />

    <div class="pop-wrp">
      <!--城市选择面板-->
      <filter-sort-panel :is-show="isShowLocationPanel" :title="'请选择城市'" :dom-id="'location'" :data="locationPanelData" :data-key="'city'" :show-reset-btn="true" @onFilterSelect="onLocationPanelSelect" @onClose="locationPanelOnClose" @onReset="locationPanelOnReset" />
    </div>

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
import doctor from './doctor'
export default doctor
</script>

<style lang="scss" scoped>
@import "./doctor.scss";
</style>

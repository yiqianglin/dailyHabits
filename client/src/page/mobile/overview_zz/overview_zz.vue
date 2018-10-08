<template>
  <div v-cloak class="container">
    <div v-cloak v-show="isShow" id="overview_pt">
      <tmenu :name="name" :issearchbar="true" @callback="tmenuCb" />
      <active-broadcast v-if="activeOps" :options="activeOps" />
      <div v-show="isShow" class="overview">
        <!-- <div class="top" :style="{backgroundImage:'url('+topicDesease.image+')'}"> -->
        <div :style="topicDesease.image ? 'background-image: url(' + topicDesease.image + ')' : ''" class="top">
          <div class="name">
            <p>{{ name }}</p>
            <div :class="['follow',followed?'followed':'']" :ptag="!followed ? 'ydd_content_follow' : 'ydd_content_unfollow'" data-follow="0" @click="followClick">{{ followed?'已关注':'＋关注' }}</div>
          </div>
          <div :style="{visibility:opReview.text?'':'hidden'}" class="review">
            <div :class="['desc',opReview.clickable===1?'':'unclickable']">
              <p>{{ opReview.text?opReview.text:'fill' }}</p>
              <i class="icon" />
              <a v-if="opReview.clickable === 1 && opReview.doctor_id" href="javascript:;" class="btn-link" @click="toDoctor(opReview.doctor_id)" />
            </div>
          </div>
        </div>
        <div v-if="topicDesease.definition" class="diease">
          <div :style="{WebkitLineClamp:opReview.text?8:9,maxHeight:'4.7rem'}" class="img">
            <div class="over md" v-html="topicDesease.v_md_definition">
              <!-- <img v-if="topicDesease.op_icon" :src="topicDesease.op_icon"> -->
              <!-- {{topicDesease.v_md_definition}} -->
            </div>
          </div>
          <div class="mask-more"><img :src="require('src/assets/images/mobile/overview/mask_trs_2.png')"></div>
          <div class="view-detail">
            <span>查看详情</span>
            <a href="javascript:;" class="btn-link" @click="toDDetail()" />
          </div>
          <ul v-if="topicItems.length>0" class="topic-list">
            <li v-for="item in topicItems" :key="item.name"><img :src="item.icon">
              <p>{{ item.name }}</p>
              <a href="javascript:;" class="btn-link" @click="toDDetail(item.pinyin,item.name)" />
            </li>
          </ul>
        </div>
      </div>
      <template v-if="search_lib!=='healthwise'&&topic && topic.slice(0, 4).length">
        <div class="block topic">
          <div class="tabs">
            <template v-for="(item, index) in topic.slice(0, 4)">
              <div :key="item.title" :ptag="index>0?'YDD_Content_TopicTabX|'+index : 'ydd_content_recoartitab'" :class="{ active: currentIndex === index, update: !item.readflag }" class="item" @click="topicTabClick(index)">
                <span>{{ item.title }}</span>
                <a href="javascript:;" class="btn-link" />
              </div>
            </template>
          </div>
          <div class="content">
            <template v-for="item in topicList">
              <div :key="item.title" :class="{noread: item.readflag == 0 }" class="item">
                <div class="name-desc">
                  <div :class="{top : !!item.isTop, new: !!item.newflag}" class="name">
                    <span>{{ item.title }}</span>
                  </div>
                  <div class="desc">
                    <template v-if="item.op_author&&item.op_author.op_doctor&&item.op_author.op_doctor.length>0">
                      <div v-for="itemi in item.op_author.op_doctor" :key="itemi.name">
                        {{ itemi.name+(!itemi.position&&itemi.department?' | ':' ')+[itemi.position,itemi.department].filter(function(s){return s;}).join(' | ') }}<br>
                      </div>
                      {{ item.op_author.op_doctor[0].hospital||'' }}
                    </template>
                    <template v-else>
                      {{ (item.op_author&&item.op_author.op_hospital&&item.op_author.op_hospital.name)||item.source }}
                    </template>
                  </div>
                </div>
                <div v-if="!!item.image || !!item.op_image" :class="{ vedio : item.tid === 10 }" class="img ">
                  <img v-if="item.tid === 4 && !!item.op_image" :src="item.op_image" alt="">
                  <img v-if="item.tid === 10" :src="item.image" alt="">
                </div>
                <a href="javascript:;" class="btn-link" @click.stop.prevent="toArticle(item.docid)" />
              </div>
            </template>
          </div>
          <div class="more">
            查看更多
            <a href="javascript:;" class="btn-link" @click="topicToDDetail" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import overviewZz from './overview_zz'
export default overviewZz
</script>

<style lang="scss" scoped>
@import "./overview_zz.scss";
</style>

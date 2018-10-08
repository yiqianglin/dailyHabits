<template>
  <div v-cloak id="main" class="container">
    <div v-cloak v-show="isShow" id="overview_m">
      <tmenu :name="name" :issearchbar="true" @callback="tmenuCb" />
      <active-broadcast v-if="activeOps" :options="activeOps" />
      <div class="overview">
        <div :style="{backgroundImage:'url('+topicDesease.image+')'}" class="top">
          <div class="name">
            <p>{{ name }}</p>
            <div :class="['follow',followed?'followed':'']" :ptag="!followed ? 'ydd_content_follow' : 'ydd_content_unfollow'" data-follow="0" @click="followClick">{{ followed?'已关注':'＋关注' }}</div>
          </div>
          <div v-if="opReview.text" class="review">
            <div :class="['desc',opReview.clickable===1?'':'unclickable']">
              <p>{{ opReview.text }}</p>
              <i class="icon" />
              <a v-if="opReview.clickable === 1 && opReview.doctor_id" href="javascript:;" class="btn-link" @click="toDoctor(opReview.doctor_id)" />
            </div>
          </div>
        </div>
        <div v-if="true" class="diease">
          <div :style="{maxHeight:maxHeight,WebkitLineClamp:lineCapNum}" class="img">
            <div class="over">
              <div class="inner-md md" v-html="mdContent" />
              <!--               <img v-if="topicDesease.op_icon" :src="topicDesease.op_icon">
        {{topicDesease.definition}} -->
            </div>
          </div>
          <div v-show="lineCapNum !== 'unset'" class="mask-more"><img :src="require('src/assets/images/mobile/overview/mask_trs_2.png')"></div>
          <div v-show="isMore" v-cloak :ptag="lineCapNum==='unset'?'YDD_MTopic_Desp_Unfold':''" class="arrow" @click="showAllText()">
            <i :class="[lineCapNum === 'unset' ? 'up' : ' down']" />
          </div>
          <!--           <div class="view-detail"><span>查看详情</span><a href="javascript:;" @click="toDDetail()" class="btn-link"></a></div> -->
          <!--           <ul v-if="topicList.length>0">
        <li v-for="item in topicList"><img :src="item.icon"><p>{{item.name}}</p><a href="javascript:;" @click="toDDetail(item.pinyin,item.name)" class="btn-link"></a></li>
        </ul> -->
        </div>
      </div>
      <div v-if="related&&related.length > 0" class="related">
        <p class="title">常见类型</p>
        <template v-for="(item, index) in related">
          <div v-if="item.tid === 13" :key="index" class="block tpl-13">
            <img :src="item.image_bg" class="img" alt="">
            <p class="name ellipsis">{{ item.title }}</p>
            <p class="desc ellipsis">{{ item.abs }}</p>
            <a href="javascript:;" class="btn-link" @click="relatedToOverview(item.title, item.jingpin, index)" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import overviewM from './overview_m'
export default overviewM
</script>

<style lang="scss" scoped>
@import "./overview_m.scss";
</style>

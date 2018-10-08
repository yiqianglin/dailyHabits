<!-- 本页面若不带name参数将被nginx重定向至enter.html-->
<template>
  <div v-cloak class="container">
    <div v-cloak id="overview_pt">
      <tmenu :name="name" :issearchbar="true" @callback="tmenuCb" />
      <loading :show="!isShow"/>
      <template v-show="isShow">
        <active-broadcast v-if="activeOps" :options="activeOps" />
        <div class="overview_pt">
          <div :style="topicDesease.image ? 'background-image: url(' + topicDesease.image + ')' : ''" class="top">
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
          <div v-if="topicDesease.definition" class="diease">
            <div :style="{WebkitLineClamp:opReview.text?8:9}" class="img">
              <div class="over">
                <img v-if="topicDesease.op_icon" :src="topicDesease.op_icon"> {{ topicDesease.definition }}
              </div>
            </div>
            <div class="view-detail">
              <span>查看详情</span>
              <a href="javascript:;" class="btn-link" @click="toDDetail()" />
            </div>
            <ul v-if="topicList.length>0">
              <li v-for="item in topicList" :key="item.name"><img :src="item.icon">
                <p>{{ item.name }}</p>
                <a href="javascript:;" class="btn-link" @click="toDDetail(item.pinyin,item.name)" />
              </li>
            </ul>
          </div>
        </div>
        <topicdocs v-if="search_lib!=='healthwise'" :topic="topic" :name="name" />
      </template>
    </div>
  </div>
</template>

<script>
import overviewPt from './overview_pt'
export default overviewPt
</script>

<style lang="scss" scoped>
@import "./overview_pt.scss";
</style>

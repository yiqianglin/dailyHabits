<template>
  <div v-cloak class="container">
    <div v-cloak id="main">
      <tmenu :name="name" :issearchbar="true" @callback="tmenuCb" />
      <loading :show="!isShow"/>
      <template v-show="isShow">
        <active-broadcast v-if="activeOps" :options="activeOps" />
        <div class="block">
          <div v-for="(item, itemIdx) in baseinfo" :key="itemIdx">
            <div v-if="item.tid === 0" class="tpl-0">
              <img :src="item.image" class="img-bg">
              <template v-if="!!item.op_icon">
                <img :src="item.op_icon" class="img-disease" alt="">
              </template>
              <div class="name">
                <p>{{ name }}</p>
                <a :class="!!followed ? 'focus' : ''" :ptag="!followed ? 'ydd_content_follow' : 'ydd_content_unfollow'" href="javascript:;" class="btn-focus" @click="followClick" />
              </div>
              <div v-if="!!alias" class="alias ellipsis">又称:{{ alias }}</div>
              <div v-if="item.op_review&&item.op_review.text" :class="{'no-alias': !alias, clickable: item.op_review.clickable == 1}" class="pos-desc">
                <i class="pos-icon" /> {{ item.op_review.text }}
                <i class="pos-arrow" />
                <a v-if="item.op_review.clickable == 1 && !!item.op_review.doctor_id" href="javascript:;" class="btn-link" @click="toDoctor(item.op_review.doctor_id)" />
              </div>
              <div v-if="!!item.op_summarys" class="diease-desc" ptag="ydd_content_overview_clk">
                <div class="summarys-wrap" @click="navToDDetail(name,'gaishu')">
                  <template v-for="subItem in item.op_summarys">
                    <div :key="subItem" class="summary ellipsis">{{ subItem }}</div>
                  </template>
                </div>
                <a href="javascript:;" ptag="ydd_content_10pic_clk" class="btn-know" @click="navToDDetail(name,item.op_quickoverview?'tujie':'gaishu')"> {{ item.op_quickoverview?'十图秒懂':'概述' }}</a>
              </div>
            </div>
            <div v-if="item.tid === 19" :class="{line:item.list&&item.list.length>3}" class="tpl-19">
              <template v-for="subItem in item.list">
                <div :key="subItem.name" class="item">
                  <img :src="subItem.icon" class="icon" alt="">
                  <p class="desc">{{ subItem.name }}</p>
                  <a href="javascript:;" class="btn-link" @click="navToDDetail(subItem.name, subItem.pinyin)" />
                </div>
              </template>
            </div>
          </div>
        </div>
        <depressiontest :show="name==='抑郁症'" :notitle="true" clickstat="ydd_content_tools_clk" />
        <topicdocs v-if="search_lib!=='healthwise'" :topic="topic" :name="name" />
        <div v-if="related&&related.length > 0" class="related">
          <p class="title">相关疾病</p>
          <template v-for="(item, index) in related">
            <div v-if="item.tid === 13" :key="index" class="block tpl-13">
              <img :src="item.image_bg" class="img" alt="">
              <p class="name ellipsis">{{ item.title }}</p>
              <p class="desc ellipsis">{{ item.abs }}</p>
              <a href="javascript:;" class="btn-link" @click="relatedToOverview(item.title, item.jingpin, index)" />
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import overview from './overview'
export default overview
</script>

<style lang="scss" scoped>
@import "./overview.scss";
</style>

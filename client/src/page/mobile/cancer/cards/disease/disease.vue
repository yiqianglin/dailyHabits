<template>
  <!-- 疾病题头卡片 -->
  <div v-if="baseinfo && baseinfo[0]">
    <div v-for="(item, index) in baseinfo" v-if="item.tid === 0" :key="index">
      <div class="card-wrapper">
        <p class="disease-intro">
          <span class="name">{{ item.name }}</span>
          <a v-if="from !== 'tanyi'" class="follow-btn" @click="followClick">{{ follow ? '已关注' : '关注' }}</a>
        </p>
        <div v-if="item.op_alias && item.op_alias.length && from !== 'tanyi'" class="alias ellipsis">又称:{{ item.op_alias.join('、') }}</div>
        <div class="csco" @click="goCSCO">
          <img :src="require('src/assets/images/mobile/cancer/csco.png')" class="csco-logo">
          <p class="csco-title">中国临床肿瘤学会</p>
          <p class="csco-title">内容战略合作</p>
        </div>
        <div class="webmd" @click="toWebmd()">
          <div class="img">
            <img :src="require('src/assets/images/mobile/cancer/webmd_sole.png')">
          </div>
          <p class="desc">全球领先的医疗科普网站{{ wmdcount>0?'，精选 '+wmdcount+' 篇'+name+'文章':'' }}</p>
        </div>
      </div>
      <div v-if="item.reviews && item.reviews.length" class="review-wrapper">
        <div :class="{multi: item.reviews.length > 1}" class="review-list">
          <div v-for="review in item.reviews" :key="review.drid" class="review-item" @click="toDoctor(review.drid, review.doctor_clickable)">
            <img :src="review.icon">
            <div class="info">
              <p>
                <span class="name">{{ review.name }}</span>
                <span class="review-text">{{ review.position?review.position+' ':'' }}审阅</span>
              </p>
              <p class="position ellipsis">{{ review.socialtitle || review.hospital }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import disease from './disease'
export default disease
</script>

<style lang="scss" scoped src="./disease.scss" />

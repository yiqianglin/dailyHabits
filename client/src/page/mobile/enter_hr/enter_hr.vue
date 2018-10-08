<template>
  <div v-cloak class="container">
    <div v-cloak id="enter" class="enter">
      <template v-if="show">
        <div class="header">
          <nav>
            <i class="health" />
            <a href="javascript:void(0);" class="my" @click="goMy" />
          </nav>
          <div class="title" @click="toAuthority">
            <img :src="require('src/assets/images/mobile/enter/logo.png')">
            <p>为大众而生的专业医典</p>
          </div>
          <div class="search" @click="goNewSearch">
            <span>
            <i class="icon" />搜疾病、文章</span>
          </div>
        </div>
        <div class="list-block">
          <div class="list-tab">鹅厂常见疾病
            <div class="list-btn" @click="toBaike">查看疾病百科
              <i class="arrow-right" />
            </div>
          </div>
          <div class="list-block-content">
            <template v-for="(item, index) in commonImages">
              <div :key="index" :style="{backgroundImage:'url('+item.image+')'}" class="list-block-grid">
                <!-- <img :src="require('src/assets/images/mobile/search_test/K1.png')" /> -->
                <div class="grid-title">{{ item.name }}</div>
                <div class="grid-desc">{{ item.abs }}</div>
                <a :data-name="item.name" :data-type="item.type" href="javascript:;" @click="toOverview" />
              </div>
            </template>
          </div>
          <div class="list-block-tags">
            <template v-for="(item, index) in commonList">
              <span :key="index" :data-name="item.name" :data-type="item.type" class="list-block-tag" @click="toOverview">{{ item.name }}</span>
            </template>
          </div>
        </div>
        <div id="paper" class="paper">
          <div class="title">医生推荐阅读</div>
          <ul v-if="paperList.length>0" class="list">
            <li v-for="(item,index) in paperList" :key="item.docid" class="paper-item" @click="toArticle(index)">
              <div class="item-img">
                <div class="item">
                  <p class="title">{{ item.title }}</p>
                  <div v-if="item.tid===10&&item.image" class="video-img">
                    <img :src="item.image">
                    <span v-if="item.duration>0" class="video-time">{{ item.duration | formatTime }}</span>
                  </div>
                  <ul v-if="item.op_keyword&&item.op_keyword.length>0">
                    <li v-for="itemi in item.op_keyword.slice(0,3)" :key="itemi">{{ itemi }}</li>
                  </ul>
                </div>
                <div v-if="item.tid!==10&&(item.op_image)" class="img">
                  <img :src="item.op_image" alt="">
                </div>
              </div>
              <div v-if="item.op_author&&item.op_author.op_doctor&&item.op_author.op_doctor[0]" class="author">
                <div v-if="item.op_author.op_doctor[0].icon" class="author-img">
                  <img :src="item.op_author.op_doctor[0].icon">
                </div>
                <div class="author-info">{{ item.op_author.op_doctor[0].name+(item.op_author.op_doctor[0].position?(' '+item.op_author.op_doctor[0].position):'')+(item.op_author.op_doctor[0].hospital?('丨'+item.op_author.op_doctor[0].hospital):'') }}</div>
              </div>
              <div v-else-if="item.op_author&&item.op_author.op_hospital&&item.op_author.op_hospital.name" class="author">
                <div v-if="item.op_author.op_hospital.icon" class="author-img">
                  <img :src="item.op_author.op_hospital.icon">
                </div>
                <div class="author-info">{{ item.op_author.op_hospital.name }}</div>
              </div>
              <div v-else class="author">
                <div v-if="item.tid!==10" class="author-img">
                  <img src="//s.pc.qq.com/tdf/baike/source_icon.png">
                </div>
                <div class="author-info">{{ item.source }}</div>
              </div>
            </li>
          </ul>
          <div v-else class="empty">数据加载中</div>
          <div v-if="paperList.length>0" class="loading">
            <span v-show="!loaded" class="dotting">
              <i/>
              <i/>
              <i/>
          </span>{{ loaded?'已经没有更多':'正在加载更多' }}</div>
        </div>
      </template>
      <template v-else>
        <div class="hint">请在微信浏览器中打开</div>
      </template>
    </div>
  </div>
</template>

<script>
import enterHr from './enter_hr'
export default enterHr
</script>

<style lang="scss" scoped>
@import "./enter_hr.scss";
</style>

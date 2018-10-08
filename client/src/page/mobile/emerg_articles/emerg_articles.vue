<template>
  <div v-cloak class="container">
    <div v-cloak id="hb_detail" class="hb-detail">
      <tmenu name="急救文章" />
      <div id="paper" class="paper">
        <!--             <div class="paper-title"> <span class="title-text">企鹅医典运动锦囊</span><a href="javascript:;" @click="goToEnter()" class="more">更多医疗知识</a></div> -->

        <ul v-if="paperList.length>0" id="paperUl" class="list">
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

    </div>
  </div>
</template>

<script>
import emergArticles from './emerg_articles'
export default emergArticles
</script>

<style lang="scss" scoped>
@import "./emerg_articles.scss";
</style>

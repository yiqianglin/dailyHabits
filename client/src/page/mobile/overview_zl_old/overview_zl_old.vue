<template>
  <div v-cloak id="main" class="container">
    <div v-cloak v-show="isShow" id="main">
      <tmenu :name="name" :isdisease="true" showlogo="true" @callback="tmenuCb" />
      <div class="top-card tpl-0">
        <div v-for="(item, index) in baseinfo" :key="index">
          <div v-if="item.tid === 0" class="disease-intro">
            <p class="h1">
              <span class="name">{{ name }}</span>
              <a class="follow-btn" @click="followClick">{{ followed ? '已关注' : '+关注' }}</a>
            </p>
            <p v-if="item.op_review&&item.op_review.text" class="disease-doctor">{{ item.op_review.text }}</p>
            <p class="webmd-text" @click="toWebmd()">
              <span class="webmd"><img :src="require('src/assets/images/mobile/overview_zl/webmd_logo.png')"></span>
              <span>美国最大医学科普网站独家授权</span>
            </p>
            <p v-if="wmdcount > 0" class="recommand">精选
            <span> {{ wmdcount }} </span>篇{{ name }}专业文章</p>
          </div>
          <div v-if="!!item.op_icon" class="disease-image">
            <img :src="item.op_icon">
          </div>
        </div>
      </div>

      <div v-if="activeList && activeList.length>0" class="hot-list">
        <p class="h2" @click="toNewCard()">
          <span class="h2-1" />
          <span class="h2-2">精选内容</span>
          <span class="h2-3">更多精选<img :src="require('src/assets/images/mobile/card/arrow-up.png')"></span>
        </p>
        <ul>
          <template v-for="(item,index) in activeList">
            <li v-if="item.text!=''" :key="index" @click="toActive(item.type,item.docid,item.h5url)">
              <p class="title">
                <span>{{ item.text }}</span>
                <em v-if="item.type==2">全网首发</em>
              </p>
              <p class="name">
                <img v-if="item.hwflag==1" :src="require('src/assets/images/mobile/overview_zl/webmd_logo.png')" class="wmd-logo">
                <img v-else-if="item.image && item.image!=''" :src="item.image" class="doctor-avart">
                <span>{{ item.author=='WebMD'?'中文版唯一授权':item.author }}</span>
              </p>
            </li>
            <!-- <li>
                            <p class="title">肺癌就医参考</p>
                            <p class="name">江泽飞</p>
                        </li>
                        <li>
                            <p class="title">肺癌就医参考</p>
                            <p class="name">江泽飞</p>
                        </li> -->
          </template>
        </ul>

      </div>
      <div class="contruct-list">
        <!-- <p class="top-bg"></p> -->
        <!-- <p class="title">
                    <span class="h1">基本概念</span>
                    <span class="btn">收起</span>
                </p> -->
        <div v-for="(item,index) in trees" :key="index">
          <!-- first 一级label start-->
          <p :id="item.id" class="h2" @click="slideFirst(index,item.id)">
            <span class="h2-1" />
            <span class="h2-2">{{ item.label }}</span>
            <span class="h2-3">{{ item.foldflag ? '收起' : '展开' }}</span>
            <span v-if="lastEid1==item.id" ref="readflag1" class="new-icon first" />
          </p>
          <!-- 一级label end -->
          <!-- 一级目录下的文章start -->
          <template v-if="item.foldflag">
            <!-- 只有一篇文章展示总论 -->
            <div v-if="item.docs && item.docs.length == 1 && item.docs[0].summary!=''" class="conclusion" @click.stop.prevent="toArticle(item.docs[0].docid,item.id)">
              <span>{{ item.docs[0].summary }}</span>
              <img :src="require('src/assets/images/mobile//doctor/arrow-up.png')">
            </div>
            <!-- 多篇文章展示文章标题列表 -->
            <template v-for="(docitem) in item.docs">
              <div v-if="item.docs && item.docs.length > 1" :key="docitem.docid" class="art-title1" @click.stop.prevent="toArticle(docitem.docid,item.id)">
                <span>{{ docitem.title }}</span>
              </div>
            </template>
          </template>
          <!-- 一级目录下的文章end -->
          <!-- second 二级目录 start 展开状态 flodflag标识展开收起状态-->
          <template v-if="item.foldflag">
            <template v-for="(item1,index1) in item.second">
              <div :key="item1.id" :id="item1.id" class="disease-content">
                <p :style="item1.foldflag?'border-bottom:none':''" class="disease-name" @click.stop="slideSecond(index,index1,item1.id)">
                  <img :src="require('src/assets/images/mobile/overview_zl/arr@3x.png')" :class="!item1.foldflag ? 'slideup' :''"> {{ item1.label }}
                  <span v-if="lastEid2==item1.id" ref="readflag2" class="new-icon second" />
                </p>
                <!-- class="slideup" -->
                <!-- third -->
                <div v-if="item1.foldflag" class="disease-info">
                  <!-- 二级目录下的文章 一篇展示总论，多篇展示标题列表 start-->
                  <p v-if="item1.docs && item1.docs.length == 1 && item1.docs[0].summary !=''" class="conclusion" @click.stop.prevent="toArticle(item1.docs[0].docid,item.id,item1.id)">
                    <span>{{ item1.docs[0].summary }}</span>
                    <img :src="require('src/assets/images/mobile/doctor/arrow-up.png')">
                  </p>
                  <template v-for="(docitem1) in item1.docs">
                    <p v-if="item1.docs && item1.docs.length > 1" :key="docitem1.docid" class="art-title" @click.stop.prevent="toArticle(docitem1.docid,item.id,item1.id)">
                      <span>{{ docitem1.title }}</span>
                    </p>
                  </template>
                  <!-- 二级目录文章end 三级下面的tag下只有一篇文章展示标题 多篇展示tag并显示文章数 start-->
                  <template v-for="(item2,index2) in item1.third">
                    <p v-if="item2.count===1" :key="index2" class="art-title" @click.stop.prevent="toArticle(item2.doc.docid,item.id,item1.id)">
                      <span>{{ item2.doc && item2.doc.title ? item2.doc.title : item2.label }}</span>
                      <!-- <span class="art-num">{{item2.count}}篇</span> -->
                    </p>
                    <p v-else :key="index2" class="tag-name" @click.stop.prevent="toTagArticle(item.label,item1.label,item2.label,item.id,item1.id)">
                      <span>{{ item2.label }}</span>
                      <span class="art-num">{{ item2.count }}篇</span>
                    </p>
                  </template>
                  <!-- end -->
                </div>
              </div>
            </template>
            <p class="border" />
          </template>
          <!-- 收起状态展示 tag list -->
          <template v-else>
            <div v-if="index1 < 2" :key="item.id" class="tags-list">
              <span v-for="(item1) in item.second" :key="item1.label">{{ item1.label+'&nbsp;&nbsp;' }}</span>
              <span>...</span>
            </div>
          </template>

          <!-- 二级目录end -->
          <!-- <span class="new-icon"></span> -->
        </div>
      </div>

      <!-- <div class="contruct-list check">
                <p class="h2">
                    <span class="h2-1"></span>
                    <span class="h2-2">病因与危险人群</span>
                    <span class="h2-3">展开</span>
                </p>
                <div class="disease-content">
                    <p class="conclusion">
                        <span>整个全马可能会带来一些肢体的伤痛，所以跑马的时候一定要准</span>
                        <img :src="require('src/assets/images/mobile/doctor/arrow-up.png')" />
                    </p>
                    <p class="disease-name"><img :src="require('src/assets/images/mobile/overview_zl/arr@3x.png')" class="slideup"/>肺与肺癌</p>
                    <p class="disease-name"><img :src="require('src/assets/images/mobile/overview_zl/arr@3x.png')" class="slideup"/>肺与肺癌</p>
                    <p class="disease-name cur">
                        <span class="triangle"></span>
                        <span class="disease-text">
                            <img :src="require('src/assets/images/mobile/overview_zl/arr@3x.png')" class="slideup"/>
                            肺与肺癌
                        </span>
                        <span class="new-icon"></span>
                    </p>
                    <p class="disease-name"><img :src="require('src/assets/images/mobile/overview_zl/arr@3x.png')" class="slideup"/>肺与肺癌</p>
                    <p class="disease-name"><img :src="require('src/assets/images/mobile/overview_zl/arr@3x.png')" class="slideup"/>肺与肺癌</p>
                    <p class="disease-name"><img :src="require('src/assets/images/mobile/overview_zl/page@3x.png')" class="art-icon"/>肺与肺癌</p>
                </div>
            </div> -->

      <!-- <div class="allarticle-knowledge" v-show="name === '乳腺癌'">
                <div class="knowledge" :style="pullUpStyle">
                    上拉进入<span class="disease">{{name + '知识图谱'}}</span>
                </div>
            </div> -->
    </div>
  </div>
</template>

<script>
import overviewZl from './overview_zl'
export default overviewZl
</script>

<style lang="scss" scoped>
@import "./overview_zl.scss";
</style>

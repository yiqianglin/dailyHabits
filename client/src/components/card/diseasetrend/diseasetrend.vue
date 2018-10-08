<template id="tpl_diseasetrend">
  <div class="diseasetrend">
    <div v-show="firstGuide" class="guide-mask"
         @touchmove.prevent.stop @click="hideGuide"/>
    <div v-if="showMode!=3" class="top-banner-wrp">
      <div v-if="name" :style="{backgroundImage:(baseInfo.image?('url('+baseInfo.image+')'):'')}" class="top-banner" @click="navToDDetail()">
        <div class="title">
          <p class="ellipsis">{{ name }}</p>
          <a :class="{followed:followed}" :ptag="followed ? 'ydd_content_followcancel' : 'ydd_content_follow'" class="follow"
             @click.prevent.stop="followClick"/>
        </div>
        <div v-if="alias" class="alias ellipsis">又称: {{ alias }}</div>
        <div v-if="baseInfo.op_review&&baseInfo.op_review.text" class="review">
          <div :class="{active:baseInfo.op_review.clickable == 1}" class="review-detail"
               @click.prevent.stop="toDoctor(baseInfo.op_review.doctor_id)">
            <i class="icon"/>{{ baseInfo.op_review.text||'' }}<i v-show="baseInfo.op_review.clickable == 1" class="arrow"/>
          </div>
        </div>
        <div v-if="baseInfo.op_summarys&&baseInfo.op_summarys.length>0&&showMode === 1" class="desc"
             @click.prevent.stop="navToDDetail()">
          <div v-for="item in baseInfo.op_summarys.slice(0,2)" :key="item" class="item ellipsis">{{ item }}</div>
          <div :class="{'old-mode':showMode === 1}" class="detail"
               @click.prevent.stop="navToDDetail('',baseInfo.allarticle?'tujie':'gaishu')">
            {{ baseInfo.allarticle?'图解':'详情' }}<i class="arrow"/>
          </div>
        </div>
        <div v-else class="detail no-desc"
             @click.prevent.stop="navToDDetail('',baseInfo.allarticle?'tujie':'gaishu')">
          {{ baseInfo.allarticle?'图解':'详情' }}<i class="arrow"/>
        </div>
        <div v-if="baseInfo.op_icon" class="img">
          <img :class="{'old-mode':showMode === 1,'new-mode':showMode !== 1}" :src="baseInfo.op_icon">
        </div>
      </div>
      <div v-show="firstGuide" class="top-banner-first-guide-mask"
           @touchmove.prevent.stop @click="hideGuide">
        <div class="top-point">
          <div class="hand"><img :src="require('src/assets/images/mobile/card/hand.png')" ></div>
          <div class="text">点击卡片进入疾病详情</div>
        </div>
      </div>
    </div>

    <div v-if="showMode === 0 || showMode ===2" class="tab-list no-top -radius">
      <ul>
        <li v-for="item in tabList" :key="item.name" class="item">
          <img :src="item.icon" alt="" class="icon">
          <p class="desc">{{ item.name }}</p>
          <a href="javascript:;" @click="navToDDetail(item.name, item.pinyin)"/>
        </li>
      </ul>
    </div>
    <ul v-if="activeList&&activeList.length>0 && showMode === 1" class="recommend-list">
      <li v-for="(item, index) in activeList" v-if="item.image" :key="index" @click="toRecommend(item)">
        <a><img :src="item.image"></a>
      </li>
    </ul>
    <ul v-if="activeList&&activeList.length>0 && showMode === 3" class="recommend-list mode3">
      <template v-if="activeList.length == 1">
        <li v-for="(item, index) in activeList" :key="index" class="only" @click="toRecommend(item)">
          <a href="javascript:;"><img :src="item.image"></a>
        </li>
      </template>
      <template v-else-if="activeList.length > 3">
        <li v-for="(item, index) in activeList.slice(0,4)" :key="index" class="two-line" @click="toRecommend(item)">
          <a href="javascript:;"><img :src="item.image"></a>
        </li>
      </template>
      <template v-else>
        <li v-for="(item, index) in activeList.slice(0,2)" :key="index" @click="toRecommend(item)">
          <a href="javascript:;"><img :src="item.image"></a>
        </li>
      </template>
      <!--  <li class="two-line">
                <a href="xxx"><img src="http://public-30017.sz.gfp.tencent-cloud.com/news.png"></a>
            </li>
            <li class="two-line">
                <a href="xxx"><img src="http://public-30017.sz.gfp.tencent-cloud.com/news.png"></a>
            </li>
            <li class="two-line">
                <a href="xxx"><img src="http://public-30017.sz.gfp.tencent-cloud.com/news.png"></a>
            </li>
            <li class="two-line">
                <a href="xxx"><img src="http://public-30017.sz.gfp.tencent-cloud.com/news.png"></a>
            </li> -->
    </ul>
    <!-- <paper :paperlist="paperList" :activelist="activeList" :toplist="topList" :show-mode="showMode" :rkey="reportKey" :loaded="loaded" :noempty="true"></paper> -->
    <template v-if="showMode===2 || showMode ===3">
      <topicdocs-c v-if="topic.length && paperList.length" :topic="topic" :name="name" :paperlistdis="paperList" :activelist="activeList" :toplistdis="topList" :show-mode="showMode" :noempty="true" :disloaded="loaded" :rkey="{article:'feeds_articleX',ad:'feeds_elementX',search: 'YDD_question_so|' + version, qa: 'qa_qax_clk',tag:'feeds_tag_clk',ignoreTag:'feeds_tag_close_clk'}" @topicclick="topictabclick"/>
    </template>
    <template v-else>
      <paper :paperlist="paperList" :activelist="activeList" :toplist="topList" :show-mode="showMode" :rkey="{article:'feeds_articleX',ad:'feeds_elementX',search: 'YDD_question_so|' + version, qa: 'qa_qax_clk',tag:'feeds_tag_clk',ignoreTag:'feeds_tag_close_clk'}" :loaded="loaded" :noempty="true" :name="name"/>
    </template>

    <!-- <transition name='bubble-tips' mode="out-in">
            <div class="bubble-tips" v-if="showBubbleTips" v-cloak @click="closeBubbleTips()">
                <div class="inner-wrp">
                    <span class="art">
                        分类查看，一目了然
                    </span>
                    <span class="close-btn"></span>
                </div>
            </div>
        </transition> -->
  </div>
</template>

<script>
import diseasetrend from './diseasetrend'
export default diseasetrend
</script>

<style lang="scss" scoped src="./diseasetrend.scss" />

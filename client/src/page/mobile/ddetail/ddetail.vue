<!-- 本页面若不带name参数将被nginx重定向至enter.html-->
<template>
  <div v-cloak id="main" class="container">
    <tmenu :name="name" :zindex="101" :backurl="backurl" @callback="tmenuCb" />
    <loading :show="!isShow" />
    <template v-if="isShow">
      <div class="crumb">
        <!-- <div class="btn-left" @click="goBack"></div> -->
        <ul class="content">
          <li v-for="(item, index) in overviews" :key="index" :class="tab == index ? 'active' : ''" @click="clickTab(index, 'topnav')">
            <a>{{ item.name }}</a>
          </li>
        </ul>
        <div class="btn-right" ptag="ydd_reviewnavbar_menu" @click="clickCate" />
      </div>
      <papertag-multiline-outter :tags="curTags.tags" :index="curTags.tagIndex" :fixed-status-from-parent="showFixPaperTag" :parent-dom="'.swiper-slide-active .block-paper'" :top-minus-dom="'.tmenu'" @tagclick="clickTag" />
      <div id="detail" class="detail" @click="showActionbar">
        <swiper :options="swiperOps">
          <swiper-slide v-for="(block,blockIndex) in overviews" :key="blockIndex">
            <div v-if="block.pinyin==='tujie'&&block.docMd" class="doc-md">
              <div class="ppt" v-html="block.docMd" />
              <div class="actionbar-static">
                <actionbar :ref="'actionbar' + block.pinyin" :options="actionOps" :pass="true" @callback="actionCb" />
              </div>
            </div>
            <div v-else-if="block.pinyin!=='tujie'&&block.tabData" class="block">
              <div class="main-content">
                <div :class="video && block.tabData.tid == 0 ? 'noborder' : (block.tabData.tid == 0 ? 'novideo' : '') " class="header">
                  <div class="title">
                    {{ block.tabData.op_tname }}
                  </div>
                </div>
                <div v-if="block.tabData.v_md_text" class="sumary md" v-html="block.tabData.v_md_text" />
                <template v-if="block.tabData.tid === 0 ">
                  <div v-if="block.tabData.v_md_text" class="sumary md" v-html="block.tabData.v_md_text" />
                  <template v-if="block.artlist&&block.artlist.length>0">
                    <div v-for="(art, index) in block.artlist" :key="index" class="tpl-6">
                      <div class="title">{{ art.title }}</div>
                      <div v-if="art.v_md_text" class="sumary md" v-html="art.v_md_text" />
                    </div>
                  </template>
                  <div v-if="block.tabData.tid == 0" class="tpl-0">
                    <div v-if="video" class="video-box">
                      <div v-show="isAutoPlay && showVideo" id="video" class="video" />
                      <div v-if="!isAutoPlay" class="hint">
                        <div class="video-mask" />
                        <div class="video-detail">
                          <span class="t1">{{ video.name }}</span>
                          <span class="t2">({{ video.time }})</span>
                        </div>
                        <img :src="video.image" class="preview">
                        <img :src="require('src/assets/images/mobile/ddetail/play.png')" class="net-tip" @click="play">
                      </div>
                    </div>
                    <div v-if="block.tabData.v_md_definition" class="sumary md" v-html="block.tabData.v_md_definition" />
                  </div>
                  <div v-if="block.tabData.tid == 1" class="tpl-1">
                    <template v-for="(subItem, subItemIdx) in block.data">
                      <div :key="subItemIdx" class="row">
                        <img :src="subItem.tabData.icon" class="icon">
                        <span class="t1">{{ subItem.tabData.key }}</span>
                        <span class="t2">{{ subItem.tabData.md_value }}</span>
                      </div>
                    </template>
                  </div>
                  <div v-if="block.tabData.tid == 8" class="tpl-8">
                    <div class="title">{{ block.tabData.title }}</div>
                    <div class="content">
                      <img :src="block.tabData.image">
                    </div>
                  </div>
                </template>
                <template v-if="block.artlist&&block.artlist.length>0">
                  <div v-for="(item, index) in block.artlist" :key="index" class="tpl-6">
                    <div class="title">{{ item.title }}</div>
                    <div v-if="item.v_md_text" class="sumary md" v-html="item.v_md_text" />
                  </div>
                </template>
                <div v-if="references && references.length" class="reference-doc">
                  <p class="references-title">
                    <span class="name">参考文献</span>
                    <span class="count">（{{ references.length }}篇）</span>
                    <span v-if="references.length > 1" :ptag="!allReferences ? 'reference_close' : 'reference_open'" class="action" @click="allReferences = !allReferences">展开全部</span>
                  </p>
                  <p v-for="(item, index) in (allReferences ? references : references.slice(0, 1))" :key="index" :class="{ellipsis: !allReferences}">
                  <span class="reference-index">[{{ index + 1 }}]</span>{{ item }}</p>
                </div>
                <div v-if="edits.length>0" class="compile-records">
                  <ul>
                    <li v-for="(item,index) in (editUp?edits:edits.slice(0,1))" :key="index">
                      <i :class="{circle:index===0}" class="ring" />
                      <span class="mr10">{{ item.name }}</span>
                      <span class="name">{{ item.desc }}</span>
                      <span>{{ item.time }}</span>
                    </li>
                  </ul>
                  <i v-if="edits.length>1" :class="{up:editUp}" class="arrow" @click="editUpClk" />
                </div>
                <div v-if="block.tabData.op_keyword && block.tabData.op_keyword.length" class="block-tags">
                  <span v-for="item in block.tabData.op_keyword.slice(0, 3)" :key="item" class="item" @click="searchByTag(item)">{{ item }}</span>
                </div>
              </div>
              <div class="actionbar-static">
                <actionbar :ref="'actionbar' + block.pinyin" :options="actionOps" :pass="true" @callback="actionCb" />
              </div>
              <div v-if="curTags&&search_lib!=='healthwise'" :class="{loaded: curTags.loaded}" class="block-paper">
                <papertag-multiline :tags="curTags.tags" :index="curTags.tagIndex" :parent-dom="'.swiper-slide-active .block-paper'" :top-minus-dom="'.tmenu'" @tagclick="clickTag" @fixedStatusOnChange="fixedStatusOnChange" />

                <paper :paperlist="curTags.list.slice(0, curTags.docUpper)" :loaded="curTags.loaded" :noloading="true" :rkey="{article:'ddetail_related_articlex'}" />
                <div v-if="!curTags.loaded && curTags.list.length" class="footer">
                  展开更多
                  <img :src="require('src/assets/images/mobile/doctor/arrow-down.png')" class="arrow">
                  <a class="btn-link" href="javascript:void(0);" ptag="reviewdetail_exp" @click="clickTag(-1)" />
                </div>
              </div>
            </div>
            <div v-else class="loading">正在加载。。。</div>
          </swiper-slide>
        </swiper>
      </div>
      <div class="actionbar-hidden">
        <actionbar ref="actionbar" :options="actionOps" @callback="actionCb" />
      </div>
      <transition name="mask">
        <div v-show="showCate" class="mask" @click="clickMask" @touchmove.prevent/>
      </transition>
      <transition name="cate" @after-leave="reShowVideo">
        <div v-show="showCate" class="cate" @touchmove.prevent>
          <div class="cate-header">
            <div class="title">目录</div>
            <img :src="require('src/assets/images/mobile/article/close.png')" class="close" @click="closeCate">
          </div>
          <div class="border-bottom" />
          <div class="cate-content">
            <div v-for="(item, index) in overviews" :key="index" class="item" @click="clickTab(index, 'cate')">
              <img :src="item.icon">
              <div class="text">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </transition>
      <depressiontest :show="name==='抑郁症'" />
      <active-banner v-if="activeOps" :options="activeOps" />

      <source-disclaimer :sourceid="showClaimer ? 2 : 3" />

      <div v-if="!isHideDetailGuide" class="guide" ptag="ydd_content_guideok" @click="guideClick" @touchmove.prevent>
        <div class="inner">
          <div class="t1">区域内左右滑动</div>
          <div class="">可切换目录</div>
          <img :src="require('src/assets/images/mobile/ddetail/arrow.png')" class="arrow">
          <img :src="require('src/assets/images/mobile/ddetail/hand.png')" class="hand slide">
        </div>
      </div>
      <annotation :setannotation="setannotation" :references="references" dom=".swiper-slide-active" topnav=".crumb" />
      <imgviewer :setimgviewer="setimgviewer" dom=".swiper-slide-active" />
    </template>
  </div>
</template>

<script>
import ddetail from './ddetail'
export default ddetail
</script>

<style lang="scss" scoped>
@import "./ddetail.scss";
</style>

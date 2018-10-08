<template>
  <div v-cloak class="container">
    <tmenu v-show="!showIntroPanel" :name="menuTitle" :stag="name" @callback="tmenuCb" />
    <loading :show="!show" />
    <template v-show="show">
      <!-- 一级标签列表，单个不显示 -->
      <div v-if="tags && tags.length > 1" v-show="!showIntroPanel" class="tags">
        <ul class="tag-list">
          <li v-for="(tag, index) in tags" :key="index" :class="{active: tagIndex === index}">
            <span>{{ tag.name }}</span>
            <a href="javascript:;" class="btn-link" ptag="recommend_articletab_tag_clk" @click="clickTag(index)" />
          </li>
        </ul>
      </div>
      <!-- 吸顶二级标签列表，卡片版肿瘤页单个不显示 -->
      <papertag-multiline-outter v-if="tags[tagIndex] && tags[tagIndex].children && tags[tagIndex].children.length && !(src === 'cancer' && tags[tagIndex].children.length === 1)&&!showIntroPanel" :tags="tags[tagIndex].children" :index="tags[tagIndex].tagIndex" :fixed-status-from-parent="showFixPaperTag" :parent-dom="'.container'" :top-minus-dom="'.tmenu'" @tagclick="clickTagL2" />
      <!-- 标签内容区 -->
      <div :class="{'with-tag': tags && tags.length > 1, 'with-fix-intro': showIntroPanel }" class="tag-content">
        <swiper v-if="swiperOps" :options="swiperOps">
          <swiper-slide v-for="(tag, index) in tags" :key="index">
            <div :id="'doc_'+index">
              <!-- 内联二级标签列表，卡片版肿瘤页单个不显示 -->
              <papertag-multiline v-if="tag.children && tag.children.length && !(src === 'cancer' && tag.children.length === 1)&&!showIntroPanel" :tags="tag.children" :index="tag.tagIndex" :parent-dom="'#doc_'+index" :top-minus-dom="'.tmenu'" :is-expand="true" @tagclick="clickTagL2" @fixedStatusOnChange="fixedStatusOnChange" />
              <!-- 蒙层 -->
              <div v-show="showIntroPanel" class="mask swiper-no-swiping" @click="showIntroPanel=false" />
              <!-- 选择标签的简介卡片 -->
              <div v-if="tag.intro&&tag.intro.descinfo" :class="[showIntroPanel ? 'swiper-no-swiping' : '']" :style="{paddingBottom:tag.intro.descinfo.length>120?'':'.34rem'}" class="intro-panel">
                <p v-if="tag.intro.title" class="intro-title">{{ tag.intro.title }}</p>
                <div class="intro-content-wrp">
                  <div class="intro-content-inner" v-html="tag.intro.descinfo.length>120&&!showIntroPanel?tag.intro.descinfo.substr(0,120)+'...':tag.intro.descinfo" />
                </div>
                <a v-if="tag.intro.descinfo.length>120" :class="{'arrow-up':showIntroPanel}" class="arrow" @click="introPanelChange" />
              </div>
              <!-- 文章列表分区 -->
              <template v-if="tag.topdocs&&tag.topdocs.length">
                <div :style="{marginTop:tag.intro&&tag.intro.descinfo?'':'0px'}" class="doc-title">必读精选</div>
                <paper :paperlist="tag.topdocs" :rkey="{article:'tag_list_articlex'}" :noloading="true" :class="{'swiper-no-swiping':showFixPaperTag}" />
                <div v-if="tag.docs&&tag.docs.length" class="doc-title">延展阅读</div>
              </template>
              <paper :paperlist="tag.docs" :rkey="{article:'tag_list_articlex'}" :loaded="tag.loaded" :class="{'swiper-no-swiping':showFixPaperTag}" />
            </div>
          </swiper-slide>
        </swiper>
      </div>

      <template v-if="pickerBtnShow">
        <a href="javascript:;" class="btn-select" @click="showPicker('selectorpad_list_clk')">
          选择疾病阶段
        </a>
        <!-- 滚轮选择器 -->
        <popup v-model="pickerShow" position="bottom">
          <div class="filters-picker">
            <div class="picker-header">
              <span class="reset-btn" @click="resetPicker">
                重置
              </span>
              请选择疾病类型或分期
              <span class="confirm-btn" @click="showPicker('selectorpad_list_confirm')">
                确定
              </span>
            </div>
            <picker v-if="filterList && filterList.length" ref="picker" :slots="filterSlots" :value-key="'label'" @change="changePicker" />
            <div v-else class="picker-loading">{{ filterLoading ? '筛选器加载中...' : '无' }}</div>
          </div>
        </popup>
      </template>
    </template>
  </div>
</template>

<script>
import tagArticle from './tag_article'
export default tagArticle
</script>

<style lang="scss" scoped>
@import "./tag_article.scss";
</style>

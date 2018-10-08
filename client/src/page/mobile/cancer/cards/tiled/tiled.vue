<template>
  <!-- 平铺型卡片 -->
  <div class="card-wrapper">
    <p class="card-title">{{ name }}</p>
    <p v-if="hint" class="card-hint">
    <span class="emphasis">温馨提示：</span>{{ hint }}</p>
    <template v-for="(cate, index) in treetags">
      <!-- 一级分类 -->
      <div v-if="cate.type === 0" :key="index" class="cate-l1-item">
        <!-- 一级标题 -->
        <p class="cate-l1-title">{{ cate.label }}</p>
        <!-- 一级标签 -->
        <tag :options="{type: 0, activeIdx: cateIdx === index ? cate.activeIdx : -1, tags: cate.treetags}" class="tags-l1" @clk="(tag, tagIdx) => {selectTag(cate, index, tagIdx)}" />
        <!-- 一级标签点击后展开内容 -->
        <!-- <div v-for="(item, tagIdx) in cate.treetags" v-show="cateIdx === index && cate.activeIdx === tagIdx" :key="tagIdx" class="tag-l1-block">
          <!- - 二级分类 - ->
          <div v-if="item.treetags && item.treetags.length" class="cate-l2-item">
            <!- - 二级标题 - ->
            <p class="cate-l2-title">{{ item.label }}</p>
            <!- - 二级标签 - ->
            <tag :options="{type: 2, tags: item.treetags}" class="tags-l2" @clk="(tag, tagIdx) => {clickTag(cate, item, tag)}" />
          </div>
          <!- - 不展示详情，直接跳至列表 - ->
          <!- - 一级标签详情 - ->
          <!- - <div v-else class="tag-l1-detail" @click="clickTag(cate, item)">
            <p class="tag-l1-title">{{ item.label }}</p>
            <p class="tag-l1-desc">{{ item.desc }}</p>
          </div> - ->
        </div> -->
      </div>
    </template>
    <!-- 直达型入口 -->
    <entry v-if="entryList && entryList" :options="{disease: disease, cate: name, list: entryList}" />
  </div>
</template>

<script>
import tiled from './tiled'
export default tiled
</script>

<style lang="scss" scoped src="./tiled.scss" />

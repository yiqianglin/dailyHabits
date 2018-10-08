<template>
  <!-- 带筛选器卡片 -->
  <div class="card-wrapper">
    <p class="card-title">{{ name }}</p>
    <p v-if="hint" class="card-hint">{{ hint }}</p>
    <!-- 下拉型筛选器 -->
    <!-- <div v-if="filters && filters.some(f => f.type === 1)" class="filters-inline">
      <div v-for="(item, index) in filters.filter(f => f.type === 1)" :key="item.title" class="filters-group">
        <multi-select v-model="item.value" :options="item.tags" :placeholder="'请选择' + item.label" :custom-label="filterLabel" :show-labels="false" :searchable="false" :allow-empty="false" deselect-label="" select-label="" selected-label="" open-direction="bottom" @input="(op, id) => {filterSelected(index, op, id)}" />
      </div>
    </div>
    <p v-if="filterBrief && filterBrief.desc" class="filter-brief" @click="clickFilterBrief(filterBrief)">{{ filterBrief.desc }}
      <span class="more">了解更多…</span>
    </p> -->
    <div class="filters-select">
      <div v-if="filters.every(f => (f.type === 1 && f.value && new RegExp(/^全部/).test(f.value.label)) || f.type === 0)" class="btn-select" @click="showPicker('selector_clk')">点击选择疾病阶段</div>
      <div v-else class="select-detail">
        <p class="filters-title">
          <span v-for="(item, index) in filters.filter(f => f.type === 1)" v-if="item.value" :key="index">{{ item.value.label }}</span>
        </p>
        <p v-if="filterBrief && filterBrief.desc" class="article-title" @click="showArticle">{{ filterBrief.desc }}
          <span v-if="filterBrief.docid" class="article-more">快速了解</span>
        </p>
        <div class="btn-change" @click="showPicker('selector_change')">更改</div>
      </div>
    </div>
    <div v-if="filters && filters.some(f => f.type === 0)" class="filters-block">
      <!-- 标签型筛选器 -->
      <div v-for="(item, index) in filters.filter(f => f.type === 0)" :key="item.label" class="cate-l1-item">
        <!-- 一级标题 -->
        <p class="cate-l1-title">{{ item.label }}</p>
        <!-- 一级标签 -->
        <tag :options="{type: 0, activeIdx: item.activeIdx, tags: item.tags}" class="tags-l1" @clk="(tag, tagIdx) => {selectTag(item, index, tagIdx)}" />
      </div>
    </div>
    <!-- <div v-for="cate in treetags" v-if="cate.treetags && cate.treetags.length" :key="cate.label">
      <template v-if="cate.type === 0">
        <!- - 二级分类 - ->
        <div v-for="item in cate.treetags" :key="item.label" class="cate-l2-item">
          <!- - 二级标题 - ->
          <p class="cate-l2-title">{{ item.label }}</p>
          <!- - 二级标签 - ->
          <tag :options="{type: 3, tags: item.treetags}" class="tags-l2" @clk="(tag, tagIdx) => {clickTag(cate, item, tag)}" />
        </div>
      </template>
    </div> -->
    <div v-for="cate in treetags" v-if="cate.treetags && cate.treetags.length" :key="cate.label">
      <template v-if="cate.type === 0">
        <!-- 二级分类 -->
        <tag :options="{type: 5, tags: cate.treetags}" class="tags-l2" @clk="(tag, tagIdx) => {clickTag(cate, tag)}" />
      </template>
    </div>
    <!-- 直达型入口 -->
    <entry v-if="entryList && entryList" :options="{disease: disease, cate: name, list: entryList}" />
    <!-- 滚轮选择器 -->
    <popup v-model="pickerShow" position="bottom">
      <div v-if="filters && filters.length" class="filters-picker">
        <!-- <scroll-picker :columns="filters.filter(f => f.type === 1)" :column-title="'label'" :column-selected="'value'" :option-title="'label'" :column-option="'tags'" title="请选择疾病类型或分期" @on-reset="resetPicker" @on-select="filterSelected" /> -->
        <div class="picker-header">
          <span class="reset-btn" @click="resetPicker">
            重置
          </span>
          请选择疾病类型或分期
          <span class="confirm-btn" @click="showPicker('selectorpad_confirm')">
            确定
          </span>
        </div>
        <picker ref="picker" :slots="filterSlots" :value-key="'label'" @change="changePicker" />
      </div>
    </popup>
    <!-- 文章 - 快速了解 -->
    <popup v-model="articleShow" position="bottom">
      <div v-if="article && articleShow" class="filter-article">
        <div class="title">{{ article.title }}
          <span class="close" @click="showArticle" />
        </div>
        <div class="content md" v-html="article.md_text" />
      </div>
    </popup>
    <!-- toast -->
    <!-- <transition name="slide-toast-fade">
      <div v-show="toastShow" class="toast-no-content">
        <span class="icon" />
        <p>无内容</p>
        <p>请修改筛选条件</p>
      </div>
    </transition> -->
  </div>
</template>

<script>
import filter from './filter'
export default filter
</script>

<style lang="scss" scoped src="./filter.scss">
</style>

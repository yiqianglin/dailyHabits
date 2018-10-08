<template>
  <div class="disease-container">
    <div class="disease-wrapper" @click="toOverview(item)">
      <p class="brief">
        <span class="name" v-html="$options.filters.highLight(item.name, keywords)" />
        <span v-if="item.alias && item.alias.length" class="alias" v-html="$options.filters.highLight('（' + item.alias[0] + '）', keywords)" />
      </p>
      <p :class="{'two-clamp': item.symptoms && item.symptoms.length}" class="desc" v-html="$options.filters.highLight(item.summary, keywords)" />
      <ul v-if="item.symptoms && item.symptoms.length" class="tag-list">
        <li v-for="(tag, index) in item.symptoms" :key="index" v-html="$options.filters.highLight(tag, keywords)" />
      </ul>
      <div v-if="item.tabs && item.tabs.length" class="disease-tabs">
        <div v-for="item in item.tabs" :key="item.tab" class="disease-tab" @click.stop="toDdetailTab(item)">
          <img v-if="item.entry === 'zhengzhuang'" :src="require('src/assets/images/mobile/search/zhengzhuang.png')">
          <img v-else-if="item.entry === 'bingyin'" :src="require('src/assets/images/mobile/search/bingyin.png')">
          <img v-else-if="item.entry === 'zhiliao'" :src="require('src/assets/images/mobile/search/zhiliao.png')">
          <img v-else :src="require('src/assets/images/mobile/search/gaishu.png')">
          <p class="name" v-html="$options.filters.highLight(item.tab, keywords)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cardNote from './card_disease'
export default cardNote
</script>

<style lang="scss" scoped>
@import "./card_disease.scss";
</style>

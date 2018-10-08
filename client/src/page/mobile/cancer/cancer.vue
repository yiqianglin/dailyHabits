<template>
  <div v-cloak class="container">
    <tmenu :name="name" :issearchbar="true" @callback="tmenuCb" />
    <loading :show="!show"/>
    <!-- 疾病题头卡片 -->
    <template v-show="show">
      <card-disease v-if="diseaseOps" :options="diseaseOps" class="card-disease" />
      <div v-for="(card, cardIdx) in tree" v-if="card.treetags && card.treetags.length" :key="cardIdx">
        <!-- 运营区卡片 -->
        <card-active v-if="activeMap && activeMap[cardIdx]" :options="{disease: name, list: activeMap[cardIdx]}" />
        <!-- 组合卡片 -->
        <div v-if="card.treetags.length > 1" :id="'group' + card.id" class="card-tab">
          <p class="card-tab-title">{{ card.label }}</p>
          <!-- 卡片tab -->
          <div class="tab-wrapper">
            <ul class="tab-list">
              <li v-for="(item, index) in card.treetags" :key="index" :class="{active: card.activeIdx === index}" :ptag="'onco_cardcancer_cardx:'+item.label" class="tab-item" @click="clickTab(card, index)">
                <span>{{ item.label }}</span>
                <a href="javascript:" class="btn-link" />
              </li>
            </ul>
          </div>
          <!-- 卡片内容 -->
          <div v-for="(item, index) in card.treetags" v-show="card.activeIdx === index" :key="index" class="tab-block">
            <card-tiled v-if="item.type === 1" :options="{disease: name, card: item}" />
            <card-filter v-if="item.type === 2" :options="{disease: name, card: item}" />
            <card-tree v-if="item.type === 3" :options="{disease: name, card: item}" />
          </div>
        </div>
        <template v-else>
          <!-- 平铺型卡片 -->
          <card-tiled v-for="(item, index) in card.treetags" v-if="item.type === 1" :key="index" :options="{disease: name, card: item}" class="card-tiled" />
          <!-- 带筛选器卡片 -->
          <card-filter v-for="(item, index) in card.treetags" v-if="item.type === 2" :key="index" :options="{disease: name, card: item}" class="card-filter" />
          <!-- 目录型卡片 -->
          <card-tree v-for="(item, index) in card.treetags" v-if="item.type === 3" :key="index" :options="{disease: name, card: item}" class="card-tree" />
        </template>
      </div>
      <!-- 运营区卡片 -->
      <card-active v-for="(item, index) in activeMap" v-if="index >= tree.length" :key="index" :options="{disease: name, list: item}" />
    </template>
  </div>
</template>

<script>
import cancer from './cancer'
export default cancer
</script>

<style lang="scss" scoped>
@import "./cancer.scss";
</style>

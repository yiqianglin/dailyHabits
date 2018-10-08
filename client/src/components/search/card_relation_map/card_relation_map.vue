<template>
  <div v-if="item" class="card-container">
    <div class="card-wrapper">
      <div class="card-answer">
        <!-- <p v-if="item.query" class="title" v-html="$options.filters.highLight(item.query, item.highlight)" /> -->
        <div class="answer-content">
          <div v-if="item.answer && item.answer.length === 1" class="answer-para" v-html="$options.filters.highLight(item.answer[0], item.highlight)" />
          <ul v-else-if="item.answer && item.answer.length > 1" class="answer-list">
            <li v-for="(answer, index) in item.answer" :key="index" v-html="$options.filters.highLight(answer, item.highlight)" />
          </ul>
        </div>
      </div>
      <div v-if="item.doc && item.doc.docid && item.doc.title" class="card-article">
        <p class="header">来源</p>
        <div class="content" @click="toArticle">
          <p class="title">{{ item.doc.title }}</p>
          <author :item="item.doc" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cardRelationMap from './card_relation_map'
export default cardRelationMap
</script>

<style lang="scss" scoped>
@import "./card_relation_map.scss";
</style>

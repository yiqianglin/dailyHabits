<template>
  <div class="container">
    <tmenu name="名词解释" @callback="tmenuCb" />
    <div class="note-list">
      <div v-for="(item, index) in noteList" :key="item.name + index" class="note-item">
        <div v-show="noteIdx !== index" :ptag="'ydd_list_searchmorenotex_clk:' + item.name" class="note-header" @click="noteClick(item, index)">
          <p class="name">{{ item.name }}
            <span v-if="item.alias && item.alias.length" class="alias">（{{ item.alias[0] }}）</span>
          </p>
          <p class="desc">{{ item.note }}</p>
        </div>
        <div v-show="noteIdx === index" class="note-detail">
          <p class="name ellipsis">{{ item.name }}</p>
          <p v-if="item.alias && item.alias.length" class="alias ellipsis">（{{ item.alias[0] }}）</p>
          <p class="desc">{{ item.note }}</p>
          <div v-if="item.doc && item.doc.title" class="recommend">
            <p class="title">深入了解</p>
            <paper :paperlist="[item.doc]" :rkey="{article: 'ydd_list_searchnotearticlex_clk:' + item.name}" />
          </div>
        </div>
      </div>
    </div>
    <p v-show="!loaded" class="more" @click="moreClick">查看更多</p>
  </div>
</template>

<script>
import noteExplain from './note_explain'
export default noteExplain
</script>

<style lang="scss" scoped>
@import "./note_explain.scss";
</style>

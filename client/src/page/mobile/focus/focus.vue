<template>
  <div v-cloak class="container">
    <div id="focus-list">
      <tmenu name="我的关注" @callback="tmenuCb" />
      <div class="list-body">
        <template v-for="(item, index) in followList">
          <div :key="index" class="list-item" @click="followClick(item.disease, item.released,item.type, index, item.newDocs.length != 0 ? item.newDocs[0]['docid'] : false)">
            <div class="list-item-title">{{ item.disease }}</div>
            <div v-if="item.op_tips" class="list-item-detail">{{ item.op_tips }}</div>
            <div v-if="!item.op_tips && item.newDocs.length != 0" class="list-item-detail">新增了文章《{{ item.newDocs[0]['title'] }}》</div>
          </div>
        </template>
      </div>
      <div v-if="!isShow" class="empty">您还没有关注的疾病</div>
    </div>
  </div>
</template>

<script>
import focus from './focus'
export default focus
</script>

<style lang="scss" scoped>
@import "./focus.scss";
</style>

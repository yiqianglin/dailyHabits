<template>
  <div v-cloak class="container">
    <div id="favorite-list">
      <tmenu name="我的收藏" @callback="tmenuCb" />
      <loading :show="!loaded"/>
      <div v-if="loaded" class="list-body">
        <template v-if="tlist&&tlist.length>0">
          <div v-for="(item, index) in tlist" :key="index" class="paper-item">
            <div class="info">
              <div class="title">{{ item.title }}</div>
              <div class="desc" v-html="(item.tid===10?item.text:item.md_text)||item.text||''"/>
            </div>
            <div v-if="(item.tid===10&&item.image)||(item.tid===4&&item.op_image)" class="img">
              <img :src="item.op_image||item.image" class="img">
            </div>
            <a class="btn-link" href="javascript:void(0);" @click="toArticle(item.docid,index)" />
          </div>
        </template>
        <div v-else class="empty">您还没有收藏的文章</div>
      </div>
    </div>
  </div>
</template>

<script>
import favorite from './favorite'
export default favorite
</script>

<style lang="scss" scoped>
@import "./favorite.scss";
</style>

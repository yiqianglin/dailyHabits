<template>
  <div v-show="!ishide" v-cloak :style="{zIndex:zindex?zindex:3}" class="tmenu">
    <a v-show="!(from==='tanyi')" class="back" href="javascript:void(0);" @click="toBack()" />
    <a v-show="issearchbar&&searchBar && !(from==='tanyi')" class="search-bar" href="javascript:void(0);" @click="toSearch">
      <span>搜索</span>
    </a>
    <p v-show="!(from==='tanyi') && !(issearchbar&&searchBar)" :style="{paddingLeft:nosearch?'':'.56rem'}" class="name ellipsis">
      <slot name="title">{{ name }}</slot>
    </p>
    <p v-show="(from==='tanyi')" class="name ">科普·{{ name }}</p>

    <a v-show="!nosearch&&!(issearchbar&&searchBar) && !(from==='tanyi')" class="search search-input-trigger" href="javascript:void(0);" @click="toSearch" />
    <a v-show="!(from==='tanyi')&&!nomore" class="more" href="javascript:void(0);" @click.stop="showMore = !showMore" />
    <!-- <transition name="fade"> -->
    <div v-show="showMore && !(from==='tanyi')&&!nomore" class="more-btn">
      <div v-show="!nomy" class="item my" href="javascript:void(0);" @click="toMy()">我的</div>
      <div class="item index" href="javascript:void(0);" @click="toIndex()">首页</div>
    </div>
    <!-- </transition> -->
  </div>
</template>

<script>
import tmenu from './tmenu'
export default tmenu
</script>

<style lang="scss" scoped src="./tmenu.scss" />

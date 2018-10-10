<template>
  <div class="home_nav">
    <ul class="home_nav_list" ref="homenav">
      <router-link 
        v-for="(item, index) in nav" 
        class="home_nav_item" 
        :key="index"
        :to="item.url + '/' +item.type"
        tag="li">{{item.text}}</router-link>
    </ul>
  </div>
</template>

<script>
import newsNav from './newsNav'
export default newsNav
</script>

<style lang="scss" scoped src="./newsNav.scss" />

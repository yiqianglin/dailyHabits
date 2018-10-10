<template>
  <div class="home_nav">
    <ul ref="homenav" class="home_nav_list">
      <router-link
        v-for="(item, index) in nav"
        :key="index"
        :to="item.url + '/' +item.type"
        class="home_nav_item"
        tag="li">{{ item.text }}</router-link>
    </ul>
  </div>
</template>

<script>
import newsNav from './newsNav'
export default newsNav
</script>

<style lang="scss" scoped src="./newsNav.scss" />

<template>
  <div class="header home_header">
    <span class="logo" />
    <router-link to="/search" tag="div" class="search">
      <i type="ios-search" class="search_icon" />
      <div class="search_input">搜索...</div>
    </router-link>
    <div ref="refresh" class="refresh_icon">
      <i type="android-refresh" color="green" />
    </div>
  </div>
</template>

<script>
import appNav from './appNav'
export default appNav
</script>

<style lang="scss" scoped src="./appNav.scss" />

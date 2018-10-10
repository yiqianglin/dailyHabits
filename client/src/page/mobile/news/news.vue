<template>
  <div v-cloak class="container">
    <news-nav></news-nav>
    <div>
    sss
    {{ $route.params }}      
    </div>

  </div>
</template>

<script>
import news from './news'
export default news
</script>

<style lang="scss" scoped>
@import "./news.scss";

</style>

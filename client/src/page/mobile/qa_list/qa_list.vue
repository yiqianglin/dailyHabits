<template>
  <div v-cloak class="container">
    <div v-cloak id="qa-main">
      <tmenu :name="title" @callback="tmenuCb" />
      <div class="qa-list">
        <paper :paperlist="qaList" :loaded="loaded" ishotqa="true" />
      </div>
    </div>
  </div>
</template>

<script>
import qaList from './qa_list'
export default qaList
</script>

<style lang="scss" scoped>
@import "./qa_list.scss";
</style>

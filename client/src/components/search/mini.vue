<template lang="pug">
  include search.pug
  +search('mini')
</template>

<script>
import mini from './mini'
export default mini
</script>

<style lang="scss" scoped>
@import "./search.scss";
</style>

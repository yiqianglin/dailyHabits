<template lang="pug">
  include search.pug
  +search('full')
</template>

<script>
import full from './full'
export default full
</script>

<style lang="scss" scoped>
@import "./search.scss";
</style>

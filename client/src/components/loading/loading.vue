<template>
  <div v-if="show" :style="{top:top||''}" class="loading">
    <div class="loading-area">
      <i class="loading-icon"/>
    </div>
  </div>
</template>

<script>
import loading from './loading'
export default loading
</script>

<style lang="scss" scoped src="./loading.scss" />

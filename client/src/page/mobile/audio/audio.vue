<template>
  <div v-cloak class="container">
    <div id="main">
      <tmenu :name="name" :stag="name" zindex="100" @callback="tmenuCb" />
      <div class="page-header">
        {{ name }}语音专栏
      </div>
      <paper :paperlist="docList" :loaded="loaded" />
    </div>
  </div>
</template>

<script>
import audio from './audio'
export default audio
</script>

<style lang="scss" scoped>
@import "./audio.scss";
</style>

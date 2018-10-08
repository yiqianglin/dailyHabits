<template>
  <div v-cloak class="container">
    <div class="overview_wm">
      <tmenu :issearchbar="true" :name="name" stag="WebMD" @callback="tmenuCb" />
      <div class="disease">
        <div class="title">{{ name }}</div>
        <div v-if="configflag!==1" :tourl="getOverview()" class="enter" ptag="ydd_webmdarti_goto">进入词条</div>
      </div>
      <topicdocs :topic="topic" :name="name" :rkey="{article:'YDD_WebMDArti_ArticleX'}" tag="WebMD" />
    </div>
  </div>
</template>

<script>
import overviewWm from './overview_wm'
export default overviewWm
</script>

<style lang="scss" scoped>
@import "./overview_wm.scss";
</style>

<template id="tpl_imgviewer">
  <div id="tplImgviewer" :class="{show: show}" class="imgviewer"
       @touchmove.prevent>
    <div class="viewbox" @click="hideImgviewer">
      <div class="prevent"/>
      <div class="images">
        <template v-for="(img, index) in images">
          <img v-show="showKey == img.key" :key="index" :src="img.src">
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import imgviewer from './imgviewer'
export default imgviewer
</script>

<style lang="scss" scoped src="./imgviewer.scss" />

<template id="tpl_papertag">
  <div class="papertag-wrp papertag-wrp-inner">
    <div :style="placeHolderStyle" class="place-holder" />
    <!-- <div v-if="!fixedStatus && tags && tags.length" :class="{fixed: fixedStatus}" :style="fixedStyle" class="papertag"> -->
    <div v-if="tags && tags.length" :class="{'fixed': fixedStatus, 'one-line': oneLine}" :style="fixedStyle" class="papertag">
      <ul :class="{'auto-height': expandStatus && !fixedStatus}">
        <li v-for="(item, tagIndex) in tags.slice(0, 10)" :key="item.name" :class="{active: activeIndex === tagIndex}" @click="tagClick(tagIndex)">
          {{ item.name.length > 10 ? item.name.substr(0, 9) + '...' : item.name }}
        </li>
      </ul>
      <!-- 非吸顶显示箭头 && 非单行模式 -->
      <i v-if="showExpandIcon && !fixedStatus && !oneLine" :class="{up: expandStatus}" class="arrow" @click="toggleExpand" />
    </div>
  </div>

</template>

<script>
import multiLine from './multiLine'
export default multiLine
</script>

<style lang="scss" scoped>
@import "./multiLine.scss";
</style>

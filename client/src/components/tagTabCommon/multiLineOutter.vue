<template id="tpl_papertag">
  <div v-show="fixedStatusFromParent" class="papertag-wrp papertag-wrp-outter">
    <div v-if="tags && tags.length" :class="{fixed: fixedStatusFromParent}" class="papertag">
      <ul>
        <li v-for="(item, tagIndex) in tags.slice(0, 10)" :key="item.name"
            :class="{active: activeIndex === tagIndex}"
            @click="tagClick(tagIndex)">
          {{ item.name.length > 10 ? item.name.substr(0, 9) + '...' : item.name }}
        </li>
      </ul>
    </div>
  </div>

</template>

<script>
import multiLineOutter from './multiLineOutter'
export default multiLineOutter
</script>

<style lang="scss" scoped>
  @import './multiLine.scss';
</style>

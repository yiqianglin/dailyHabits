<template id="tpl_papertag">
  <div id="topicWrap" class="papertag">
    <div v-if="tags&&tags.length>1" :class="fixedStatusFromParent?'tabs-row':'tabs'" class="tab-wrap">
      <div v-for="(item, index) in tags.slice(0,fixedStatusFromParent?tags.length:8)" :key="index" :class="{ active: activeIndex === index, update: !item.readflag}" class="item" @click="tagClick(index)">
        <span>{{ (item.name||'').substr(0,5) }}</span>
        <a href="javascript:;" class="btn-link"/>
      </div>
    </div>
  </div>

</template>

<script>
import twoLine from './twoLine'
export default twoLine
</script>

<style lang="scss" scoped>
  @import './twoLine.scss';
</style>

<template id="tpl_papertag">
  <div v-if="tags && tags.length" class="papertag">
    <ul :class="{'auto-height': expand}">
      <li v-for="(item, tagIndex) in tags" :key="tagIndex" :class="{active: index === tagIndex}" @click="tagClick(tagIndex)">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
import papertag from './papertag'
export default papertag
</script>

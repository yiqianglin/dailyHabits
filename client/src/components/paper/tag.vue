<template id="tpl_tag">
  <ul v-if="tags && tags.length > 0" class="item-tags">
    <li v-for="(item, index) in tags.slice(0,3)" :key="index">{{ item }}</li>
  </ul>
</template>

<script>
export default {
  // props: ['tags']
  props: {
    tags: {
      type: Array,
      default () { return [] }
    }
  }
}
</script>

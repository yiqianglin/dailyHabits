<template>
  <div class="note-container">
    <div class="note-wrapper" @click="toWord">
      <p class="brief">
        <span class="names ellipsis">
          <span class="name" v-html="$options.filters.highLight(item.name, keywords)" />
          <span v-if="item.alias && item.alias.length" class="alias" v-html="$options.filters.highLight('（' + item.alias[0] + '）', keywords)" />
        </span>
        <span v-if="count > 1" class="count">共计{{ count }}条内容</span>
      </p>
      <p class="desc" v-html="$options.filters.highLight(item.note, keywords)" />
    </div>
  </div>
</template>

<script>
import cardNote from './card_note'
export default cardNote
</script>

<style lang="scss" scoped>
@import "./card_note.scss";
</style>

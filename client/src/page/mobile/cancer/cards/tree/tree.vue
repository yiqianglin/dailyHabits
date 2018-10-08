<template>
  <!-- 目录型卡片 -->
  <div class="tree-wrapper">
    <!-- 卡片头部 -->
    <div :class="{'only': !hint}" class="card-title">{{ name }}</div>
    <div v-if="hint" class="card-hint">{{ hint }}</div>

    <ul v-if="treetags && treetags.length" class="tags-l1">
      <li v-for="tagL1 in treetags" :key="tagL1.label" class="tag-l1" @click="clickTagL1(tagL1)">
        <p :class="tagL1.treetags && tagL1.treetags.length ? (tagL1.foldflag ? 'fold-collapse' : 'fold-expand') : 'unfoldable'" class="tag-l1-title">
          {{ tagL1.label }}
          <!-- <span v-if="bookmarkL1 === name && bookmarkL2 === tagL1.id && ((tagL1.tags.length && tagL1.foldflag) || !tagL1.tags.length)" class="bookmark"></span> -->
          <a href="javascript:" class="btn-link"/>
        </p>
        <template v-if="tagL1.treetags && tagL1.treetags.length">
          <ul v-show="!tagL1.foldflag" class="tags-l2">
            <li v-for="tagL2 in tagL1.treetags" :key="tagL2.label" class="tag-l2"
                @click.stop="clickTagL2(tagL1, tagL2)">
              {{ tagL2.label }}
              <span class="count">{{ tagL2.count }}篇</span>
              <!-- <span v-if="bookmarkL1 === name && bookmarkL2 === tagL2.id" class="bookmark"></span> -->
              <a href="javascript:" class="btn-link"/>
            </li>
          </ul>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import tree from './tree'
export default tree
</script>

<style lang="scss" scoped src="./tree.scss">
</style>

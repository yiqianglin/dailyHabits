<template>
  <!-- 直达型入口 -->
  <div v-if="list && list.length" :class="list.length > 2 ? 'multi' : list.length > 1 ? 'double' : 'single'" class="entry-wrapper">
    <div class="entry-list">
      <div v-for="(item, index) in list" :key="index" :class="{only: !item.desc}" class="entry-item" @click="toEntry(item,index)">
        <p class="name">{{ item.label }}</p>
        <p class="desc">{{ item.desc }}</p>
        <a href="javascript:" class="btn-link"/>
      </div>
    </div>
  </div>
</template>

<script>
import entry from './entry'
export default entry
</script>

<style lang="scss" scoped src="./entry.scss" />

<template>
  <!-- 上下滚动广播 -->
  <div v-if="list && list.length" class="broadcast">
    <div :class="{default: !options.customStyle}" class="broadcast-container">
      <div :style="broadcastStyle" class="broadcast-wrapper">
        <div v-for="(item, index) in list" :key="index" class="broadcast-slide" @click="toBroadcast(item, index)">{{ item.text }}</div>
        <div v-if="list.length > 1" class="broadcast-slide" @click="toBroadcast(list[0], 0)">{{ list[0].text }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import broadcast from './broadcast'
export default broadcast
</script>

<style lang="scss" scoped src="./broadcast.scss" />

<template>
  <div class="baike-toast">
    <transition :name="animation">
      <!-- 普通消息通知 -->
      <div v-if="mode === 1" key="msg" :class="{'baike-toast-icon': !!icon}" class="baike-toast-common"><img v-if="icon" :src="icon" class="toast-icon">{{ msg }}</div>
      <!-- 已添加XXX消息通知 -->
      <div v-if="mode === 2" key="add" class="baike-toast-add"><img v-if="icon" :src="icon" class="toast-icon">{{ msg }}</div>
    </transition>
  </div>
</template>
<script>
import toast from './toast'
export default toast
</script>
<style lang="scss" scoped>
@import "./toast.scss";
</style>

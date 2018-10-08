<template>
  <!-- 运营区列表 -->
  <div class="active-wrapper">
    <div class="active-list">
      <div v-for="(item, index) in list" :key="'multi' + index" :class="{'font-white': !!item.image}" :style="item.image ? 'background-image: url(' + item.image + ');' : ''" class="active-item" @click="toActive(item)">
        <p class="title ellipsis">{{ item.topic }}
          <span v-if="item.docnum" class="count">(共{{ item.docnum }}篇)</span>
        </p>
        <active-broadcast v-if="item.titles.length > 1" :options="{list: item.titles}" />
        <active-marquee v-else :options="{list: item.titles, minLength: list.length % 2 === 1 && index === list.length - 1 ? 26 : 10}" />
      </div>
    </div>
  </div>
</template>

<script>
import active from './active'
export default active
</script>

<style lang="scss" scoped src="./active.scss" />

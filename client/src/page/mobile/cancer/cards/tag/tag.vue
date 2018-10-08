<template>
  <!-- 运营区卡片 -->
  <div v-if="tags && tags.length" class="tag-list-wrapper">
    <ul v-if="type === 0" class="white-circle-border-list">
      <li v-for="(tag, index) in tags" :key="index" :class="{active: activeIdx === index}" class="tag-item" @click="clickTag(tag, index)">{{ tag.label.length > maxLength ? tag.label.substr(0, maxLength - 1) + '…' : tag.label }}
        <!-- <span v-if="tag.direct" class="arr-right"/> -->
        <a href="javascript:" class="btn-link" />
      </li>
    </ul>
    <p v-if="type === 1" class="gray-dot-list">
      <span v-for="(tag, index) in tags" :key="index" :class="{active: activeIdx === index}" class="tag-item" @click="clickTag(tag, index)">{{ tag.label.length > maxLength ? tag.label.substr(0, maxLength - 1) + '…' : tag.label }}</span>
    </p>
    <p v-if="type === 2" class="green-rect-border-list">
      <span v-for="(tag, index) in tags" :key="index" :class="{active: activeIdx === index}" class="tag-item" @click="clickTag(tag, index)">{{ tag.label.length > maxLength ? tag.label.substr(0, maxLength - 1) + '…' : tag.label }}</span>
    </p>
    <p v-if="type === 3" class="gray-rect-list">
      <span v-for="(tag, index) in tags" :key="index" :class="{active: activeIdx === index}" class="tag-item" @click="clickTag(tag, index)">{{ tag.label.length > maxLength ? tag.label.substr(0, maxLength - 1) + '…' : tag.label }}</span>
    </p>
    <p v-if="type === 4" class="gray-circle-list">
      <span v-for="(tag, index) in tags" :key="index" :class="{active: activeIdx === index}" class="tag-item" @click="clickTag(tag, index)">{{ tag.label.length > maxLength ? tag.label.substr(0, maxLength - 1) + '…' : tag.label }}</span>
    </p>
    <p v-if="type === 5" class="gray-binary-seperator-list">
      <span v-for="(tag, index) in tags" :key="index" :class="{active: activeIdx === index}" class="tag-item" @click="clickTag(tag, index)">{{ tag.label.length > maxLength ? tag.label.substr(0, maxLength - 1) + '…' : tag.label }}</span>
    </p>
  </div>
</template>

<script>
import tag from './tag'
export default tag
</script>

<style lang="scss" scoped src="./tag.scss" />

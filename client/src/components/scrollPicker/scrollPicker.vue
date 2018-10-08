<template>
  <div class="scroll-picker-container">
    <!-- 选择器头部 -->
    <div class="picker-header">
      <slot name="picker-header">
        <div class="picker-header-default">
          {{ title }}
          <span class="reset-btn" @click="resetBtnClick">
            重置
          </span>
        </div>
      </slot>
    </div>
    <!-- 选择器内容 -->
    <div v-if="columns && columns.length" class="picker-content">
      <!-- 选择器 - 列 -->
      <div v-for="(col, colIdx) in columns" :key="colIdx" class="picker-column">
        <!-- 选择器 - 列 -头部 -->
        <slot name="column-header">
          <div class="column-header-default">{{ getColumnTitle(col) }}</div>
        </slot>
        <!-- 选择器 - 列 - 选项 -->
        <ul v-if="columnOption && col[columnOption] && col[columnOption].length" class="column-content">
          <!-- 选择器 - 列 - 选项 - 标题 -->
          <li v-for="(opt, optIdx) in col[columnOption]" :key="optIdx" :class="{selected: columnSelected && getOptionTitle(col[columnSelected]) === getOptionTitle(opt)}" class="column-option" @click="onOptionSelect(col, colIdx, opt, optIdx)">
            <slot :option="opt" name="column-option">
              <div class="column-option-default">{{ getOptionTitle(opt) }}</div>
            </slot>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import scrollPicker from './scrollPicker'
export default scrollPicker
</script>

<style lang="scss" scoped src="./scrollPicker.scss" />

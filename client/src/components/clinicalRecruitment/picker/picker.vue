<template id="tpl_picker">
  <mt-popup
    v-model="isShowModel"
    :lock-scroll="true"
    position="bottom"
    class="mint-popup-picker"
  >
    <mt-picker ref="pickerView" :slots="data" :visible-item-count="5"
               :show-toolbar="true"
               :rotate-effect="true"
               @change="slotSelected">
      <div class="picker-header">
        <a href="javascript:;" class="btn-link cancel" @click="cancel">取消</a>
        <span v-if="title" class="title">{{ title }}</span>
        <a href="javascript:;" class="btn-link sure" @click="confirm">确定</a>
      </div>
    </mt-picker>
  </mt-popup>
</template>

<script>
import picker from './picker'
export default picker
</script>

<style lang="scss" scoped src="./picker.scss" />
